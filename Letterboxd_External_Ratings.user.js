// ==UserScript==
// @name        Letterboxd External Ratings
// @namespace   https://github.com/worldwidewaves/letterboxd-scripts
// @description Adds ratings of film from external sites to film pages
// @copyright   2015, Ramón Guijarro (http://soyguijarro.com)
// @homepageURL https://github.com/worldwidewaves/letterboxd-scripts
// @supportURL  https://github.com/worldwidewaves/letterboxd-scripts/issues
// @updateURL   https://raw.githubusercontent.com/worldwidewaves/letterboxd-scripts/master/Letterboxd_External_Ratings.user.js
// @icon        https://raw.githubusercontent.com/worldwidewaves/letterboxd-scripts/master/img/letterboxd_icon.png
// @license     GPLv3; http://www.gnu.org/licenses/gpl.html
// @version     2.3
// @include     *://letterboxd.com/film/*
// @include     *://letterboxd.com/film/*/crew/*
// @include     *://letterboxd.com/film/*/studios/*
// @include     *://letterboxd.com/film/*/genres/*
// @exclude     *://letterboxd.com/film/*/views/*
// @exclude     *://letterboxd.com/film/*/lists/*
// @exclude     *://letterboxd.com/film/*/likes/*
// @exclude     *://letterboxd.com/film/*/fans/*
// @exclude     *://letterboxd.com/film/*/ratings/*
// @exclude     *://letterboxd.com/film/*/reviews/*
// @exclude     *://letterboxd.com/film/*/members/*
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// ==/UserScript==

var ratingsData = {"IMDb": {origRatingMax: 10, isLoaded: false},
                   "Metascore": {origRatingMax: 10, isLoaded: false},
                   "Tomatometer": {origRatingMax: 0, isLoaded: false},
                  };

function updateRatingElt(site) {
    var ratingElts = document.querySelectorAll("section.ratings-external a"),
        ratingElt = ratingElts[Object.keys(ratingsData).indexOf(site)],
        ratingInnerElt = ratingElt.firstElementChild,
        ratingData = ratingsData[site];

    // If data loads, remove loading icon
    if (ratingData.isLoaded) {
        ratingInnerElt.classList.remove("spinner");

        if (ratingData.origRating && ratingData.origRating !== "" && ratingData.origRating !== 0 && !isNaN(ratingData.origRating)) {
            if (localStorage.origRatingsMode === "true") {
                ratingInnerElt.removeAttribute("class");
                if (ratingData.origRatingMax){
                    ratingInnerElt.textContent = parseFloat(ratingData.origRating).toFixed(1);
                    ratingInnerElt.setAttribute("title", "Weighted average of " + ratingData.origRating + " based on " + (ratingData.ratingCounter ? ratingData.ratingCounter : "some") + " ratings");
                } else {
                    ratingInnerElt.textContent = parseFloat(ratingData.origRating) + "%";
                    ratingInnerElt.setAttribute("title", "Weighted average of " + parseFloat(ratingData.origRating) + "% based on " + (ratingData.ratingCounter ? ratingData.ratingCounter : "some") + " ratings");
                }
            // Use stars
            } else if (Math.round(ratingData.oneToTenRating) !== 0){
                ratingInnerElt.className = "rating rated-" + Math.round(ratingData.oneToTenRating);
            // If score is below 1/10, use 1 star
            } else {
                ratingInnerElt.className = "rating rated-" + (Math.round(ratingData.oneToTenRating) + 1);
             }
            ratingElt.href = ratingData.url;
            ratingElt.style.cursor = "pointer";
        } else {
            ratingInnerElt.removeAttribute("class");
            if (localStorage.origRatingsMode === "true") {
                ratingInnerElt.textContent = "✗";
            } else {
                ratingInnerElt.className = "emoji";
                ratingInnerElt.textContent = "✘";
            }
        }
    }
}

function createRatingsSection(callback) {
    var sidebarElt = document.getElementsByClassName("sidebar")[0],
        ratingsSectionElt = document.createElement("section"),
        modeToggleElt = document.createElement("ul"),
        modeToggleInnerElt = document.createElement("li"),
        modeToggleInnerInnerElt = document.createElement("a"),
        ratingElt,
        ratingInnerElt,
        cssRules1 = "section.ratings-external {\
                        margin-top: 20px;\
                    }\
                    section.ratings-external a {\
                        display: block;\
                        font-size: 12px;\
                        line-height: 1.5;\
                        margin-bottom: 0.5em;\
                    }\
                    section.ratings-external span {\
                        text-align: right;\
                        position: absolute;\
                        font-size: 14px;\
                        margin-top: -3px;\
                        right: 0;\
                        color: #6C3;\
                    }\
                    section.ratings-external span.spinner {\
                        background: url('" + getSpinnerImageUrl() + "');\
                        background-size: 14px;\
                        height: 14px;\
                        width: 14px;\
                        margin: 0 0;\
                    }";
    var cssRules2 = "section.ratings-external {\
                        margin-top: 20px;\
                    }\
                    section.ratings-external a {\
                        display: block;\
                        font-size: 12px;\
                        line-height: 1.5;\
                        margin-bottom: 0.5em;\
                    }\
                    section.ratings-external span {\
                        text-align: right;\
                        position: absolute;\
                        font-size: 14px;\
                        margin-top: 0px;\
                        right: 0;\
                        color: #6C3;\
                    }\
                    section.ratings-external span.spinner {\
                        background: url('" + getSpinnerImageUrl() + "');\
                        background-size: 14px;\
                        height: 14px;\
                        width: 14px;\
                        margin: 0 0;\
                    }\
                    section.ratings-external .emoji {\
                    text-align: right;\
                    position: absolute;\
                    font-size: 14px;\
                    margin-top: -3px;\
                    right: 0;\
                    color: #6C3;\
                    }";

    function getSpinnerImageUrl() {
        var spinnersObj = unsafeWindow.globals.spinners;

        for (var prop in spinnersObj) {
            if (/spinner_12/.test(prop)) {
                return spinnersObj[prop];
            }
        }
        return null;
    }

    function getModeToggleButtonText() {
        var ratingsModeName =
            (localStorage.origRatingsMode === "true") ? "five-star" : "original";

        return "Show " + ratingsModeName + " ratings";
    }

    function toggleRatingsMode(evt) {
        evt.preventDefault();

        localStorage.origRatingsMode = !(localStorage.origRatingsMode === "true");
        modeToggleInnerInnerElt.textContent = getModeToggleButtonText();

        if(localStorage.origRatingsMode === "true"){
            GM_addStyle(cssRules1);
        }
        else{
            GM_addStyle(cssRules2);
        }

        for (var i = 0; i < Object.keys(ratingsData).length; i++) {
            updateRatingElt(Object.keys(ratingsData)[i]);

        }
    }

    // Set up section to be inserted in page
    ratingsSectionElt.className = "section ratings-external";

    // Set up section elements that will contain ratings
    for (var i = 0; i < Object.keys(ratingsData).length; i++) {
        ratingElt = document.createElement("a");
        ratingInnerElt = document.createElement("span");

        ratingElt.textContent = Object.keys(ratingsData)[i];
        ratingElt.className = "rating-green";
        ratingInnerElt.className = "spinner";
        ratingElt.style.cursor = "default";

        ratingElt.appendChild(ratingInnerElt);
        ratingsSectionElt.appendChild(ratingElt);
    }

    // Set up ratings mode toggle button
    modeToggleElt.className = "box-link-list box-links";
    modeToggleInnerInnerElt.className = "text-slug tooltip";
    modeToggleInnerInnerElt.href = "#";
    modeToggleInnerInnerElt.textContent = getModeToggleButtonText();
    modeToggleInnerInnerElt.style.textAlign = "center";
    modeToggleInnerInnerElt.addEventListener("click", toggleRatingsMode, false);
    modeToggleInnerElt.appendChild(modeToggleInnerInnerElt);

    modeToggleElt.appendChild(modeToggleInnerElt);
    ratingsSectionElt.appendChild(modeToggleElt);

    // Insert section in page
    sidebarElt.insertBefore(ratingsSectionElt, sidebarElt.lastElementChild.nextSibling);
    if(localStorage.origRatingsMode === "true"){
        GM_addStyle(cssRules1);
    }
    else{
        GM_addStyle(cssRules2);
    }

    callback();
}

function fillRatingsSection() {
    var moreDetailsElt = document.querySelector("section.col-main p.text-link"),
        imdbIdMatch = moreDetailsElt.innerHTML.
            match(/http:\/\/www\.imdb.com\/title\/tt(\d+)\//),
        imdbUrl,
        imdbId,
        rottenUrl= "https://www.rottentomatoes.com";

    function updateRatingData(site, origRating, oneToTenRating, url, ratingCounter) {
        ratingsData[site].origRating = origRating;
        ratingsData[site].oneToTenRating = oneToTenRating;
        ratingsData[site].url = url;
        ratingsData[site].ratingCounter= ratingCounter;
        ratingsData[site].isLoaded = true;

        updateRatingElt(site);
    }

    function getIMDbAndMetaRatings(res) {
        var parser = new DOMParser(),
            dom = parser.parseFromString(res.responseText, "text/html");

        function getIMDbRating() {
            var data = dom.querySelector('script[type="application/ld+json"]'),
                dataJSON = JSON.parse(data.innerText),
                imdbRating = dataJSON.aggregateRating.ratingValue,
                imdbRatingCount = dataJSON.aggregateRating.ratingCount;

            if (imdbRating && imdbRatingCount) {
                updateRatingData("IMDb", imdbRating, imdbRating, imdbUrl, imdbRatingCount);
            } else {
                updateRatingData("IMDb", null);
            }
        }

        function getMetaRating() {
            var metaRating,
                metaRatingElt = dom.querySelector(".score-meta");

            if (metaRatingElt) {
                metaRating = parseFloat(metaRatingElt.textContent)/10;

                GM_xmlhttpRequest({
                    method: "GET",
                    url: imdbUrl + "criticreviews", // Metacritic reviews page on IMDb
                    onload: function (res) {
                        var pageContent,
                            metaUrl;

                        dom = parser.parseFromString(res.responseText, "text/html");
                        pageContent = dom.getElementById("main").innerHTML;
                        metaUrl = pageContent.
                        match(/<a.*href="(.*?)".*>See all \d+ reviews/)[1];

                        var metaRatingCount,
                            metaRatingCountElt = dom.querySelector("span[itemprop=ratingCount]"),
                            userScoreRating,
                            userScoreRatingElt = dom.getElementsByClassName("metascore_w user larger movie mixed"),
                            userScoreRatingCount,
                            userScoreRatingCountElt;

                        if (metaRatingCountElt) {
                            metaRatingCount = (metaRatingCountElt.textContent).replace(',', '.');
                            updateRatingData("Metascore", metaRating, metaRating, metaUrl, metaRatingCount);
                            /*
                            if (userScoreRatingElt && userScoreRatingElt[0]) { //! user scores are no longer in the critics section of IMDb
                                userScoreRating = userScoreRatingElt[0].textContent;
                                updateRatingData("UserScore", userScoreRating, userScoreRating, metaUrl, metaRatingCount);
                            } else {
                                updateRatingData("UserScore", null);
                            }
                            */
                        } else {
                            updateRatingData("Metascore", metaRating, metaRating, metaUrl);
                        }
                    }
                });
            } else {
                updateRatingData("Metascore", null);
            }
        }

        getIMDbRating();
        getMetaRating();
    }

    function getRottenRating(res) {
        var filmTitle = document.querySelector("#featured-film-header h1").textContent,
            i;
        for (i = 0; i < filmTitle.length; i++) {
            filmTitle = filmTitle.replace(/\s/, "_").replace(" ", "_").replace(/[&\/\\#,+()$~%.'":;*?!<>{}]/, "");
        }
        var rottenUrl = encodeURI("https://www.rottentomatoes.com/m/" + filmTitle);

        GM_xmlhttpRequest({
            method: "GET",
            url: rottenUrl,
            onload: function(res){
                var parser = new DOMParser(),
                    dom = parser.parseFromString(res.responseText, "text/html"),
                    data = dom.querySelector("script[type='application/ld+json']");

                if (data) {
                    var dataJSON = JSON.parse(data.innerText),
                        tomatoPercentage = dataJSON.aggregateRating.ratingValue,
                        tomatoPercentageOneToTen = tomatoPercentage / 10,
                        tomatoNumberOfRatings = dataJSON.aggregateRating.ratingCount;

                    updateRatingData("Tomatometer", tomatoPercentage, tomatoPercentageOneToTen, rottenUrl, tomatoNumberOfRatings);
                } else {
                    updateRatingData("Tomatometer", null);
                }
            }
       });
    }

    if (imdbIdMatch) {
        imdbUrl = imdbIdMatch[0];
        imdbId = imdbIdMatch[1];

        GM_xmlhttpRequest({
            method: "GET",
            url: imdbUrl,
            onload: getIMDbAndMetaRatings
        });

        GM_xmlhttpRequest({
            method: "GET",
            url: rottenUrl,
            onload: getRottenRating
        });
    } else {
        updateRatingData("IMDb", null);
        updateRatingData("Metascore", null);
        updateRatingData("Tomatometer", null);
    }
}

localStorage.origRatingsMode = (localStorage.origRatingsMode || true);
createRatingsSection(fillRatingsSection);

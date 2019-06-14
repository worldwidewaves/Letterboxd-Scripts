// ==UserScript==
// @name        Letterboxd Bio Modifier
// @namespace   https://github.com/su1c1d3jerk/letterboxd-scripts
// @description Adds visual bio summary and Wikipedia link to actors and directors pages
// @copyright   2015, Ramón Guijarro (http://soyguijarro.com)
// @homepageURL https://github.com/su1c1d3jerk/letterboxd-scripts
// @supportURL  https://github.com/su1c1d3jerk/letterboxd-scripts/issues
// @updateURL   https://raw.githubusercontent.com/su1c1d3jerk/letterboxd-scripts/master/Letterboxd_Bio_Modifier.user.js
// @icon        https://raw.githubusercontent.com/su1c1d3jerk/letterboxd-scripts/master/img/letterboxd_icon.png
// @license     GPLv3; http://www.gnu.org/licenses/gpl.html
// @version     1.3
// @include     *://letterboxd.com/director/*
// @include     *://letterboxd.com/actor/*
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// ==/UserScript==

var sidebarElt = document.getElementsByClassName("sidebar")[0],
    bioElt = sidebarElt.getElementsByClassName("js-tmdb-person-bio")[0],
    tmdbId = bioElt.getAttribute("data-tmdb-id"),
    tmdbBaseUrl = "http://themoviedb.org/person/",
    tmdbUrl = tmdbBaseUrl + tmdbId;

function showBioSummary(res) {
    var dom = new DOMParser().parseFromString(res.responseText, "text/html"),
        tmdbBirthplaceElt = dom.getElementsByClassName("facts left_column")[0].childNodes[9].nextElementSibling,
        tmdbBirthdayElt = dom.getElementsByClassName("facts left_column")[0].childNodes[8].nextElementSibling,
        tmdbDeathdayElt = dom.getElementsByClassName("facts left_column")[0].childNodes[9].nextElementSibling,
        creditsElt = dom.getElementsByClassName("facts left_column")[0].childNodes[5].nextElementSibling,
        creditsMatch = creditsElt.textContent.replace(/Known Credits/g,''),
        gotRelevantData = isActualData(tmdbBirthplaceElt) || isActualData(tmdbBirthdayElt),
        bioSummaryElt = document.createElement("section"),
        bioSummaryElts,
        bioInnerElt,
        cssRules = "section.panel-text.bio-summary {\
                        border-bottom: 1px solid #456;\
                        margin-bottom: 10px;\
                    }\
                    section.panel-text.bio-summary p {\
                        padding-left: 25px;\
                        display: block;\
                    }";

    if (!tmdbDeathdayElt.textContent.includes("Day of Death")) {
        tmdbDeathdayElt = null;
    } else {
        tmdbBirthplaceElt = dom.getElementsByClassName("facts left_column")[0].childNodes[11].nextElementSibling;
    }

    function getFormattedDate(date) {
        var monthNum = date.getMonth(),
            dayNum = date.getDate(),
            yearNum = date.getFullYear(),
            monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        return monthNames[monthNum] + " " + dayNum + ", " + yearNum;
    }

    function isActualData(elt) {
        var data = elt.textContent.replace(/Birthday/g,'').replace(/Day of Death/g,'').replace(/Place of Birth/g,''),
            exp = /^-$/;

        return !(exp.test(data));
    }

    function showBirthplace() {
        var birthplace = tmdbBirthplaceElt.textContent.replace(/Place of Birth/g,''),
            birthplaceElt = document.createElement("p"),
            birthplaceIconElt = document.createElement("span");

        // Fill element with data and apply styles
        birthplaceElt.classList.add("icon-location");
        birthplaceElt.textContent = birthplace.replace(/ - /g, ", ").replace(/Place of Birth/g,'');
        birthplaceIconElt.style.marginLeft = "0px";

        // Insert element in section
        birthplaceElt.appendChild(birthplaceIconElt);
        bioSummaryElt.appendChild(birthplaceElt);
    }

    function showBornDeathDate() {
        var birthday = new Date(tmdbBirthdayElt.textContent.replace(/Birthday/g,'')),

            dateElt = document.createElement("p"),
            dateIconElt = document.createElement("span"),
            msPerYear = 1000 * 60 * 60 * 24 * 365,
            refDate,
            date,
            age;

        // Fill element with data and apply styles
        if (tmdbDeathdayElt) {  // Person is dead
            // Use death date as reference to calculate age
            refDate = new Date(tmdbDeathdayElt.textContent.replace(/Day of Death/g,''));
            date = refDate; // Show death date

            dateElt.classList.add("icon-hidden");
            dateIconElt.style.marginLeft = "3px";
        } else {    // Person is alive
            // Use today as reference to calculate age
            refDate = new Date();
            date = birthday;    // Show birthday

            dateElt.classList.add("icon-people");
        }
        age = Math.floor((refDate - birthday.getTime()) / msPerYear);
        dateElt.textContent = getFormattedDate(date) +
            " (age" + ((tmdbDeathdayElt) ? "d " : " ") + age + ")";

        // Insert element in section
        dateElt.appendChild(dateIconElt);
        bioSummaryElt.appendChild(dateElt);
    }

    function showNumCredits() {
        var numCredits = creditsMatch,
            creditsElt = document.createElement("p"),
            creditsIconElt = document.createElement("span");

        // Fill element with data and apply styles
        //creditsElt.classList.add("icon-list-all");
        creditsElt.textContent = numCredits + " known credits";
        creditsIconElt.style.backgroundPosition = "-740px -110px";

        // Insert element in section
        creditsElt.appendChild(creditsIconElt);
        bioSummaryElt.appendChild(creditsElt);
    }

    // Set up section to be inserted in page
    bioSummaryElt.className = "section panel-text bio-summary";

    // Fill section with available data
    if (gotRelevantData) {
        if (isActualData(tmdbBirthplaceElt)) {
            showBirthplace();
        }
        if (isActualData(tmdbBirthdayElt)) {
            showBornDeathDate();
        }
        if (creditsMatch) {
            showNumCredits();
        }
    } else {
        return; // Abort if no relevant data at all is available
    }

    // Apply common styles to section elements
    bioSummaryElts = bioSummaryElt.children;
    for (var i = 0; i < bioSummaryElts.length; i++) {
        bioSummaryElts[i].classList.add("has-icon")
        bioSummaryElts[i].classList.add("icon-16");
        bioSummaryElts[i].firstElementChild.className = "icon";
    }

    // Insert section in page
    bioInnerElt = bioElt.getElementsByClassName("panel-text condensed")[0] || bioElt.getElementsByClassName("panel-text")[0];
    bioInnerElt.insertBefore(bioSummaryElt, bioInnerElt.firstElementChild);

    GM_addStyle(cssRules);
}

function showWikiLink() {
    var linksElt = document.getElementsByClassName("text-link text-footer")[0],
        linksInnerElt,

        headerElt = document.getElementsByClassName("page-header")[0],
        personNameElt = headerElt.querySelector("h1.title-1"),
        personName = personNameElt.textContent.split("\n")[2],

        wikiLinkElt = document.createElement("a"),
        wikiLinkInnerElt = document.createElement("a"),

        wikiBaseUrl = "https://en.wikipedia.org/wiki/",
        wikiUrl = wikiBaseUrl + personName;

    // Fill element with data and apply styles
    wikiLinkInnerElt.className = "micro-button";
    wikiLinkInnerElt.href = wikiUrl;
    wikiLinkInnerElt.textContent = "Wiki";
    wikiLinkElt.appendChild(wikiLinkInnerElt);

    // Insert section in page
    linksInnerElt = linksElt.getElementsByClassName("micro-button")[0];
    linksInnerElt.parentElement.appendChild(wikiLinkElt);
}

GM_xmlhttpRequest({
    method: "GET",
    url: tmdbUrl,
    onload: showBioSummary
});

showWikiLink();
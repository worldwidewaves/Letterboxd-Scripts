// ==UserScript==
// @name        Letterboxd Extra Profile Stats
// @namespace   https://github.com/worldwidewaves/letterboxd-scripts
// @description Adds average number of films watched per month and per week to profile pages
// @copyright   2014+, Ramón Guijarro (http://soyguijarro.com), N190392
// @homepageURL https://github.com/worldwidewaves/letterboxd-scripts
// @supportURL  https://github.com/worldwidewaves/letterboxd-scripts/issues
// @updateURL   https://raw.githubusercontent.com/worldwidewaves/letterboxd-scripts/master/Letterboxd_Extra_Profile_Stats.user.js
// @icon        https://raw.githubusercontent.com/worldwidewaves/letterboxd-scripts/master/img/letterboxd_icon.png
// @license     GPLv3; http://www.gnu.org/licenses/gpl.html
// @version     1.8
// @include     *://letterboxd.com/*/
// @exclude     *://letterboxd.com/*/*/
// @exclude     *://letterboxd.com/films/
// @exclude     *://letterboxd.com/lists/
// @exclude     *://letterboxd.com/people/
// @exclude     *://letterboxd.com/search/
// @exclude     *://letterboxd.com/settings/
// @exclude     *://letterboxd.com/activity/
// @exclude     *://letterboxd.com/invitations/
// @exclude     *://letterboxd.com/about/
// @exclude     *://letterboxd.com/pro/
// @exclude     *://letterboxd.com/welcome/
// @exclude     *://letterboxd.com/contact/
// @exclude     *://letterboxd.com/201\d/
// @grant       none
// ==/UserScript==

{
    var avatarElt = document.getElementsByClassName("profile-avatar")[0],
        infoElt = document.getElementsByClassName("profile-info")[0],
        statsElt = document.getElementsByClassName("profile-stats")[0],
        statitsticsElt = document.getElementsByClassName("profile-statistic")[1],
        diaryUrl = statitsticsElt.getElementsByTagName("a")[0].href,
        filmsPerYear = parseInt(statitsticsElt.getElementsByClassName("value")[0].textContent, 10),
        filmsPerMonth,
        filmsPerWeek,
        avgElt,
        avgInnerElt,
        numElt,
        textElt;

    // Calculate averages
    console.log("Followers:", filmsPerYear);
    filmsPerMonth = (filmsPerYear / (new Date().getMonth() + 1));
    filmsPerWeek = ((filmsPerMonth / 30) * 7);

    // Insert calculated averages in page
    [filmsPerWeek, filmsPerMonth].forEach(function (filmsAvg, index) {
        avgElt = document.createElement("h4");
        avgElt.className = "profile-statistic statistic";
        avgInnerElt = document.createElement("a");
        numElt = document.createElement("span");
        numElt.className = "value";
        textElt = document.createElement("span");
        textElt.className = "definition";

        // Round to one decimal place and remove trailing zero if present
        filmsAvg = filmsAvg.toFixed(1).replace(/^(\d+)\.0$/, "$1");

        // Fill element with data
        avgInnerElt.href = diaryUrl;
        numElt.textContent = filmsAvg;
        textElt.textContent = (index === 0) ? "Per week" : "Per month";

        // Build element structure
        avgInnerElt.appendChild(numElt);
        avgInnerElt.appendChild(textElt);
        avgElt.appendChild(avgInnerElt);

        // Insert element in page
        statsElt.insertBefore(avgElt, statsElt.children[2]);
    });

    // Prevent overflow in layout
    infoElt.style.width = "auto";
    infoElt.style.maxWidth = document.offsetWidth - avatarElt.offsetWidth - infoElt.offsetWidth + "px";
}

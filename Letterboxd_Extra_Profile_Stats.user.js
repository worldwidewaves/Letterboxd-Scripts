// ==UserScript==
// @name        Letterboxd Extra Profile Stats
// @namespace   https://github.com/soyguijarro/userscripts
// @description Adds average number of films watched per month and per week to profile pages
// @copyright   2014+, Ramón Guijarro (http://soyguijarro.com)
// @homepageURL https://github.com/soyguijarro/userscripts
// @supportURL  https://github.com/soyguijarro/userscripts/issues
// @updateURL   https://raw.githubusercontent.com/soyguijarro/userscripts/master/Letterboxd_Extra_Profile_Stats.user.js
// @icon        https://raw.githubusercontent.com/soyguijarro/userscripts/master/img/letterboxd_icon.png
// @license     GPLv3; http://www.gnu.org/licenses/gpl.html
// @version     1.6
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

var headerElt = document.getElementById("profile-header"),
    avatarElt = headerElt.getElementsByClassName("avatar")[0],
    infoElt = headerElt.getElementsByClassName("profile-person-info")[0],
    statsElt = headerElt.getElementsByClassName("stats")[0],
    dataMatch = statsElt.innerHTML.match(/<a href="(.*?)"><strong>(\d+).*This year/),
    diaryUrl = dataMatch[1],
    filmsPerYear = dataMatch[2],
    filmsPerMonth,
    filmsPerWeek,
    avgElt,
    avgInnerElt,
    numElt,
    textElt;

// Calculate averages
filmsPerMonth = (filmsPerYear / (new Date().getMonth() + 1));
filmsPerWeek = ((filmsPerMonth / 30) * 7);

// Insert calculated averages in page
[filmsPerWeek, filmsPerMonth].forEach(function (filmsAvg, index) {
    avgElt = document.createElement("li");
    avgInnerElt = document.createElement("a");
    numElt = document.createElement("strong");
    textElt = document.createElement("span");

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
infoElt.style.maxWidth = headerElt.offsetWidth -
    avatarElt.offsetWidth - statsElt.offsetWidth + "px";

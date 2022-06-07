// ==UserScript==
// @name        Letterboxd Rating Base 10
// @namespace   https://github.com/worldwidewaves/letterboxd-scripts
// @description Changes the Letterboxd rating to Base 10
// @homepageURL https://github.com/worldwidewaves/letterboxd-scripts
// @supportURL  https://github.com/worldwidewaves/letterboxd-scripts/issues
// @updateURL   https://raw.githubusercontent.com/worldwidewaves/letterboxd-scripts/master/Letterboxd_Rating_Base_10.user.js
// @icon        https://raw.githubusercontent.com/worldwidewaves/letterboxd-scripts/master/img/letterboxd_icon.png
// @license     MIT
// @version     3.2
// @include     *://letterboxd.com/film/*
// @exclude     *://letterboxd.com/film/*/views/*
// @exclude     *://letterboxd.com/film/*/lists/*
// @exclude     *://letterboxd.com/film/*/likes/*
// @exclude     *://letterboxd.com/film/*/fans/*
// @exclude     *://letterboxd.com/film/*/ratings/*
// @exclude     *://letterboxd.com/film/*/reviews/*
// @exclude     *://letterboxd.com/film/*/members/*
// @grant       GM_addStyle
// ==/UserScript==

{
    // Replace rating
    function setBase10Rating(displayRating) {
        let displayRatingText = displayRating.getAttribute('data-original-title')
        let base10Rating = displayRatingText.split(' ')[3] * 2.0

        displayRating.innerText = parseFloat((base10Rating).toFixed(1))
        displayRating.setAttribute('data-original-title', displayRatingText.replace(/^(\S+\s+\S+\s+\S+\s+)\S+/, '$1' + base10Rating.toFixed(2)))
    }

    // Wait for elements to load
    let observer = new MutationObserver(() => {
        let displayRating = document.getElementsByClassName('tooltip display-rating')[0]

        if (displayRating) {
            observer.disconnect()
            setBase10Rating(displayRating)
        }
    })

    // Run
    observer.observe(document, { childList: true, subtree: true, attributes: false, characterData: false})
}

// ==UserScript==
// @name        Letterboxd Rating Base 10
// @namespace   https://github.com/Z41D3L/letterboxd-scripts
// @description Changes the Letterboxd rating to base 10
// @copyright   2018, Zaidel
// @homepageURL https://github.com/Z41D3L/letterboxd-scripts
// @supportURL  https://github.com/Z41D3L/letterboxd-scripts/issues
// @icon        https://raw.githubusercontent.com/soyguijarro/userscripts/master/img/letterboxd_icon.png
// @license     GPLv3; http://www.gnu.org/licenses/gpl.html
// @version     1.0
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
// @grant       none
// ==/UserScript==

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
var i;

for(i= 0; i < 1000; i= i+10){
    sleep(i).then(() => {
        var oldRating= document.getElementsByClassName("tooltip display-rating")[0],
            newRating= document.querySelector("[itemprop~=ratingValue][content]");

        if(oldRating || newRating){
            oldRating.innerText = parseFloat(Math.round(newRating.content * 10) / 10).toFixed(1);
            i=1000;
        }
    })
}

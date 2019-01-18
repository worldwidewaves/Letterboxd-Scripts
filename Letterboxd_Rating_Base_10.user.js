// ==UserScript==
// @name        Letterboxd Rating Base 10
// @namespace   https://github.com/su1c1d3jerk/letterboxd-scripts
// @description Changes the Letterboxd rating to base 10
// @homepageURL https://github.com/su1c1d3jerk/letterboxd-scripts
// @supportURL  https://github.com/su1c1d3jerk/letterboxd-scripts/issues
// @updateURL   https://raw.githubusercontent.com/su1c1d3jerk/letterboxd-scripts/master/Letterboxd_Rating_Base_10.user.js
// @icon        https://raw.githubusercontent.com/soyguijarro/su1c1d3jerk/master/img/letterboxd_icon.png
// @license     MIT
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

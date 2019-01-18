// ==UserScript==
// @name        Letterboxd Backdrop Remover
// @namespace   https://github.com/su1c1d3jerk/letterboxd-scripts
// @description Removes backdrop image from film pages
// @copyright   2014+, Ramón Guijarro (http://soyguijarro.com)
// @homepageURL https://github.com/su1c1d3jerk/letterboxd-scripts
// @supportURL  https://github.com/su1c1d3jerk/letterboxd-scripts/issues
// @updateURL   https://raw.githubusercontent.com/su1c1d3jerk/letterboxd-scripts/master/Letterboxd_Backdrop_Remover.user.js
// @icon        https://raw.githubusercontent.com/su1c1d3jerk/letterboxd-scripts/master/img/letterboxd_icon.png
// @license     GPLv3; http://www.gnu.org/licenses/gpl.html
// @version     1.4
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

if(document.getElementsByClassName("backdrop-container")){
    document.getElementById("content").className = "site-body";
    document.body.removeChild(document.getElementsByClassName("backdrop-container")[0]);
}

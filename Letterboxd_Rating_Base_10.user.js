// ==UserScript==
// @name        Letterboxd Rating Base 10
// @namespace   https://github.com/su1c1d3jerk/letterboxd-scripts
// @description Changes the Letterboxd rating to base 10
// @homepageURL https://github.com/su1c1d3jerk/letterboxd-scripts
// @supportURL  https://github.com/su1c1d3jerk/letterboxd-scripts/issues
// @updateURL   https://raw.githubusercontent.com/su1c1d3jerk/letterboxd-scripts/master/Letterboxd_Rating_Base_10.user.js
// @icon        https://raw.githubusercontent.com/su1c1d3jerk/letterboxd-scripts/master/img/letterboxd_icon.png
// @license     MIT
// @version     2.0
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
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require     https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant       GM_addStyle
// ==/UserScript==

waitForKeyElements (".average-rating meta[itemprop='ratingValue']", actionFunction);

function actionFunction (jNode){
    jNode.parent().children().html((Math.round(jNode.attr("content") * 10) / 10).toFixed(1));
}

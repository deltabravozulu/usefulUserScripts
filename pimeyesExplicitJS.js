// ==UserScript==
// @name        pimeyesExplicitJS 
// @namespace   Violentmonkey Scripts
// @match       *://pimeyes.com/en/search/*
// @grant       none
// @version     2.3
// @author      DeltaBravoZulu
// @description 5/20/2021, 1:58:32 PM
// @run-at      document-idle
// ==/UserScript==
      ///////////////////////////////////////////////////////////////////////////////////
     ///////////////////////////////////////////////////////////////////////////////////
    ////   A script to allow automatic image loading, page improvements via CSS,   ////
   ////   explicit result isolation, and other neat stuff on pimeyes.com          ////
  ////   by DeltaBravoZulu                                                       ////
 ///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////


  ///////////////////////////////////////
 //       Script Initialization       //
///////////////////////////////////////
/*
** Invokes injection of buttons
** Sets initial variables and gathers stats
*/

//Make sure page loads before starting 
(new MutationObserver(check)).observe(document, {childList: true, subtree: true});

function check(changes, observer) {
    if(document.querySelector('#results > div > div > div.top-slot > div > div > div > button:nth-child(5) > img')) {
    observer.disconnect();
    explicitButts();
    scrollButts();
    explicitCount = 0;
    explicitStats();
    scrolled = 0;
    scrollResultsUpdateListener();    }
}

//Alternative way of doing it
/*
var observer = new MutationObserver(resetTimer);
var timer = setTimeout(action, 2000, observer); // wait for the page to stay still for 2 seconds
observer.observe(document, {childList: true, subtree: true});
function resetTimer(changes, observer) {
	clearTimeout(timer);
	timer = setTimeout(action, 2000, observer);
}

function action(o) {
	o.disconnect();
	observer.disconnect();
    explicitButts();
    scrollButts();
    explicitCount = 0;
    explicitStats();
    scrolled = 0;
    scrollResultsUpdateListener();
}
*/


  ///////////////////////////////////////
 //         Button Injections         //
///////////////////////////////////////
/*
** Adds buttons to invoke scrolling and removal
** Sets initial variable and gathers stats
*/

//Injects a button that, when pressed, will scroll to the bottom of the page to load all images, then remove all images that are not explicit
function explicitButts() {
	console.log("Adding 18+ Button");
	var oldButtons = document.querySelector(
		"#results > div > div > div.top-slot > div > div > div > button:last-child"
	);
	var explicitButtons = oldButtons.parentElement;
	var iconHtml =
		'<button data-v-4ccff48d="" type="button" class="default icon-only" data-v-46dbee4d="" id="18Button"><img data-v-4ccff48d="" src="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzEwLjkgMzEwLjkiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTk1IDIxMS40di04OS4zSDc0LjRWOTkuMmg0OS4xdjExMi4yem0xMzUuNi04My4yYzAgOS44LTUuMyAxOC40LTE0LjEgMjMuMiAxMi4zIDUuMSAyMCAxNS44IDIwIDI4LjMgMCAyMC4yLTE3LjkgMzMtNDUuOSAzM3MtNDUuOS0xMi42LTQ1LjktMzIuNWMwLTEyLjggOC4zLTIzLjcgMjEuMy0yOC44LTkuNC01LjMtMTUuNS0xNC4yLTE1LjUtMjQgMC0xNy45IDE1LjctMjkuMyA0MC0yOS4zIDI0LjUuMSA0MC4xIDExLjcgNDAuMSAzMC4xem0tNTkuMSA0OS4yYzAgOS40IDYuNyAxNC43IDE5IDE0LjdzMTkuMi01LjEgMTkuMi0xNC43YzAtOS4zLTYuOS0xNC42LTE5LjItMTQuNnMtMTkgNS4zLTE5IDE0LjZ6bTIuOS00Ny42YzAgOCA1LjggMTIuNSAxNi4yIDEyLjVzMTYuMi00LjUgMTYuMi0xMi41YzAtOC4zLTUuOC0xMy0xNi4yLTEzLTEwLjUuMS0xNi4yIDQuNy0xNi4yIDEzeiIvPjxwYXRoIGQ9Ik0xNTUuNCAzMTAuOUM2OS43IDMxMC45IDAgMjQxLjEgMCAxNTUuNFM2OS43IDAgMTU1LjQgMGMxMS42IDAgMjMuMiAxLjMgMzQuNSAzLjlWMTVjLTExLjItMi44LTIyLjgtNC4xLTM0LjUtNC4xLTc5LjcgMC0xNDQuNiA2NC45LTE0NC42IDE0NC42czY0LjkgMTQ0LjYgMTQ0LjYgMTQ0LjZTMzAwIDIzNS4yIDMwMCAxNTUuNWMwLTExLjctMS40LTIzLjMtNC4xLTM0LjVIMzA3YzIuNiAxMS4zIDMuOSAyMi44IDMuOSAzNC41IDAgODUuNi02OS44IDE1NS40LTE1NS41IDE1NS40eiIvPjxwYXRoIGQ9Ik0yNzUuNyAzNS4xVjMuNkgyNTN2MzEuNWgtMzEuNHYyMi43SDI1M3YzMS41aDIyLjdWNTcuOGgzMS41VjM1LjF6Ii8+PC9zdmc+"> <span data-v-4ccff48d="">View Explicit</span></button>';
	explicitButtons.insertAdjacentHTML("beforeend", iconHtml);
	document.getElementById("18Button").addEventListener("click", explicitJS);
	console.log("Added 18+ Button");
}

//Injects a scroll button which will allow one to load all images on the page automatically
function scrollButts() {
	console.log("Adding Scroll Button");
	var oldButtons = document.querySelector(
		"#results > div > div > div.top-slot > div > div > div > button:last-child"
	);
	var scrollButton = oldButtons.parentElement;
	var scrollIconHtml =
		'<button data-v-4ccff48d="" type="button" class="default icon-only" data-v-46dbee4d="" id="scrollButton"><img data-v-4ccff48d="" src="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNDkwLjcgNDkwLjciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTQ3Mi4zIDIxNi41LTIyNy4xIDIyNy4yLTIyNy4xLTIyNy4yYy00LjItNC4xLTExLTQtMTUuMS4zLTQgNC4xLTQgMTAuNyAwIDE0LjhsMjM0LjcgMjM0LjdjNC4yIDQuMiAxMC45IDQuMiAxNS4xIDBsMjM0LjctMjM0LjdjNC4xLTQuMiA0LTExLS4zLTE1LjEtNC4yLTQtMTAuNy00LTE0LjkgMHoiIGZpbGw9IiM2MDdkOGIiLz48cGF0aCBkPSJtNDcyLjMgMjQuNS0yMjcuMSAyMjcuMi0yMjcuMS0yMjcuMmMtNC4yLTQuMS0xMS00LTE1LjEuMy00IDQuMS00IDEwLjcgMCAxNC44bDIzNC43IDIzNC43YzQuMiA0LjIgMTAuOSA0LjIgMTUuMSAwbDIzNC42LTIzNC43YzQuMi00LjEgNC40LTEwLjguMy0xNS4xLTQuMS00LjItMTAuOC00LjQtMTUuMS0uMy0uMS4yLS4yLjItLjMuM3oiIGZpbGw9IiM2MDdkOGIiLz48cGF0aCBkPSJtMjQ1LjIgNDY5LjRjLTIuOCAwLTUuNS0xLjEtNy42LTMuMWwtMjM0LjYtMjM0LjdjLTQuMS00LjItNC0xMSAuMy0xNS4xIDQuMS00IDEwLjctNCAxNC44IDBsMjI3LjEgMjI3LjEgMjI3LjEtMjI3LjFjNC4yLTQuMSAxMS00IDE1LjEuMyA0IDQuMSA0IDEwLjcgMCAxNC44bC0yMzQuNyAyMzQuN2MtMiAyLTQuNyAzLjEtNy41IDMuMXoiLz48cGF0aCBkPSJtMjQ1LjIgMjc3LjRjLTIuOCAwLTUuNS0xLjEtNy42LTMuMWwtMjM0LjYtMjM0LjdjLTQuMS00LjItNC0xMSAuMy0xNS4xIDQuMS00IDEwLjctNCAxNC44IDBsMjI3LjEgMjI3LjEgMjI3LjEtMjI3LjFjNC4xLTQuMiAxMC44LTQuNCAxNS4xLS4zczQuNCAxMC44LjMgMTUuMWMtLjEuMS0uMi4yLS4zLjNsLTIzNC43IDIzNC43Yy0yIDItNC43IDMuMS03LjUgMy4xeiIvPjwvc3ZnPg=="> <span data-v-4ccff48d="">Scroll Button</span></button>';
	scrollButton.insertAdjacentHTML("beforeend", scrollIconHtml);
	document.getElementById("scrollButton").addEventListener("click", scroller);
	console.log("Added Scroll Button");
}


  ///////////////////////////////////////
 //       Removal Prerequisites       //
///////////////////////////////////////
/*
** Includes a scroller to load the page, stats, and sleep timers
*/

//Scrolls down the page as fast as possible
function scrollDown() {
	window.scrollBy(0, 10000);
	window.scrollTo(0, document.body.scrollHeight);
}

//Scrolls to the top of the page
function scrollUp() {
	window.scrollBy(0, -50000);
	window.scrollTo(0, 0);
}

//Scrolls all the way to the bottom of the page to load all results, then scrolls back to the top
async function scroller() {
	if (document.querySelectorAll("div.results-end").length === 1) {
		scrolled = 1
	}
	else if (document.querySelectorAll("div.results-end").length === 0) {
		scrolled = 0
	}
	while (scrolled < 1) {
		console.log("Scrolling to the bottom of the results");
		var scrollCount = 1;
		do {
			scrollDown();
			console.log("Sleeping 1000ms");
			await sleep(1000);
			console.log("Still scrolling (" + scrollCount + "x)");
			scrollCount++;
		} while (document.querySelectorAll("div.results-end").length === 0);
		console.log("Done scrolling");
		console.log("Sleeping 1000ms");
		await sleep(1000);
		console.log("Scrolling to top of page");
		scrollUp();
		console.log("We reached the top");
		console.log("Sleeping 1000ms");
		await sleep(1000);
		scrolled = 1;
	}
}

//Lets script sleep after functions to allow page a bit of time to catch up
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

//Helper script to update the count of explicit results
function expResultsUpdater() {
	explicitCount = document.querySelectorAll(
		"#results div.results-grid div.result div.thumbnail span.explicit-result"
	).length;
	console.log(explicitCount + " potentially explicit results so far");
	document.getElementById("expResults").innerHTML = explicitCount;
}

//Injects an explicit results running total at the top of the page
function explicitStats() {
	console.log("Inserting Stats Counter");
	var oldResults = document.querySelector(
		"#results > div > div > div.top-slot > div > div > span > span:nth-child(2)"
	);
	var explicitResults = oldResults;
	var resultsHtml =
		'<span data-v-26e5f418="">' +
		'<bdi id="expResults">' +
		explicitCount +
		"</bdi>" +
		" potentially explicit results so far</span>";
	explicitResults.insertAdjacentHTML("beforebegin", resultsHtml);
	expResultsUpdater();
}

//Updates the explicit results count that was injected at the top of the page then stops doing anything after page-end is reached
function scrollResultsUpdateListener() {
	addEventListener("scroll", function () {
		if (document.querySelectorAll("div.results-end").length === 0) {
		expResultsUpdater();
		scrolled = 0;
	}
});
}


  ///////////////////////////////////////
 //          Removal Scripts          //
///////////////////////////////////////
/*
**Pure Javascript based removal scripts
*/

//Script to remove nonexplicit images using jQuery
function jsRemover() {
	console.log("Running removal script (Pure JavaScript)");
	document
		.querySelectorAll("#results div.results-grid div.result div.thumbnail")
		.forEach(function (element) {
			if (!element.querySelector("span.explicit-result")) {
				element.parentNode.remove();
			}
		});
	console.log("Finished removal script");
}

//jsRemover helper script
async function explicitJS() {
	console.log("Starting the removal process");
	await scroller();
	jsRemover();
	console.log("Finished the removal process");
}

/*
**jQuery based removal scripts
*/

//Script to remove nonexplicit images using jQuery
function jqRemover() {
	console.log("Running removal service (jQuery)");
	jQuery(
		"#results div.results-grid div.result div.thumbnail:has(span):not(:has(.explicit-result))"
	)
		.parent()
		.remove();
	console.log("Finished removal script");
}

//jqRemover helper script
async function explicitJQ() {
	jqGetter();
	console.log("Starting the removal process");
	await scroller();
	jsRemover();
	console.log("Finished the removal process");
}

//Downloads jQuery to the page
function jqGetter() {
	console.log("Downloading jQuery to page");
	var el = document.createElement("div"),
		b = document.getElementsByTagName("body")[0],
		otherlib = !1,
		msg = "";
	(el.style.position = "fixed"),
		(el.style.height = "32px"),
		(el.style.width = "220px"),
		(el.style.marginLeft = "-110px"),
		(el.style.top = "0"),
		(el.style.left = "50%"),
		(el.style.padding = "5px 10px"),
		(el.style.zIndex = 1001),
		(el.style.fontSize = "12px"),
		(el.style.color = "#222"),
		(el.style.backgroundColor = "#f99");

	function showMsg() {
		var txt = document.createTextNode(msg);
		el.appendChild(txt),
			b.appendChild(el),
			window.setTimeout(function () {
				(txt = null),
					typeof jQuery == "undefined"
						? b.removeChild(el)
						: (jQuery(el).fadeOut("slow", function () {
								jQuery(this).remove();
						  }),
						  otherlib && (window.$jq = jQuery.noConflict()));
			}, 2500);
	}
	if (typeof jQuery != "undefined")
		return (
			(msg = "This page already using jQuery v" + jQuery.fn.jquery),
			showMsg()
		);
	typeof $ == "function" && (otherlib = !0);

	function getScript(url, success) {
		var script = document.createElement("script");
		script.src = url;
		var head = document.getElementsByTagName("head")[0],
			done = !1;
		(script.onload = script.onreadystatechange = function () {
			!done &&
				(!this.readyState ||
					this.readyState == "loaded" ||
					this.readyState == "complete") &&
				((done = !0),
				success(),
				(script.onload = script.onreadystatechange = null),
				head.removeChild(script));
		}),
			head.appendChild(script);
	}
	getScript("//code.jquery.com/jquery.min.js", function () {
		return (
			typeof jQuery == "undefined"
				? (msg = "Sorry, but jQuery was not able to load")
				: ((msg =
						"This page is now jQuerified with v" +
						jQuery.fn.jquery),
				  otherlib &&
						(msg += " and noConflict(). Use $jq(), not $().")),
			showMsg()
		);
	});
	console.log("jQuery downloaded to page");
}


  ///////////////////////////////////////
 //     CSS Mods/Page Improvement     //
///////////////////////////////////////
/**
 * Utility function to add CSS in multiple passes.
 * @param {string} styleString
 * From http://stackoverflow.com/a/15506705
 **/
function addStyle(styleString) {
	const style = document.createElement("style");
	style.textContent = styleString;
	document.head.append(style);
}

//From https://greasyfork.org/scripts/406062
addStyle(`
/*Un-blur the URLs*/
.blurred-source-url {
    user-select: all !important;
    ;
}
`);

//From https://greasyfork.org/scripts/406062
addStyle(`
/*Make the URLs selectable, and visible*/
*.url {
    filter: none !important;
    ;
    overflow: visible !important;
    ;
    user-select: initial !important;
    ;
    max-width: initial !important;
    ;
    pointer-events: none !important;
    ;
    position: initial !important;
}
`);

//From https://greasyfork.org/scripts/406062
addStyle(`
/*Remove the Buy Premium overlay on images*/
.zoom {
    display: none !important;
    ;
}
`);

//From https://greasyfork.org/scripts/406062
addStyle(`
/*Remove the 'Get access to archival results and Deep search for $299.99/mo overlay on images*/
.promo {
    display: none !important;
    ;
}
`);

//From https://greasyfork.org/scripts/406062
addStyle(`
/*Remove the actions menu, so we can select the image*/
.actions {
    display: none !important;
    ;
}
`);

//From https://greasyfork.org/scripts/406062
/*
addStyle(`
/*Hide UNLOCK buttons*\/
button[type="button"] {
    display: none !important;
    ;
}
`);
*/

//From https://greasyfork.org/scripts/406062
addStyle(`
/*un-hide add picture button*/
button[class="spacer"] {
    display: inherit !important;
    ;
}
`);

//From https://greasyfork.org/scripts/406062
addStyle(`
/*Remove events from image*/
div.thumbnail {
    pointer-events: none !important;
    ;
}
`);

addStyle(`
/*Hide the unlock popup/buttons if it appears*/
#app > div:nth-child(4) > div > div.mask {
    display: none !important;
    ;
}
`);

addStyle(`
/*Hide the unlock popup/buttons if it appears*/
#app > div:nth-child(4) > div.wrapper {
    display: none !important;
    ;
}
`);

addStyle(`
/*Hide the unlock popup if it appears in another way*/
#app > div:nth-child(3) > div.wrapper {
    display: none !important;
    ;
}
`);

addStyle(`
/*Hide the Formspring payment request*/
#fscCanvas {
    display: none !important;
    ;
}
`);

addStyle(`
/*Prevent the overlays from blocking scrolling*
body {
    overflow: visible !important;
    ;
}
`);

/*
** bookmarklet
javascript:(function()%7Bfunction%20n()%7Bconsole.log(%22Adding%2018%2B%20Button%22)%3Bdocument.querySelector(%22%23results%20%3E%20div%20%3E%20div%20%3E%20div.top-slot%20%3E%20div%20%3E%20div%20%3E%20div%20%3E%20button%3Alast-child%22).parentElement.insertAdjacentHTML(%22beforeend%22%2C'%3Cbutton%20data-v-4ccff48d%3D%22%22%20type%3D%22button%22%20class%3D%22default%20icon-only%22%20data-v-46dbee4d%3D%22%22%20id%3D%2218Button%22%3E%3Cimg%20data-v-4ccff48d%3D%22%22%20src%3D%22data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB2aWV3Qm94PSIwIDAgMzEwLjkgMzEwLjkiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI%2BPHBhdGggZD0iTTk1IDIxMS40di04OS4zSDc0LjRWOTkuMmg0OS4xdjExMi4yem0xMzUuNi04My4yYzAgOS44LTUuMyAxOC40LTE0LjEgMjMuMiAxMi4zIDUuMSAyMCAxNS44IDIwIDI4LjMgMCAyMC4yLTE3LjkgMzMtNDUuOSAzM3MtNDUuOS0xMi42LTQ1LjktMzIuNWMwLTEyLjggOC4zLTIzLjcgMjEuMy0yOC44LTkuNC01LjMtMTUuNS0xNC4yLTE1LjUtMjQgMC0xNy45IDE1LjctMjkuMyA0MC0yOS4zIDI0LjUuMSA0MC4xIDExLjcgNDAuMSAzMC4xem0tNTkuMSA0OS4yYzAgOS40IDYuNyAxNC43IDE5IDE0LjdzMTkuMi01LjEgMTkuMi0xNC43YzAtOS4zLTYuOS0xNC42LTE5LjItMTQuNnMtMTkgNS4zLTE5IDE0LjZ6bTIuOS00Ny42YzAgOCA1LjggMTIuNSAxNi4yIDEyLjVzMTYuMi00LjUgMTYuMi0xMi41YzAtOC4zLTUuOC0xMy0xNi4yLTEzLTEwLjUuMS0xNi4yIDQuNy0xNi4yIDEzeiIvPjxwYXRoIGQ9Ik0xNTUuNCAzMTAuOUM2OS43IDMxMC45IDAgMjQxLjEgMCAxNTUuNFM2OS43IDAgMTU1LjQgMGMxMS42IDAgMjMuMiAxLjMgMzQuNSAzLjlWMTVjLTExLjItMi44LTIyLjgtNC4xLTM0LjUtNC4xLTc5LjcgMC0xNDQuNiA2NC45LTE0NC42IDE0NC42czY0LjkgMTQ0LjYgMTQ0LjYgMTQ0LjZTMzAwIDIzNS4yIDMwMCAxNTUuNWMwLTExLjctMS40LTIzLjMtNC4xLTM0LjVIMzA3YzIuNiAxMS4zIDMuOSAyMi44IDMuOSAzNC41IDAgODUuNi02OS44IDE1NS40LTE1NS41IDE1NS40eiIvPjxwYXRoIGQ9Ik0yNzUuNyAzNS4xVjMuNkgyNTN2MzEuNWgtMzEuNHYyMi43SDI1M3YzMS41aDIyLjdWNTcuOGgzMS41VjM1LjF6Ii8%2BPC9zdmc%2B%22%3E%20%3Cspan%20data-v-4ccff48d%3D%22%22%3EView%20Explicit%3C%2Fspan%3E%3C%2Fbutton%3E')%2Cdocument.getElementById(%2218Button%22).addEventListener(%22click%22%2Cl)%2Cconsole.log(%22Added%2018%2B%20Button%22)%7Dfunction%20t()%7Bconsole.log(%22Adding%20Scroll%20Button%22)%3Bdocument.querySelector(%22%23results%20%3E%20div%20%3E%20div%20%3E%20div.top-slot%20%3E%20div%20%3E%20div%20%3E%20div%20%3E%20button%3Alast-child%22).parentElement.insertAdjacentHTML(%22beforeend%22%2C'%3Cbutton%20data-v-4ccff48d%3D%22%22%20type%3D%22button%22%20class%3D%22default%20icon-only%22%20data-v-46dbee4d%3D%22%22%20id%3D%22scrollButton%22%3E%3Cimg%20data-v-4ccff48d%3D%22%22%20src%3D%22data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB2aWV3Qm94PSIwIDAgNDkwLjcgNDkwLjciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI%2BPHBhdGggZD0ibTQ3Mi4zIDIxNi41LTIyNy4xIDIyNy4yLTIyNy4xLTIyNy4yYy00LjItNC4xLTExLTQtMTUuMS4zLTQgNC4xLTQgMTAuNyAwIDE0LjhsMjM0LjcgMjM0LjdjNC4yIDQuMiAxMC45IDQuMiAxNS4xIDBsMjM0LjctMjM0LjdjNC4xLTQuMiA0LTExLS4zLTE1LjEtNC4yLTQtMTAuNy00LTE0LjkgMHoiIGZpbGw9IiM2MDdkOGIiLz48cGF0aCBkPSJtNDcyLjMgMjQuNS0yMjcuMSAyMjcuMi0yMjcuMS0yMjcuMmMtNC4yLTQuMS0xMS00LTE1LjEuMy00IDQuMS00IDEwLjcgMCAxNC44bDIzNC43IDIzNC43YzQuMiA0LjIgMTAuOSA0LjIgMTUuMSAwbDIzNC42LTIzNC43YzQuMi00LjEgNC40LTEwLjguMy0xNS4xLTQuMS00LjItMTAuOC00LjQtMTUuMS0uMy0uMS4yLS4yLjItLjMuM3oiIGZpbGw9IiM2MDdkOGIiLz48cGF0aCBkPSJtMjQ1LjIgNDY5LjRjLTIuOCAwLTUuNS0xLjEtNy42LTMuMWwtMjM0LjYtMjM0LjdjLTQuMS00LjItNC0xMSAuMy0xNS4xIDQuMS00IDEwLjctNCAxNC44IDBsMjI3LjEgMjI3LjEgMjI3LjEtMjI3LjFjNC4yLTQuMSAxMS00IDE1LjEuMyA0IDQuMSA0IDEwLjcgMCAxNC44bC0yMzQuNyAyMzQuN2MtMiAyLTQuNyAzLjEtNy41IDMuMXoiLz48cGF0aCBkPSJtMjQ1LjIgMjc3LjRjLTIuOCAwLTUuNS0xLjEtNy42LTMuMWwtMjM0LjYtMjM0LjdjLTQuMS00LjItNC0xMSAuMy0xNS4xIDQuMS00IDEwLjctNCAxNC44IDBsMjI3LjEgMjI3LjEgMjI3LjEtMjI3LjFjNC4xLTQuMiAxMC44LTQuNCAxNS4xLS4zczQuNCAxMC44LjMgMTUuMWMtLjEuMS0uMi4yLS4zLjNsLTIzNC43IDIzNC43Yy0yIDItNC43IDMuMS03LjUgMy4xeiIvPjwvc3ZnPg%3D%3D%22%3E%20%3Cspan%20data-v-4ccff48d%3D%22%22%3EScroll%20Button%3C%2Fspan%3E%3C%2Fbutton%3E')%2Cdocument.getElementById(%22scrollButton%22).addEventListener(%22click%22%2Co)%2Cconsole.log(%22Added%20Scroll%20Button%22)%7Dfunction%20i()%7Bwindow.scrollBy(0%2C1e4)%2Cwindow.scrollTo(0%2Cdocument.body.scrollHeight)%7Dfunction%20M()%7Bwindow.scrollBy(0%2C-5e4)%2Cwindow.scrollTo(0%2C0)%7Dasync%20function%20o()%7Bfor(1%3D%3D%3Ddocument.querySelectorAll(%22div.results-end%22).length%3Fscrolled%3D1%3A0%3D%3D%3Ddocument.querySelectorAll(%22div.results-end%22).length%26%26(scrolled%3D0)%3Bscrolled%3C1%3B)%7Bconsole.log(%22Scrolling%20to%20the%20bottom%20of%20the%20results%22)%3Bvar%20n%3D1%3Bdo%7Bi()%2Cconsole.log(%22Sleeping%201000ms%22)%2Cawait%20u(1e3)%2Cconsole.log(%22Still%20scrolling%20(%22%2Bn%2B%22x)%22)%2Cn%2B%2B%7Dwhile(0%3D%3D%3Ddocument.querySelectorAll(%22div.results-end%22).length)%3Bconsole.log(%22Done%20scrolling%22)%2Cconsole.log(%22Sleeping%201000ms%22)%2Cawait%20u(1e3)%2Cconsole.log(%22Scrolling%20to%20top%20of%20page%22)%2CM()%2Cconsole.log(%22We%20reached%20the%20top%22)%2Cconsole.log(%22Sleeping%201000ms%22)%2Cawait%20u(1e3)%2Cscrolled%3D1%7D%7Dfunction%20u(t)%7Breturn%20new%20Promise(n%3D%3EsetTimeout(n%2Ct))%7Dfunction%20e()%7BexplicitCount%3Ddocument.querySelectorAll(%22%23results%20div.results-grid%20div.result%20div.thumbnail%20span.explicit-result%22).length%2Cconsole.log(explicitCount%2B%22%20potentially%20explicit%20results%20so%20far%22)%2Cdocument.getElementById(%22expResults%22).innerHTML%3DexplicitCount%7Dfunction%20L()%7Bconsole.log(%22Inserting%20Stats%20Counter%22)%3Bvar%20n%3Ddocument.querySelector(%22%23results%20%3E%20div%20%3E%20div%20%3E%20div.top-slot%20%3E%20div%20%3E%20div%20%3E%20span%20%3E%20span%3Anth-child(2)%22)%2Ct%3D'%3Cspan%20data-v-26e5f418%3D%22%22%3E%3Cbdi%20id%3D%22expResults%22%3E'%2BexplicitCount%2B%22%3C%2Fbdi%3E%20potentially%20explicit%20results%20so%20far%3C%2Fspan%3E%22%3Bn.insertAdjacentHTML(%22beforebegin%22%2Ct)%2Ce()%7Dfunction%20c()%7BaddEventListener(%22scroll%22%2Cfunction()%7B0%3D%3D%3Ddocument.querySelectorAll(%22div.results-end%22).length%26%26(e()%2Cscrolled%3D0)%7D)%7Dfunction%20d()%7Bconsole.log(%22Running%20removal%20script%20(Pure%20JavaScript)%22)%2Cdocument.querySelectorAll(%22%23results%20div.results-grid%20div.result%20div.thumbnail%22).forEach(function(n)%7Bn.querySelector(%22span.explicit-result%22)%7C%7Cn.parentNode.remove()%7D)%2Cconsole.log(%22Finished%20removal%20script%22)%7Dasync%20function%20l()%7Bconsole.log(%22Starting%20the%20removal%20process%22)%2Cawait%20o()%2Cd()%2Cconsole.log(%22Finished%20the%20removal%20process%22)%7Dfunction%20s(n)%7Bconst%20t%3Ddocument.createElement(%22style%22)%3Bt.textContent%3Dn%2Cdocument.head.append(t)%7Dn()%2Ct()%2CexplicitCount%3D0%2CL()%2Cscrolled%3D0%2Cc()%2Cs(%22%5Cn.blurred-source-url%20%7B%5Cn%20%20%20%20user-select%3A%20all%20!important%3B%5Cn%20%20%20%20%3B%5Cn%7D%5Cn%22)%2Cs(%22%5Cn*.url%20%7B%5Cn%20%20%20%20filter%3A%20none%20!important%3B%5Cn%20%20%20%20%3B%5Cn%20%20%20%20overflow%3A%20visible%20!important%3B%5Cn%20%20%20%20%3B%5Cn%20%20%20%20user-select%3A%20initial%20!important%3B%5Cn%20%20%20%20%3B%5Cn%20%20%20%20max-width%3A%20initial%20!important%3B%5Cn%20%20%20%20%3B%5Cn%20%20%20%20pointer-events%3A%20none%20!important%3B%5Cn%20%20%20%20%3B%5Cn%20%20%20%20position%3A%20initial%20!important%3B%5Cn%7D%5Cn%22)%2Cs(%22%5Cn.zoom%20%7B%5Cn%20%20%20%20display%3A%20none%20!important%3B%5Cn%20%20%20%20%3B%5Cn%7D%5Cn%22)%2Cs(%22%5Cn.promo%20%7B%5Cn%20%20%20%20display%3A%20none%20!important%3B%5Cn%20%20%20%20%3B%5Cn%7D%5Cn%22)%2Cs(%22%5Cn.actions%20%7B%5Cn%20%20%20%20display%3A%20none%20!important%3B%5Cn%20%20%20%20%3B%5Cn%7D%5Cn%22)%2Cs('%5Cnbutton%5Bclass%3D%22spacer%22%5D%20%7B%5Cn%20%20%20%20display%3A%20inherit%20!important%3B%5Cn%20%20%20%20%3B%5Cn%7D%5Cn')%2Cs(%22%5Cndiv.thumbnail%20%7B%5Cn%20%20%20%20pointer-events%3A%20none%20!important%3B%5Cn%20%20%20%20%3B%5Cn%7D%5Cn%22)%2Cs(%22%5Cn%23app%20%3E%20div%3Anth-child(4)%20%3E%20div%20%3E%20div.mask%20%7B%5Cn%20%20%20%20display%3A%20none%20!important%3B%5Cn%20%20%20%20%3B%5Cn%7D%5Cn%22)%2Cs(%22%5Cn%23app%20%3E%20div%3Anth-child(4)%20%3E%20div.wrapper%20%7B%5Cn%20%20%20%20display%3A%20none%20!important%3B%5Cn%20%20%20%20%3B%5Cn%7D%5Cn%22)%2Cs(%22%5Cn%23app%20%3E%20div%3Anth-child(3)%20%3E%20div.wrapper%20%7B%5Cn%20%20%20%20display%3A%20none%20!important%3B%5Cn%20%20%20%20%3B%5Cn%7D%5Cn%22)%2Cs(%22%5Cn%23fscCanvas%20%7B%5Cn%20%20%20%20display%3A%20none%20!important%3B%5Cn%20%20%20%20%3B%5Cn%7D%5Cn%22)%2Cs(%22%5Cnbody%20%7B%5Cn%20%20%20%20overflow%3A%20visible%20!important%3B%5Cn%20%20%20%20%3B%5Cn%7D%5Cn%22)%3B%7D)()%3B
*/

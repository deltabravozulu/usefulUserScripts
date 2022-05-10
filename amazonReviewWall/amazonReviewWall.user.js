// ==UserScript==
// @name        amazonReviewWall
// @namespace   https://github.com/deltabravozulu/usefulUserScripts
// @include     /^https?:\/\/(www|smile)\.amazon\.(cn|in|co\.jp|sg|ae|fr|de|it|nl|es|co\.uk|ca|com(\.(mx|au|br|tr))?)\/.*(dp|gp\/(product|video)|exec\/obidos\/ASIN|o\/ASIN)\/.*$/
// @updateURL   https://github.com/deltabravozulu/usefulUserScripts/raw/main/amazonReviewWall/amazonReviewWall.user.js
// @grant       none
// @version     9.6.9_420.11
// @author      DeltaBravoZulu
// @description View Amazon review images in a zoomable wall
// @description 2022-05-09T22:04:20
// @run-at      document-idle
// @license     PayMe
// ==/UserScript==
  ///////////////////////////////////////
 //      Amazon Review Photowall      //
///////////////////////////////////////
/*
 ** Makes a zoomable photo wall from Amazon review pictures
 */
async function theStuff() {
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function appendHTML() {
        var wrapper = document.createElement("body");
        wrapper.innerHTML = '\
<style>\
html,body {\
margin: 0;\
padding: 0;\
}\
body { background-color: black; }\
header {\
padding: 1em;\
background-color: #333;\
text-align: center;\
}\
h1 { color:#fff;}\
a:link,\
a:visited {\
text-decoration: none;\
font-family: sans-serif;\
color: white;\
}\
a:hover { color: #ddd; }\
#author { float: left; }\
#repo { float: right; }\
#title {\
display: inline-block;\
font-weight: bold;\
}\
.zoomwall {\
font-size: 0;\
overflow: hidden; \
}\
.zoomwall img {\
height: 15vw;\
opacity: 1;\
vertical-align: top;\
\
transform-origin: 0% 0%;\
transition-property: transform, opacity;\
transition-duration: 0.3s;\
transition-timing-function: ease-out;\
-webkit-transform-origin: 0% 0%;\
-webkit-transition-property: transform, opacity;\
-webkit-transition-duration: 0.3s;\
-webkit-transition-timing-function: ease-out;\
}\
.zoomwall.lightbox img {\
transition-timing-function: ease-in;\
-webkit-transition-timing-function: ease-in;\
}\
.zoomwall.lightbox img {\
opacity: 0.3;\
}\
.zoomwall.lightbox img.active {\
opacity: 1;\
}\
</style>\
<div id="zoomwall" class="zoomwall"></div>\
';
        document.appendChild(wrapper);
    }
    await sleep(1000)
    //begin NEW 
    //https://stackoverflow.com/a/58316317/8398127
    function getChunks(selector, strStart, strEnd) {
        const html = document.querySelector(selector).innerHTML;
        const start = html.indexOf(strStart);
        const end = html.indexOf(strEnd, start);
        if (start == -1 || end == -1) return;
        return {
            before: html.substr(0, start),
            match: html.substr(start, end - start + strEnd.length),
            after: html.substr(end + strEnd.length, html.length - end)
        };
    }
    //document.documentElement.innerHTML.search('imagePopoverController.loadDataAndInitImageGalleryPopover')
    let chunkSelector = '#reviews-image-gallery-container > script'
    let chunkStart = 'data, '
    let chunkEnd = '");'
    chunks = getChunks(chunkSelector, chunkStart, chunkEnd).match
    dataAndCSRF = chunks.replaceAll(');', '').replaceAll('"', '').replaceAll(' ', '')
    dataAndCSRFArray = dataAndCSRF.split(',')
    data = dataAndCSRFArray[1]
    firstReviewIds = dataAndCSRFArray[3]
    asin = data
    csrfToken = firstReviewIds
    let text = ""
    //https://www.amazon.com/hz/reviews-render/get-reviews-with-media?mediaType=image&asin=B08DKK2KD1&csrfToken=guMT%2B0nYuIuyIIE6DbwfM0%2BcGnpEsbBr8SAKSRIAAAABAAAAAGJ5vEhyYXcAAAAA%2B4kUEk%2F7iMGR3xPcX6iU
    function loadReviews() {
        url = 'https://www.amazon.com/hz/reviews-render/get-reviews-with-media?mediaType=image&asin=' + asin + '&csrfToken=' + csrfToken

        function getJSON(url) {
            var resp;
            var xmlHttp;
            resp = '';
            xmlHttp = new XMLHttpRequest();
            if (xmlHttp != null) {
                xmlHttp.open("GET", url, false);
                xmlHttp.send(null);
                resp = xmlHttp.responseText;
            }
            return resp;
        }
        jsonGot = getJSON(url)
        jsonParsed = JSON.parse(jsonGot)
        //need to keep doing this until all pages are hit
        csrfToken = jsonParsed.csrfToken
        reviews = jsonParsed.reviewsWithMediaList
        reviewKeys = Object.keys(reviews)
        reviewCount = reviewKeys.length
        for (var r = 0; r < reviewCount; r++) {
            reviewKey = reviewKeys[r]
            review = reviews[reviewKey];
            //console.log(review)
            reviewId = review.reviewId
            reviewUrl = 'https://www.amazon.com/gp/customer-reviews/' + reviewId
            profileUrl = 'https://www.amazon.com' + review.customerProfileLink
            for (var j = 0; j < review.images.length; j++) {
                imgUrl = review.images[j].source
                //text += "<a href=\"" + reviewUrl + "\" target=\"_blank\"><img src=\"" + imgUrl + "\"/></a>"
                text += "<img src=\"" + imgUrl + "\" reviewurl=\"" + reviewUrl + "\" profileurl=\"" + profileUrl + "\"></img>"
                //text += "<button onclick=\" window.open(\'" + reviewUrl + "\',\'_blank\')\"><img src=\"" + imgUrl + "\"/></button>"
                console.log("imgUrl: " + imgUrl + ", reviewUrl: " + reviewUrl + ", profileUrl: " + profileUrl)
                //console.log(csrfToken)
            }
        }
    }
    loadReviews();
    await sleep(3000)
    //end NEW
    /*
    //begin OLD
    if (document.getElementById('seeAllImages') != null) {
    document.getElementById('seeAllImages').click()
    } else {
    document.querySelector('#reviews-image-gallery-container > div > a').click()
    }
    await sleep(3000)
    // Change height of box so all images will show after toggleSeeAllView()
    var allPopover = document.getElementsByClassName('cr-lightbox-see-all-popover-container');
    for (var i = 0; i < allPopover.length; i++) {
    allPopover[i].style.height = '100%';
    allPopover[i].style.width = '100%';
    allPopover[i].style.overflow = 'visible';
    }
    var allThumbs = document.getElementsByClassName('cr-thumbnail-preview-tile');
    for (var i = 0; i < allThumbs.length; i++) {
    allThumbs[i].style.height = '1em';
    allThumbs[i].style.width = '10em';
    allThumbs[i].style.overflow = 'visible';
    allThumbs[i].style.margin = '0px';
    }
    var allAPopover = document.getElementsByClassName('a-popover');
    for (var i = 0; i < allAPopover.length; i++) {
    allAPopover[i].style.height = '100%';
    allAPopover[i].style.width = '100%';
    allAPopover[i].style.margin = '0px';
    allAPopover[i].style.width = '100%';
    allAPopover[i].style.maxwidth = '100%';
    allAPopover[i].style.left = 'auto';
    allAPopover[i].style.top = 'auto';
    }
    var allAPopoverModal = document.getElementsByClassName('a-popover-modal');
    for (var i = 0; i < allAPopoverModal.length; i++) {
    allAPopoverModal[i].style.height = '100%';
    allAPopoverModal[i].style.width = '100%';
    allAPopoverModal[i].style.margin = '0px';
    allAPopoverModal[i].style.width = '100%';
    allAPopoverModal[i].style.maxwidth = '100%';
    allAPopoverModal[i].style.left = '0px';
    allAPopoverModal[i].style.top = '0px';
    }
    // Use Amazon's native "see all"
    toggleSeeAllView();
    await sleep(1500)
    console.log('Sleepin')
    toggleSeeAllView();
    await sleep(1500)
    console.log('Sleepin')
    toggleSeeAllView();
    await sleep(1500)
    console.log('Sleepin')
    toggleSeeAllView();
    await sleep(200)
    console.log('Sleepin')
    toggleSeeAllView();
    await sleep(200)
    console.log('Sleepin')
    toggleSeeAllView();
    await sleep(200)
    console.log('Sleepin')
    toggleSeeAllView();
    await sleep(200)
    console.log('Sleepin')
    toggleSeeAllView();
    // Set image container
    imgcont = document.getElementById('seeAllImagesContainer')
    if (imgcont == null) {
    imgcont = document.querySelector('#reviews-image-gallery > div.compositeThumbnailContentView')
    }
    // Replaxe thumbnails
    imgcont.innerHTML = imgcont.innerHTML.replaceAll('._SY256', '')
    imgcont.innerHTML = imgcont.innerHTML.replaceAll('._SL256_', '')
    await sleep(1500)
    imgcont.innerHTML = imgcont.innerHTML.replaceAll('._SY256', '')
    imgcont.innerHTML = imgcont.innerHTML.replaceAll('._SL256_', '')
    await sleep(3000)
    if (imgcont.getElementsByClassName('cr-thumbnail-preview-tile')[0] != null) {
    thumb = imgcont.getElementsByClassName('cr-thumbnail-preview-tile')
    } else {
    thumb = imgcont.getElementsByClassName('thumbnailPreviewTile')
    }
    thumbCount = (thumb.length - 1)
    await sleep(2000)
    let text = ""
    let thumbNum = 0;
    do {
    thumbNum++;
    pic = thumb[thumbNum].style.backgroundImage.split('"')[1]
    console.log(pic)
    text += "<img src=\"" + pic + "\" data-highres=\"" + pic + "\"/>"
    }
    while (thumbNum < thumbCount);
    await sleep(1000)
    */ //END OLD
    var newDoc = document.open("text/html", "replace");
    appendHTML();
    await sleep(1000)
    document.getElementById("zoomwall").innerHTML = text;
    await sleep(1000)
    var zoomwall = {
        create: function(blocks, enableKeys) {
            zoomwall.resize(blocks.children);
            blocks.classList.remove('loading');
            // shrink blocks if an empty space is clicked
            blocks.addEventListener('click', function() {
                if (this.children && this.children.length > 0) {
                    zoomwall.shrink(this.children[0]);
                }
            });
            // add click listeners to blocks
            for (var i = 0; i < blocks.children.length; i++) {
                blocks.children[i].addEventListener('click', zoomwall.animate);
            }
            // add key down listener
            if (enableKeys) {
                var keyPager = function(event) {
                    which = event.which
                    keyCode = event.keyCode
                    shiftKey = event.shiftKey
                    altKey = event.altKey
                    ctrlKey = event.ctrlKey
                    metaKey = event.metaKey
                    key = event.key
                    defaultPrevented = event.defaultPrevented
                    //[prevent key codes from working when shift,alt,ctrl,cmd,windows,super,etc. keys are working ]
                    if (defaultPrevented || shiftKey || altKey || ctrlKey || metaKey) {
                        console.log(key);
                        return;
                    }
                    //[ESC] = zoom out
                    else if (keyCode === 27) {
                        console.log(key);
                        if (blocks.children && blocks.children.length > 0) {
                            zoomwall.shrink(blocks.children[0]);
                        }
                        event.preventDefault();
                    }
                    //[⬅] = previous
                    else if (keyCode === 37) {
                        console.log(key);
                        zoomwall.page(blocks, false);
                        event.preventDefault();
                    }
                    //[➡] = next
                    else if (keyCode === 39) {
                        console.log(key);
                        zoomwall.page(blocks, true);
                        event.preventDefault();
                    }
                    //[space]||[⬆]||[r] = open review
                    else if (keyCode === 32 || keyCode === 38 || keyCode === 82) {
                        console.log(key);
                        zoomwall.reviewUrl(blocks);
                        event.preventDefault();
                    }
                    //[⬇]||[p] = open profile
                    else if (keyCode === 40 || keyCode === 80) {
                        console.log(key);
                        zoomwall.profileUrl(blocks);
                        event.preventDefault();
                    } else {
                        console.log(key);
                        return;
                    }
                }
                document.addEventListener('keydown', keyPager);
            }
        },
        resizeRow: function(row, width) {
            if (row && row.length > 1) {
                for (var i in row) {
                    row[i].style.width = (parseInt(window.getComputedStyle(row[i]).width, 10) / width * 100) + '%';
                    row[i].style.height = 'auto';
                }
            }
        },
        calcRowWidth: function(row) {
            var width = 0;
            for (var i in row) {
                width += parseInt(window.getComputedStyle(row[i]).width, 10);
            }
            return width;
        },
        resize: function(blocks) {
            var row = [];
            var top = -1;
            for (var c = 0; c < blocks.length; c++) {
                var block = blocks[c];
                if (block) {
                    if (top == -1) {
                        top = block.offsetTop;
                    } else if (block.offsetTop != top) {
                        zoomwall.resizeRow(row, zoomwall.calcRowWidth(row));
                        row = [];
                        top = block.offsetTop;
                    }
                    row.push(block);
                }
            }
            zoomwall.resizeRow(row, zoomwall.calcRowWidth(row));
        },
        reset: function(block) {
            block.style.transform = 'translate(0, 0) scale(1)';
            block.style.webkitTransform = 'translate(0, 0) scale(1)';
            block.classList.remove('active');
        },
        shrink: function(block) {
            block.parentNode.classList.remove('lightbox');
            // reset all blocks
            zoomwall.reset(block);
            var prev = block.previousElementSibling;
            while (prev) {
                zoomwall.reset(prev);
                prev = prev.previousElementSibling;
            }
            var next = block.nextElementSibling;
            while (next) {
                zoomwall.reset(next);
                next = next.nextElementSibling;
            }
            // swap images
            if (block.dataset.lowres) {
                block.src = block.dataset.lowres;
            }
        },
        expand: function(block) {
            block.classList.add('active');
            block.parentNode.classList.add('lightbox');
            // parent dimensions
            var parentStyle = window.getComputedStyle(block.parentNode);
            var parentWidth = parseInt(parentStyle.width, 10);
            var parentHeight = parseInt(parentStyle.height, 10);
            var parentTop = block.parentNode.getBoundingClientRect().top;
            // block dimensions
            var blockStyle = window.getComputedStyle(block);
            var blockWidth = parseInt(blockStyle.width, 10);
            var blockHeight = parseInt(blockStyle.height, 10);
            // determine maximum height
            var targetHeight = window.innerHeight;
            if (parentHeight < window.innerHeight) {
                targetHeight = parentHeight;
            } else if (parentTop > 0) {
                targetHeight -= parentTop;
            }
            // swap images
            if (block.dataset.highres) {
                if (block.src != block.dataset.highres && block.dataset.lowres === undefined) {
                    block.dataset.lowres = block.src;
                }
                block.src = block.dataset.highres;
            }
            // determine what blocks are on this row
            var row = [];
            row.push(block);
            var next = block.nextElementSibling;
            while (next && next.offsetTop == block.offsetTop) {
                row.push(next);
                next = next.nextElementSibling;
            }
            var prev = block.previousElementSibling;
            while (prev && prev.offsetTop == block.offsetTop) {
                row.unshift(prev);
                prev = prev.previousElementSibling;
            }
            // calculate scale
            var scale = targetHeight / blockHeight;
            if (blockWidth * scale > parentWidth) {
                scale = parentWidth / blockWidth;
            }
            // determine offset
            var offsetY = parentTop - block.parentNode.offsetTop + block.offsetTop;
            if (offsetY > 0) {
                if (parentHeight < window.innerHeight) {
                    offsetY -= targetHeight / 2 - blockHeight * scale / 2;
                }
                if (parentTop > 0) {
                    offsetY -= parentTop;
                }
            }
            var leftOffsetX = 0; // shift in current row
            for (var i = 0; i < row.length && row[i] != block; i++) {
                leftOffsetX += parseInt(window.getComputedStyle(row[i]).width, 10) * scale;
            }
            leftOffsetX = parentWidth / 2 - blockWidth * scale / 2 - leftOffsetX;
            var rightOffsetX = 0; // shift in current row
            for (var i = row.length - 1; i >= 0 && row[i] != block; i--) {
                rightOffsetX += parseInt(window.getComputedStyle(row[i]).width, 10) * scale;
            }
            rightOffsetX = parentWidth / 2 - blockWidth * scale / 2 - rightOffsetX;
            // transform current row
            var itemOffset = 0; // offset due to scaling of previous items
            var prevWidth = 0;
            for (var i = 0; i < row.length; i++) {
                itemOffset += (prevWidth * scale - prevWidth);
                prevWidth = parseInt(window.getComputedStyle(row[i]).width, 10);
                var percentageOffsetX = (itemOffset + leftOffsetX) / prevWidth * 100;
                var percentageOffsetY = -offsetY / parseInt(window.getComputedStyle(row[i]).height, 10) * 100;
                row[i].style.transformOrigin = '0% 0%';
                row[i].style.webkitTransformOrigin = '0% 0%';
                row[i].style.transform = 'translate(' + percentageOffsetX.toFixed(8) + '%, ' + percentageOffsetY.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';
                row[i].style.webkitTransform = 'translate(' + percentageOffsetX.toFixed(8) + '%, ' + percentageOffsetY.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';
            }
            // transform items after
            var nextOffsetY = blockHeight * (scale - 1) - offsetY;
            var prevHeight;
            itemOffset = 0; // offset due to scaling of previous items
            prevWidth = 0;
            var next = row[row.length - 1].nextElementSibling;
            var nextRowTop = -1;
            while (next) {
                var curTop = next.offsetTop;
                if (curTop == nextRowTop) {
                    itemOffset += prevWidth * scale - prevWidth;
                } else {
                    if (nextRowTop != -1) {
                        itemOffset = 0;
                        nextOffsetY += prevHeight * (scale - 1);
                    }
                    nextRowTop = curTop;
                }
                prevWidth = parseInt(window.getComputedStyle(next).width, 10);
                prevHeight = parseInt(window.getComputedStyle(next).height, 10);
                var percentageOffsetX = (itemOffset + leftOffsetX) / prevWidth * 100;
                var percentageOffsetY = nextOffsetY / prevHeight * 100;
                next.style.transformOrigin = '0% 0%';
                next.style.webkitTransformOrigin = '0% 0%';
                next.style.transform = 'translate(' + percentageOffsetX.toFixed(8) + '%, ' + percentageOffsetY.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';
                next.style.webkitTransform = 'translate(' + percentageOffsetX.toFixed(8) + '%, ' + percentageOffsetY.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';
                next = next.nextElementSibling;
            }
            // transform items before
            var prevOffsetY = -offsetY;
            itemOffset = 0; // offset due to scaling of previous items
            prevWidth = 0;
            var prev = row[0].previousElementSibling;
            var prevRowTop = -1;
            while (prev) {
                var curTop = prev.offsetTop;
                if (curTop == prevRowTop) {
                    itemOffset -= prevWidth * scale - prevWidth;
                } else {
                    itemOffset = 0;
                    prevOffsetY -= parseInt(window.getComputedStyle(prev).height, 10) * (scale - 1);
                    prevRowTop = curTop;
                }
                prevWidth = parseInt(window.getComputedStyle(prev).width, 10);
                var percentageOffsetX = (itemOffset - rightOffsetX) / prevWidth * 100;
                var percentageOffsetY = prevOffsetY / parseInt(window.getComputedStyle(prev).height, 10) * 100;
                prev.style.transformOrigin = '100% 0%';
                prev.style.webkitTransformOrigin = '100% 0%';
                prev.style.transform = 'translate(' + percentageOffsetX.toFixed(8) + '%, ' + percentageOffsetY.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';
                prev.style.webkitTransform = 'translate(' + percentageOffsetX.toFixed(8) + '%, ' + percentageOffsetY.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';
                prev = prev.previousElementSibling;
            }
        },
        animate: function(e) {
            if (this.classList.contains('active')) {
                zoomwall.shrink(this);
            } else {
                var actives = this.parentNode.getElementsByClassName('active');
                for (var i = 0; i < actives.length; i++) {
                    actives[i].classList.remove('active');
                }
                zoomwall.expand(this);
            }
            e.stopPropagation();
        },
        //deltabravozulu--adding review url 
        reviewUrl: function(blocks) {
            var actives = blocks.getElementsByClassName('active');
            if (actives && actives.length > 0) {
                var current = actives[0];
            }
            window.open(
                current.attributes.reviewurl.value, "_blank").blur();
            self.focus();
        },
        //deltabravozulu--adding profile url      
        profileUrl: function(blocks) {
            var actives = blocks.getElementsByClassName('active');
            if (actives && actives.length > 0) {
                var current = actives[0];
            }
            window.open(
                current.attributes.profileurl.value, "_blank").blur();
                self.focus();
        },
        page: function(blocks, isNext) {
            var actives = blocks.getElementsByClassName('active');
            if (actives && actives.length > 0) {
                var current = actives[0];
                var next;
                if (isNext) {
                    next = current.nextElementSibling;
                } else {
                    next = current.previousElementSibling;
                }
                if (next) {
                    current.classList.remove('active');
                    // swap images
                    if (current.dataset.lowres) {
                        current.src = current.dataset.lowres;
                    }
                    zoomwall.expand(next);
                }
            }
        }
    };
    await sleep(1000)
    zoomwall.create(document.getElementById("zoomwall"), true);
    await sleep(1000)
    newDoc.close();
}
  ///////////////////////////////////////
 //         Button Injections         //
///////////////////////////////////////
/*
 ** Adds button to process start
 */
function addButts() {
    console.log("Adding Button");
    var oldButtons = document.querySelector(
        "#productTitle"
    );
    var newButtons = oldButtons.parentElement;
    var iconHtml =
        '<button type="button" class="default icon-only" id="ImageWallButton" title="See review images in a wall"><img height="24" width="24" src="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNDAwIDQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMTc4LjcgMGMxMS45IDMuOCAxNS4zIDEyLjMgMTUuMyAyNC4zLS4zIDEwMi43LS4yIDIwNS41LS4yIDMwOC4yIDAgMTQuMi03LjQgMjEuNy0yMS41IDIxLjdoLTE1MC45Yy0xNCAwLTIxLjQtNy40LTIxLjQtMjEuNHYtMjQ1LjgtNC42aDEyLjd2MjE3LjhjMi0xLjUgMy41LTIuNCA0LjYtMy41IDI0LjktMjQuNiA0OS43LTQ5LjIgNzQuNi03My44IDExLjgtMTEuNiAyMy43LTIzLjEgMzUuNS0zNC44IDYuNi02LjUgOS42LTYuNiAxNi4zLjEgMTEuMSAxMSAyMi4yIDIyLjEgMzMuMiAzMy4zLjcuNyAxLjIgMS43IDIuOCAyIC4xLTEuMi4yLTIuNC4yLTMuNiAwLTY2IDAtMTMyIC4xLTE5OCAwLTcuMS0yLjEtOS4xLTkuMi05LjFoLTE0OC45Yy03IDAtOS4yIDIuMy05LjIgOS4zdjIyaC0xMi4yYy4yLTEwLjEtLjUtMjAuNC41LTMwLjQuNy03LjMgNi45LTExLjEgMTMuMy0xMy43em0xLjQgMjQ2LjJjLTE1LjctMTctMjkuOC0zMi40LTQ0LjEtNDcuOC00MS42IDQwLjktODIuMyA4MC45LTEyMy4yIDEyMS4xdjEzLjZjMCA1LjcgMi40IDguMyA4LjIgOC4zIDUwLjUuMSAxMDEuMSAwIDE1MS42IDAgNC44IDAgNy40LTIuNSA3LjQtNy4zLjItMzAuNC4xLTYwLjcuMS04Ny45em0zOSA4LjNjOS41IDEwLjggMTcuNCAxOS44IDI1LjMgMjguOCAxLjEtLjggMS41LTEuMSAxLjktMS40IDEzLTEyLjcgMjUuOS0yNS40IDM4LjktMzguMSAxOC44LTE4LjUgMzcuNi0zNy4xIDU2LjUtNTUuNyA0LjUtNC41IDguNi00LjUgMTMuMi4xIDEwLjMgMTAuMiAyMC41IDIwLjQgMzEuMyAzMS4xdi05MS4yaDEzLjh2MjUyYzAgMTEuNC04LjUgMTkuOC0xOS45IDE5LjhoLTE1NC44Yy0xMC44IDAtMTktOC4yLTE5LTE5di0zMTYuNWMwLTEwLjYgOC4yLTE4LjggMTguNy0xOC44aDE1NS4yYzExLjIgMCAxOS43IDguNSAxOS44IDE5LjYuMSA4LjEgMCAxNi4zIDAgMjQuNmgtMTMuN3YtMjIuOWMwLTYuMy0yLjItOC41LTguNi04LjVoLTE1MC4xYy01LjkgMC04LjYgMi4yLTguNiA3LjMgMCA2NC4yLjEgMTI4LjIuMSAxODguOHptMzYuMyAzN2MxNy4zIDE4LjEgMzQuMyAzNS45IDUxIDUzLjQtMi43IDIuOS01LjQgNS44LTguMyA5LTI2LjItMjUuNy01Mi4yLTUxLjItNzkuMS03Ny42djEwMS4xYzAgNy45IDEuOCA5LjggOS43IDkuOGgxNDguNWM3IDAgOS4xLTIuMSA5LjEtOS4ydi04Ni41LTQ5LjhjLTEzLjktMTUuMS0yNS45LTI4LjMtMzgtNDEuNC0zMS43IDMxLjEtNjIuNiA2MS41LTkyLjkgOTEuMnoiLz48cGF0aCBkPSJtNzcuOCAzMS41YzIzLjQtLjMgNDQuMiAxOS40IDQ1IDQxLjUuOSAyNi45LTE4LjggNDYuNi00My45IDQ3LjItMjUuNC42LTQ2LjMtMTguNi00Ni41LTQyLjItLjItMjYuOSAxOC42LTQ2LjIgNDUuNC00Ni41em0tMzIuNSA0NC43Yy4xIDE2LjkgMTQuOCAzMS40IDMyLjIgMzEgMTcuMy0uNCAzMi4xLTEyLjYgMzIuMS0zMS40IDAtMTkuMS0xNS45LTMxLjEtMzIuMy0zMS4zLTE3LjUtLjEtMzIuMSAxNC42LTMyIDMxLjd6bTMwMi40LTV2MTIuNGgtODkuOXYtMTIuNHptMzguOSAzMS42aDEzLjF2MTIuNGgtMTMuMXptLTM4Ni40LTMzLjV2LTEyLjJoMTIuNHYxMi4yem0zNzMuNSAxNC40aC0xMi40di0xMi40aDEyLjR6Ii8+PC9zdmc+"></img></button>';
    newButtons.insertAdjacentHTML("beforeend", iconHtml);
    document.getElementById("ImageWallButton").addEventListener("click", theStuff);
    console.log("Added Button");
}
addButts();

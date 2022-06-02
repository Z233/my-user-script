// ==UserScript==
// @name         juejin-awebp2Png
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://juejin.cn/post/*
// @icon         https://www.google.com/s2/favicons?domain=juejin.cn
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    waitForKeyElements('.article-title', () => {
        const imgEles = document.querySelectorAll('.medium-zoom-image')
        for (let img of imgEles) {
            img.src = img.src.replace('.awebp', '.png')
        }
    })
})();

function waitForKeyElements(
  selectorOrFunction,
  callback,
  waitOnce,
  interval,
  maxIntervals
) {
  if (typeof waitOnce === 'undefined') {
    waitOnce = true;
  }
  if (typeof interval === 'undefined') {
    interval = 300;
  }
  if (typeof maxIntervals === 'undefined') {
    maxIntervals = -1;
  }
  var targetNodes =
    typeof selectorOrFunction === 'function'
      ? selectorOrFunction()
      : document.querySelectorAll(selectorOrFunction);

  var targetsFound = targetNodes && targetNodes.length > 0;
  if (targetsFound) {
    targetNodes.forEach(function (targetNode) {
      var attrAlreadyFound = 'data-userscript-alreadyFound';
      var alreadyFound =
        targetNode.getAttribute(attrAlreadyFound) || false;
      if (!alreadyFound) {
        var cancelFound = callback(targetNode);
        if (cancelFound) {
          targetsFound = false;
        } else {
          targetNode.setAttribute(attrAlreadyFound, true);
        }
      }
    });
  }

  if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
    maxIntervals -= 1;
    setTimeout(function () {
      waitForKeyElements(
        selectorOrFunction,
        callback,
        waitOnce,
        interval,
        maxIntervals
      );
    }, interval);
  }
}

// https://stackoverflow.com/a/36566052
function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

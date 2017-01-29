(() => {
  'use strict';
  var parentElement = document.currentScript.parentElement;
  parentElement.addEventListener('load', e => {
    if (e.detail.fragment !== parentElement) return;
    // [setup]
    e.detail.fragment.querySelector('.mdl-fragment').currentTest = e.detail.fragment.currentTest;
  });
})();

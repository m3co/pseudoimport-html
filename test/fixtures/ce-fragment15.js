(() => {
  'use strict';
  document.currentScript.parentElement.addEventListener('load', e => {
    // [setup]
    e.detail.fragment.querySelector('x-fragment').currentTest = e.detail.fragment.currentTest;
  });
})();

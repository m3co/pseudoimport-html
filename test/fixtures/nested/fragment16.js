(() => {
  'use strict';
  document.currentScript.parentElement.addEventListener('load', e => {
    // [teardown]
    e.detail.fragment.currentTest.done();
    e.detail.fragment.parentNode.remove();
  });
})();

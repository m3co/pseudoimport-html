(() => {
  'use strict';
  document.currentScript.parentElement.addEventListener('load', e => {
    // [teardown]
    e.detail.fragment.remove();
    e.detail.fragment.currentTest.done();
  });
})();

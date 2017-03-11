'use strict';

const cssFragment = 'x-fragment-element';
const selFragment = `.${cssFragment}`;
const nameElement = 'x-fragment';

setup({allow_uncaught_exception:true});

(() => {
/**
 * Do not move this test to any other place and
 * from the index.html
 */
onload_test(function(e) {
  var fragment = document.querySelector(selFragment);

  assert_true(fragment instanceof HTMLElement);
  assert_true(fragment.loaded instanceof Promise);

  fragment.remove();
  this.done();
}, "Check the API");

//@@include('../_includes/test-ce-wc.js')
//@@include('../_includes/test-ce-delayed.js')
//@@include('../_includes/test-ce-currentFragment.js')
//@@include('../_includes/test-ce-currentFragment-script-src.js')
//@@include('../_includes/test-ce-currentFragment-nested.js')

})();

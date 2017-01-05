'use strict';

const classAsString = "MaterialFragment";
const cssFragment = "mdl-fragment";
const selFragment = `.${cssFragment}`;

(() => {
/**
 * Do not move this test to any other place and
 * Do not remove the unique <ul class="mdl-tree3" /> element
 * from the index.html
 */
onload_test(function(e) {
  var fragment = document.querySelector(selFragment);

  assert_true(fragment.dataset.upgraded.includes(classAsString));
  this.done();
}, "MDL upgrades the component from the Body");

/**
 * Do not move this test to any other place and
 * Do not remove the unique <ul class="mdl-tree3" /> element
 * from the index.html
 */
onload_test(function(e) {
  var fragment = document.querySelector(selFragment).MaterialFragment;

  assert_true(fragment instanceof MaterialFragment);

  document.querySelector(selFragment).remove();
  this.done();
}, "Check the API");

})();

'use strict';

const classAsString = 'MaterialFragment';
const cssFragment = 'mdl-fragment';
const selFragment = `.${cssFragment}`;

(() => {
/**
 * Do not move this test to any other place and
 * from the index.html
 */
onload_test(function(e) {
  var fragment = document.querySelector(selFragment);

  assert_true(fragment.dataset.upgraded.includes(classAsString));
  this.done();
}, "MDL upgrades the component from the Body");

/**
 * Do not move this test to any other place and
 * from the index.html
 */
onload_test(function(e) {
  var fragment = document.querySelector(selFragment).MaterialFragment;

  assert_true(fragment instanceof MaterialFragment);

  document.querySelector(selFragment).remove();
  this.done();
}, "Check the API");

/**
 * Do a simple import from absolute path
 */
onload_test(function(e) {
  // [setup]
  var fragment = document.createElement('div');
  fragment.setAttribute('src', '/test/fixtures/fragment1.html');
  fragment.classList.add(cssFragment);
  fragment.addEventListener('load', this.step_func((e) => {
    // [verify]
    var fragment1 = fragment.querySelector('#fragment1');
    assert_true(fragment1 instanceof HTMLElement);
    assert_equals(fragment1.textContent, 'Fragment 1');
    assert_equals(e.detail.fragment, fragment);

    // [teardown]
    fragment.remove();
    this.done();
  }));

  // [run]
  document.body.appendChild(fragment);
  componentHandler.upgradeElement(fragment);
}, "Import from src='/test/fixtures/fragment1.html' absolute path, default insertion");

/**
 * Do a simple import from relative path
 */
onload_test(function(e) {
  // [setup]
  var fragment = document.createElement('div');
  fragment.setAttribute('src', 'fixtures/fragment1.html');
  fragment.classList.add(cssFragment);
  fragment.addEventListener('load', this.step_func(() => {
    // [verify]
    var fragment1 = fragment.querySelector('#fragment1');
    assert_true(fragment1 instanceof HTMLElement);
    assert_equals(fragment1.textContent, 'Fragment 1');

    // [teardown]
    fragment.remove();
    this.done();
  }));

  // [run]
  document.body.appendChild(fragment);
  componentHandler.upgradeElement(fragment);
}, "Import from src='/test/fixtures/fragment1.html' relative path, default insertion");

/**
 * Do a nested import from relative path
 */
onload_test(function(e) {
  // [setup]
  var fragment = document.createElement('div');
  fragment.setAttribute('src', '/test/fixtures/fragment2.html');
  fragment.classList.add(cssFragment);
  fragment.addEventListener('load', this.step_func(() => {
    // [verify]
    var fragment1 = fragment.querySelector(selFragment);
    var fragment2 = fragment.querySelector('#fragment2');
    assert_true(fragment2 instanceof HTMLElement);
    assert_true(fragment1 instanceof HTMLElement);
    assert_equals(fragment2.textContent, 'Fragment 2');

    fragment1.addEventListener('load', this.step_func(() => {
      var fragment1 = fragment.querySelector('#fragment1');

      assert_true(fragment1 instanceof HTMLElement);
      assert_equals(fragment1.textContent, 'Fragment 1');

      // [teardown]
      fragment.remove();
      this.done();
    }));
  }));

  // [run]
  document.body.appendChild(fragment);
  componentHandler.upgradeElement(fragment);
}, "Import from src='/test/fixtures/fragment2.html' absolute path, nested, default insertion");

})();

'use strict';

const classAsString = 'MaterialFragment';
const cssFragment = 'mdl-fragment';
const selFragment = `.${cssFragment}`;
const selFragmentContent = `.${cssFragment}__content`;

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
 * Do a nested import from absolute path
 */
onload_test(function(e) {
  // [setup]
  var fragment = document.createElement('div');
  fragment.setAttribute('src', '/test/fixtures/fragment2.html');
  fragment.classList.add(cssFragment);
  fragment.addEventListener('load', this.step_func((e) => {
    // [verify]
    var fragment1 = fragment.querySelector(selFragment);
    var fragment2 = fragment.querySelector('#fragment2');
    assert_true(fragment2 instanceof HTMLElement);
    assert_true(fragment1 instanceof HTMLElement);
    assert_equals(fragment2.textContent, 'Fragment 2');
    assert_equals(e.detail.fragment, fragment);

    fragment1.addEventListener('load', this.step_func((e) => {
      var fragment1_ = fragment.querySelector('#fragment1');

      assert_true(fragment1_ instanceof HTMLElement);
      assert_equals(fragment1_.textContent, 'Fragment 1');
      assert_equals(e.detail.fragment, fragment1);

      // [teardown]
      fragment.remove();
      this.done();
    }));
  }));

  // [run]
  document.body.appendChild(fragment);
  componentHandler.upgradeElement(fragment);
}, "Import from src='/test/fixtures/fragment2.html' absolute path, nested, default insertion");

/**
 * Do a nested import from relative path
 */
onload_test(function(e) {
  // [setup]
  var fragment = document.createElement('div');
  fragment.setAttribute('src', 'fixtures/fragment3.html');
  fragment.classList.add(cssFragment);
  fragment.addEventListener('load', this.step_func((e) => {
    // [verify]
    var fragment1 = fragment.querySelector(selFragment);
    var fragment3 = fragment.querySelector('#fragment3');

    assert_true(fragment3 instanceof HTMLElement);
    assert_true(fragment1 instanceof HTMLElement);
    assert_equals(fragment3.textContent, 'Fragment 3');
    assert_equals(e.detail.fragment, fragment);

    fragment1.addEventListener('load', this.step_func((e) => {
      var fragment1_ = fragment.querySelector('#fragment1');

      assert_true(fragment1_ instanceof HTMLElement);
      assert_equals(fragment1_.textContent, 'Fragment 1');
      assert_equals(e.detail.fragment, fragment1);

      // [teardown]
      fragment.remove();
      this.done();
    }));
  }));

  // [run]
  document.body.appendChild(fragment);
  componentHandler.upgradeElement(fragment);
}, "Import from src='fixtures/fragment3.html' relative path, nested, default insertion");

/**
 * Do nested import following FIFO event calling
 */
onload_test(function(e) {
  // [setup]
  var fragment = document.createElement('div');
  fragment.setAttribute('src', 'fixtures/fragment4.html');
  fragment.classList.add(cssFragment);
  fragment.addEventListener('load', this.step_func((e) => {
    // [verify]
    var fragment = e.detail.fragment;
    assert_true(fragment.querySelector('[src="nested/fragment5.html"]') instanceof HTMLElement);
    assert_true(fragment.querySelector('[src="nested/fragment6.html"]') instanceof HTMLElement);
    assert_true(fragment.querySelector('[src="nested1/fragment7.html"]') instanceof HTMLElement);
    assert_true(fragment.querySelector('[src="nested1/fragment8.html"]') instanceof HTMLElement);
    assert_true(fragment.querySelector('[src="nested1/fragment9.html"]') instanceof HTMLElement);
    assert_true(fragment.querySelector('[src="nested1/fragment10.html"]') instanceof HTMLElement);

    // [setup]
    fragment.querySelector('[src="nested/fragment5.html"]')
            .addEventListener('load', (e) => {
      var fragment = e.detail.fragment;
      assert_true(fragment.querySelector('[src="nested1/fragment7.html"]') instanceof HTMLElement);
      assert_true(fragment.querySelector('[src="nested1/fragment8.html"]') instanceof HTMLElement);
      fragment.querySelector('[src="nested1/fragment7.html"]')
              .addEventListener('load', (e) => {
        exit();
      });
      fragment.querySelector('[src="nested1/fragment8.html"]')
              .addEventListener('load', (e) => {
        exit();
      });
    });
    fragment.querySelector('[src="nested/fragment6.html"]')
            .addEventListener('load', (e) => {
      var fragment = e.detail.fragment;
      assert_true(fragment.querySelector('[src="nested1/fragment9.html"]') instanceof HTMLElement);
      assert_true(fragment.querySelector('[src="nested1/fragment10.html"]') instanceof HTMLElement);
      fragment.querySelector('[src="nested1/fragment9.html"]')
              .addEventListener('load', (e) => {
        exit();
      });
      fragment.querySelector('[src="nested1/fragment10.html"]')
              .addEventListener('load', (e) => {
        exit();
      });
    });

  }));

  var counterLeafs = 0;
  var exit = this.step_func(() => {
    if (++counterLeafs >= 4) {
      // [teardown]
      fragment.remove();
      this.done();
    }
  });

  // [run]
  document.body.appendChild(fragment);
  componentHandler.upgradeElement(fragment);

}, "Import from src='fixtures/fragment4.html' relative path, nested directory, default insertion");

/**
 * Do an import from absolute path with custom insertion
 */
onload_test(function(e) {
  // [setup]
  var fragment = document.createElement('div');
  fragment.setAttribute('src', '/test/fixtures/fragment11.html');
  fragment.classList.add(cssFragment);
  fragment.addEventListener('load', this.step_func((e) => {
    // [verify]
    var fragment1 = fragment.querySelector('#fragment11');
    assert_true(fragment1 instanceof HTMLElement);
    assert_equals(fragment1.textContent, 'Fragment 11');
    assert_equals(e.detail.fragment, fragment);

    var fragment2 = fragment.querySelector('#fragment12');
    assert_true(fragment2 instanceof HTMLElement);
    assert_equals(fragment2.textContent, 'Fragment 12');

    var fragmentContent = fragment.querySelector(selFragmentContent);
    assert_true(fragmentContent instanceof HTMLElement);
    assert_equals(fragment2.parentElement, fragmentContent);

    // [teardown]
    fragment.remove();
    this.done();
  }));

  // [run]
  document.body.appendChild(fragment);
  componentHandler.upgradeElement(fragment);
}, "Import from src='/test/fixtures/fragment11.html' absolute path, custom insertion");

/**
 * Inline scripts should know when fragment(parent) dispatch load event
 */
onload_test(function(e) {
  // [setup]
  var fragment = document.createElement('div');
  fragment.setAttribute('src', 'fixtures/fragment13.html');
  fragment.classList.add(cssFragment);
  fragment.currentTest = this;

  // [run]
  document.body.appendChild(fragment);
  componentHandler.upgradeElement(fragment);
}, "Inline scripts should know when fragment(parent) dispatch load event");

})();

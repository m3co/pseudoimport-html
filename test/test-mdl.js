'use strict';

const classAsString = 'MaterialFragment';
const cssFragment = 'mdl-fragment';
const selFragment = `.${cssFragment}`;

setup({allow_uncaught_exception:true});

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
  assert_true(fragment.loaded instanceof Promise);

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
    assert_equals(e.detail.fragment.dataset.baseURI, undefined);

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
  var fragment4 = document.createElement('div');
  fragment4.setAttribute('src', 'fixtures/fragment4.html');
  fragment4.classList.add(cssFragment);
  fragment4.addEventListener('load', this.step_func((e) => {
    // [verify]
    var fragment = e.detail.fragment;
    if (fragment !== fragment4) return;
    assert_true(fragment.querySelector('[src="nested/fragment5.html"]') instanceof HTMLElement);
    assert_true(fragment.querySelector('[src="nested/fragment6.html"]') instanceof HTMLElement);
    assert_true(fragment.querySelector('[src="nested1/fragment7.html"]') instanceof HTMLElement);
    assert_true(fragment.querySelector('[src="nested1/fragment8.html"]') instanceof HTMLElement);
    assert_true(fragment.querySelector('[src="nested1/fragment9.html"]') instanceof HTMLElement);
    assert_true(fragment.querySelector('[src="nested1/fragment10.html"]') instanceof HTMLElement);

    // [setup]
    var fragment5 = fragment.querySelector('[src="nested/fragment5.html"]');
    fragment5.addEventListener('load', (e) => {
      var fragment = e.detail.fragment;
      if (fragment !== fragment5) return;
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

    var fragment6 = fragment.querySelector('[src="nested/fragment6.html"]');
    fragment6.addEventListener('load', (e) => {
      var fragment = e.detail.fragment;
      if (fragment !== fragment6) return;
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
      fragment4.remove();
      this.done();
    }
  });

  // [run]
  document.body.appendChild(fragment4);
  componentHandler.upgradeElement(fragment4);

}, "Import from src='fixtures/fragment4.html' relative path, nested directory, default insertion");

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

/**
 * Async scripts should know when fragment(parent) dispatch load event
 */
onload_test(function(e) {
  // [setup]
  var fragment = document.createElement('div');
  fragment.setAttribute('src', 'fixtures/fragment14.html');
  fragment.classList.add(cssFragment);
  fragment.currentTest = this;

  // [run]
  document.body.appendChild(fragment);
  componentHandler.upgradeElement(fragment);
}, "Async scripts should know when fragment(parent) dispatch load event");

/**
 * Async scripts should load from a relative url
 */
onload_test(function(e) {
  // [setup]
  var fragment = document.createElement('div');
  fragment.setAttribute('src', 'fixtures/fragment15.html');
  fragment.classList.add(cssFragment);
  fragment.currentTest = this;

  // [run]
  document.body.appendChild(fragment);
  componentHandler.upgradeElement(fragment);
}, "Async scripts should load from a relative url");

/**
 * Load event is a promise too
 */
onload_test(function(e) {
  // [setup]
  var fragment = document.createElement('div');
  fragment.setAttribute('src', '/test/fixtures/fragment1.html');
  fragment.classList.add(cssFragment);

  // [run]
  document.body.appendChild(fragment);
  componentHandler.upgradeElement(fragment);

  fragment.MaterialFragment.loaded.then(this.step_func((fragment_) => {
    // [verify]
    var fragment1 = fragment.querySelector('#fragment1');
    assert_true(fragment1 instanceof HTMLElement);
    assert_equals(fragment1.textContent, 'Fragment 1');
    assert_equals(fragment_, fragment);
  }));

  this.step_timeout(() => {
    fragment.MaterialFragment.loaded.then(this.step_func((fragment_) => {
      // [teardown]
      fragment.remove();
      this.done();
    }));
  }, 100);
}, "Load event is a promise too");

/**
 * Load event is a promise too in nested fragments
 */
onload_test(function(e) {
  // [setup]
  var fragment = document.createElement('div');
  fragment.setAttribute('src', 'fixtures/fragment17.html');
  fragment.classList.add(cssFragment);
  fragment._index = 0;
  var _index = 0;

  // [run]
  document.body.appendChild(fragment);
  componentHandler.upgradeElement(fragment);

  fragment.MaterialFragment.loaded.then(this.step_func((fragment_) => {
    _index++;

    fragment_.querySelector('.mdl-fragment').MaterialFragment.loaded.then(this.step_func((fragment_) => {
      _index++;
      assert_equals(fragment._index, 3);

      fragment_.querySelector('.mdl-fragment').MaterialFragment.loaded.then(this.step_func((fragment_) => {
        _index++;
        assert_equals(fragment._index, 3);
        assert_equals(_index, 3);

        // [teardown]
        fragment.remove();
        this.done();
      }));
    }));
    assert_equals(fragment_, fragment);
  }));
}, "Load event is a promise too in nested fragments");

/**
 * Check circular links...
 */
promise_test(function(e) { return new Promise((resolve, reject) => {

  // [setup]
  var fragment = document.createElement('div');
  fragment.setAttribute('src', 'fixtures/fragment20.html');
  fragment.classList.add(cssFragment);

  var handler = this.step_func((e) => {
    // [verify]
    assert_equals(e.message, `Circular dependency detected at ${window.location.origin}/test/fixtures/fragment20.html`);

    // [teardown]
    fragment.remove();
    window.removeEventListener('error', handler);
    resolve();
  });
  window.addEventListener('error', handler);

  // [run]
  document.body.appendChild(fragment);
  componentHandler.upgradeElement(fragment);

}); }, "Circular links are not allowed if fetch same link");

/**
 * Check circular links...
 */
promise_test(function(e) { return new Promise((resolve, reject) => {

  // [setup]
  var fragment = document.createElement('div');
  fragment.setAttribute('src', 'fixtures/fragment21.html');
  fragment.classList.add(cssFragment);

  var handler = this.step_func((e) => {
    // [verify]
    assert_equals(e.message, `Circular dependency detected at ${window.location.origin}/test/fixtures/fragment21.html`);

    // [teardown]
    fragment.remove();
    window.removeEventListener('error', handler);
    resolve();
  });
  window.addEventListener('error', handler);

  // [run]
  document.body.appendChild(fragment);
  componentHandler.upgradeElement(fragment);

}); }, "Circular links are not allowed if fetch a resource that contains a circular link");

})();

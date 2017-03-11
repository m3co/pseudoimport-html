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

  assert_true(fragment instanceof HTMLXFragmentElement);
  assert_true(fragment.loaded instanceof Promise);

  fragment.remove();
  this.done();
}, "Check the API");

/**
 * Do a simple import from absolute path
 */
onload_test(function(e) {
  // [setup]
  var fragment = document.createElement(nameElement);
  fragment.setAttribute('src', '/test/fixtures/fragment1.html');
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
}, "Import from src='/test/fixtures/ce-fragment1.html' absolute path, default insertion");

/**
 * Do a simple import from relative path
 */
onload_test(function(e) {
  // [setup]
  var fragment = document.createElement(nameElement);
  fragment.setAttribute('src', 'fixtures/fragment1.html');
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
}, "Import from src='/test/fixtures/ce-fragment1.html' relative path, default insertion");

/**
 * Do a nested import from absolute path
 */
onload_test(function(e) {
  // [setup]
  var fragment = document.createElement(nameElement);
  fragment.setAttribute('src', '/test/fixtures/ce-fragment2.html');
  fragment.addEventListener('load', this.step_func((e) => {
    // [verify]
    var fragment1 = fragment.querySelector(nameElement);
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
}, "Import from src='/test/fixtures/ce-fragment2.html' absolute path, nested, default insertion");

/**
 * Do a nested import from relative path
 */
onload_test(function(e) {
  // [setup]
  var fragment = document.createElement(nameElement);
  fragment.setAttribute('src', 'fixtures/ce-fragment3.html');
  fragment.addEventListener('load', this.step_func((e) => {
    // [verify]
    var fragment1 = fragment.querySelector(nameElement);
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
}, "Import from src='fixtures/ce-fragment3.html' relative path, nested, default insertion");

/**
 * Do nested import following FIFO event calling
 */
onload_test(function(e) {
  // [setup]
  var fragment4 = document.createElement(nameElement);
  fragment4.setAttribute('src', 'fixtures/ce-fragment4.html');
  fragment4.addEventListener('load', this.step_func((e) => {
    // [verify]
    var fragment = e.detail.fragment;
    if (fragment !== fragment4) return;
    assert_true(fragment.querySelector('[src="nested/ce-fragment5.html"]') instanceof HTMLElement);
    assert_true(fragment.querySelector('[src="nested/ce-fragment6.html"]') instanceof HTMLElement);
    assert_true(fragment.querySelector('[src="nested1/fragment7.html"]') instanceof HTMLElement);
    assert_true(fragment.querySelector('[src="nested1/fragment8.html"]') instanceof HTMLElement);
    assert_true(fragment.querySelector('[src="nested1/fragment9.html"]') instanceof HTMLElement);
    assert_true(fragment.querySelector('[src="nested1/fragment10.html"]') instanceof HTMLElement);

    // [setup]
    var fragment5 = fragment.querySelector('[src="nested/ce-fragment5.html"]');
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
    var fragment6 = fragment.querySelector('[src="nested/ce-fragment6.html"]');
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

}, "Import from src='fixtures/cw-fragment4.html' relative path, nested directory, default insertion");

/**
 * Inline scripts should know when fragment(parent) dispatch load event
 */
onload_test(function(e) {
  // [setup]
  var fragment = document.createElement(nameElement);
  fragment.setAttribute('src', 'fixtures/fragment13.html');
  fragment.currentTest = this;

  // [run]
  document.body.appendChild(fragment);
}, "Inline scripts should know when fragment(parent) dispatch load event");

/**
 * Async scripts should know when fragment(parent) dispatch load event
 */
onload_test(function(e) {
  // [setup]
  var fragment = document.createElement(nameElement);
  fragment.setAttribute('src', 'fixtures/fragment14.html');
  fragment.currentTest = this;

  // [run]
  document.body.appendChild(fragment);
}, "Async scripts should know when fragment(parent) dispatch load event");

/**
 * Async scripts should load from a relative url
 */
onload_test(function(e) {
  // [setup]
  var fragment = document.createElement(nameElement);
  fragment.setAttribute('src', 'fixtures/ce-fragment15.html');
  fragment.currentTest = this;

  // [run]
  document.body.appendChild(fragment);
}, "Async scripts should load from a relative url");

/**
 * Load event is a promise too
 */
onload_test(function(e) {
  // [setup]
  var fragment = document.createElement(nameElement);
  fragment.setAttribute('src', '/test/fixtures/ce-fragment1.html');

  // [run]
  document.body.appendChild(fragment);

  fragment.loaded.then(this.step_func((fragment_) => {
    // [verify]
    var fragment1 = fragment.querySelector('#fragment1');
    assert_true(fragment1 instanceof HTMLElement);
    assert_equals(fragment1.textContent, 'Fragment 1');
    assert_equals(fragment_, fragment);
  }));

  this.step_timeout(() => {
    fragment.loaded.then(this.step_func((fragment_) => {
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
  var fragment = document.createElement(nameElement);
  fragment.setAttribute('src', 'fixtures/ce-fragment17.html');
  fragment._index = 0;
  var _index = 0;

  // [run]
  document.body.appendChild(fragment);

  fragment.loaded.then(this.step_func((fragment_) => {
    _index++;

    fragment_.querySelector('x-fragment').loaded.then(this.step_func((fragment_) => {
      _index++;
      assert_equals(fragment._index, 3);

      fragment_.querySelector('x-fragment').loaded.then(this.step_func((fragment_) => {
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
promise_test(function(e) { return new Promise(this.step_func((resolve, reject) => {

  // [setup]
  var fragment = document.createElement(nameElement);
  fragment.setAttribute('src', 'fixtures/ce-fragment20.html');

  var handler = this.step_func((e) => {
    // [verify]
    assert_equals(e.message, `Circular dependency detected at ${window.location.origin}/test/fixtures/ce-fragment20.html`);

    // [teardown]
    fragment.remove();
    window.removeEventListener('error', handler);
    resolve();
  });
  window.addEventListener('error', handler);

  // [run]
  document.body.appendChild(fragment);

})); }, "Circular links are not allowed if fetch same link");

/**
 * Check circular links...
 */
promise_test(function(e) { return new Promise(this.step_func((resolve, reject) => {

  // [setup]
  var fragment = document.createElement(nameElement);
  fragment.setAttribute('src', 'fixtures/ce-fragment21.html');
  fragment.classList.add(cssFragment);

  var handler = this.step_func((e) => {
    // [verify]
    assert_equals(e.message, `Circular dependency detected at ${window.location.origin}/test/fixtures/ce-fragment21.html`);

    // [teardown]
    fragment.remove();
    window.removeEventListener('error', handler);
    resolve();
  });
  window.addEventListener('error', handler);

  // [run]
  document.body.appendChild(fragment);

})); }, "Circular links are not allowed if fetch a resource that contains a circular link");

/**
 * Check fetch's options after loading
 */
promise_test(function() { return new Promise(this.step_func((resolve, reject) => {

  let fragment = document.querySelector('[src="/test/fixtures/ce-fragment23.html"]');
  fragment.loaded.then(this.step_func((fragment) => {
    assert_equals(fragment.getAttribute('headers-cache-control'), 'must-revalidate');
    assert_equals(fragment.getAttribute('headers-custom-header'), 'custom-value');
    assert_equals(fragment.getAttribute('method'), 'GET');
    assert_equals(fragment.getAttribute('mode'), 'cors');
    resolve();
  }));
})); }, "Check fetch's options after loading");

/**
 * Throw error if src attribute is not present...
 */
promise_test(function() { return new Promise(this.step_func((resolve, reject) => {

  // [setup]
  let handler = this.step_func((e) => {
    // [verify]
    assert_equals(e.message, "Uncaught Error: Src attribute is not present");

    // [teardown]
    window.removeEventListener('error', handler);
    fragmentWithoutSrc.remove();
    resolve();
  });
  window.addEventListener('error', handler);
  var fragmentWithoutSrc = document.createElement(nameElement);

  // [run]
  document.body.appendChild(fragmentWithoutSrc);

  // [teardown]
  reject('Can\'t test presence of src attribute');
  window.removeEventListener('error', handler);
  fragmentWithoutSrc.remove();
})); }, "Throw error if src attribute is not present");

/**
 * Check currentFragment object - case fixture1
 */
promise_test(function() { return new Promise(this.step_func((resolve, reject) => {
  // [setup]
  var fragment = document.createElement('x-fragment');
  fragment.setAttribute('src', 'fixtures/ce-fragment-currentFragment.html');
  window.currentFragmentFixture1 = fragment;

  // [run]
  document.body.appendChild(fragment);
  fragment.loaded.then(this.step_func(fragment => {

    // [verify]
    assert_equals(document.currentFragment, null);

    // [teardown]
    resolve();
    fragment.remove();
    delete window.currentFragmentFixture1;
  }));
})); }, "Check currentFragment object - case fixture1");

/**
 * Throw error if fetching fragment script return 404
 */
promise_test(function() { return new Promise(this.step_func((resolve, reject) => {

  // [setup]
  let handler = this.step_func((e) => {
    // [verify]
    assert_equals(e.reason.message, "Not Found");

    // [teardown]
    window.removeEventListener('unhandledrejection', handler);
    fragment.remove();
    resolve();
  });
  window.addEventListener("unhandledrejection", handler);
  var fragment = document.createElement(nameElement);
  fragment.setAttribute('src', '/test/fixtures/ce-fragment24.html');

  // [run]
  document.body.appendChild(fragment);

  // // [teardown]
  // reject('Can\'t test fetching fragment script return 404');
  // window.removeEventListener('unhandledrejection', handler);
  // fragment.remove();
})); }, "Throw error if fetching fragment script return 404");

//@@include('../_includes/test-ce-delayed.js')
//@@include('../_includes/test-ce-currentFragment.js')
//@@include('../_includes/test-ce-currentFragment-script-src.js')
//@@include('../_includes/test-ce-currentFragment-nested.js')

})();

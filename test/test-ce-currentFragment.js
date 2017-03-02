'use strict';

const cssFragment = 'x-fragment-element';
const selFragment = `.${cssFragment}`;
const nameElement = 'x-fragment';

setup({allow_uncaught_exception:true});

(() => {
  /**
   * Title here
   */
  promise_test(function() { return new Promise(this.step_func((resolve, reject) => {
    // [setup]
    var fragment = document.createElement('x-fragment');
    fragment.setAttribute('src', 'currentFragment/test-1.html');
    var fragment2 = document.createElement('x-fragment');
    fragment2.setAttribute('src', 'currentFragment/test-1.html');
    // window.currentFragmentFixture1 = fragment;

    // [run]
    document.body.appendChild(fragment);
    document.body.appendChild(fragment2);
    fragment.loaded.then(this.step_func(fragment => {

      // [verify]
      // assert_equals(document.currentFragment, null);

      // [teardown]
      resolve();
      fragment.remove();
      // delete window.currentFragmentFixture1;
    }));

    fragment2.loaded.then(this.step_func(fragment => {

      // [verify]
      // assert_equals(document.currentFragment, null);

      // [teardown]
      resolve();
      fragment.remove();
      // delete window.currentFragmentFixture1;
    }));

  })); }, "Title here");
})();

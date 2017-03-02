'use strict';

(() => {
  /**
   * Two fragments added via body.appendChild see their document.currentFragment
   */
  promise_test(function() { return new Promise(this.step_func((resolve, reject) => {
    // [setup]
    var fragment1 = document.createElement('x-fragment');
    var fragment2 = document.createElement('x-fragment');
    fragment1.id = 'test-1';
    fragment2.id = 'test-2';

    fragment1.setAttribute('src', 'ce-currentFragment/test-1.html');
    fragment2.setAttribute('src', 'ce-currentFragment/test-2.html');

    // [run]
    document.body.appendChild(fragment1);
    document.body.appendChild(fragment2);

    Promise.all([
      fragment1.loaded,
      fragment2.loaded
    ]).then(() => {
      resolve();
    });

  })); }, 'If two fragments were added via body.appendChild then they see their document.currentFragment');

  promise_test(function() { return new Promise(this.step_func((resolve, reject) => {
    // [setup]
    var fragment1 = document.createElement('x-fragment');
    var fragment2 = document.createElement('x-fragment');
    fragment1.id = 'test-7';
    fragment2.id = 'test-8';

    fragment1.setAttribute('src', 'ce-currentFragment/test-6.html');
    fragment2.setAttribute('src', 'ce-currentFragment/test-6.html');

    // [run]
    document.body.appendChild(fragment1);
    document.body.appendChild(fragment2);

    Promise.all([
      fragment1.loaded,
      fragment2.loaded
    ]).then(() => {
      resolve();
    });

  })); }, 'If two fragments have a common url they see their document.currentFragment');
})();

'use strict';

(() => {
  /**
   * Two fragments added via body.appendChild see their document.currentFragment
   */
  promise_test(function() { return new Promise(this.step_func((resolve, reject) => {
    // [setup]
    var fragment1 = document.createElement('x-fragment');
    var fragment2 = document.createElement('x-fragment');

    fragment1.setAttribute('src', 'ce-currentFragment/test-1.html');
    fragment2.setAttribute('src', 'ce-currentFragment/test-2.html');

    window.fixtures = {
      fragment1: fragment1,
      fragment2: fragment2
    };

    // [run]
    document.body.appendChild(fragment1);
    document.body.appendChild(fragment2);

    Promise.all([
      fragment1.loaded,
      fragment2.loaded
    ]).then(() => {
      resolve();
    });

  })); }, "Two fragments added via body.appendChild see their document.currentFragment");
})();

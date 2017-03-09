'use strict';

(() => {
  /**
   * Two fragments added via body.appendChild see their document.currentFragment
   */
  promise_test(function() { return new Promise(this.step_func((resolve, reject) => {
    // [setup]
    var fragment1 = document.createElement('x-fragment');
    var fragment2 = document.createElement('x-fragment');
    var fragment3 = document.createElement('x-fragment');
    fragment1.id = 'test-1-external';
    fragment2.id = 'test-2-external';
    fragment3.id = 'test-3-external';

    fragment1.setAttribute('src', 'ce-currentFragment-external/test-1.html');
    fragment2.setAttribute('src', 'ce-currentFragment-external/test-2.html');
    fragment3.setAttribute('src', 'ce-currentFragment-external/test-3.html');

    // [run]
    document.body.appendChild(fragment1);
    document.body.appendChild(fragment2);
    document.body.appendChild(fragment3);

    Promise.all([
      fragment1.loaded,
      fragment2.loaded,
      fragment3.loaded
    ]).then(this.step_func(() => {
      resolve();
      // [verify]
      assert_equals(document.currentFragment, null);

      // [teardown]
      fragment1.remove();
      fragment2.remove();
      fragment3.remove();
    }));

  })); }, 'If two fragments were added via body.appendChild then they see their document.currentFragment');

  promise_test(function() { return new Promise(this.step_func((resolve, reject) => {
    // [setup]
    var fragment1 = document.createElement('x-fragment');
    var fragment2 = document.createElement('x-fragment');
    var fragment3 = document.createElement('x-fragment');
    fragment1.id = 'test-10-external';
    fragment2.id = 'test-11-external';
    fragment3.id = 'test-12-external';

    fragment1.setAttribute('src', 'ce-currentFragment-external/test-8.html');
    fragment2.setAttribute('src', 'ce-currentFragment-external/test-8.html');
    fragment3.setAttribute('src', 'ce-currentFragment-external/test-8.html');

    // [run]
    document.body.appendChild(fragment1);
    document.body.appendChild(fragment2);
    document.body.appendChild(fragment3);

    Promise.all([
      fragment1.loaded,
      fragment2.loaded,
      fragment3.loaded
    ]).then(this.step_func(() => {
      resolve();
      // [verify]
      assert_equals(document.currentFragment, null);

      // [teardown]
      fragment1.remove();
      fragment2.remove();
      fragment3.remove();
    }));

  })); }, 'If two fragments have a common url they see their document.currentFragment');
})();

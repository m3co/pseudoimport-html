'use strict';

(() => {
  /**
   * One fragment added via body.appendChild see their document.currentFragment
   */
  promise_test(function() { return new Promise(this.step_func((resolve, reject) => {
    // [setup]
    var fragment = document.createElement('x-fragment');
    fragment.id = 'test-1';
    fragment.setAttribute('src', 'ce-currentFragment-nested/test-1.html');

    // [run]
    document.body.appendChild(fragment);

    fragment.loaded.then(this.step_func(() => {
      resolve();
      // [verify]
      assert_equals(document.currentFragment, null);

      // [teardown]
      fragment.remove();
    }));

  })); }, 'If one fragment was added via body.appendChild then it see their document.currentFragment (nested)');

  /**
   * One fragment added via body.appendChild see their document.currentFragment
   */
  promise_test(function() { return new Promise(this.step_func((resolve, reject) => {
    // [setup]
    var fragment = document.createElement('x-fragment');
    fragment.id = 'test-2';
    fragment.setAttribute('src', 'ce-currentFragment-nested/test-2.html');

    // [run]
    document.body.appendChild(fragment);

    fragment.loaded.then(this.step_func(() => {
      resolve();
      // [verify]
      assert_equals(document.currentFragment, null);

      // [teardown]
      fragment.remove();
    }));

  })); }, 'If one fragment was added via body.appendChild then it see their document.currentFragment (dynamic nesting)');

  /**
   * Two fragments added via body.appendChild see their document.currentFragment
   */
  promise_test(function() { return new Promise(this.step_func((resolve, reject) => {
    // [setup]
    var fragment1 = document.createElement('x-fragment');
    var fragment2 = document.createElement('x-fragment');
    var fragment3 = document.createElement('x-fragment');
    fragment1.id = 'test-3';
    fragment2.id = 'test-4';
    fragment3.id = 'test-5';

    fragment1.setAttribute('src', 'ce-currentFragment-nested/test-3.html');
    fragment2.setAttribute('src', 'ce-currentFragment-nested/test-4.html');
    fragment3.setAttribute('src', 'ce-currentFragment-nested/test-5.html');

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

  })); }, 'If two different fragments were added via body.appendChild then they see their document.currentFragment');

  /**
   * Two fragments added via body.appendChild see their document.currentFragment
   */
  promise_test(function() { return new Promise(this.step_func((resolve, reject) => {
    // [setup]
    var fragment1 = document.createElement('x-fragment');
    var fragment2 = document.createElement('x-fragment');
    var fragment3 = document.createElement('x-fragment');
    fragment1.id = 'test-6';
    fragment2.id = 'test-7';
    fragment3.id = 'test-8';

    fragment1.setAttribute('src', 'ce-currentFragment-nested/test-6.html');
    fragment2.setAttribute('src', 'ce-currentFragment-nested/test-7.html');
    fragment3.setAttribute('src', 'ce-currentFragment-nested/test-8.html');

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

  })); }, 'If two equal fragments were added via body.appendChild then they see their document.currentFragment (dynamic nesting)');
})();

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

    fragment.loaded.then(() => {
      resolve();
      fragment.remove();
    });

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

    fragment.loaded.then(() => {
      resolve();
      fragment.remove();
    });

  })); }, 'If one fragment was added via body.appendChild then it see their document.currentFragment (dynamic nesting)');

  /**
   * Two fragments added via body.appendChild see their document.currentFragment
   */
  promise_test(function() { return new Promise(this.step_func((resolve, reject) => {
    // [setup]
    var fragment1 = document.createElement('x-fragment');
    var fragment2 = document.createElement('x-fragment');
    fragment1.id = 'test-3';
    fragment2.id = 'test-4';

    fragment1.setAttribute('src', 'ce-currentFragment-nested/test-3.html');
    fragment2.setAttribute('src', 'ce-currentFragment-nested/test-4.html');

    // [run]
    document.body.appendChild(fragment1);
    document.body.appendChild(fragment2);

    Promise.all([
      fragment1.loaded,
      fragment2.loaded
    ]).then(() => {
      resolve();
      fragment1.remove();
      fragment2.remove();
    });

  })); }, 'If two different fragments were added via body.appendChild then they see their document.currentFragment');

  /**
   * Two fragments added via body.appendChild see their document.currentFragment
   */
  promise_test(function() { return new Promise(this.step_func((resolve, reject) => {
    // [setup]
    var fragment1 = document.createElement('x-fragment');
    var fragment2 = document.createElement('x-fragment');
    fragment1.id = 'test-5';
    fragment2.id = 'test-6';

    fragment1.setAttribute('src', 'ce-currentFragment-nested/test-5.html');
    fragment2.setAttribute('src', 'ce-currentFragment-nested/test-6.html');

    // [run]
    document.body.appendChild(fragment1);
    document.body.appendChild(fragment2);

    Promise.all([
      fragment1.loaded,
      fragment2.loaded
    ]).then(() => {
      resolve();
      fragment1.remove();
      fragment2.remove();
    });

  })); }, 'If two equal fragments were added via body.appendChild then they see their document.currentFragment (dynamic nesting)');
})();

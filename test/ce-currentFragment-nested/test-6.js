'use script';
promise_test(function() { return new Promise(this.step_func((resolve, reject) => {
  // [setup]
  var fragment1 = document.createElement('x-fragment');
  var fragment2 = document.createElement('x-fragment');
  fragment1.id = 'test-6-1';
  fragment2.id = 'test-6-2';

  fragment1.setAttribute('src', 'ce-currentFragment-nested/test-6-1.html');
  fragment2.setAttribute('src', 'ce-currentFragment-nested/test-6-2.html');

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

})); }, 'If two fragments were added via body.appendChild then they see their document.currentFragment');
test(() => {
  assert_equals(document.currentFragment, document.querySelector('#test-6'));
}, 'Fixture 6 see document.currentFragment - fragment6');

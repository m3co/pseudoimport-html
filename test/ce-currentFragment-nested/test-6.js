'use script';
promise_test(function() { return new Promise(this.step_func((resolve, reject) => {
  // [setup]
  var fragment1 = document.createElement('x-fragment');
  var fragment2 = document.createElement('x-fragment');
  var fragment3 = document.createElement('x-fragment');
  fragment1.id = 'test-6-1-nested';
  fragment2.id = 'test-6-2-nested';
  fragment3.id = 'test-6-3-nested';

  fragment1.setAttribute('src', 'ce-currentFragment-nested/test-6-1.html');
  fragment2.setAttribute('src', 'ce-currentFragment-nested/test-6-2.html');
  fragment3.setAttribute('src', 'ce-currentFragment-nested/test-6-3.html');

  // [run]
  document.body.appendChild(fragment1);
  document.body.appendChild(fragment2);
  document.body.appendChild(fragment3);

  Promise.all([
    fragment1.loaded,
    fragment2.loaded,
    fragment3.loaded
  ]).then(() => {
    resolve();
    fragment1.remove();
    fragment2.remove();
    fragment3.remove();
  });

})); }, 'If two fragments were added via body.appendChild then they see their document.currentFragment');
test(() => {
  assert_equals(document.currentFragment, document.querySelector('#test-6-nested'));
}, 'Fixture 6 see document.currentFragment - fragment6');

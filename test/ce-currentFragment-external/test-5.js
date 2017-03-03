'use script';
test(() => {
  assert_true(
    (document.currentFragment === document.querySelector('#test-5')) ||
    (document.currentFragment === document.querySelector('#test-6'))
  );
}, 'Repeated url fragment points to its currentFragment');

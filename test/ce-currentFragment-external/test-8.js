'use script';
test(() => {
  assert_true(
    (document.currentFragment === document.querySelector('#test-10-external')) ||
    (document.currentFragment === document.querySelector('#test-11-external')) ||
    (document.currentFragment === document.querySelector('#test-12-external'))
  );
}, 'Repeated url fragment points to its currentFragment');

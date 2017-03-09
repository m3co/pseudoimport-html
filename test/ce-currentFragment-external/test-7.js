'use script';
test(() => {
  assert_true(
    (document.currentFragment === document.querySelector('#test-7-external')) ||
    (document.currentFragment === document.querySelector('#test-8-external')) ||
    (document.currentFragment === document.querySelector('#test-9-external'))
  );
}, 'Repeated url fragment points to its currentFragment');

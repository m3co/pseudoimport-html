'use script';
test(() => {
  assert_true(
    (document.currentFragment === document.querySelector('#test-7')) ||
    (document.currentFragment === document.querySelector('#test-8')) ||
    (document.currentFragment === document.querySelector('#test-9'))
  );
}, 'Repeated url fragment points to its currentFragment');
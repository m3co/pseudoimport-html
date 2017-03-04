'use script';
test(() => {
  assert_true(
    (document.currentFragment === document.querySelector('#test-10')) ||
    (document.currentFragment === document.querySelector('#test-11')) ||
    (document.currentFragment === document.querySelector('#test-12'))
  );
}, 'Repeated url fragment points to its currentFragment');

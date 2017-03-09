'use strict';
window.test1.step(() => {
  test(() => {
    assert_equals(document.currentFragment, document.querySelector('#test-1-script-src'));
  }, "Fixture 1 - currentFragment is test-1");
  window.test1.check_exit();
});

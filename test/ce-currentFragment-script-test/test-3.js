'use strict';
window.test3.step(() => {
  test(() => {
    assert_equals(document.currentFragment, document.querySelector('#test-3-script-src'));
  }, "Fixture 3 - currentFragment is test-3");
  window.test3.check_exit();
});

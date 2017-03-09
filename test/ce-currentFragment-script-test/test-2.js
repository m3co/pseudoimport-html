'use strict';
window.test2.step(() => {
  test(() => {
    assert_equals(document.currentFragment, document.querySelector('#test-2-script-src'));
  }, "Fixture 2 - currentFragment is test-2");
  window.test2.check_exit();
});

'use strict';
test(() => {
  assert_equals(document.currentFragment, document.querySelector('#test-4-nested'));
}, 'Fixture 4 see document.currentFragment - fragment4');

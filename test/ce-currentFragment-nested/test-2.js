'use strict';
test(() => {
  assert_equals(document.currentFragment, document.querySelector('#test-2-nested'));
}, 'Fixture 2 see document.currentFragment - fragment2');

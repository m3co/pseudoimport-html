'use strict';
test(() => {
  assert_equals(document.currentFragment, document.querySelector('#test-2-1-nested'));
}, 'Fixture 2-1 see document.currentFragment - fragment2-1');

'use strict';
test(() => {
  assert_equals(document.currentFragment, document.querySelector('#test-1-1-nested'));
}, 'Fixture 1-1 see document.currentFragment - fragment1-1');

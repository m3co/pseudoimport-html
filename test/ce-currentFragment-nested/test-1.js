'use strict';
test(() => {
  assert_equals(document.currentFragment, document.querySelector('#test-1-nested'));
}, 'Fixture 1 see document.currentFragment - fragment1');

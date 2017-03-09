'use strict';
test(() => {
  assert_equals(document.currentFragment, document.querySelector('#test-3-nested'));
}, 'Fixture 3 see document.currentFragment - fragment3');

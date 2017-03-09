'use strict';
test(() => {
  assert_equals(document.currentFragment, document.querySelector('#test-5-nested'));
}, 'Fixture 5 see document.currentFragment - fragment5');

'use strict';
test(() => {
  assert_equals(document.currentFragment, document.querySelector('#test-5-external'));
}, 'Fixture 5 see document.currentFragment - fragment5');

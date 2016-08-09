;(_ => {
  'use strict';
  var tagImport = 'pseudoimport-html';

  var async1 = async_test('Check if content was fetched correctly');

  window.addEventListener('load', async1.step_func(e => {
    var el = document.querySelector(tagImport);
    assert_true(el.innerHTML.includes('398v2whwu024jnkjw209j2ijlkwmdlkwm029434j'));
    async1.done();
  }));
})();

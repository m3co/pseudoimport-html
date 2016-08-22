;(_ => {
  'use strict';
  var tagImport = 'pseudoimport-html';
  var el = document.querySelector(tagImport);

  var async1 = async_test('Check if content was fetched correctly');
  var async2 = async_test('Check if content executes an script');

  el.addEventListener('load', async1.step_func(e => {
    assert_true(el.innerHTML.includes('398v2whwu024jnkjw209j2ijlkwmdlkwm029434j'));
    async1.done();
  }));

  window.async2 = async2;
})();

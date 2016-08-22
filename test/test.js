;(_ => {
  'use strict';
  var tagImport = 'pseudoimport-html';
  var el = document.querySelector(tagImport);

  var async1 = async_test('Check if content was fetched correctly');
  var async2 = async_test('Check if content executes an script');
  var async3 = async_test('Check if nested content was fetched correctly');
  var async4 = async_test('Check if nested-nested content was fetched correctly');

  el.addEventListener('load', async1.step_func(e => {

    var el = e.detail.element.querySelector(tagImport);
    el.addEventListener('load', async3.step_func(e => {

      var el = e.detail.element.querySelector(tagImport);
      el.addEventListener('load', async4.step_func(e => {

        assert_true(e.detail.element.innerHTML.includes('jewnrgi83y4iu34ngo9834l2k3nlw98y34988y34iu34hij34h478'));
        async4.done();
      }));

      assert_true(e.detail.element.innerHTML.includes('kjnsfvik34h8374hkjwdnv2ui38238oy19hqfwonegowui44h824'));
      async3.done();
    }));

    assert_true(e.detail.element.innerHTML.includes('398v2whwu024jnkjw209j2ijlkwmdlkwm029434j'));
    async1.done();
  }));

  window.async2 = async2;
})();

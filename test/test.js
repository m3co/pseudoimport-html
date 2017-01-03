;(_ => {
  'use strict';
  var tagImport = 'pseudoimport-html';
  var el = document.querySelector(`${tagImport}[first]`);
  var el2 = document.querySelector(`${tagImport}[second]`);
  var el3 = document.querySelector(`${tagImport}[third]`);

  var async1 = async_test('Check if content was fetched correctly');
  var async2 = async_test('Check if content executes an script');
  var async3 = async_test('Check if nested content was fetched correctly');
  var async4 = async_test('Check if nested-nested content was fetched correctly');
  var async11 = async_test('Check if second content was fetched correctly');
  var async5 = async_test('Check if run return a promise after fetching all tags');
  var async6 = async_test('Check the flexibility of pseudoimport-html-src');

  window.addEventListener('load', async5.step_func(e => {
    var run = window.PseudoimportHTML.run();
    assert_true(run.then instanceof Function);

    run.then(async5.step_func(elements => {
      assert_equals(elements.length, document.querySelectorAll(tagImport).length);
      async5.done();
    }));
  }));

  el2.addEventListener('load', async11.step_func(e => {

    assert_true(e.detail.element.innerHTML.includes('iwhrgiuwhr3743n4398y2u3i2398h2on33oig434'));
    async11.done();
  }));

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

  el3.addEventListener('load', async6.step_func(e => {

    assert_equals(el3.childNodes.length, 7);
    assert_true(el3.childNodes[1] instanceof HTMLDivElement);
    assert_equals(el3.childNodes[1].id, 'div1');

    assert_equals(el3.childNodes[3].localName, 'pseudoimport-html-src');
    assert_true(el3.childNodes[3].innerHTML.includes('234it3i4uh24kln23o8t23tjkn221323'));

    assert_true(el3.childNodes[5] instanceof HTMLDivElement);
    assert_equals(el3.childNodes[5].id, 'div2');

    async6.done();
  }));

  window.async2 = async2;
})();

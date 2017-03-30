
promise_test(function() { return new Promise(this.step_func((resolve, reject) => {
  // [setup]
  var fragment = document.createElement('x-fragment');
  fragment.id = 'fetch-relative-test-1';
  fragment.setAttribute('src', 'ce-fetch-relative/test-1.html');

  window.fetchRelativeTest1 = {
    test: this,
    resolve: resolve,
    reject: reject,
    fragment: fragment
  };
  // [run]
  document.body.appendChild(fragment);

})); }, 'Test relative path at fetch request');



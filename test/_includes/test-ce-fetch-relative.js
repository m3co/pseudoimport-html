
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

promise_test(function() { return new Promise(this.step_func((resolve, reject) => {
  // [setup]
  var fragment = document.createElement('x-fragment');
  fragment.id = 'fetch-relative-test-2';
  fragment.setAttribute('src', 'ce-fetch-relative/test-2.html');

  window.fetchRelativeTest2 = {
    test: this,
    resolve: resolve,
    reject: reject,
    fragment: fragment
  };
  // [run]
  document.body.appendChild(fragment);

})); }, 'Test relative path at nested fetch request');

promise_test(function() { return new Promise(this.step_func((resolve, reject) => {
  // [setup]
  var fragment = document.createElement('x-fragment');
  fragment.id = 'fetch-relative-test-3';
  fragment.setAttribute('src', 'http://localhost:9004/test/ce-fetch-relative/test-3.html');

  window.fetchRelativeTest3 = {
    test: this,
    resolve: resolve,
    reject: reject,
    fragment: fragment
  };
  // [run]
  document.body.appendChild(fragment);

})); }, 'Test relative path at nested fetch request from absolute fragment');


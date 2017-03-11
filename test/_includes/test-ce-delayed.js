/**
 * Check delayed insertion of fragments at first level
 */
promise_test(function() { return new Promise(this.step_func((resolve, reject) => {

  // [setup]
  var fragment = document.createElement(nameElement);
  fragment.setAttribute('src', '/test/fixtures/delay-fixture1.html');
  window.delayFixture1_resolve = resolve;
  let handlerError = (e) => {
    window.removeEventListener('error', handlerError);
    reject(e.message);
  };
  window.addEventListener('error', handlerError);

  // [run]
  document.body.appendChild(fragment);
})); }, "Check delayed insertion of fragment at first level");

/**
 * Check delayed insertion of fragments at first level - repeated
 */
promise_test(function() { return new Promise(this.step_func((resolve, reject) => {

  // [setup]
  var fragment = document.createElement(nameElement);
  fragment.setAttribute('src', '/test/fixtures/delay-fixture1.html');
  window.delayFixture1_resolve = resolve;
  let handlerError = (e) => {
    window.removeEventListener('error', handlerError);
    reject(e.message);
  };
  window.addEventListener('error', handlerError);

  // [run]
  document.body.appendChild(fragment);
})); }, "Check delayed insertion of fragment at first level - repeated");

/**
 * Check delayed insertion of fragments at second level
 */
promise_test(function() { return new Promise(this.step_func((resolve, reject) => {

  // [setup]
  var fragment = document.createElement(nameElement);
  fragment.setAttribute('src', '/test/fixtures/delay-fixture2.html');
  window.delayFixture2_resolve = resolve;
  let handlerError = (e) => {
    window.removeEventListener('error', handlerError);
    reject(e.message);
  };
  window.addEventListener('error', handlerError);

  // [run]
  document.body.appendChild(fragment);
})); }, "Check delayed insertion of fragment at second level");

/**
 * Check delayed insertion of fragments at second level - repeated
 */
promise_test(function() { return new Promise(this.step_func((resolve, reject) => {

  // [setup]
  var fragment = document.createElement(nameElement);
  fragment.setAttribute('src', '/test/fixtures/delay-fixture2.html');
  window.delayFixture2_resolve = resolve;
  let handlerError = (e) => {
    window.removeEventListener('error', handlerError);
    reject(e.message);
  };
  window.addEventListener('error', handlerError);

  // [run]
  document.body.appendChild(fragment);
})); }, "Check delayed insertion of fragment at second level - repeated");

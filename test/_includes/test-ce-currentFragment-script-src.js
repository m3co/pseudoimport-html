window.test1 = async_test('Fixture 1');
window.test1.i = 0;
window.test1.check_exit = function() {
  window.test1.i++;
  if (window.test1.i === 1) {
    window.test1.done();
  }
};
window.test2 = async_test('Fixture 2');
window.test2.i = 0;
window.test2.check_exit = function() {
  window.test2.i++;
  if (window.test2.i === 1) {
    window.test2.done();
  }
};
window.test3 = async_test('Fixture 3');
window.test3.i = 0;
window.test3.check_exit = function() {
  window.test3.i++;
  if (window.test3.i === 1) {
    window.test3.done();
  }
};

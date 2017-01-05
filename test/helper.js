'use strict';
function onload_test(f, m) {
  window.addEventListener('load', async_test(m).step_func(f));
}

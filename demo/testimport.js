'use strict';
console.log('2');
document.querySelector('button').addEventListener('click', function(e) {
  console.log('4');
  console.log(document.querySelector('div#mydiv'));
});

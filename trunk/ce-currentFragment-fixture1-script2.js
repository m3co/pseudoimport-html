'use strict';
console.log('<outside loaded script2');
console.log(document.currentFragment);
console.log(document.currentScript, 'script 2');
console.log(document.currentFragment.querySelector('#script1'));
console.log('outside loaded script2>');

document.currentFragment.loaded.then((fragment) => {
  console.log('inside loaded script2');
  console.log(fragment);
  console.log(fragment.querySelector('#script1'));
  console.log('inside loaded script2>');
});

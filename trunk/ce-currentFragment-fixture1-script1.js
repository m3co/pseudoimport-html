'use strict';
console.log('<outside loaded script1');
console.log(document.currentFragment);
console.log(document.currentScript, 'script 1');
console.log(document.currentFragment.querySelector('#script2'));
console.log('outside loaded script1>');

document.currentFragment.loaded.then((fragment) => {
  console.log('inside loaded script1');
  console.log(fragment);
  console.log(fragment.querySelector('#script2'));
  console.log('inside loaded script1>');
});

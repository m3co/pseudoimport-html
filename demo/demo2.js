'use strict';
var range = new Range();
fetchFragments(document.querySelectorAll('fragment-html'));

function fetchFragments(fragments) {
  for (let i = 0; i < fragments.length; i++) {
    let fragment = fragments[i];
    let src = preparePath(fragment.getAttribute('src'));
    fetch(src).then((response) => {
      return response.text();
    }).then((text) => {
      var content = range.createContextualFragment(text);
      var fragmentsrc = fragment.querySelector('fragment-html-src');
      if (fragmentsrc) {
        fragmentsrc.appendChild(content);
      }
      fragment.appendChild(content);
      fetchFragments(fragment.querySelectorAll('fragment-html'));
    });
  }
}


function basedir(path) {
  return path.split("/").reduce((acc, curr, index, array) => {
    if (index == array.length - 1) { return acc; }
    return acc += curr + '/';
  }, "");
}

function preparePath(path) {
  return path[0] === '/' ? path : basedir(document.baseURI) + path;
}

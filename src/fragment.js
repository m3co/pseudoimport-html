(() => {
  'use strict';
  var range = new Range();
  var createHTML = range.createContextualFragment.bind(range);

  var classAsString = 'MaterialFragment';
  var cssClass = 'mdl-fragment';

  /**
   * Class MaterialFragment
   */
  class MaterialFragment {

    constructor(element) {
      this.element_ = element;
      this.init();
    }

    init() {
      fetchFragment(this.element_);
    }
  }

  function clean(str) {
    return str.replace(/\n{1,} {0,}/g, ' ').replace(/> </g, '><').trim();
  }

  function fetchFragment(fragment) {
    let src = preparePath(fragment.getAttribute('src'));
    fetch(src).then((response) => {
      return response.text();
    }).then((text) => {
      fragment.appendChild(createHTML(clean(text)));
    });
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

  window[classAsString] = MaterialFragment;

  componentHandler.register({
    constructor: MaterialFragment,
    classAsString: classAsString,
    cssClass: cssClass,
    widget: true
  });
})();

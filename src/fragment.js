(() => {
  'use strict';
  var range = new Range();
  var createHTML = range.createContextualFragment.bind(range);

  var classAsString = 'MaterialFragment';
  var cssClass = 'mdl-fragment';
  var selClass = `.${cssClass}`;

  /**
   * Class MaterialFragment
   */
  class MaterialFragment {

    constructor(element) {
      this.element_ = element;
      this.init();
    }

    init() {
      fetchFragment(this.element_).then((element) => {
        element.dispatchEvent(new CustomEvent('load'));
      });
    }
  }

  function clean(str) {
    return str.replace(/\n{1,} {0,}/g, ' ').replace(/> </g, '><').trim();
  }

  function fetchFragment(fragment) {
    var src = preparePath(fragment.getAttribute('src'));
    return fetch(src).then((response) => {
      return response.text();
    }).then((text) => {
      fragment.appendChild(createHTML(clean(text)));
      componentHandler.upgradeElements(fragment.querySelectorAll(selClass));
      return fragment;
    });
  }

  function basedir(path) {
    return path.split('/').reduce((acc, curr, index, array) => {
      if (index === array.length - 1) { return acc; }
      return acc += curr + '/';
    }, '');
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

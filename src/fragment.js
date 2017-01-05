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
      var src = preparePath(this.element_.getAttribute('src'),
                            this.element_.dataset.baseURI);
      fetchFragment(this.element_, src).then((element) => {
        delete element.dataset.baseURI;
        element.dispatchEvent(new CustomEvent('load', {
          detail: {
            fragment: element
          }
        }));
      });
    }
  }

  function clean(str) {
    return str.replace(/\n{1,} {0,}/g, ' ').replace(/> </g, '><').trim();
  }

  function fetchFragment(fragment, src) {
    return fetch(src).then((response) => {
      return response.text();
    }).then((text) => {
      fragment.appendChild(createHTML(clean(text)));
      var fragments = fragment.querySelectorAll(selClass);
      for (let i = 0; i < fragments.length; i++) {
        fragments[i].dataset.baseURI = basedir(src);
        componentHandler.upgradeElement(fragments[i]);
      }
      return fragment;
    });
  }

  function basedir(path) {
    return path.split('/').reduce((acc, curr, index, array) => {
      if (index === array.length - 1) { return acc; }
      return acc += curr + '/';
    }, '');
  }

  function preparePath(path, baseURI) {
    return path[0] === '/' ? path : (baseURI ? baseURI : basedir(document.baseURI)) + path;
  }

  window[classAsString] = MaterialFragment;

  componentHandler.register({
    constructor: MaterialFragment,
    classAsString: classAsString,
    cssClass: cssClass,
    widget: true
  });
})();

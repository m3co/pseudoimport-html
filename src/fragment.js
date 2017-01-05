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

    /**
     * Class constructor for dropdown MDL component.
     * Implements {@link https://github.com/jasonmayes/mdl-component-design-pattern|MDL component design pattern}
     *
     * @param {HTMLElement} element - The element that will be upgraded.
     */
    constructor(element) {
      this.element_ = element;
      this.init();
    }

    /**
     * Initialize element.
     *
     */
    init() {
      var src = preparePath(this.element_.getAttribute('src'),
                            this.element_.dataset.baseURI);
      fetchFragment(this.element_, src).then((element) => {
        delete element.dataset.baseURI;

        /**
         * On load the fragment.
         * All scrips loaded from a fragment are executed asynchronously.
         *
         * @event MaterialFragment#load
         * @type {CustomEvent}
         * @property {HTMLElement} fragment - The loaded fragment
         */
        element.dispatchEvent(new CustomEvent('load', {
          detail: {
            fragment: element
          }
        }));
      });
    }
  }

  /**
   * Clean unnecessary spaces.
   *
   * @param {String} str - String to clean
   * @return {String} - Cleaned string
   * @private
   */
  function clean(str) {
    return str.replace(/\n{1,} {0,}/g, ' ').replace(/> </g, '><').trim();
  }

  /**
   * Fetch HTML code from src to fragment.
   *
   * @param {HTMLElement} fragment - The fragment that will hold the fetched HTML
   * @param {String} src - The URI to fetch
   * @return {Promise} - The fetch request
   * @private
   */
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

  /**
   * Extract the base dir from path.
   *
   * @param {String} path
   * @return {String}
   * @private
   */
  function basedir(path) {
    return path.split('/').reduce((acc, curr, index, array) => {
      if (index === array.length - 1) { return acc; }
      return acc += curr + '/';
    }, '');
  }

  /**
   * Prepare path based on baseURI or document.baseURI
   *
   * @param {String} path
   * @param {String} baseURI
   * @return {String}
   * @private
   */
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

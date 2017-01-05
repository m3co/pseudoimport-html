'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  'use strict';

  var range = new Range();
  var createHTML = range.createContextualFragment.bind(range);

  var classAsString = 'MaterialFragment';
  var cssClass = 'mdl-fragment';
  var selClass = '.' + cssClass;

  /**
   * Class MaterialFragment
   */

  var MaterialFragment = function () {

    /**
     * Class constructor for dropdown MDL component.
     * Implements {@link https://github.com/jasonmayes/mdl-component-design-pattern|MDL component design pattern}
     *
     * @param {HTMLElement} element - The element that will be upgraded.
     */
    function MaterialFragment(element) {
      _classCallCheck(this, MaterialFragment);

      this.element_ = element;
      this.init();
    }

    /**
     * Initialize element.
     *
     */


    _createClass(MaterialFragment, [{
      key: 'init',
      value: function init() {
        var src = preparePath(this.element_.getAttribute('src'), this.element_.dataset.baseURI);
        fetchFragment(this.element_, src).then(function (element) {
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
    }]);

    return MaterialFragment;
  }();

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
    return fetch(src).then(function (response) {
      return response.text();
    }).then(function (text) {
      fragment.appendChild(createHTML(clean(text)));
      var fragments = fragment.querySelectorAll(selClass);
      for (var i = 0; i < fragments.length; i++) {
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
    return path.split('/').reduce(function (acc, curr, index, array) {
      if (index === array.length - 1) {
        return acc;
      }
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
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  'use strict';

  var range = document.createRange();
  var createHTML = range.createContextualFragment.bind(range);

  var classAsString = 'MaterialFragment';
  var cssClass = 'mdl-fragment';
  var selClass = '.' + cssClass;
  var selClassContent = '.' + cssClass + '__content';

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
      var _this = this;

      _classCallCheck(this, MaterialFragment);

      var parent = element.parentElement.closest(selClass);
      this.fetch_ = null;
      this.element_ = element;
      this.root_ = parent ? parent.MaterialFragment.root_ : element;
      this.isRoot_ = parent ? false : true;
      this.resolvers_ = [];

      /**
       * Load promise
       *
       */
      this.loaded = new Promise(function (resolve) {
        _this.resolve_ = resolve;
      });
      this.init();
    }

    /**
     * Initialize element.
     *
     */


    _createClass(MaterialFragment, [{
      key: 'init',
      value: function init() {
        var _this2 = this;

        var src = preparePath(this.element_.getAttribute('src'), this.element_.dataset.baseURI);
        this.fetch_ = fetch_(this.element_, src).then(function (element) {
          delete element.dataset.baseURI;
          _this2.root_.MaterialFragment.resolvers_.push(resolve.bind(null, element));
          return Promise.all(Array.prototype.slice.call(element.querySelectorAll(selClass)).map(function (fragment) {
            return fragment.MaterialFragment.fetch_;
          }));
        }).then(function () {
          if (_this2.isRoot_) {
            _this2.resolvers_.forEach(function (resolver) {
              resolver();
            });
            delete _this2.resolvers_;
            delete _this2.resolve_;
            delete _this2.fetch_;
            delete _this2.isRoot_;
          }
        });
      }
    }]);

    return MaterialFragment;
  }();

  /**
   * Resolve, in fact, dispatch load event from an element
   *
   * @param {HTMLElement} element - The element that will dispatch the
   *   load event.
   * @private
   */


  function resolve(element) {
    /**
     * On load the fragment.
     * All scrips loaded from a fragment will execute asynchronously.
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
    element.MaterialFragment.resolve_(element);
  }

  /**
   * Fetch HTML code from src to fragment.
   *
   * @param {HTMLElement} fragment - The fragment that will hold the fetched HTML
   * @param {String} src - The URI to fetch
   * @return {Promise} - The fetch request
   * @private
   */
  function fetch_(fragment, src) {
    return fetch(src).then(function (response) {
      return response.text();
    }).then(function (text) {
      var base = basedir(src);
      var html = createHTML(text);
      var scripts = Array.prototype.slice.call(html.querySelectorAll('script')).map(function (script) {
        return new Promise(function (resolve) {
          if (script.src === '') {
            resolve(script);
          } else {
            var src = script.getAttribute('src');
            script.src = src[0] === '/' ? src : base + src;
            script.addEventListener('load', function () {
              resolve(script);
            });
          }
        });
      });
      var content = fragment.querySelector(selClassContent);
      content ? content.appendChild(html) : fragment.appendChild(html); // jshint ignore:line
      return Promise.all(scripts).then(function () {
        Array.prototype.slice.call(fragment.querySelectorAll(selClass)).forEach(function (fragment) {
          fragment.dataset.baseURI = base;
          componentHandler.upgradeElement(fragment);
        });
        return fragment;
      });
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
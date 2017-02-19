'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  'use strict';

  var range = document.createRange();
  var createHTML = range.createContextualFragment.bind(range);
  var slice = Array.prototype.slice;

  var classAsString = 'MaterialFragment';
  var cssClass = 'mdl-fragment';
  var selClass = '.' + cssClass;

  var options = {};

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

      if (!this.element_.hasAttribute('src')) {
        throw new Error('Src attribute is not present');
      }

      this.root_ = parent ? parent.MaterialFragment.root_ : element;
      this.isRoot_ = parent ? false : true;
      this.resolvers_ = [];
      if (this.isRoot_) {
        this.element_.fetched_ = [];
        this.element_.isRoot_ = this.isRoot_;
      }
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
        this.fetch_ = fetch_(this.element_, src, options).then(function (element) {
          delete element.dataset.baseURI;
          _this2.root_.MaterialFragment.resolvers_.push(resolve.bind(null, element, options));
          return Promise.all(slice.call(element.querySelectorAll(selClass)).map(function (fragment) {
            return fragment.MaterialFragment.fetch_;
          }));
        }).then(function () {
          if (_this2.isRoot_) {
            _this2.resolvers_.forEach(function (resolver) {
              return resolver();
            });
            delete _this2.resolvers_;
            delete _this2.resolve_;
            delete _this2.fetch_;
            delete _this2.isRoot_;
            delete _this2.element_.fetched_;
            delete _this2.element_.isRoot_;
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


  function resolve(element, options) {
    var options_ = Object.keys(options).reduce(function (acc, key) {

      var options_ = options[key];
      var options_isObj = options_ instanceof Object;
      if (options_isObj) {
        Object.keys(options_).reduce(function (acc, key_) {
          var options__ = options_[key_];
          var options__isObj = options__ instanceof Object;
          if (options__isObj) {
            throw new Error('still not developed the recursion');
          } else {
            acc[key + '-' + key_] = options__;
            return acc;
          }
        }, acc);
      } else {
        acc[key] = options_;
      }
      return acc;
    }, {});
    Object.keys(options_).forEach(function (key) {
      return element.setAttribute(key, options_[key]);
    });
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
      },
      bubbles: true
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
  function fetch_(fragment, src, options) {
    var fetched = fragment.isRoot_ ? fragment.fetched_ : fragment.parentElement.closest(selClass).MaterialFragment.root_.fetched_;
    if (fetched.includes(src)) {
      var error = new Error('Circular dependency detected at ' + src);
      window.dispatchEvent(new window.ErrorEvent('error', error));
      throw error;
    }
    fetched.push(src);
    return fetch(src, options).then(function (response) {
      return response.text();
    }).then(function (text) {
      var base = basedir(src);
      var html = createHTML(text);
      var scripts = slice.call(html.querySelectorAll('script')).map(function (script) {
        return new Promise(function (resolve) {
          if (script.src === '') {
            resolve(script);
          } else {
            var src = script.getAttribute('src');
            script.src = src[0] === '/' ? src : base + src;
            script.addEventListener('load', function () {
              return resolve(script);
            });
          }
        });
      });
      fragment.appendChild(html);
      return Promise.all(scripts).then(function () {
        slice.call(fragment.querySelectorAll(selClass)).forEach(function (fragment) {
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
    return path.split('#')[0].split('/').reduce(function (acc, curr, index, array) {
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

  /**
   * Set options (IIEF) from meta x-fragment tag
   *
   * @private
   */
  (function () {
    slice.call(document.querySelectorAll('meta[' + cssClass + ']')).forEach(function (meta) {
      slice.call(meta.attributes).forEach(function (attr) {
        if (attr.name === cssClass) {
          return;
        }
        var dividerPosition = attr.name.indexOf('-');
        if (dividerPosition === -1) {
          options[attr.name] = attr.value;
        } else {
          var type = attr.name.substring(0, dividerPosition);
          var param = attr.name.substring(dividerPosition + 1);
          options[type] = options[type] || {};
          options[type][param] = attr.value;
        }
      });
    });
  })();

  if (!window[classAsString]) {
    window[classAsString] = MaterialFragment;

    componentHandler.register({
      constructor: MaterialFragment,
      classAsString: classAsString,
      cssClass: cssClass,
      widget: true
    });
  }
})();
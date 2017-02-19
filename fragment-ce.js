'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  'use strict';

  var range = document.createRange();
  var createHTML = range.createContextualFragment.bind(range);
  var slice = Array.prototype.slice;

  var classAsString = 'HTMLXFragmentElement';
  var selClass = 'x-fragment';

  var options = {};

  /**
   * Class HTMLXFragmentElement
   */

  var HTMLXFragmentElement = function (_HTMLElement) {
    _inherits(HTMLXFragmentElement, _HTMLElement);

    /**
     * Constructor
     *
     */
    function HTMLXFragmentElement() {
      _classCallCheck(this, HTMLXFragmentElement);

      var _this = _possibleConstructorReturn(this, (HTMLXFragmentElement.__proto__ || Object.getPrototypeOf(HTMLXFragmentElement)).call(this));

      _this.fetch_ = null;
      _this.resolvers_ = [];

      /**
       * Load promise
       *
       */
      _this.loaded = new Promise(function (resolve) {
        _this.resolve_ = resolve;
      });
      return _this;
    }

    /**
     * Initialize element.
     *
     * @private
     */


    _createClass(HTMLXFragmentElement, [{
      key: 'connectedCallback',
      value: function connectedCallback() {
        var _this2 = this;

        if (!this.hasAttribute('src')) {
          throw new Error('Src attribute is not present');
        }

        var parent = this.parentElement.closest(selClass);
        this.root_ = parent ? parent.root_ : this;
        this.isRoot_ = parent ? false : true;
        this.fetched_ = [];

        var src = preparePath(this.getAttribute('src'), this.dataset.baseURI);
        this.fetch_ = fetch_(this, src, options).then(function (element) {
          delete element.dataset.baseURI;
          _this2.root_.resolvers_.push(resolve.bind(null, element, options));
          return Promise.all(slice.call(element.querySelectorAll(selClass)).map(function (fragment) {
            return fragment.fetch_;
          }));
        }).then(function () {
          if (_this2.isRoot_) {
            _this2.resolvers_.forEach(function (resolver) {
              return resolver();
            });
            delete _this2.resolvers_;
            delete _this2.resolve_;
            delete _this2.fetched_;
            delete _this2.fetch_;
            delete _this2.isRoot_;
          }
        });
      }
    }]);

    return HTMLXFragmentElement;
  }(HTMLElement);

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
     * @event HTMLXFragmentElement#load
     * @type {CustomEvent}
     * @property {HTMLElement} fragment - The loaded fragment
     */
    element.dispatchEvent(new CustomEvent('load', {
      detail: {
        fragment: element
      },
      bubbles: true
    }));
    element.resolve_(element);
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
    var fetched = fragment.isRoot_ ? fragment.fetched_ : fragment.parentElement.closest(selClass).root_.fetched_;
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
      slice.call(html.querySelectorAll(selClass)).forEach(function (fragment) {
        return fragment.dataset.baseURI = base;
      });
      fragment.appendChild(html);
      return Promise.all(scripts).then(function () {
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

  (function () {
    slice.call(document.querySelectorAll('meta[' + selClass + ']')).forEach(function (meta) {
      slice.call(meta.attributes).forEach(function (attr) {
        if (attr.name === selClass) {
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
    window[classAsString] = HTMLXFragmentElement;
    window.customElements.define('x-fragment', HTMLXFragmentElement);
  }
})();
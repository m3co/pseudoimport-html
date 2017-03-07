'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  'use strict';

  var createHTML = craftedCreateContextualFragment;
  var slice = Array.prototype.slice;

  var classAsString = 'MaterialFragment';
  var selector = 'mdl-fragment';
  var cssClass = '.' + selector;

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

      var parent = element.parentElement.closest(cssClass);
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
          return Promise.all(slice.call(element.querySelectorAll(cssClass)).map(function (fragment) {
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

  if (!window[classAsString]) {
    window[classAsString] = MaterialFragment;

    componentHandler.register({
      constructor: MaterialFragment,
      classAsString: classAsString,
      cssClass: selector,
      widget: true
    });
  }

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
     * This event is not bubbled.
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
    slice.call(document.querySelectorAll('meta[' + selector + ']')).forEach(function (meta) {
      slice.call(meta.attributes).forEach(function (attr) {
        if (attr.name === selector) {
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

  /**
   * Please, do not use createContextualFragment from Range
   * It's an experimental fn. This function intentionally replaces
   * Range.createContextualFragment
   *
   * @param {String} html - The string that we want to convert into HTML
   * @return {DocumentFragment}
   * @private
   */
  function craftedCreateContextualFragment(html, base) {
    function rewriteScripts(element) {
      return slice.call(element.querySelectorAll('script')).map(function (old_script) {
        return new Promise(function (resolve, reject) {
          var new_script = document.createElement('script');

          // clone text (content)
          if (old_script.src) {
            new_script.src = old_script.src;
            new_script.setAttribute('data-src', old_script.getAttribute('src'));
          }
          if (old_script.text) {
            new_script.setAttribute('data-src', '');
            new_script.text = old_script.text;
          }

          // clone all attributes
          slice.call(old_script.attributes).forEach(function (attr) {
            return new_script.setAttribute(attr.name, attr.value);
          });

          old_script.parentNode.replaceChild(new_script, old_script);
          resolve(new_script);
        });
      });
    }

    return new Promise(function (resolve, reject) {
      // create DocumentFragment
      var frag = document.createDocumentFragment();

      // create a wrapper as div (could be anything else)
      var wrapper = document.createElement('div');

      // fill with HTML
      wrapper.innerHTML = html;

      // rewrite scripts in order to make them executable
      return Promise.all(rewriteScripts(wrapper)).then(function () {
        // append wrapper to fragment
        frag.appendChild(wrapper);
        while (wrapper.children.length > 0) {
          // move eveything from wrapper to fragment
          frag.appendChild(wrapper.children[0]);
        }
        // clean-up
        frag.removeChild(wrapper);
        frag.BASE_URL = base;
        resolve(frag);
      });
    });
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
    var fetched = fragment.isRoot_ ? fragment.fetched_ : fragment.parentElement.closest(cssClass).MaterialFragment.root_.fetched_;
    if (fetched.includes(src)) {
      var error = new Error('Circular dependency detected at ' + src);
      window.dispatchEvent(new window.ErrorEvent('error', error));
      throw error;
    }
    fetched.push(src);
    return fetch(src, options).then(function (response) {
      return response.text();
    }).then(function (text) {
      return createHTML(text, basedir(src)).then(function (html) {
        var base = html.BASE_URL;
        var scripts = slice.call(html.querySelectorAll('script')).map(function (script) {
          return new Promise(function (resolve) {
            if (script.getAttribute('data-src') === '') {
              resolve(script);
            } else {
              var src = script.getAttribute('data-src');
              script.src = src[0] === '/' ? src : base + src;
              script.addEventListener('load', function () {
                return resolve(script);
              });
            }
          });
        });
        document.currentFragment = fragment;
        fragment.appendChild(html);
        return Promise.all(scripts).then(function () {
          slice.call(fragment.querySelectorAll(cssClass)).forEach(function (fragment) {
            fragment.dataset.baseURI = base;
            componentHandler.upgradeElement(fragment);
          });
          document.currentFragment = null;
          return fragment;
        });
      });
    });
  }
})();
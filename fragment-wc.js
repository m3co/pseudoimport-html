'use strict';

(function () {
  'use strict';

  var createHTML = craftedCreateContextualFragment;
  var slice = Array.prototype.slice;

  var classAsString = 'HTMLXFragmentElement';
  var selector = 'x-fragment';

  var options = {};

  /**
   * Prototype HTMLXFragmentElement
   *
   */
  var HTMLXFragmentElement = Object.create(HTMLElement.prototype);

  /**
   * Callback that is called when document.create(fragment) or similar
   *
   * @private
   */
  HTMLXFragmentElement.createdCallback = function () {
    var _this = this;

    this.fetch_ = null;
    this.resolvers_ = [];

    /**
     * Load promise
     *
     */
    this.loaded = new Promise(function (resolve) {
      _this.resolve_ = resolve;
    });
  };

  /**
   * Callback that is called when attaching (appendChild or similar)
   * this fragment into DOM
   *
   * @private
   */
  HTMLXFragmentElement.attachedCallback = function () {
    var _this2 = this;

    if (!this.hasAttribute('src')) {
      throw new Error('Src attribute is not present');
    }

    var parent = this.parentElement.closest(selector);
    this.root_ = parent ? parent.root_ : this;
    this.isRoot_ = parent ? false : true;
    this.fetched_ = [];

    var src = preparePath(this.getAttribute('src'), this.dataset.baseURI);
    this.fetch_ = fetch_(this, src, options).then(function (element) {
      delete element.dataset.baseURI;
      _this2.root_.resolvers_.push(resolve.bind(null, element, options));
      return Promise.all(slice.call(element.querySelectorAll(selector)).map(function (fragment) {
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
  };

  if (!window[classAsString]) {
    window[classAsString] = HTMLXFragmentElement;
    document.registerElement('x-fragment', { prototype: HTMLXFragmentElement });
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
     * @event HTMLXFragmentElement#load
     * @type {CustomEvent}
     * @property {HTMLElement} fragment - The loaded fragment
     */
    element.dispatchEvent(new CustomEvent('load', {
      detail: {
        fragment: element
      }
    }));
    element.resolve_(element);
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
          var src = old_script.getAttribute('src');

          // clone all attributes
          slice.call(old_script.attributes).forEach(function (attr) {
            return new_script.setAttribute(attr.name, attr.value);
          });

          // clone text (content)
          if (old_script.src) {
            new_script.src = old_script.src;
            new_script.setAttribute('data-src', old_script.getAttribute('src'));
            new_script.setAttribute('data-src-', old_script.getAttribute('src'));
            new_script.src = src[0] === '/' ? src : base + src;
          }
          if (old_script.text) {
            new_script.setAttribute('data-src', '');
            new_script.text = old_script.text;
            return resolve(old_script.parentNode.replaceChild(new_script, old_script));
          }

          return fetch(new_script.src, options).then(function (response) {
            if (response.status === 404) {
              return Promise.reject(new Error(response.statusText));
            }
            return response.text();
          }).then(function (text) {
            delete new_script.src;
            new_script.removeAttribute('src');
            new_script.text = text;
            resolve(old_script.parentNode.replaceChild(new_script, old_script));
          });
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
        while (wrapper.childNodes.length > 0) {
          // move eveything from wrapper to fragment
          frag.appendChild(wrapper.childNodes[0]);
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
    var fetched = fragment.isRoot_ ? fragment.fetched_ : fragment.parentElement.closest(selector).root_.fetched_;
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
        slice.call(html.querySelectorAll(selector)).forEach(function (fragment) {
          return fragment.dataset.baseURI = base;
        });
        document.currentFragment = fragment;
        fragment.appendChild(html);
        slice.call(fragment.querySelectorAll('script')).forEach(function (script) {
          if (script.getAttribute('data-src') !== '') {
            script.setAttribute('src', script.getAttribute('data-src-'));
            script.removeAttribute('data-src');
            script.removeAttribute('data-src-');
            script.dispatchEvent(new Event('load'));
          }
        });
        document.currentFragment = null;
        return fragment;
      });
    });
  }
})();
(!window.HTMLXFragmentElement) && (() => {
  'use strict';
  const selector = 'x-fragment';

  var options = {};

  /**
   * Class HTMLXFragmentElement
   */
  class HTMLXFragmentElement extends HTMLElement {

    /**
     * Constructor
     *
     */
    constructor() {
      super();
      this.fetch_ = null;
      this.resolvers_ = [];

      /**
       * Load promise
       *
       */
      this.loaded = new Promise((resolve) => {
        this.resolve_ = resolve;
      });
      this.loaded.status = 'pending';
    }

    /**
     * Initialize element.
     *
     * @private
     */
    connectedCallback() {
      if (!this.hasAttribute('src')) {
        throw new Error('Src attribute is not present');
      }

      var parent = this.parentElement.closest(selector);
      this.root_ = parent ? (parent.loaded.status === 'fulfilled' ?
        this : parent.root_) : this;
      this.isRoot_ = parent ? (parent.loaded.status === 'fulfilled' ?
        true : false) : true;
      this.fetched_ = [];

      var src = preparePath(this.getAttribute('src'),
                            this.dataset.baseURI);
      this.fetch_ = fetch_(this, src, options).then(element => {
        delete element.dataset.baseURI;
        this.root_.resolvers_.push(resolve.bind(null, element, options));
        return Promise.all(
          [...element.querySelectorAll(selector)]
            .map(fragment => fragment.fetch_)
        );
      }).then(() => {
        if (this.isRoot_) {
          this.resolvers_.forEach(resolver => resolver());
          delete this.resolvers_;
          delete this.resolve_;
          delete this.fetched_;
          delete this.fetch_;
          delete this.isRoot_;
        }
      });
    }
  }

  /**
   * Extract the base dir from path.
   *
   * @param {String} path
   * @return {String}
   * @private
   */
  function basedir(path) {
    return path.split('#')[0]
      .split('/')
      .reduce((acc, curr, index, array) => {
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
    return (path[0] === '/' || /([a-zA-Z0-9-]+:)\/\/.+/.test(path)) ? path :
      (baseURI ? baseURI : basedir(document.baseURI)) + path;
  }

  /**
   * Set options (IIEF) from meta x-fragment tag
   *
   * @private
   */
  (() => {
    [...document.querySelectorAll(`meta[${selector}]`)]
      .forEach((meta) => {
        [...meta.attributes]
          .forEach((attr) => {
            if (attr.name === selector) { return; }
            let dividerPosition = attr.name.indexOf('-');
            if (dividerPosition === -1) {
              options[attr.name] = attr.value;
            } else {
              let type = attr.name.substring(0, dividerPosition);
              let param = attr.name.substring(dividerPosition + 1);
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
    return new Promise((resolve) => {
      // create DocumentFragment
      let frag = document.createDocumentFragment();

      // create a wrapper as div (could be anything else)
      let wrapper = document.createElement('div');

      // fill with HTML
      wrapper.innerHTML = html;

      // rewrite scripts in order to make them executable
      return Promise.all((element => [...element.querySelectorAll('script')]
        .map(old_script => new Promise((resolve, reject) => {
          let new_script = document.createElement('script');
          let src = old_script.getAttribute('src');

          // clone all attributes
          [...old_script.attributes]
            .forEach(attr => new_script.setAttribute(attr.name, attr.value));

          // clone text (content)
          if (old_script.src) {
            new_script.src = old_script.src;
            new_script.setAttribute('data-src', old_script.getAttribute('src'));
            new_script.setAttribute('data-src-', old_script.getAttribute('src'));
            new_script.src = (
              src[0] === '/' || /([a-zA-Z0-9-]+:)\/\/.+/.test(src)
              ) ? src : base + src;
          }
          if (old_script.text) {
            new_script.setAttribute('data-src', '');
            new_script.text = old_script.text;
            return resolve(old_script.parentNode
              .replaceChild(new_script, old_script));
          }

          return fetch(new_script.src, options).then(response => {
            if (response.status === 404) {
              return reject(new Error(response.statusText));
            }
            return response.text();
          }).then(text => {
            delete new_script.src;
            new_script.removeAttribute('src');
            new_script.text = text;
            resolve(old_script.parentNode.replaceChild(new_script, old_script));
          });
        }))
      )(wrapper)).then(() => {
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

  const createHTML = craftedCreateContextualFragment;
  /**
   * Resolve, in fact, dispatch load event from an element
   *
   * @param {HTMLElement} element - The element that will dispatch the
   *   load event.
   * @private
   */
  function resolve(element, options) {
    let options_ = Object.keys(options).reduce((acc, key)  => {
      let options_ = options[key];
      let options_isObj = options_ instanceof Object;
      if (options_isObj) {
        Object.keys(options_).reduce((acc, key_) => {
          let options__ = options_[key_];
          let options__isObj = options__ instanceof Object;
          if (options__isObj) {
            throw new Error('still not developed the recursion');
          } else {
            acc[`${key}-${key_}`] = options__;
            return acc;
          }
        }, acc);
      } else {
        acc[key] = options_;
      }
      return acc;
    }, {});
    Object.keys(options_).forEach(key =>
        element.setAttribute(key, options_[key])
      );
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
    element.loaded.status = 'fulfilled';
    element.resolve_(element);
  }

  var originalFetch = window.fetch;
  /**
   * Fetch HTML code from src to fragment.
   *
   * @param {HTMLElement} fragment - The fragment that will hold the fetched HTML
   * @param {String} src - The URI to fetch
   * @return {Promise} - The fetch request
   * @private
   */
  function fetch_(fragment, src, options) {
    var fetched = fragment.isRoot_ ?
      fragment.fetched_ :
      fragment.parentElement.closest(selector).root_.fetched_;
    if (fetched.includes(src)) {
      var error = new Error(`Circular dependency detected at ${src}`);
      window.dispatchEvent(new window.ErrorEvent('error', error));
      throw error;
    }
    fetched.push(src);
    return originalFetch(src, options).then(response => response.text())
      .then(text => createHTML(text, basedir(src)).then((html) => {
        var base = html.BASE_URL;
        [...html.querySelectorAll(selector)]
          .forEach(fragment => fragment.dataset.baseURI = base);
        document.currentFragment = fragment;
        window.fetch = (url, options) => originalFetch(base + url, options);
        fragment.appendChild(html);
        window.fetch = originalFetch;
        [...fragment.querySelectorAll('script')]
          .forEach(script => {
            if (script.getAttribute('data-src') !== '') {
              script.setAttribute('src', script.getAttribute('data-src-'));
              script.removeAttribute('data-src');
              script.removeAttribute('data-src-');
              script.dispatchEvent(new Event('load'));
            }
          });
        document.currentFragment = null;
        return fragment;
      }));
  }

  window.HTMLXFragmentElement = HTMLXFragmentElement;
  window.customElements.define('x-fragment', HTMLXFragmentElement);

})();

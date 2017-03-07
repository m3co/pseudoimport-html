(() => {
  'use strict';
  const createHTML = craftedCreateContextualFragment;
  const slice = Array.prototype.slice;

  const classAsString = 'HTMLXFragmentElement';
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
      this.root_ = parent ? parent.root_ : this;
      this.isRoot_ = parent ? false : true;
      this.fetched_ = [];

      var src = preparePath(this.getAttribute('src'),
                            this.dataset.baseURI);
      this.fetch_ = fetch_(this, src, options).then(element => {
        delete element.dataset.baseURI;
        this.root_.resolvers_.push(resolve.bind(null, element, options));
        return Promise.all(
          slice.call(element.querySelectorAll(selector))
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

  if (!window[classAsString]) {
    window[classAsString] = HTMLXFragmentElement;
    window.customElements.define('x-fragment', HTMLXFragmentElement);
  }

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
    element.resolve_(element);
  }

  //@@include('../includes/utils.js')
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
    return fetch(src, options).then(response => response.text())
      .then(text => createHTML(text, basedir(src)).then(html => {
        var base = html.BASE_URL;
        slice.call(html.querySelectorAll(selector))
          .forEach(fragment => fragment.dataset.baseURI = base);
        document.currentFragment = fragment;
        fragment.appendChild(html);
        slice.call(html.querySelectorAll('script'))
          .forEach(script => {
            if (script.getAttribute('data-src') !== '') {
              script.dispatchEvent(new Event('load'));
            }
          });
        document.currentFragment = null;
        return fragment;
      }));

  }

})();

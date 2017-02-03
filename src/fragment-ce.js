(() => {
  'use strict';
  const range = document.createRange();
  const createHTML = range.createContextualFragment.bind(range);

  const classAsString = 'HTMLXFragmentElement';
  const selClass = 'x-fragment';

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
      var parent = this.parentElement.closest(selClass);
      this.root_ = parent ? parent.root_ : this;
      this.isRoot_ = parent ? false : true;
      this.fetched_ = [];

      var src = preparePath(this.getAttribute('src'),
                            this.dataset.baseURI);
      this.fetch_ = fetch_(this, src).then(element => {
        delete element.dataset.baseURI;
        this.root_.resolvers_.push(resolve.bind(null, element));
        return Promise.all(
          Array.prototype
               .slice
               .call(element.querySelectorAll(selClass))
               .map(fragment => fragment.fetch_)
        );
      }).then(() => {
        if (this.isRoot_) {
          this.resolvers_.forEach(resolver => resolver());
          delete this.resolvers_;
          delete this.resolve_;
          delete this.fetch_;
          delete this.isRoot_;
        }
      });
    }
  }

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
  function fetch_(fragment, src) {
    var fetched = fragment.isRoot_ ? fragment.fetched_ : fragment.parentElement.closest(selClass).root_.fetched_;
    if (fetched.includes(src)) {
      var error = new Error(`Circular dependency detected at ${src}`);
      window.dispatchEvent(new window.ErrorEvent('error', error));
      throw error;
    }
    fetched.push(src);
    return fetch(src).then(response => response.text())
      .then(text => {
      var base = basedir(src);
      var html = createHTML(text);
      var scripts = Array.prototype
        .slice
        .call(html.querySelectorAll('script'))
        .map(script => new Promise(resolve => {
          if (script.src === '') {
            resolve(script);
          } else {
            var src = script.getAttribute('src');
            script.src = src[0] === '/' ? src : base + src;
            script.addEventListener('load', () => resolve(script));
          }
        }));
      Array.prototype
           .slice
           .call(html.querySelectorAll(selClass))
           .forEach(fragment => fragment.dataset.baseURI = base);
      fragment.appendChild(html);
      return Promise.all(scripts).then(() => fragment);
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
    return path[0] === '/' ? path : (baseURI ? baseURI : basedir(document.baseURI)) + path;
  }

  window[classAsString] = HTMLXFragmentElement;

  window.customElements.define('x-fragment', HTMLXFragmentElement);

})();

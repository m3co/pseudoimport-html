(() => {
  'use strict';
  const range = document.createRange();
  const createHTML = range.createContextualFragment.bind(range);

  const classAsString = 'MaterialFragment';
  const cssClass = 'mdl-fragment';
  const selClass = `.${cssClass}`;

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
      this.loaded = new Promise((resolve) => {
        this.resolve_ = resolve;
      });
      this.init();
    }

    /**
     * Initialize element.
     *
     */
    init() {
      var src = preparePath(this.element_.getAttribute('src'),
                            this.element_.dataset.baseURI);
      this.fetch_ = fetch_(this.element_, src).then(element => {
        delete element.dataset.baseURI;
        this.root_.MaterialFragment.resolvers_.push(resolve.bind(null, element));
        return Promise.all(
          Array.prototype
               .slice
               .call(element.querySelectorAll(selClass))
               .map(fragment => fragment.MaterialFragment.fetch_)
        );
      }).then(() => {
        if (this.isRoot_) {
          this.resolvers_.forEach(resolver => resolver());
          delete this.resolvers_;
          delete this.resolve_;
          delete this.fetch_;
          delete this.isRoot_;
          delete this.element_.fetched_;
          delete this.element_.isRoot_;
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
  function fetch_(fragment, src) {
    var fetched = fragment.isRoot_ ?
      fragment.fetched_ :
      fragment.parentElement.closest(selClass).MaterialFragment.root_.fetched_;
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
        fragment.appendChild(html);
        return Promise.all(scripts).then(() => {
          Array.prototype
             .slice
             .call(fragment.querySelectorAll(selClass))
             .forEach(fragment => {
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
    return path[0] === '/' ? path :
      (baseURI ? baseURI : basedir(document.baseURI)) + path;
  }

  window[classAsString] = MaterialFragment;

  componentHandler.register({
    constructor: MaterialFragment,
    classAsString: classAsString,
    cssClass: cssClass,
    widget: true
  });
})();

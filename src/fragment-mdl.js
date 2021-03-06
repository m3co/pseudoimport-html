(() => {
  'use strict';
  const createHTML = craftedCreateContextualFragment;

  const classAsString = 'MaterialFragment';
  const selector = 'mdl-fragment';
  const cssClass = `.${selector}`;

  var options = {};

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
      var parent = element.parentElement.closest(cssClass);
      this.fetch_ = null;
      this.element_ = element;

      if (!this.element_.hasAttribute('src')) {
        throw new Error('Src attribute is not present');
      }

      this.root_ = parent ? (parent.MaterialFragment.loaded.status === 'fulfilled' ?
        element : parent.MaterialFragment.root_) : element;
      this.isRoot_ = parent ? (parent.MaterialFragment.loaded.status === 'fulfilled' ?
        true : false) : true;
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
      this.loaded.status = 'pending';
      this.init();
    }

    /**
     * Initialize element.
     *
     */
    init() {
      var src = preparePath(this.element_.getAttribute('src'),
                            this.element_.dataset.baseURI);
      this.fetch_ = fetch_(this.element_, src, options).then(element => {
        delete element.dataset.baseURI;
        this.root_.MaterialFragment.resolvers_
          .push(resolve.bind(null, element, options));
        return Promise.all(
          [...element.querySelectorAll(cssClass)]
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
     * @event MaterialFragment#load
     * @type {CustomEvent}
     * @property {HTMLElement} fragment - The loaded fragment
     */
    element.dispatchEvent(new CustomEvent('load', {
      detail: {
        fragment: element
      }
    }));
    element.MaterialFragment.loaded.status = 'fulfilled';
    element.MaterialFragment.resolve_(element);
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
    var parentEl = fragment;
    var parentElements = [fragment.getAttribute('src')];
    while(parentEl = parentEl.parentElement.closest(cssClass)) { // eslint-disable-line
      var item = parentEl.getAttribute('src');
      if (parentElements.indexOf(item) > -1) {
        var error = new Error(`Circular dependency detected at ${src}`);
        window.dispatchEvent(new window.ErrorEvent('error', error));
        throw error;
      }
      parentElements.push(item);
    }
    return fetch(src, options).then(response => response.text())
      .then(text => createHTML(text, basedir(src)).then(html => {
        var base = html.BASE_URL;
        document.currentFragment = fragment;
        fragment.appendChild(html);
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
        [...fragment.querySelectorAll(cssClass)]
          .forEach(fragment => {
            fragment.dataset.baseURI = base;
            componentHandler.upgradeElement(fragment);
          });
        return fragment;
      }));
  }

})();

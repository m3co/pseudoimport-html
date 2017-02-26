(() => {
  'use strict';
  const createHTML = craftedCreateContextualFragment;
  const slice = Array.prototype.slice;

  const classAsString = 'HTMLXFragmentElement';
  const selClass = 'x-fragment';

  var options = {};

  /**
   * Class HTMLXFragmentElement
   */
  class HTMLXFragmentElement extends HTMLElement {

    /**
     * Constructor
     *
     * @private
     */
    constructor() {
      super();
      // In fact, this function is never being called by browser
    }

    /**
     * Callback that is called when document.create(fragment) or similar
     *
     */
    createdCallback() {
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
     * Callback that is called when attaching (appendChild or similar)
     * this fragment into DOM
     *
     * @private
     */
    attachedCallback() {
      if (!this.hasAttribute('src')) {
        throw new Error('Src attribute is not present');
      }

      var parent = this.parentElement.closest(selClass);
      this.root_ = parent ? parent.root_ : this;
      this.isRoot_ = parent ? false : true;
      this.fetched_ = [];

      var src = preparePath(this.getAttribute('src'),
                            this.dataset.baseURI);
      this.fetch_ = fetch_(this, src, options).then(element => {
        delete element.dataset.baseURI;
        this.root_.resolvers_.push(resolve.bind(null, element, options));
        return Promise.all(
          slice.call(element.querySelectorAll(selClass))
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
    document.registerElement('x-fragment', HTMLXFragmentElement);
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

  /**
   * Set options (IIEF) from meta x-fragment tag
   *
   * @private
   */
  (() => {
    slice.call(document.querySelectorAll(`meta[${selClass}]`))
      .forEach((meta) => {
        slice.call(meta.attributes)
          .forEach((attr) => {
            if (attr.name === selClass) { return; }
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
  function craftedCreateContextualFragment(html) {
    function rewriteScripts(element) {
      slice.call(element.querySelectorAll('script'))
        .forEach(old_script => {
          let new_script = document.createElement('script');

          // clone text (content)
          old_script.src && (new_script.src = old_script.src);
          old_script.text && (new_script.text = old_script.text);

          // clone all attributes
          slice.call(old_script.attributes)
            .forEach(attr => new_script.setAttribute(attr.name, attr.value));

          old_script.parentNode.replaceChild(new_script, old_script);
        });
    }

    // create DocumentFragment
    let frag = document.createDocumentFragment();

    // create a wrapper as div (could be anything else)
    let wrapper = document.createElement('div');

    // fill with HTML
    wrapper.innerHTML = html;

    // rewrite scripts in order to make them executable
    rewriteScripts(wrapper);

    // append wrapper to fragment
    frag.appendChild(wrapper);
    while (wrapper.children.length > 0) {
      // move eveything from wrapper to fragment
      frag.appendChild(wrapper.children[0]);
    }
    // clean-up
    frag.removeChild(wrapper);
    return frag;
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
    var fetched = fragment.isRoot_ ?
      fragment.fetched_ :
      fragment.parentElement.closest(selClass).root_.fetched_;
    if (fetched.includes(src)) {
      var error = new Error(`Circular dependency detected at ${src}`);
      window.dispatchEvent(new window.ErrorEvent('error', error));
      throw error;
    }
    fetched.push(src);
    return fetch(src, options).then(response => response.text())
      .then(text => {
        var base = basedir(src);
        var html = createHTML(text);
        var scripts = slice.call(html.querySelectorAll('script'))
          .map(script => new Promise(resolve => {
            if (script.src === '') {
              resolve(script);
            } else {
              var src = script.getAttribute('src');
              script.src = src[0] === '/' ? src : base + src;
              script.addEventListener('load', () => resolve(script));
            }
          }));
        slice.call(html.querySelectorAll(selClass))
          .forEach(fragment => fragment.dataset.baseURI = base);
        fragment.appendChild(html);
        return Promise.all(scripts).then(() => fragment);
      });

  }

})();

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
 * @param {Object} options - The options to pass to the fetch function
 * @param {HTMLElement} parent - The parent of the fragment that will be fetched
 *
 * @return {Promise} - The fetch request
 * @private
 */
function fetch_(fragment, src, options, parent) {
  var fetched = fragment.isRoot_ ?
    fragment.fetched_ :
    parent.root_.fetched_;
  var ref = `${src}:${parent ?
    parent.getAttribute('src') :
    null}`;
  if (fetched.includes(ref)) {
    var error = new Error(`Circular dependency detected at ${src}`);
    window.dispatchEvent(new window.ErrorEvent('error', error));
    throw error;
  }
  fetched.push(ref);
  return originalFetch(src, options).then(response => response.text())
    .then(text => createHTML(text, basedir(src)).then(html => {
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

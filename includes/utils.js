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
  slice.call(document.querySelectorAll(`meta[${selector}]`))
    .forEach((meta) => {
      slice.call(meta.attributes)
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
  function rewriteScripts(element) {
    slice.call(element.querySelectorAll('script'))
      .forEach(old_script => {
        let new_script = document.createElement('script');

        // clone text (content)
        if (old_script.src) {
          new_script.src = old_script.src;
          new_script.setAttribute('data-src', old_script.getAttribute('src'));
        }
        old_script.text && (new_script.text = old_script.text);

        // clone all attributes
        slice.call(old_script.attributes)
          .forEach(attr => new_script.setAttribute(attr.name, attr.value));

        old_script.parentNode.replaceChild(new_script, old_script);
      });
  }

  return new Promise((resolve, reject) => {
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
    frag.BASE_URL = base;
    resolve(frag);
  });
}

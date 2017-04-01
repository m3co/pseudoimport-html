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

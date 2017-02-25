'use strict';

var html = `
  <script>
  'use strict';
  console.log('inline');
  </script>
  <script src="testJS.js"></script>
  <div>Whatever</div>`;


function craftedCreateContextualFragment(html) {
  function rewriteScripts(element) {
    Array.prototype.slice
      .call(element.querySelectorAll('script'))
      .forEach(old_script => {
        let new_script = document.createElement('script');

        // clone text (content)
        old_script.src && (new_script.src = old_script.src);
        old_script.text && (new_script.text = old_script.text);

        // clone all attributes
        Array.prototype.slice
          .call(old_script.attributes)
          .forEach(attr => new_script.setAttribute(attr.name, attr.value));

        old_script.parentNode.replaceChild(new_script, old_script);
      });
  }

  // createContextualFragment step-by-step

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

var frag = craftedCreateContextualFragment(html);
document.body.appendChild(frag);

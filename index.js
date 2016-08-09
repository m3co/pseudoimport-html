;(function() {
  'use strict';
  var tagContent = 'pseudoimport-html';

  function pseudoImportHTML(element, url) {
    return fetch(url).then(function(response) {
      return response.text();
    }).then(function(text) {
      element.innerHTML = text;

      var scripts = element.querySelectorAll('script');
      var i;
      for (var i = 0; i < scripts.length; i++) {
        var old_script = scripts[i];
        var new_script = document.createElement('script');

        // clone text (content)
        if (old_script.src) {
          new_script.src = old_script.src;
        } else if (old_script.text) {
          new_script.text = old_script.text;
        }

        // clone all attributes
        for (var j = 0; j < old_script.attributes.length; j++) {
          new_script.setAttribute(old_script.attributes[j].name, old_script.attributes[j].value);
        }

        var parent = old_script.parentNode;
        parent.replaceChild(new_script, old_script);
      }
      element.dispatchEvent(new CustomEvent('load'));

      return element;
    });
  }

  function updateAll() {
    var containers = document.querySelectorAll(tagContent);
    for (var i = 0; i < containers.length; i++) {
      var container = containers[i];
      if (!container.updatePromise && container.hasAttribute('src')) {
        var url = container.getAttribute('src');
        container.updatePromise = pseudoImportHTML(container, url);
      }
    }
  }

  window.addEventListener('load', function(e) {
    updateAll();
  });

})();

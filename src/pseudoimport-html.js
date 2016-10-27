;(() => {
  var tagContent = 'pseudoimport-html';
  var tagContentSrc = 'pseudoimport-html-src';
  var fetchs = [];

  function rewriteScripts(element) {
    var scripts = element.querySelectorAll('script');
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
  }

  function pseudoImportHTML(element, url, tagContentSrc) {
    var temporal, ALREADY_IN_ELEMENT = false;
    if (tagContentSrc instanceof HTMLElement) {
      temporal = tagContentSrc;
    } else if (typeof(tagContentSrc) === "string") {
      var srcTag = element.querySelector(tagContentSrc);
      if (srcTag instanceof HTMLElement) {
        temporal = srcTag;
        ALREADY_IN_ELEMENT = true;
      } else {
        temporal = document.createElement(tagContentSrc);
      }
    } else {
      throw new Error('define a tagContentSrc');
    }

    var fetching = fetch(url).then(response => {
      return response.text();
    }).then(text => {
      temporal.innerHTML = text;
      rewriteScripts(temporal);
      if (!ALREADY_IN_ELEMENT) {
        element.appendChild(temporal);
      }
      element.dispatchEvent(new CustomEvent('load', {
        detail: {
          element: element,
          url: url
        }
      }));

      return element;
    });

    fetchs.push(fetching);
    return fetching;
  }

  function updateAll(tagContent, tagContentSrc) {
    var containers = document.querySelectorAll(tagContent);
    for (var i = 0; i < containers.length; i++) {
      var container = containers[i];
      if (!container.updatePromise && container.hasAttribute('src')) {
        var url = container.getAttribute('src');
        container.updatePromise = pseudoImportHTML(container, url, tagContentSrc);
      }
    }
    return Promise.all(fetchs);
  }

  function run(tagContent, tagContentSrc) {
    var pimsOb = new MutationObserver((records, instance) => {
      records.forEach(record => {
        var pims = record.target.querySelectorAll(tagContent);
        for (var i = 0; i < pims.length; i++) {
          if (!pims[i].ALREADY_OBSERVING) {
            instance.observe(pims[i], { childList: true });
            pims[i].ALREAD_OBSERVING = true;
          }
        }
      });
      updateAll(tagContent, tagContentSrc);
    });

    var pims = document.querySelectorAll(tagContent);
    for (var i = 0; i < pims.length; i++) {
      if (!pims[i].ALREADY_OBSERVING) {
        pimsOb.observe(pims[i], { childList: true });
        pims[i].ALREADY_OBSERVING = true;
      }
    }
    return updateAll(tagContent, tagContentSrc);
  }
  run(tagContent, tagContentSrc);

  window.PseudoimportHTML = {
    run: run,
    importHTML: pseudoImportHTML
  };

})();

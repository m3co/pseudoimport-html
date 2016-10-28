'use strict';

;(function () {
  var TAG_CONTENT = 'pseudoimport-html';
  var TAG_CONTENT_SRC = 'pseudoimport-html-src';
  var fetchs = [];

  var tagContents = [];
  var tagContentsSrc = [];

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
    var temporal,
        ALREADY_IN_ELEMENT = false;
    if (tagContentSrc instanceof HTMLElement) {
      temporal = tagContentSrc;
    } else if (typeof tagContentSrc === "string") {
      var srcTag = element.querySelector(tagContentsSrc.join());
      if (srcTag instanceof HTMLElement) {
        temporal = srcTag;
        ALREADY_IN_ELEMENT = true;
      } else {
        temporal = document.createElement(TAG_CONTENT_SRC);
      }
    } else {
      throw new Error('define a tagContentSrc');
    }

    var fetching = fetch(url).then(function (response) {
      return response.text();
    }).then(function (text) {
      temporal.innerHTML = text;
      rewriteScripts(temporal);
      if (!ALREADY_IN_ELEMENT) {
        element.appendChild(temporal);
      }
      element.setAttribute('ready', '');
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
    var containers = document.querySelectorAll(tagContents.join());
    for (var i = 0; i < containers.length; i++) {
      var container = containers[i];
      if (!container.updatePromise && container.hasAttribute('src')) {
        var url = container.getAttribute('src');
        container.updatePromise = pseudoImportHTML(container, url, tagContentSrc);
      }
    }
    return Promise.all(fetchs);
  }

  var runPromise;
  function run(tagContent, tagContentSrc) {
    tagContent = tagContent || TAG_CONTENT;
    tagContentSrc = tagContentSrc || TAG_CONTENT_SRC;

    var l_tagContents = tagContents.length;
    if (!tagContents.includes(tagContent)) {
      tagContents.push(tagContent);
    }
    var l_tagContentsSrc = tagContentsSrc.length;
    if (!tagContentsSrc.includes(tagContentSrc)) {
      tagContentsSrc.push(tagContentSrc);
    }

    if (runPromise && l_tagContents == tagContents.length && l_tagContentsSrc == tagContentsSrc.length) {
      return runPromise;
    }

    runPromise = new Promise(function (resolve, reject) {
      var resolved = false;
      var pimsOb = new MutationObserver(function (records, instance) {
        records.forEach(function (record) {
          var pims = record.target.querySelectorAll(tagContents.join());
          for (var i = 0; i < pims.length; i++) {
            if (!pims[i].ALREADY_OBSERVING) {
              instance.observe(pims[i], { childList: true });
              pims[i].ALREAD_OBSERVING = true;
            }
          }
        });
        updateAll(tagContent, tagContentSrc).then(function (elements) {
          var s = tagContents.map(function (item) {
            return item + ':not([ready])';
          }).join();
          if (!document.querySelector(s)) {
            if (!resolved) {
              resolved = true;
              resolve(elements);
            }
          }
        });
      });

      var pims = document.querySelectorAll(tagContents.join());
      for (var i = 0; i < pims.length; i++) {
        if (!pims[i].ALREADY_OBSERVING) {
          pimsOb.observe(pims[i], { childList: true });
          pims[i].ALREADY_OBSERVING = true;
        }
      }
      updateAll(tagContent, tagContentSrc).then(function (elements) {
        var s = tagContents.map(function (item) {
          return item + ':not([ready])';
        }).join();
        if (!document.querySelector(s)) {
          if (!resolved) {
            resolved = true;
            resolve(elements);
          }
        }
      });
    });

    return runPromise;
  }
  run(TAG_CONTENT, TAG_CONTENT_SRC);

  window.PseudoimportHTML = {
    run: run,
    importHTML: pseudoImportHTML
  };
})();
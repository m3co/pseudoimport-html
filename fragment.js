'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  'use strict';

  var range = new Range();
  var createHTML = range.createContextualFragment.bind(range);

  var classAsString = 'MaterialFragment';
  var cssClass = 'mdl-fragment';

  /**
   * Class MaterialFragment
   */

  var MaterialFragment = function () {
    function MaterialFragment(element) {
      _classCallCheck(this, MaterialFragment);

      this.element_ = element;
      this.init();
    }

    _createClass(MaterialFragment, [{
      key: 'init',
      value: function init() {
        var _this = this;

        fetchFragment(this.element_).then(function () {
          _this.element_.dispatchEvent(new CustomEvent('load'));
        });
      }
    }]);

    return MaterialFragment;
  }();

  function clean(str) {
    return str.replace(/\n{1,} {0,}/g, ' ').replace(/> </g, '><').trim();
  }

  function fetchFragment(fragment) {
    var src = preparePath(fragment.getAttribute('src'));
    return fetch(src).then(function (response) {
      return response.text();
    }).then(function (text) {
      fragment.appendChild(createHTML(clean(text)));
    });
  }

  function basedir(path) {
    return path.split("/").reduce(function (acc, curr, index, array) {
      if (index == array.length - 1) {
        return acc;
      }
      return acc += curr + '/';
    }, "");
  }

  function preparePath(path) {
    return path[0] === '/' ? path : basedir(document.baseURI) + path;
  }

  window[classAsString] = MaterialFragment;

  componentHandler.register({
    constructor: MaterialFragment,
    classAsString: classAsString,
    cssClass: cssClass,
    widget: true
  });
})();
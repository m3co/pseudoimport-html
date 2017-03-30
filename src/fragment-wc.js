(!window.HTMLXFragmentElement) && (() => {
  'use strict';
  const classAsString = 'HTMLXFragmentElement';
  const selector = 'x-fragment';

  var options = {};

  /**
   * Prototype HTMLXFragmentElement
   *
   */
  var HTMLXFragmentElement = Object.create(HTMLElement.prototype);

  /**
   * Callback that is called when document.create(fragment) or similar
   *
   * @private
   */
  HTMLXFragmentElement.createdCallback = function() {
    this.fetch_ = null;
    this.resolvers_ = [];

    /**
     * Load promise
     *
     */
    this.loaded = new Promise((resolve) => {
      this.resolve_ = resolve;
    });
    this.loaded.status = 'pending';
  };

  /**
   * Callback that is called when attaching (appendChild or similar)
   * this fragment into DOM
   *
   * @private
   */
  HTMLXFragmentElement.attachedCallback = function() {
    if (!this.hasAttribute('src')) {
      throw new Error('Src attribute is not present');
    }

    var parent = this.parentElement.closest(selector);
    this.root_ = parent ? (parent.loaded.status === 'fulfilled' ? this : parent.root_) : this;
    this.isRoot_ = parent ? (parent.loaded.status === 'fulfilled' ? true : false) : true;
    this.fetched_ = [];

    var src = preparePath(this.getAttribute('src'),
                            this.dataset.baseURI);
    this.fetch_ = fetch_(this, src, options).then(element => {
      delete element.dataset.baseURI;
      this.root_.resolvers_.push(resolve.bind(null, element, options));
      return Promise.all(
          [...element.querySelectorAll(selector)]
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
  };

  //@@include('../includes/utils.js')
  //@@include('../includes/wc-ce.js')

  window.HTMLXFragmentElement = HTMLXFragmentElement;
  document.registerElement('x-fragment', { prototype: HTMLXFragmentElement });

})();

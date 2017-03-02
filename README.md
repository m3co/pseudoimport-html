# MDL/CE-fragment

Here's a simple _MDL/CE/WC component_ that allows you to import HTML code.

Check the [docs](/docs).

Check the [tests MDL](/test/test-mdl.html).

Check the [tests CE](/test/test-ce.html).

Check the [tests WC](/test/test-wc.html).

Feel free to import HTML content by using

```html
<div class="mdl-fragment" src="an_URI.html"></div>
```

or

```html
<x-fragment src="an_URI.html"></x-fragment>
```

## Assumptions

### Scripts or Modules?

The rough idea is that the fragment behaves like ```<script>```. If you _import_ two or more times the same fragment, then it'll be fetched and executed as browser does with ```scripts```. There's no complex mechanism that allows to _import_ a fragment, and reuse its code in somewhere else.

### document.currentFragment

A.k.a the cousing of ```document.currentScript```. It works only once. So, while executing an script, the value of ```document.currentFragment``` is the fragment caller. Once the promise of all scripts is completed, then ```document.currentFragment = null```.

### Earlier content cannot be touched

Let's imagine an obvious case
```html
<x-fragment src="URL.html">
  <script src="something-that-could-be-important.js"></script>
  <div class="loader-or-similar">
    ~
  </div>
</x-fragment>
```
If the fragment would _reset_ the content, then there's no guarrante that _something-that-could-be-important_ won't brake the page after putting the fetched content from _URL.html_, right? By this simple reason, __the eariler content cannot be touched__.

### Contexts are important

Please, do not mix _fragment-mdl.js_ with _fragment-ce.js_ and _fragment-wc.js_. The last one is for old browsers. _MDL_ is for [Material Design Lite](https://github.com/google/material-design-lite). _CE_ is for [Custom Elements](https://w3c.github.io/webcomponents/spec/custom/) and _WC_ is for [Web Components](https://w3c.github.io/webcomponents/spec/custom/) but instead of ```customElements.define``` it uses ```document.registerElement```.

If this idea looks good to you and you want to implement it into your favorite framework, then feel free to send me a PR. I'll be glad to help you with testing and more.

### Fetch an URI

This tool allows to _import_ html code from a ```src = URI``` where that resource is fetched via [fetch](https://fetch.spec.whatwg.org/). This means that [fetch](https://fetch.spec.whatwg.org/) will handle CORS and some other cases.

### Load event dispatching order

While its expected that if a resource has been fetched and parsed successfully then a load event will be fire, this tool fetches and parses all the fragments and then will fire the load events in order of appearance. E.g in MDL:

```html
<div class="mdl-fragment" src="fragmentA.html"> <!-- (1) -->
  <!-- for the sake of the example, the fragmentA.html's content is: -->
  <!-- <fragmentA.html> -->
  <div class="mdl-fragment" src="fragmentB.html"> <!-- (2) -->
  </div>
  <!-- </fragmentA.html> -->
</div>
```

As intended here, __(1)__ will dispatch load event after all its content and fragments has been fetched and parsed successfully. After __(1)__ has finished, __(2)__ will dispatch load event having all its content and fragments fetched and parsed successfully, and so on...

All scripts that belong to a fragment will be executed as _async_.

The load event is exposed as a _Promise_ through ```loaded``` property.

### Relative URIs

The resolution of relative URI is implemented by using a [baseURI](https://github.com/m3co/pseudoimport-html/blob/master/src/fragment.js#L119) attribute that is assigned while fetching. Once the content has been fetched and parsed successfully, then this attribute is [deleted](https://github.com/m3co/pseudoimport-html/blob/master/src/fragment.js#L41).

The above doesn't apply for ```<scripts src=relativeURI></scripts>``` inside a fragment. The reason is that the src's ```<script>``` [must be changed](https://github.com/m3co/pseudoimport-html/blob/master/src/fragment.js#L104) in order to let the browser's parser do its job.

### Fetch options

You can provide global options for fetch request through meta-tag. In ex., you have options object:

```javascript
let options = {
  headers: {
    "cache-control": "no-cache"
  },
  method: "GET"
}
```

You would be transform it to:

```html
<!-- In custom-element (ce) -->
<meta x-fragment headers-cache-control="no-cache" method="GET">
```

```html
<!-- In material design light (mdl) -->
<meta mdl-fragment headers-cache-control="no-cache" method="GET">
```

Also, you can divide options to multiple meta-tags:

```html
<meta x-fragment headers-cache-control="no-cache">
<meta x-fragment method="GET">
```

## Contribute

### Install

`$ git submodule init`

`$ git submodule update`

`$ npm start`

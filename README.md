# MDL-fragment

Here's a simple _MDL component_ that allows you to import HTML code.

Check the [docs](http://pseudoimport-html.m3c.space/docs).

Check the [tests](http://pseudoimport-html.m3c.space/test).

Feel free to import HTML content using

```html
<div class="mdl-fragment" src="an_URI.html"></div>
```

If the fetched content should be in some specific place, then

```html
<div class="mdl-fragment" src="an_URI.html">
  <div class="mdl-fragment__content"></div>
  <div>A custom extra content</div>
</div>
```

## Assumptions

### Fetch an URI

This tool allows to _import_ html code from a ```src = URI``` where that resource is fetched via [fetch](https://fetch.spec.whatwg.org/). This means that [fetch](https://fetch.spec.whatwg.org/) will handle CORS and some other cases.

### Load event dispatching order

While its expected that if a resource has been fetched and parsed successfully then a load event will be fire, this tool fetches and parses all the fragments and then will fire the load events in order of appearance. E.g:

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

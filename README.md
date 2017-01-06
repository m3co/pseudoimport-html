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

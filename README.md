# pseudoImport for HTML

Yeah yeah! I know! I'm using ```innerHTML = response``` in order to import an external code from a given __URL__

So, feel free to try this fake version of ```<link rel="import">```

## How to?
```
<script src="bower_components/customevent-polyfill/customevent-polyfill.min.js"></script>
<script src="bower_components/es6-promise/es6-promise.min.js"></script>
<script src="bower_components/fetch/fetch.js"></script>
<script src="bower_components/pseudoimport-html/pseudoimport-html.js" defer></script>
```

Notice that ```pseudoimport-html.js``` is being loaded with ```defer``` flag.
```customevent-polyfill```, ```es6-promise```, ```fetch``` scripts are optional.

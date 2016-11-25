# pseudoImport for HTML

Yeah yeah! I know! I'm using ```innerHTML = response``` in order to import an external code from a given __URL__

So, feel free to try this fake version of ```<link rel="import">```

Do you want to see in action? Check the [demo](http://pseudoimport-html.m3c.space/demo).

Do you want to see if everything is ok? Check the [tests](http://pseudoimport-html.m3c.space/test).


## How to?
```
<script src="bower_components/customevent-polyfill/customevent-polyfill.min.js"></script>
<script src="bower_components/promise-polyfill/promise.min.js"></script>
<script src="bower_components/fetch/fetch.js"></script>
<script src="bower_components/pseudoimport-html/pseudoimport-html.js" defer></script>
```

Notice that ```pseudoimport-html.js``` is being loaded with ```defer``` flag.
```customevent-polyfill```, ```promise-polyfill```, ```fetch``` scripts are optional.

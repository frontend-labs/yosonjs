yOSONJS
=======

A Sandbox library in JavaScript for manage modular scripts

[![Build Status](https://secure.travis-ci.org/yosonjs/yosonjs.png)](https://travis-ci.org/yosonjs/yosonjs)

A little example
================

1. Insert in your html file or proyect the js called yoson.js o the minified version

2. Then Create a Module

```javascript
yOSON.AppCore.addModule('nombre-modulo', function(){
    return {
        init: function(){
            //some code
        }
    }
});
```
3. And run the module
```javascript
yOSON.AppCore.runModule('nombre-modulo');
```

4. Be fun.

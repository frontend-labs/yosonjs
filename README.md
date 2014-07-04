yoson
=======

A Sandbox library in JavaScript for manage modular scripts

[![Build Status](https://secure.travis-ci.org/yosonjs/yosonjs.png)](https://travis-ci.org/yosonjs/yosonjs)

how to run
=========

1. Insert in your html file or proyect the build js called yoson.js o the version minified

2. You can add and run modules like this

2.1 Adding a module to manager by yOSON

```javascript
yOSON.AppCore.addModule('mi-module', function(){
    return {
        init: function(){
            //some code
        }
    }
});
```
2.2 Running the module

```javascript
yOSON.AppCore.runModule('mi-module');
```

3. Comming soon how to use the components of yoson

yOSONJS
=======

A Sandbox library in JavaScript for manage modular scripts

[![Build Status](https://secure.travis-ci.org/yosonjs/yosonjs.png)](https://travis-ci.org/yosonjs/yosonjs)

A little example
================
Insert in your html file or proyect the js called yoson.js o the minified version.

Then Create a Module
```javascript
yOSON.AppCore.addModule('nombre-modulo', function(){
    return {
        init: function(){
            //some code
        }
    }
});
```
And Run the module
```javascript
yOSON.AppCore.runModule('nombre-modulo');
```

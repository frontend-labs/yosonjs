yOSONJS
=======

A Sandbox library in JavaScript for manage modular scripts

[![Build Status](https://secure.travis-ci.org/frontend-labs/yosonjs.png)](https://travis-ci.org/frontend-labs/yosonjs)
[![Coverage Status](https://img.shields.io/coveralls/andru255/yosonjs.svg)](https://coveralls.io/r/andru255/yosonjs?branch=master)

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

yoson
=======

A Sandbox library in JavaScript for manage modular scripts


how to run
=========

1. Insert in your html file or proyect the build js called yoson.js o the version minified

2. You can add and run modules like this

2.1 Adding a module to manager by yOSON
yOSON.AppCore.addModule('mi-module', function(){
    return {
        init: function(){
            //some code
        }
    }
});

2.2 Running the module
yOSON.AppCore.runModule('mi-module');

3. Comming soon how to use the components of yoson

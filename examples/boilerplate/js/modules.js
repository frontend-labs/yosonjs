/**
Hello, this is the example of declare a module in yOSON
@main my-first-module
@author @frontend-labs
*/
yOSON.AppCore.addModule("my-first-module", function(){
    var welcome = function(){
        document.body.innerHTML = "Welcome to yOSON";
    };
    return {
        init: function(){
            welcome();
        }
    }
});


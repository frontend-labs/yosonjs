//Using the modular manager component
var objModularManager = new yOSON.Components.ModularManager();

objModularManager.addModule("moduleA", function(){
    var init = function(){
        console.log("hellooooooooooooo I'm in the module manager comp!!");
    };
    return {
        init: init
    }
});
objModularManager.runModule("moduleA");

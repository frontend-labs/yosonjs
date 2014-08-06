//===========
var objModularA = new Modular();
//create a module
objModularA.create(function(){
    var init = function(){
        console.log("hello I'm moduleA!!");
    };
    return {
        init: init
    }
});

var objModularB = new Modular({
    methodInside: "ey!"
});

objModularB.create(function(Sb){
    var init = function(){
        console.log("hello I'm moduleB!!", Sb.methodInside);
    };
    return {
        init: init
    }
});

var objDontValidate = new Modular();
objDontValidate.create(function(){
    return {
        init: function(){
            log(tmp);
        }
    }
});

objModularA.start();
objModularB.start();

var objModularManager = new ModularManager();

objModularManager.addModule("moduleA", function(){
    var init = function(){
        console.log("hellooooooooooooo I'm in the module manager comp!!");
    };
    return {
        init: init
    }
});

objModularManager.runModule("moduleA");
//objModular.addModule('moduleC', function(Sb){
    //var init = function(){
        //console.log("hello I'm moduleC!!");
    //};
    //return {
        //init: init
    //}
//});

//objModular.addModule('moduleD', function(Sb){
    //var init = function(){
        //console.log("hello I'm moduleD!!");
    //};
    //return {
        //init: init
    //}
//});
//start a module
//objModular.runModule('moduleA');
//objModular.runModule('moduleB');
//objModular.runModules([ 'moduleC', 'moduleD']);

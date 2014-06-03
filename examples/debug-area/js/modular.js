//===========
var objModular = new yOSON.modular();
//define the modules
objModular.addModule('moduleA', function(){
    var init = function(){
        console.log("hello I'm moduleA!!");
    };
    return {
        init: init
    }
});

objModular.addModule('moduleB', function(Sb){
    var init = function(){
        console.log("hello I'm moduleB!!");
    };
    return {
        init: init
    }
});

objModular.addModule('moduleC', function(Sb){
    var init = function(){
        console.log("hello I'm moduleC!!");
    };
    return {
        init: init
    }
});

objModular.addModule('moduleD', function(Sb){
    var init = function(){
        console.log("hello I'm moduleD!!");
    };
    return {
        init: init
    }
});
//run the module
objModular.runModule('moduleA');
objModular.runModule('moduleB');
objModular.runModules([ 'moduleC', 'moduleD']);

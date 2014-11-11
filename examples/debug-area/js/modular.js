var Modular = yOSON.Components.Modular;
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

//define the modules
yOSON.AppCore.addModule('moduleA', function(Sb){
    var init = function(){
        log("hello I'm moduleA!!");
        log("hello!! I'm a dependence in A", $);
    },
    suscribeFn = function(){
        log("Hello Im a suscribeFn from moduleA");
    };
    return {
        init: init
    }
}, ['http://code.jquery.com/jquery-1.11.0.min.js']);
yOSON.AppCore.addModule('moduleB', function(Sb){
    var init = function(){
        log("hello I'm moduleB!!");
        //log("hello!! I'm a dependence in B", $);
        publishFn();
    },
    publishFn = function(){
        Sb.trigger('suscribeFn');
    };
    return {
        init: init
    }
}, ['http://code.jquery.com/jquery-1.11.0.min.js']);
//run the module
yOSON.AppCore.runModule('moduleA');
yOSON.AppCore.runModule('moduleB');

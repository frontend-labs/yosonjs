//define the modules
yOSON.AppCore.addModule('moduleA', function(Sb){
    var init = function(){
        log("hello I'm moduleA!!");
        Sb.events(['suscribeFn'], suscribeFn, this);
    },
    suscribeFn = function(){
        log("Hello Im a suscribeFn from moduleA");
    };
    return {
        init: init
    }
});
yOSON.AppCore.addModule('moduleB', function(Sb){
    var init = function(){
        log("hello I'm moduleB!!");
        publishFn();
    },
    publishFn = function(){
        Sb.trigger('suscribeFn');
    };
    return {
        init: init
    }
});
//run the module
yOSON.AppCore.runModule('moduleA');
yOSON.AppCore.runModule('moduleB');

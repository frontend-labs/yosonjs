//===========
var objPubSub = new yOSON.comunicator();
//define the modules
yOSON.AppCore.addModule('moduleA', function(Sb){
    var init = function(){
        log("hello I'm moduleA!!");
        objPubSub.subscribe(['suscribeFnForYosonComunicator'], suscribeFnForYosonComunicator , this);
        Sb.events(['suscribeFn'], suscribeFn, this);
    },
    suscribeFnForYosonComunicator = function(){
        log("Hello Im a suscribeFn I travel with YosonComunicator :D");
    };
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
        objPubSub.publish('suscribeFnForYosonComunicator');
    };
    return {
        init: init
    }
});

//run the module
yOSON.AppCore.runModule('moduleA');
yOSON.AppCore.runModule('moduleB');

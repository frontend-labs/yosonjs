define([
    "yoson",
    "../../src/comps/single-promise.js",
    "../../src/comps/modular.js",
    "../../src/comps/modular-monitor.js"
], function(yOSON, SinglePromise, Modular, ModularMonitor){

    var ModularManager = function(){
        this.modules = {};
        this.runningModules = {};
        this.entityBridge = {};
        this.alreadyAllModulesBeRunning = false;
        this.syncModules = [];
        this.objMonitor = new ModularMonitor();
    };

    //receive one method for the entity comunicator on modules
    ModularManager.prototype.addMethodToBrigde = function(methodName, methodSelf){
        this.entityBridge[methodName] = methodSelf;
    };

    //adding a module
    ModularManager.prototype.addModule = function(moduleName, moduleDefinition){
        var modules = this.modules;
        if(!this.getModule(moduleName)){
            modules[moduleName] = new Modular(this.entityBridge);
            modules[moduleName].create(moduleDefinition);
        }
    };

    //return the module from the collection of modules
    ModularManager.prototype.getModule = function(moduleName){
        return this.modules[moduleName];
    };

    //running the module
    ModularManager.prototype.runModule = function(moduleName, optionalParameters){
        var module = this.getModule(moduleName);
        if(module){
            module.start(optionalParameters);
        }
    };

    ModularManager.prototype.whenModuleHaveStatus = function(moduleName, statusName, whenHaveStatus){
        var module = this.getModule(moduleName);
        if(module.getStatusModule() === statusName){
            whenHaveStatus.call(this, moduleName, module);
        }
    };

    ModularManager.prototype.allModulesRunning = function(onNotFinished, onFinished){
        var that = this,
            objMonitor = that.objMonitor;
        if(this.alreadyAllModulesBeRunning){
            onFinished.call(that);
        } else {
            var checkModulesRunning = setInterval(function(){
                if(objMonitor.getTotalModulesToStart() > 0){
                    if( objMonitor.getTotalModulesToStart() === objMonitor.getTotalModulesRunning()){
                        onFinished.call(that);
                        this.alreadyAllModulesBeRunning = true;
                        clearInterval(checkModulesRunning);
                    } else {
                        onNotFinished.call(that);
                    }
                } else {
                    onFinished.call(that);
                    this.alreadyAllModulesBeRunning = true;
                    clearInterval(checkModulesRunning);
                }
            }, 200);
        }
    };

    yOSON.Components.ModularManager = ModularManager;
    return ModularManager;
});

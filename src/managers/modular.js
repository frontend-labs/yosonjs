define([
    "yoson",
    "../../src/comps/modular.js"
], function(yOSON, Modular){

    var ModularManager = function(){
        this.modules = {};
        this.runningModules = {};
        this.entityBridge = {};
        this.alreadyAllModulesBeRunning = false;
        this.moduleEvents = {};
    };

    // Receives a method for the entity communicator on modules
    ModularManager.prototype.addMethodToBrigde = function(methodName, methodSelf){
        this.entityBridge[methodName] = methodSelf;
    };

    //
    ModularManager.prototype.listenEvent = function(moduleName, eventName, eventSelf){
        this.moduleEvents[moduleName] = {};
        this.moduleEvents[moduleName][eventName] = eventSelf;
    };

    // Adds a module
    ModularManager.prototype.addModule = function(moduleName, moduleDefinition){
        var modules = this.modules;
        if(!this.getModule(moduleName)){
            modules[moduleName] = new Modular(this.entityBridge, this.moduleEvents[moduleName]);
            modules[moduleName].create(moduleDefinition);
        }
    };

    // Returns the module from the collection of modules
    ModularManager.prototype.getModule = function(moduleName){
        return this.modules[moduleName];
    };

    // Runs the module
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

    yOSON.Components.ModularManager = ModularManager;
    return ModularManager;
});

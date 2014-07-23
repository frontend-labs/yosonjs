define([
    "yoson",
    "../../src/comps/modular.js"
], function(yOSON, Modular){

    var ModularManager = function(){
        this.modules = {};
        this.runningModules = {};
        this.entityBridge = {};
        this.alreadyAllModulesBeRunning = null;
    };

    //receive one method for the entity comunicator on modules
    ModularManager.prototype.addMethodToBrigde = function(methodName, methodSelf){
        this.entityBridge[methodName] = methodSelf;
    };

    //adding a module
    ModularManager.prototype.addModule = function(moduleName, moduleDefinition){
        var modules = this.modules;
        if(!this.existsModule(moduleName)){
            modules[moduleName] = new Modular(this.entityBridge);
            modules[moduleName].create(moduleDefinition);
        }
    };

    //verifying the existence of one module by name
    ModularManager.prototype.existsModule = function(moduleName){
        var founded = false;
        if(this.getModule(moduleName)){
            founded = true;
        }
        return founded;
    };

    //return the module from the collection of modules
    ModularManager.prototype.getModule = function(moduleName){
        return this.modules[moduleName];
    };

    //running the module
    ModularManager.prototype.runModule = function(moduleName, optionalParameters){
        var module = this.getModule(moduleName);
        if(this.existsModule(moduleName)){
            module.start(optionalParameters);
        }
    };

    //running one list of modules
    ModularManager.prototype.runModules = function(moduleNames){
        //its necesary the parameter moduleNames must be a type Array
        if(moduleNames instanceof Array){
            for(var moduleName in moduleNames){
                this.runModule(moduleNames[moduleNames]);
            }
        }
    };

    ModularManager.prototype.eachModules = function(eachModule){
        for(var moduleName in this.modules){
            eachModule.call(this, moduleName);
        }
    };


    ModularManager.prototype.getTotalModulesRunning = function(){
        var total = 0;
        this.eachModules(function(moduleName){
            if(moduleName.getStatus() === "run"){
                total++;
            }
        });
        return total;
    };

    ModularManager.prototype.getTotalModulesStarted = function(){
        var total = 0;
        this.eachModules(function(moduleName){
            if(moduleName.getStatus() === "start"){
                total++;
            }
        });
        return total + this.getTotalModulesRunning();
    };

    ModularManager.prototype.allModulesRunning = function(onNotFinished, onFinished){
        var that = this;
        if(this.alreadyAllModulesBeRunning){
            onFinished.call(that);
        } else {
            var checkModulesRunning = setInterval(function(){
                if(that.getTotalModulesStarted() > 0){
                    if( that.getTotalModulesStarted() == that.getTotalModulesRunning()){
                        this.alreadyAllModulesBeRunning = true;
                        onFinished.call(that);
                        clearInterval(checkModulesRunning);
                    } else {
                        onNotFinished.call(that);
                    }
                } else {
                    this.alreadyAllModulesBeRunning = true;
                    onFinished.call(that);
                    clearInterval(checkModulesRunning);
                }
            }, 200);
        }
    };

    yOSON.Components.ModularManager = ModularManager;
    return ModularManager;
});

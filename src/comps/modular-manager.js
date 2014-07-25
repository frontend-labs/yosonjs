define([
    "yoson",
    "../../src/comps/modular.js"
], function(yOSON, Modular){

    var ModularManager = function(){
        this.modules = {};
        this.runningModules = {};
        this.entityBridge = {};
        this.alreadyAllModulesBeRunning = null;
        this.syncModules = [];
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
            module.setStatusModule("start");
            this.setDataModule(moduleName,optionalParameters);
            this.runQueueModules();
        }
    };

    ModularManager.prototype.syncModule = function(moduleName){
        this.syncModules.push(moduleName);
    };

    ModularManager.prototype.getDataModule = function(moduleName){
        return this.modules[moduleName].data;
    };

    ModularManager.prototype.setDataModule = function(moduleName, data){
        this.modules[moduleName].data = data;
    };

    ModularManager.prototype.runQueueModules = function(){
        var that = this,
            index = 0,
            runModules = function(list){
                if(list.length > index){
                    that.whenModuleHaveStatus(list[index], "start", function(moduleName, moduleSelf){
                        var data = that.getDataModule(moduleName);
                        moduleSelf.start(data);
                    });
                    that.whenModuleHaveStatus(list[index], "run", function(){
                        index++;
                        runModules(list);
                    });
                }
            };
        runModules(that.syncModules);
    };

    ModularManager.prototype.whenModuleHaveStatus = function(moduleName, statusName, whenHaveStatus){
        var module = this.getModule(moduleName),
            queryStatus = setInterval(function(){
                if(module.getStatusModule() === statusName){
                    whenHaveStatus.call(this, moduleName, module);
                    clearInterval(queryStatus);
                }
            }, 20);
    };

    ModularManager.prototype.eachModules = function(eachModule){
        for(var moduleName in this.modules){
            eachModule.call(this, moduleName);
        }
    };

    ModularManager.prototype.getTotalModulesByStatus = function(statusName){
        var total = 0;
        this.eachModules(function(moduleName){
            if(moduleName.getStatusModule() === statusName){
                total++;
            }
        });
        return total;
    };

    ModularManager.prototype.getTotalModulesRunning = function(){
        return this.getTotalModulesByStatus("run");
    };

    ModularManager.prototype.getTotalModulesStarted = function(){
        return this.getTotalModulesByStatus("start") + this.getTotalModulesRunning();
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

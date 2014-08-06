define([
    "yoson",
    "../../src/comps/modular.js",
    "../../src/comps/modular-monitor.js"
], function(yOSON, Modular, ModularMonitor){

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
        if(this.getModule(moduleName)){
            module.setStatusModule("start");
            this.dataModule(moduleName,optionalParameters);
            this.runQueueModules();
        }
    };

    ModularManager.prototype.syncModule = function(moduleName){
        var that = this;
        var module = that.getModule(moduleName);
        that.objMonitor.updateStatus(moduleName, "toStart");
        that.syncModules.push(moduleName);
    };

    ModularManager.prototype.dataModule = function(moduleName, data){
        if(typeof data !== "undefined"){
            this.modules[moduleName].data = data;
        }
        return this.modules[moduleName].data;
    };

    ModularManager.prototype.runQueueModules = function(){
        var that = this,
            index = 0,
            runModules = function(list){
                if(list.length > index){
                    var module = list[index];
                    that.whenModuleHaveStatus(module, "start", function(moduleName, moduleSelf){
                        that.objMonitor.updateStatus(moduleName, "run");
                        var data = that.dataModule(moduleName);
                        moduleSelf.start(data);
                    });
                    that.whenModuleHaveStatus(module, "run", function(){
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

define([
    "yoson"
], function(yOSON){
    //clase with pattern factory with the idea of create modules
    var Modular = function(){
        this.modules = {};
        this.runningModules = {};
        this.skeletonModule = {};
        this.entityBridge = {};
        this.alreadyAllModulesBeRunning = null;
    };

    //receive one method for the entity comunicator on modules
    Modular.prototype.addMethodToBrigde = function(methodName, methodSelf){
        this.entityBridge[methodName] = methodSelf;
    };

    //adding a module
    Modular.prototype.addModule = function(moduleName, moduleDefinition){
        if(!this.existsModule(moduleName)){
            this.modules[moduleName] = this.createDefinitionModule(moduleName, moduleDefinition);
        }
    };

    //return the complete definition of an module with the components
    Modular.prototype.getModuleDefinition = function(moduleName){
        var that = this,
            module = that.getModule(moduleName),
            moduleInstance = module.moduleDefinition(that.entityBridge);

        for(var propertyName in moduleInstance){
            var method = moduleInstance[propertyName];
            moduleInstance[propertyName] = that.addFunctionToDefinitionModule(moduleName, propertyName, method);
        }

        return moduleInstance;
    };

    //create a method taking a name and function self
    Modular.prototype.addFunctionToDefinitionModule = function(moduleName, functionName, functionSelf){
        if(typeof functionSelf === "function"){
            return function(){
                try {
                    return functionSelf.apply(this, arguments);
                } catch( ex ){
                    console.log("Modulo:"+ moduleName + "." + functionName + "(): " + ex.message);
                }
            };
        } else {
            return functionSelf;
        }
    };

    //verifying the existence of one module by name
    Modular.prototype.existsModule = function(moduleName){
        var founded = false;
        if(this.getModule(moduleName)){
            founded = true;
        }
        return founded;
    };

    //return the module from the collection of modules
    Modular.prototype.getModule = function(moduleName){
        return this.modules[moduleName];
    };

    // return the skeleton for the creation of module
    //creator of the definition ready for merge with the components
    Modular.prototype.createDefinitionModule = function(moduleName, moduleDefinition){
        this.skeletonModule[moduleName] = {
            'moduleDefinition': moduleDefinition
        };
        return this.skeletonModule[moduleName];
    };

    //running the module
    Modular.prototype.runModule = function(moduleName, optionalParameters){
        var parameters = this.dealParamaterOfModule(optionalParameters);
        parameters.moduleName = moduleName;
        if(this.existsModule(moduleName)){
            this.runInitMethodOfModule(moduleName, parameters);
        }
    };

    Modular.prototype.dealParamaterOfModule = function(parametersOfModule){
        var newParameters = {};
        if(typeof parametersOfModule !== "undefined"){
            newParameters = parametersOfModule;
        }
        return newParameters;
    };

    Modular.prototype.runInitMethodOfModule = function(moduleName, parameters){
        var moduleDefinition = this.getModuleDefinition(moduleName);
        if(typeof moduleDefinition.init === "function"){
            this.setStatusModule(moduleName, "run");
            moduleDefinition.init(parameters);
        }
    };
    //running one list of modules
    Modular.prototype.runModules = function(moduleNames){
        //its necesary the parameter moduleNames must be a type Array
        if(moduleNames instanceof Array){
            for(var moduleName in moduleNames){
                this.runModule(moduleNames[moduleNames]);
            }
        }
    };

    Modular.prototype.setStatusModule = function(moduleName, statusName){
        this.modules[moduleName].status = statusName;
    };

    Modular.prototype.getStatusModule = function(moduleName){
        return this.modules[moduleName].status;
    };

    Modular.prototype.eachModules = function(eachModule){
        for(var moduleName in this.modules){
            eachModule.call(this, moduleName);
        }
    };

    Modular.prototype.getTotalModulesRunning = function(){
        var total = 0;
        this.eachModules(function(moduleName){
            if(this.getStatusModule(moduleName) === "run"){
                total++;
            }
        });
        return total;
    };

    Modular.prototype.getTotalModulesStarted = function(){
        var total = 0;
        this.eachModules(function(moduleName){
            if(this.getStatusModule(moduleName) === "start"){
                total++;
            }
        });
        return total + this.getTotalModulesRunning();
    };

    Modular.prototype.allModulesRunning = function(onNotFinished, onFinished){
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

    yOSON.Components.Modular = Modular;
    return Modular;
});

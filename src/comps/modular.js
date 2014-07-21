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
        if(this.existsModule(moduleName)){
            //mensaje ya existe modulo
        } else {
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
            this.runningModule(moduleName);
            moduleDefinition.init(parameters);
        }
    };
    //running one list of modules
    Modular.prototype.runModules = function(moduleNames){
        var that = this;
        //its necesary the parameter moduleNames must be a type Array
        if(moduleNames instanceof Array){
            for(var index = 0; index < moduleNames.length; index++){
                var moduleName = moduleNames[index];
                that.runModule(moduleName);
            }
        }
    };

    Modular.prototype.runningModule = function(moduleName){
        this.modules[moduleName].running = true;
    };

    Modular.prototype.moduleIsRunning = function(moduleName){
        return this.modules[moduleName].running;
    };

    Modular.prototype.setStatusModule = function(moduleName, statusName){
        this.modules[moduleName].status = statusName;
    };

    Modular.prototype.getStatusModule = function(moduleName){
        return this.modules[moduleName].status;
    };

    Modular.prototype.allModulesRunning = function(onNotFinished, onFinished){
        var that = this;
        if(this.alreadyAllModulesBeRunning){
            onFinished.call(that);
        } else {
            var checkModulesRunning = setInterval(function(){
                var startedModules = 0,
                    runningModules = 0;

                for(var moduleName in that.modules){
                    if(that.moduleIsRunning(moduleName)){
                        runningModules++;
                    }
                    if(that.getStatusModule(moduleName) == "start"){
                        startedModules++;
                    }
                }

                if(startedModules > 0){
                    if( startedModules == runningModules){
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

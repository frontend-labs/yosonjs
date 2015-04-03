define([
    "yoson"
], function(yOSON){

    //Class with pattern factory with the idea of creating modules
    var Modular = function(entityBridge, events){
        this.entityBridge = entityBridge;
        this.moduleInstance = "";
        this.status = "stop";
        this.events = {
            "onError": function(ex, functionName){
                yOSON.Log(functionName + "(): " + ex.message);
            }
        };
        if(typeof events !== "undefined"){
            this.events = events;
        }
    };

    Modular.prototype.moduleCallbackEvent = function(){
        var arrayOfArguments = [].slice.call(arguments, 0);
        var eventName = arrayOfArguments[0];
        var eventSelf = this.events[eventName];
        var paramsToPass = [];
        if(arrayOfArguments.length > 1){
            paramsToPass = arrayOfArguments.slice(1);
        }
        if(typeof eventSelf === "function"){
            eventSelf.apply(this, paramsToPass);
        }
    };

    //Creates an empty context of module
    Modular.prototype.create = function(moduleDefinition){
        this.moduleDefinition = moduleDefinition;
        this.moduleCallbackEvent("onCreated");
    };

    //Creates a definition of module self
    Modular.prototype.generateModularDefinition = function(functionName, functionSelf){
        var that = this;
        if(typeof functionSelf === "function"){
            return function(){
                try {
                    return functionSelf.apply(this, arguments);
                } catch( ex ){
                    that.moduleCallbackEvent("onError", ex, functionName);
                }
            };
        } else {
            return functionSelf;
        }
    };

    //Starts a simple module
    Modular.prototype.start = function(parameters){
        var params = this.dealParamaterOfModule(parameters);
        var moduleInstance = this.moduleDefinition(this.entityBridge);
        for(var propertyName in moduleInstance){
            var method = moduleInstance[propertyName];
            moduleInstance[propertyName] = this.generateModularDefinition(propertyName, method);
        }
        this.moduleInstance = moduleInstance;
        this.moduleCallbackEvent("onRun", moduleInstance);
        this.runInitMethodOfModule(params);
    };

    Modular.prototype.dealParamaterOfModule = function(parametersOfModule){
        var newParameters = {};
        if(typeof parametersOfModule !== "undefined"){
            newParameters = parametersOfModule;
        }
        return newParameters;
    };

    Modular.prototype.runInitMethodOfModule = function(parameters){
        var moduleDefinition = this.moduleInstance;
        if(typeof moduleDefinition.init === "function"){
            this.setStatusModule("run");
            moduleDefinition.init(parameters);
        }
    };

    Modular.prototype.setStatusModule = function(statusName){
        this.status = statusName;
    };

    Modular.prototype.getStatusModule = function(){
        return this.status;
    };

    yOSON.Components.Modular = Modular;
    return Modular;
});

define(function(){
    var LoaderSchema = function(schema){
        this.modules = schema.modules;
        this.modules.allModules = function(){};
        this.modules.byDefault = function(){};

        this.controllers = {
            byDefault: function(){

            }
        };
        this.actions = {
            byDefault: function(){

            }
        };
    };

    LoaderSchema.prototype.appendMethod = function(nodeObject, methodName, methodSelf){
        if(typeof nodeObject[methodName] !== "function"){
            nodeObject[methodName] = methodSelf;
        }
    };

    LoaderSchema.prototype.overrideModuleLevel = function(moduleName, moduleNode){
        this.appendMethod(moduleNode, 'allControllers', function(){});
        this.modules[moduleName] = moduleNode;
        this.modules = this.modules;
    };

    LoaderSchema.prototype.setControllers = function(moduleName){
        this.controllers = this.modules[moduleName].controllers;
    };

    LoaderSchema.prototype.overrideControllerLevel = function(controllerName, controllerNode){
        this.appendMethod(controllerNode, 'allActions', function(){});
        this.controllers[controllerName] = controllerNode;
    };

    LoaderSchema.prototype.setActions = function(controllerName){
        this.actions = this.controllers[controllerName].actions;
    };

    LoaderSchema.prototype.getLevel =function(levelName){
        return this[levelName];
    };

    LoaderSchema.prototype.getNodeByLevel =function(levelName, nodeName){
        return this[levelName][nodeName];
    };

    LoaderSchema.prototype.getDefaultMethodInLevel = function(levelName){
        this[levelName].byDefault();
    };

    return LoaderSchema;
});

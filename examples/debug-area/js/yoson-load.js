//Clase que se orienta al manejo de comunicacion entre modulos
    var LoaderSchema = function(schema){
        this.modules = schema.modules;
        this.modules["allModules"] = function(){};
        this.modules["byDefault"] = function(){};

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

    LoaderSchema.prototype.runActionLevel = function(actionName){
        var action = this.actions[actionName];
        if(typeof  action === "function"){
            action();
        }
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
    var Loader = function(schema){
        this.schema = schema;
        this.objSchema = new LoaderSchema(schema);
    };

    Loader.prototype.init = function(moduleName, controllerName, actionName){

        var moduleNameToQuery = this.checkLevelName(moduleName);
        var controllerNameToQuery = this.checkLevelName(controllerName);
        var actionNameToQuery = this.checkLevelName(actionName);
        var objSchema = this.objSchema;

        this.runModuleLevel(moduleNameToQuery, function(moduleFound){
            moduleFound.allControllers();
            this.runControllerLevel(controllerNameToQuery, function(controllerFound){
                controllerFound.allActions();
                this.runActionLevel(actionNameToQuery, function(actionFound){
                    actionFound();
                });
            });
        });
    };

    Loader.prototype.checkLevelName = function(levelName){
        var result = "";
        if(typeof levelName !== "undefined"){
            result = levelName;
        }
        return result;
    };

    Loader.prototype.runModuleLevel = function(moduleName, onModuleFound){
        var objSchema = this.objSchema;
        var moduleLevel = objSchema.getLevel('modules');
        moduleLevel.allModules();

        if(moduleLevel[moduleName]){
            var module = moduleLevel[moduleName];

            objSchema.overrideModuleLevel(moduleName, module);
            objSchema.setControllers(moduleName);

            onModuleFound.call(this, module);
        } else {
            objSchema.getDefaultMethodInLevel('modules');
        }
    };

    Loader.prototype.runControllerLevel = function(controllerName, onControllerFound){
        var objSchema = this.objSchema,
            controllerLevel = objSchema.getLevel('controllers');

        if(controllerLevel[controllerName]){
            var controller = controllerLevel[controllerName];
            objSchema.setActions(controllerName);

            onControllerFound.call(this, controller);
        } else {
            objSchema.getDefaultMethodInLevel('controllers');
        }
    };

    Loader.prototype.runActionLevel = function(actionName, onActionFound){
        var objSchema = this.objSchema,
            actionLevel = objSchema.getLevel('actions');

        console.log(actionLevel);
        if(actionLevel[actionName]){
            var action = actionLevel[actionName];
            onActionFound.call(this, action);
        } else {
            objSchema.getDefaultMethodInLevel('actions');
        }
    };

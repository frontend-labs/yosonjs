//Clase que se orienta al manejo de comunicacion entre modulos
Loader = function(schema){
    this.schema = schema;
    this.modules = this.schema.modules;
    this.controllers = {};
    this.actions = {};
};

Loader.prototype.init = function(moduleName, controllerName, actionName){

    var moduleNameToQuery = this.checkLevelName(moduleName);
    var controllerNameToQuery = this.checkLevelName(controllerName);
    var actionNameToQuery = this.checkLevelName(actionName);

    this.runModuleLevel(moduleNameToQuery, function(moduleFound){
        this.runControllerLevel(moduleFound, controllerNameToQuery , function(controllerFound){
            this.runActionLevel(controllerFound, actionNameToQuery, function(actionFound){
                actionFound();
            }, function(controllerSelf){
                this.getByDefaultInActionLevel(controllerSelf);
            });
        }, function(moduleSelf){
            this.getByDefaultInControllerLevel(moduleSelf);
        });
    }, function(){
        this.getByDefaultInModuleLevel();
    });
};

Loader.prototype.checkLevelName = function(levelName){
    var result = "";
    if(typeof levelName === "undefined"){

    } else {
        result = levelName;
    }
    return result;
};

Loader.prototype.getModuleByName = function(moduleName){
    return this.modules[moduleName];
};

Loader.prototype.existsModuleByName = function(moduleName){
    var result = false;
    if(this.getModuleByName(moduleName)){
        result = true;
    }
    return result;
};

Loader.prototype.getByDefaultInModuleLevel = function(){
    if(typeof this.modules.byDefault === "function"){
        this.modules.byDefault();
    } else {
        throw new Error("The level module dont have the default module or not is a function");
    }
};

Loader.prototype.runModuleLevel = function(moduleName, onModuleFound, onModuleNotFound){
    this.schema.modules.allModules();
    if(this.existsModuleByName(moduleName)){
        var module = this.getModuleByName(moduleName);
        onModuleFound.call(this, module);
    } else {
        onModuleNotFound.call(this);
    }
};

Loader.prototype.getControllerByNameInModule = function(controllerName, moduleSelf){
    return moduleSelf.controllers[controllerName];
};

Loader.prototype.existsControllerByName = function(module, controllerName){
    var result = false;
    if(this.getControllerByNameInModule(controllerName, module)){
        result = true;
    }
    return result;
};

Loader.prototype.getByDefaultInControllerLevel = function(moduleSelf){
    if(typeof moduleSelf.controllers.byDefault === "function"){
        moduleSelf.controllers.byDefault();
    } else {
        throw new Error("The level controller don't have the default controller or not is a function");
    }
};

Loader.prototype.runControllerLevel = function(moduleSelf, controllerName, onControllerFound, onControllerNotFound){
    moduleSelf.allControllers();
    if(this.existsControllerByName(moduleSelf, controllerName)){
        var controller = this.getControllerByNameInModule(controllerName, moduleSelf);
        onControllerFound.call(this, controller);
    } else {
        onControllerNotFound.call(this, moduleSelf);
    }
};

Loader.prototype.getActionByNameInController = function(actionName, controller){
    return controller.actions[actionName];
};

Loader.prototype.existsActionInController = function(controller, actionName){
    var result = false;
    if(this.getActionByNameInController(actionName, controller)){
        result = true;
    }
    return result;
};

Loader.prototype.getByDefaultInActionLevel = function(controllerSelf){
    if(typeof controllerSelf.actions.byDefault === "function"){
        controllerSelf.actions.byDefault();
    } else {
        throw new Error("The level action don't have the default controller or not is a function");
    }
};

Loader.prototype.runActionLevel = function(controllerSelf, actionName, onActionFound, onActionNotFound){
    controllerSelf.allActions();
    if(this.existsActionInController(controllerSelf, actionName)){
        var action = this.getActionByNameInController(actionName, controllerSelf);
        onActionFound.call(this, action);
    } else {
        onActionNotFound.call(this, controllerSelf);
    }
};

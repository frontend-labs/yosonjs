//Clase que se orienta al manejo de comunicacion entre modulos
yOSON.Loader = function(schema){
    this.schema = schema;
    this.modules = this.schema.modules;
    this.controllers = {};
    this.actions = {};
};

yOSON.Loader.prototype.init = function(moduleName, controllerName, actionName){

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

yOSON.Loader.prototype.checkLevelName = function(levelName){
    var result = "";
    if(typeof levelName === "undefined"){

    } else {
        result = levelName;
    }
    return result;
};

yOSON.Loader.prototype.getModuleByName = function(moduleName){
    return this.modules[moduleName];
};

yOSON.Loader.prototype.existsModuleByName = function(moduleName){
    var result = false;
    if(this.getModuleByName(moduleName)){
        result = true;
    }
    return result;
};

yOSON.Loader.prototype.getByDefaultInModuleLevel = function(){
    if(typeof this.modules.byDefault === "function"){
        this.modules.byDefault();
    } else {
        throw new Error("The level module dont have the default module or not is a function");
    }
};

yOSON.Loader.prototype.runModuleLevel = function(moduleName, onModuleFound, onModuleNotFound){
    this.schema.modules.allModules();
    if(this.existsModuleByName(moduleName)){
        var module = this.getModuleByName(moduleName);
        onModuleFound.call(this, module);
    } else {
        onModuleNotFound.call(this);
    }
};

yOSON.Loader.prototype.getControllerByNameInModule = function(controllerName, moduleSelf){
    return moduleSelf.controllers[controllerName];
};

yOSON.Loader.prototype.existsControllerByName = function(module, controllerName){
    var result = false;
    if(this.getControllerByNameInModule(controllerName, module)){
        result = true;
    }
    return result;
};

yOSON.Loader.prototype.getByDefaultInControllerLevel = function(moduleSelf){
    if(typeof moduleSelf.controllers.byDefault === "function"){
        moduleSelf.controllers.byDefault();
    } else {
        throw new Error("The level controller don't have the default controller or not is a function");
    }
};

yOSON.Loader.prototype.runControllerLevel = function(moduleSelf, controllerName, onControllerFound, onControllerNotFound){
    moduleSelf.allControllers();
    if(this.existsControllerByName(moduleSelf, controllerName)){
        var controller = this.getControllerByNameInModule(controllerName, moduleSelf);
        onControllerFound.call(this, controller);
    } else {
        onControllerNotFound.call(this, moduleSelf);
    }
};

yOSON.Loader.prototype.getActionByNameInController = function(actionName, controller){
    return controller.actions[actionName];
};

yOSON.Loader.prototype.existsActionInController = function(controller, actionName){
    var result = false;
    if(this.getActionByNameInController(actionName, controller)){
        result = true;
    }
    return result;
};

yOSON.Loader.prototype.getByDefaultInActionLevel = function(controllerSelf){
    if(typeof controllerSelf.actions.byDefault === "function"){
        controllerSelf.actions.byDefault();
    } else {
        throw new Error("The level action don't have the default controller or not is a function");
    }
};

yOSON.Loader.prototype.runActionLevel = function(controllerSelf, actionName, onActionFound, onActionNotFound){
    controllerSelf.allActions();
    if(this.existsActionInController(controllerSelf, actionName)){
        var action = this.getActionByNameInController(actionName, controllerSelf);
        onActionFound.call(this, action);
    } else {
        onActionNotFound.call(this, controllerSelf);
    }
};

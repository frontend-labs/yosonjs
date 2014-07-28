//Clase que maneja la ejecución de modulos depediendo de 3 parametros (Modulo, Controlador, Accion)
define(
    ["yoson",
    "../../src/comps/loader-schema.js"],
    function(yOSON, LoaderSchema){

    var Loader = function(schema){
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

        if(actionLevel[actionName]){
            var action = actionLevel[actionName];
            onActionFound.call(this, action);
        } else {
            objSchema.getDefaultMethodInLevel('actions');
        }
    };

    yOSON.Components.Loader = Loader;

    return Loader;
});

//Clase que se orienta al manejo de comunicacion entre modulos
yOSON.Loader = function(schema){
    this.schema = schema;
    //default keys
    this.moduleKeyName = "modules";
    this.controllerKeyName = "controller";
    this.ActionKeyName = "action";
};

yOSON.Loader.prototype.init = function(moduleName, controllerName, actionName){
    this.runModuleLevel(moduleName, function(){

    }, function(){
        this.schema.modules.byDefault();
    })
};

yOSON.Loader.prototype.getModuleName = function(moduleName){
    return this.schema.modules[moduleName];
};

yOSON.Loader.prototype.existsModuleName = function(moduleName){
    var result = false;
    if(this.getModuleName(moduleName)){
        result = true;
    }
    return result;
};

yOSON.Loader.prototype.runModuleLevel = function(moduleName, onModuleFound, onModuleNotfound){
    this.schema.allModules();
    if(this.existsModuleName(moduleName)){
        var module = this.getModuleName(moduleName);
        onModuleFound.call(this, module);
    } else {
        onModuleNotfound.call(this);
    }
};

yOSON.Loader.prototype.runControllerLevel = function(moduleName, controllerName){

};


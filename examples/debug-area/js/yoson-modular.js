//clase with pattern factory with the idea of create modules
yOSON.modular = function(){
    this.modules = {};
    this.skeletonModule = {};
    this.components = {};
    this.debug = false;
};

//the factory will receive components for create an module
yOSON.modular.prototype.addComponent = function(nameComponent, componentSelf){
    this.components[ nameComponent ] = componentSelf;
};

//adding a module
yOSON.modular.prototype.addModule = function(moduleName, moduleDefinition, dependences){
    var dependencesProperty = [];
    if(this.existsModule(moduleName)){
        //mensaje ya existe modulo
    } else {
        if(typeof dependences === "Array"){
            dependencesProperty = dependences;
        }
        this.modules[moduleName] = this.createDefinitionModule(moduleName, moduleDefinition, dependencesProperty);
    }
};

//return the complete definition of an module with the components
yOSON.modular.prototype.getModuleDefinition = function(moduleName){
    var module = this.getModule(moduleName),
        moduleInstance = module.moduleDefinition(this.components),
        that = this;
    if(!this.debug){
        for(var propertyName in moduleInstance){
            var method = moduleInstance[propertyName];
            if(typeof method === "function"){
                moduleInstance[propertyName] = that.addFunctionToDefinitionModule(propertyName, method);
            }
        }
    }
    return moduleInstance;
};

//create a method taking a name and function self
yOSON.modular.prototype.addFunctionToDefinitionModule = function(functionName, functionSelf){
    return function(){
        try {
            return functionSelf.apply(this, arguments);
        } catch( ex ){
            console.log(ex.message);
        }
    };
};

//verifying the existence of one module by name
yOSON.modular.prototype.existsModule = function(moduleName){
    var founded = false;
    if(this.getModule(moduleName)){
        founded = true;
    }
    return founded;
};

//return the module from the collection of modules
yOSON.modular.prototype.getModule = function(moduleName){
    return this.modules[moduleName];
};

// return the skeleton for the creation of module
//creator of the definition ready for merge with the components
yOSON.modular.prototype.createDefinitionModule = function(moduleName, moduleDefinition, dependences){
    this.skeletonModule[moduleName] = {
        'moduleDefinition': moduleDefinition,
        'dependences': dependences
    };
    return this.skeletonModule[moduleName];
};

//running the module
yOSON.modular.prototype.runModule = function(moduleName, optionalParameter){
    var parameters = {};
    console.log('this.existsModule(moduleName)', moduleName);
    if(this.existsModule(moduleName)){

        if(typeof optionalParameter !== "undefined"){
            parameters = optionalParameter;
        }
        parameters.moduleName = moduleName;

        var moduleDefinition = this.getModuleDefinition(moduleName);

        if(moduleDefinition.hasOwnProperty('init')){
            moduleDefinition.init();
        } else {
            //message modulo dont run
        }
    }
};

//running one list of modules
yOSON.modular.prototype.runModules = function(moduleNames){
    var that = this;
    //its necesary the parameter moduleNames must be a type Array
    if(typeof moduleNames !== "Array"){
        return;
    }

    for(var index = 0; index < moduleNames.length; index++){
        var moduleName = moduleNames[index];
        if(that.existsModule(moduleName)){
            that.runModule(moduleName);
        }
    }
};

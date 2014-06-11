//Creando el manejo de dependencias
//Clase que trata con una url
//Objeto que como objetivo invoca a la dependencia a travez de su url
//y notifica el status del mismo
yOSON.Dependency = function(url){
    this.url = url;
    this.status = "request";
    this.message = "";
};
//realiza el request
yOSON.Dependency.prototype.request = function(){
    console.log('solicitando url', this.url);
    var that = this,
        newScript = document.createElement("script");
    newScript.type = "text/javascript";
    newScript.src = this.url;
    if( newScript.readyState ){
        this.requestIE(newScript);
    } else {
        newScript.onload = function(){
            that.status = "ready";
        }
        newScript.onerror = function(){
            that.onErrorRequest();
        };
    }
    document.getElementsByTagName("head")[0].appendChild(newScript);
};
//en caso sea IExplorer realiza el request
yOSON.Dependency.prototype.requestIE = function(src){
    var that = this;
    src.onreadystatechange = function(){
        if(src.readyState=="loaded" || scr.readyState=="complete"){
          scr.onreadystatechange=null;
          that.status = "ready";
        } else {
            that.onErrorRequest();
        }
    };
};

yOSON.Dependency.prototype.onErrorRequest = function(){
    this.status = "error";
    this.setErrorMessage("No pudo cargarse el script "+ this.url);
};
//retorna el status del request
yOSON.Dependency.prototype.getStatus = function(){
    return this.status;
};

//retorna el mensage de error
yOSON.Dependency.prototype.getErrorMessage = function(){
    return this.message;
};

//retorna el mensage de error
yOSON.Dependency.prototype.setErrorMessage = function(message){
    this.message = message;
};

//clase manager de los objetos Dependency
//Administrador de dependencias
yOSON.DependencyManager = function(){
    this.data = {};
    this.loaded = {};
    this.config = {
        staticHost: "",
        versionUrl: ""
    };
};

yOSON.DependencyManager.prototype.setStaticHost = function(hostName){
    this.config.staticHost = hostName;
};

yOSON.DependencyManager.prototype.setVersionUrl = function(versionNumber){
    this.config.versionUrl = versionNumber;
};

yOSON.DependencyManager.prototype.getVersionUrl = function(){
    var result = "";
    if(this.config.versionUrl != ""){
        result = "?" + this.config.versionUrl;
    }
    return result;
};

yOSON.DependencyManager.prototype.transformUrl = function(url){
    var urlResult = "",
        regularExpresion = /((http?|https):\/\/)(www)?([\w-]+\.\w+)+(\/[\w-]+)+\.\w+/g;
    if(regularExpresion.test(url)){
        urlResult = url;
    } else {
        urlResult = this.config.staticHost + url + this.getVersionUrl();
    }
    return urlResult;
};

//método que crea el id segun la url ingresada
yOSON.DependencyManager.prototype.generateId = function(url){
 return (url.indexOf('//')!=-1)?url.split('//')[1].split('?')[0].replace(/[/.:]/g,'_'):url.split('?')[0].replace(/[/.:]/g,'_');
};

//Adiciona la dependencia a administrar con su url
yOSON.DependencyManager.prototype.addScript = function(url){
    var id = this.generateId( url );
    if(!this.alreadyInCollection(id)){
        this.data[id] = new yOSON.Dependency(url);
        //Hago la consulta del script
        this.data[id].request();
    } else {
        console.log('dependency in cache', this.data[id]);
    }
};
//Metodo que indica que está lista la dependencia
yOSON.DependencyManager.prototype.ready = function(urlList, onReady){
        var index = 0,
            that = this;
        var queueQuering = function(list){
            var urlToQuery = that.transformUrl(list[index]);
            if(index < list.length){
                that.addScript(urlToQuery);
                that.avaliable(urlToQuery, function(){
                    index++;
                    queueQuering(urlList);
                });
            } else {
                onReady.apply(that);
            }
        };
        queueQuering(urlList);
};
//Método que verifica si está lista el script agregado
yOSON.DependencyManager.prototype.avaliable = function(url, onAvaliable){
    var that = this,
        id = that.generateId(url),
        dependency = that.getDependency(url);
    if(!this.alreadyLoaded(id)){
        var checkStatusDependency = setInterval(function(){
            if(dependency.getStatus() == "ready"){
                that.loaded[id] = true;
                clearInterval(checkStatusDependency);
                onAvaliable.apply(that);
            }
            if(dependency.getStatus() == "error"){
                console.warn(dependency.getErrorMessage());
                clearInterval(checkStatusDependency);
                onAvaliable = null;
            }
        }, 500);
    } else {
        return true;
    }
};
//retorna la dependencia en memoria
yOSON.DependencyManager.prototype.getDependency = function(url){
    var id = this.generateId(url);
    return this.data[id];
};
//Consulta si está agregada en la data del administrador
yOSON.DependencyManager.prototype.alreadyInCollection = function(id){
    return this.data[id];
};
//retorna si ya está cargado la dependencia completamente
yOSON.DependencyManager.prototype.alreadyLoaded = function(id){
    return this.loaded[id];
};

//clase with pattern factory with the idea of create modules
yOSON.Modular = function(){
    this.modules = {};
    this.runningModules = {};
    this.skeletonModule = {};
    this.entityBridge = {};
    this.debug = false;
};

//receive one method for the entity comunicator on modules
yOSON.Modular.prototype.addMethodToBrigde = function(methodName, methodSelf){
    this.entityBridge[methodName] = methodSelf;
};

//adding a module
yOSON.Modular.prototype.addModule = function(moduleName, moduleDefinition){
    if(this.existsModule(moduleName)){
        //mensaje ya existe modulo
    } else {
        this.modules[moduleName] = this.createDefinitionModule(moduleName, moduleDefinition);
    }
};

//return the complete definition of an module with the components
yOSON.Modular.prototype.getModuleDefinition = function(moduleName){
    var module = this.getModule(moduleName),
        moduleInstance = module.moduleDefinition(this.entityBridge),
        that = this;

    for(var propertyName in moduleInstance){
        var method = moduleInstance[propertyName];
        if(typeof method === "function"){
            moduleInstance[propertyName] = that.addFunctionToDefinitionModule(moduleName, propertyName, method);
        }
    }

    return moduleInstance;
};

//create a method taking a name and function self
yOSON.Modular.prototype.addFunctionToDefinitionModule = function(moduleName, functionName, functionSelf){
    return function(){
        try {
            return functionSelf.apply(this, arguments);
        } catch( ex ){
            console.log("Modulo:"+ moduleName + "." + functionName + "(): " + ex.message);
        }
    };
};

//verifying the existence of one module by name
yOSON.Modular.prototype.existsModule = function(moduleName){
    var founded = false;
    if(this.getModule(moduleName)){
        founded = true;
    }
    return founded;
};

//return the module from the collection of modules
yOSON.Modular.prototype.getModule = function(moduleName){
    return this.modules[moduleName];
};

// return the skeleton for the creation of module
//creator of the definition ready for merge with the components
yOSON.Modular.prototype.createDefinitionModule = function(moduleName, moduleDefinition){
    this.skeletonModule[moduleName] = {
        'moduleDefinition': moduleDefinition,
    };
    return this.skeletonModule[moduleName];
};

//running the module
yOSON.Modular.prototype.runModule = function(moduleName, optionalParameter){
    var parameters = null;
    if(this.existsModule(moduleName)){
        console.log('running Module:', moduleName);

        if(typeof optionalParameter === "undefined"){
            parameters = {};
        } else {
            parameters = optionalParameter;
        }

        parameters.moduleName = moduleName;

        var moduleDefinition = this.getModuleDefinition(moduleName);

        this.runningModule(moduleName);

        if(moduleDefinition.hasOwnProperty('init')){
            moduleDefinition.init(parameters);
        } else {
            //message modulo dont run
        }
    }
};

//running one list of modules
yOSON.Modular.prototype.runModules = function(moduleNames){
    var that = this;
    //its necesary the parameter moduleNames must be a type Array
    if(!moduleNames instanceof Array){
        return;
    }

    for(var index = 0; index < moduleNames.length; index++){
        var moduleName = moduleNames[index];
        if(that.existsModule(moduleName)){
            that.runModule(moduleName);
        }
    }
};

yOSON.Modular.prototype.runningModule = function(moduleName){
    this.modules[moduleName].running = true;
};

yOSON.Modular.prototype.moduleIsRunning = function(moduleName){
    return this.modules[moduleName].running;
};

yOSON.Modular.prototype.setStatusModule = function(moduleName, statusName){
    this.modules[moduleName].status = statusName;
};

yOSON.Modular.prototype.getStatusModule = function(moduleName){
    return this.modules[moduleName].status;
};
yOSON.Modular.prototype.allModulesRunning = function(onNotFinished, onFinished){
    var that = this;
    var checkModulesRunning = setInterval(function(){
        var startedModules = 0,
            runningModules  = 0;

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
                onFinished.call(that);
                clearInterval(checkModulesRunning);
            } else {
                onNotFinished.call(that);
            }
        } else {
            onFinished.call(that);
            clearInterval(checkModulesRunning);
        }

    }, 200);
};

//Clase que se orienta al manejo de comunicacion entre modulos
yOSON.Comunicator = function(){
    this.events = {};
};

yOSON.Comunicator.prototype.publish = function(eventName, argumentsOfEvent){
    var that = this;
    this.finderEvents([eventName], function(eventNameFound, eventFound){
        var instanceFound = eventFound.instanceOrigin,
            functionFound = eventFound.functionSelf,
            validArguments = that.validateArguments(argumentsOfEvent);
        console.log('execute event', eventName);
        functionFound.call(instanceFound, validArguments);
    }, function(){});
};

yOSON.Comunicator.prototype.subscribe = function(eventNames, functionSelfEvent, instanceOrigin){
    var that = this;
    this.finderEvents(eventNames, function(){
    }, function(eventName){
        console.log('register event', eventName);
        that.addEvent(eventName, functionSelfEvent, instanceOrigin);
    });
};

yOSON.Comunicator.prototype.validateArguments = function(argumentsToValidate){
    var validArguments = [];
    if(typeof argumentsToValidate !== "undefined"){
        validArguments = argumentsToValidate;
    }
    return validArguments;
};

yOSON.Comunicator.prototype.stopSubscribe = function(EventsToStop, instanceOrigin){
    var that = this;
    this.finderEvents(EventsToStop, function(eventNameFound, eventFound){
        that.removeEvent(eventNameFound);
    }, function(){});
};

yOSON.Comunicator.prototype.addEvent = function(eventName, functionOfEvent, instanceOrigin){
    var bodyNewEvent = {};
    bodyNewEvent['instanceOrigin'] = instanceOrigin;
    bodyNewEvent['functionSelf'] = functionOfEvent;
    this.events[eventName] = bodyNewEvent;
    return this;
};

yOSON.Comunicator.prototype.removeEvent = function(eventName){
    this.events[eventName] = null;
};

yOSON.Comunicator.prototype.eventAlreadyRegistered = function(eventName){
    var response = null;
    if(this.getEvent(eventName)){
        response = true;
    }
    return response;
};

yOSON.Comunicator.prototype.getEvent = function(eventName){
    return this.events[eventName];
};

yOSON.Comunicator.prototype.finderEvents = function(eventNames, whichEventFound, whichEventNotFound){
    var that = this;
    for(var index = 0; index < eventNames.length;index++){
        var eventName = eventNames[index];
        if(that.eventAlreadyRegistered(eventName)){
            var eventFound = that.getEvent(eventName);
            whichEventFound.call(that, eventName, eventFound);
        } else {
            whichEventNotFound.call(that, eventName);
        }
    }
};

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

yOSON.AppCore = (function(){
    var objModular = new yOSON.Modular(),
        dependencyManager = new yOSON.DependencyManager(),
        objComunicator = new yOSON.Comunicator(),
        dependenceByModule = {};

    //setting the main methods in the bridge of an module
    objModular.addMethodToBrigde('events', function(eventNames, functionSelfEvent, instanceOrigin){
        objComunicator.subscribe(eventNames, functionSelfEvent, instanceOrigin);
    });

    objModular.addMethodToBrigde('trigger', function(eventName, argumentsOfEvent){
        var eventsWaiting = {};

        console.log('corriendo evento', eventName);
        objModular.allModulesRunning(function(){
            eventsWaiting[eventName] = argumentsOfEvent;
        }, function(){
            //if have events waiting
            for(var eventsForTrigger in eventsWaiting){
                objComunicator.publish(eventsForTrigger , eventsWaiting[eventsForTrigger]);
            }
            objComunicator.publish(eventName, argumentsOfEvent);
        });
    });

    //managing the dependences
    var setDependencesByModule = function(moduleName, dependencesOfModule){
        dependenceByModule[moduleName] = dependencesOfModule;
    },
    getDependencesByModule = function(moduleName){
        var dependencesToReturn = [];
        if(dependenceByModule[moduleName]){
            dependencesToReturn = dependenceByModule[moduleName];
        }
        return dependencesToReturn;
    };

    return {
        addModule: function(moduleName, moduleDefinition, dependences){
            setDependencesByModule(moduleName, dependences);
            objModular.addModule(moduleName, moduleDefinition);
        },
        runModule: function(moduleName, optionalParameter){
            var dependencesToLoad = getDependencesByModule(moduleName);
            objModular.setStatusModule(moduleName, "start");
            dependencyManager.ready(dependencesToLoad,function(){
                objModular.runModule(moduleName, optionalParameter);
            });
        },
        setStaticHost: function(hostName){
            dependencyManager.setStaticHost(hostName);
        },
        setVersionUrl: function(versionCode){
            dependencyManager.setVersionUrl(versionCode);
        }
    };
})();

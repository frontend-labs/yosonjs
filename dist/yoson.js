


    if(typeof yOSON === "undefined"){
        var yOSON = {};
    }

    yOSON.Components = {};

     (function(){

    /**
     * Class dealer of an url and indicates if ready or not
     * @class Dependency
     * @constructor
     * @param {String} url Setting the url to request
     * @example
     *      var url = "http://misite.com/mylib.js";
     *      //create and object setting the url to call
     *      var objDependency = new yOSON.Dependency(url);
     *      //request the url
     *      objDependency.request({
     *          onRequest: function(){
     *              //when request
     *          },
     *          onReady: function(){
     *              //when ready
     *          },
     *          onError: function(){
     *              //when occurs an error
     *          },
     *      });
     */
    var Dependency = function(url){
        this.url = url;
        this.status = "request";
        this.message = "";
        this.events = {};
    };
    /**
     * Return the status of the request
     * @method getStatus
     * @return {String} status of the request "request" | "ready" | "error"
     */
    Dependency.prototype.getStatus = function(){
        return this.status;
    };
    /**
     * Call the request of the script
     * @method request
     * @param {Object} events Settings the callbacks
     */
    Dependency.prototype.request = function(events){
        var that = this;

        if(typeof events !== "undefined"){
            that.events = events;
        }

        that.onRequest();
        var newScript = that.createNewScript(that.url);
        that.requestIE(newScript, function(){
            newScript.onload = function(){
                that.onReadyRequest();
            };
            newScript.onerror = function(){
                that.onErrorRequest();
            };
        });
        document.getElementsByTagName("head")[0].appendChild(newScript);
    };

    Dependency.prototype.createNewScript = function(urlSource){
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = urlSource;
        return script;
    };

    /**
     * Trigger when the request its started
     * @method onRequest
     */
    Dependency.prototype.onRequest = function(){
        this.requestCallBackEvent('onRequest');
    };

    /**
     * Trigger when the request its successfully
     * @method onReadyRequest
     */
    Dependency.prototype.onReadyRequest = function(){
        this.status = "ready";
        this.requestCallBackEvent('onReady');
    };
    /**
     * Trigger when the request have an error in the load of the script
     * @method onErrorRequest
     */
    Dependency.prototype.onErrorRequest = function(){
        this.status = "error";
        this.requestCallBackEvent('onError');
    };

    Dependency.prototype.requestCallBackEvent = function(eventName){
        var eventSelf = this.events[eventName];
        if(typeof eventSelf === "function"){
            eventSelf.call(this);
        }
    };
    /**
     * Call the request of the script for IE browser
     * @method requestIE
     * @param {Object} src the newScript created in the method request
     * @param {Object} events Settings the callbacks
     */
    Dependency.prototype.requestIE = function(scriptElement, onNoIEBrowser){
        var that = this;
        if(scriptElement.readyState){
            scriptElement.onreadystatechange = function(){
                if(scriptElement.readyState=="loaded" || scriptElement.readyState=="complete"){
                    scriptElement.onreadystatechange=null;
                    that.onReadyRequest();
                } else {
                    that.onErrorRequest();
                }
            };
        } else {
            onNoIEBrowser.call(that);
        }
    };

    yOSON.Components.Dependency = Dependency;
    

    /**
     * Class manager of one or many requests
     * @class DependencyManager
     * @requires Dependency
     * @constructor
     * @example
     *      //create and object setting the class
     *      var objDependencyManager = new yOSON.DependencyManager();
     *      //example of setting the static host
     *      objdependencymanager.setStaticHost("http://static.host/");
     *      //example of setting the static host
     *      objdependencymanager.setVersionUrl("?v=0.1");
     *      //request the url
     *      objDependency.ready(['url1'], function(){
     *          //when ready execute here
     *      });
     */
    var DependencyManager = function(){
        this.data = {};
        this.loaded = {};

        this.config = {
            staticHost: yOSON.statHost || "",
            versionUrl: yOSON.statVers || ""
        };
    };

    /**
     * Setting the host of the static elements
     * @method setStaticHost
     * @param {String} hostName the host of the static elements,
     * like a CDN url
     * @example
     *      objDependencyManager.setStaticHost("http://cdnjs.com");
     */
    DependencyManager.prototype.setStaticHost = function(hostName){
        this.config.staticHost = hostName;
    };

    /**
     * Get the host saved
     * @method getStaticHost
     * @return {String} Get the host saved with the method setStaticHost
     * @example
     *      //if setting "http://cdnjs.com" return that
     *      objDependencyManager.getStaticHost();
     */
    DependencyManager.prototype.getStaticHost = function(){
        return this.config.staticHost;
    };

    /**
     * Setting the suffix for the url, ideally when working with elements versioned
     * @method setVersionUrl
     * @param {String} versionNumber the suffix or number for concatenate in the url
     * @example
     *      objDependencyManager.setVersionUrl("?v=0.1");
     */
    DependencyManager.prototype.setVersionUrl = function(versionNumber){
        this.config.versionUrl = versionNumber;
    };

    /**
     * Get the suffix saved
     * @method getVersionUrl
     * @return {String} Get the suffix saved with the method setVersionUrl
     * @example
     *      //if setting "?v=0.1" return that
     *      objDependencyManager.getVersionUrl();
     */
    DependencyManager.prototype.getVersionUrl = function(){
        var result = "";
        if(this.config.versionUrl !== ""){
            result = this.config.versionUrl;
        }
        return result;
    };

    /**
     * method what transform the url to request
     * @method transformUrl
     * @param {String} url the url self to transform and ready for request
     * @return {String} the url transformed
     */
    DependencyManager.prototype.transformUrl = function(url){
        var urlResult = "",
        regularExpresion = /((http?|https):\/\/)(www)?([\w-]+\.\w+)+(\/[\w-]+)+\.\w+/g;
        if(regularExpresion.test(url)){
            urlResult = url;
        } else {
            urlResult = this.config.staticHost + url + this.getVersionUrl();
        }
        return urlResult;
    };

    /**
     * method what use the url and generateid the id for the manager
     * @method generateId
     * @param {String} url the url self to generate your id
     */
    DependencyManager.prototype.generateId = function(url){
        return (url.indexOf('//')!=-1)?url.split('//')[1].split('?')[0].replace(/[/.:]/g,'_'):url.split('?')[0].replace(/[/.:]/g,'_');
    };

    /**
     * method what receive an url to the manager
     * @method addScript
     * @param {String} url the url self to request in the manager
     */
    DependencyManager.prototype.addScript = function(url){
        var id = this.generateId( url );
        if(this.alreadyInCollection(id)){
            return 'the dependence already appended';
        } else {
            this.data[id] = new Dependency(url);
            //Hago la consulta del script
            this.data[id].request();
            return true;
        }
    };

    /**
     * method what receive an list of urls to request and callbacks when the requests are ready
     * @method ready
     * @param {Array} urlList List of urls to request
     * @param {Function} onReady Callback to execute when the all requests are ready
     */
    DependencyManager.prototype.ready = function(urlList, onReady){
        var index = 0,
        that = this;
        var queueQuering = function(list){
            if(index < list.length){
                var urlToQuery = that.transformUrl(list[index]);
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

    /**
     * method what verify the avaliability of an Dependency
     * @method avaliable
     * @param {String} url the url to query if its avaliable or not
     * @param {Function} onAvaliable Callback to execute when the url its avaliable
     * @return {Boolean} if the dependency its avaliable return true
     */
    DependencyManager.prototype.avaliable = function(url, onAvaliable){
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
                    onAvaliable = null;
                    clearInterval(checkStatusDependency);
                }
            }, 500);
        } else {
            return true;
        }
    };

    /**
     * return the dependency saved in the manager
     * @method getDependency
     * @param {String} url the url to get in the manager
     * @return {Object} the object Dependency created by the url
     */
    DependencyManager.prototype.getDependency = function(url){
        var id = this.generateId(url);
        return this.data[id];
    };

    /**
     * Query if its appened in the collection of the manager
     * @method alreadyInCollection
     * @param {String} id the id generated by the url
     * @return {Object} the object Dependency created by the url
     */
    DependencyManager.prototype.alreadyInCollection = function(id){
        return this.data[id];
    };

    /**
     * Query if its loaded the dependency in the manager
     * @method alreadyLoaded
     * @param {String} id the id generated by the url
     * @return {Object} the object Dependency created by the url
     */
    DependencyManager.prototype.alreadyLoaded = function(id){
        return ( typeof this.loaded[id] !== "undefined");
    };

    yOSON.Components.DependencyManager = DependencyManager;
    


    //clase with pattern factory with the idea of create modules
    var Modular = function(entityBridge){
        this.entityBridge = entityBridge;
        this.moduleInstance = "";
        this.status = "stop";
    };

    //create a empty context of module
    Modular.prototype.create = function(moduleDefinition){
        this.moduleDefinition = moduleDefinition;
    };

    //create a definition of module self
    Modular.prototype.generateModularDefinition = function(functionName, functionSelf){
        if(typeof functionSelf === "function"){
            return function(){
                try {
                    return functionSelf.apply(this, arguments);
                } catch( ex ){
                    console.log(functionName + "(): " + ex.message);
                }
            };
        } else {
            return functionSelf;
        }
    };

    //start a simple module
    Modular.prototype.start = function(parameters){
        var params = this.dealParamaterOfModule(parameters);
        var moduleInstance = this.moduleDefinition(this.entityBridge);
        for(var propertyName in moduleInstance){
            var method = moduleInstance[propertyName];
            moduleInstance[propertyName] = this.generateModularDefinition(propertyName, method);
        }
        this.moduleInstance = moduleInstance;
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
    

    var ModularMonitor = function(){
        this.modules = {};
    };

    ModularMonitor.prototype.updateStatus = function(moduleName, statusName){
        this.modules[moduleName] = statusName;
    };

    ModularMonitor.prototype.eachModules = function(eachModule){
        for(var moduleName in this.modules){
            var status = this.modules[moduleName];
            eachModule.call(this, status);
        }
    };

    ModularMonitor.prototype.getTotalModulesByStatus = function(statusName){
        var total = 0;
        this.eachModules(function(status){
            if(status === statusName){
                total++;
            }
        });
        return total;
    };

    ModularMonitor.prototype.getTotalModulesRunning = function(){
        return this.getTotalModulesByStatus('run');
    };

    ModularMonitor.prototype.getTotalModulesToStart = function(){
        return this.getTotalModulesByStatus('toStart') + this.getTotalModulesRunning();
    };

    


    var ModularManager = function(){
        this.modules = {};
        this.runningModules = {};
        this.entityBridge = {};
        this.alreadyAllModulesBeRunning = false;
        this.syncModules = [];
        this.objMonitor = new ModularMonitor();
    };

    //receive one method for the entity comunicator on modules
    ModularManager.prototype.addMethodToBrigde = function(methodName, methodSelf){
        this.entityBridge[methodName] = methodSelf;
    };

    //adding a module
    ModularManager.prototype.addModule = function(moduleName, moduleDefinition){
        var modules = this.modules;
        if(!this.getModule(moduleName)){
            modules[moduleName] = new Modular(this.entityBridge);
            modules[moduleName].create(moduleDefinition);
        }
    };

    //return the module from the collection of modules
    ModularManager.prototype.getModule = function(moduleName){
        return this.modules[moduleName];
    };

    //running the module
    ModularManager.prototype.runModule = function(moduleName, optionalParameters){
        var module = this.getModule(moduleName);
        if(this.getModule(moduleName)){
            module.setStatusModule("start");
            this.dataModule(moduleName,optionalParameters);
            this.runQueueModules();
        }
    };

    ModularManager.prototype.syncModule = function(moduleName){
        var that = this;
        var module = that.getModule(moduleName);
        that.objMonitor.updateStatus(moduleName, "toStart");
        that.syncModules.push(moduleName);
    };

    ModularManager.prototype.dataModule = function(moduleName, data){
        if(typeof data !== "undefined"){
            this.modules[moduleName].data = data;
        }
        return this.modules[moduleName].data;
    };

    ModularManager.prototype.runQueueModules = function(){
        var that = this,
            index = 0,
            runModules = function(list){
                if(list.length > index){
                    var module = list[index];
                    that.whenModuleHaveStatus(module, "start", function(moduleName, moduleSelf){
                        that.objMonitor.updateStatus(moduleName, "run");
                        var data = that.dataModule(moduleName);
                        moduleSelf.start(data);
                    });
                    that.whenModuleHaveStatus(module, "run", function(){
                        index++;
                        runModules(list);
                    });
                }
            };
        runModules(that.syncModules);
    };

    ModularManager.prototype.whenModuleHaveStatus = function(moduleName, statusName, whenHaveStatus){
        var module = this.getModule(moduleName),
            queryStatus = setInterval(function(){
                if(module.getStatusModule() === statusName){
                    whenHaveStatus.call(this, moduleName, module);
                    clearInterval(queryStatus);
                }
            }, 20);
    };

    ModularManager.prototype.allModulesRunning = function(onNotFinished, onFinished){
        var that = this,
            objMonitor = that.objMonitor;
        if(this.alreadyAllModulesBeRunning){
            onFinished.call(that);
        } else {
            var checkModulesRunning = setInterval(function(){
                if(objMonitor.getTotalModulesToStart() > 0){
                    if( objMonitor.getTotalModulesToStart() === objMonitor.getTotalModulesRunning()){
                        onFinished.call(that);
                        this.alreadyAllModulesBeRunning = true;
                        clearInterval(checkModulesRunning);
                    } else {
                        onNotFinished.call(that);
                    }
                } else {
                    onFinished.call(that);
                    this.alreadyAllModulesBeRunning = true;
                    clearInterval(checkModulesRunning);
                }
            }, 200);
        }
    };

    yOSON.Components.ModularManager = ModularManager;
    


    //Clase que se orienta al manejo de comunicacion entre modulos
    var Comunicator = function(){
        this.events = {};
    };

    Comunicator.prototype.subscribe = function(eventNames, functionSelfEvent, instanceOrigin){
        var that = this;
        this.finderEvents(eventNames, function(){
        }, function(eventName){
            that.addEvent(eventName, functionSelfEvent, instanceOrigin);
        });
    };

    Comunicator.prototype.publish = function(eventName, argumentsOfEvent){
        var that = this;
        this.finderEvents([eventName], function(eventNameFound, eventFound){
            var instanceFound = eventFound.instanceOrigin,
                functionFound = eventFound.functionSelf,
                validArguments = that.validateArguments(argumentsOfEvent);
            functionFound.apply(instanceFound, validArguments);
        }, function(){});
    };

    Comunicator.prototype.validateArguments = function(argumentsToValidate){
        var validArguments = [];
        if(typeof argumentsToValidate !== "undefined"){
            validArguments = argumentsToValidate;
        }
        return validArguments;
    };

    Comunicator.prototype.stopSubscribe = function(EventsToStop){
        var that = this;
        this.finderEvents(EventsToStop, function(eventNameFound, eventFound){
            that.removeEvent(eventNameFound);
        }, function(){});
    };

    Comunicator.prototype.addEvent = function(eventName, functionOfEvent, instanceOrigin){
        var bodyNewEvent = {};
        bodyNewEvent.instanceOrigin = instanceOrigin;
        bodyNewEvent.functionSelf = functionOfEvent;
        this.events[eventName] = bodyNewEvent;
        return this;
    };

    Comunicator.prototype.removeEvent = function(eventName){
        delete this.events[eventName];
    };

    Comunicator.prototype.eventAlreadyRegistered = function(eventName){
        var response = false;
        if(this.getEvent(eventName)){
            response = true;
        }
        return response;
    };

    Comunicator.prototype.getEvent = function(eventName){
        return this.events[eventName];
    };

    Comunicator.prototype.finderEvents = function(eventNames, whichEventFound, whichEventNotFound){
        var that = this;
        for(var index = 0; index < eventNames.length;index++){
            that.eachFindEvent(eventNames[index], whichEventFound, whichEventNotFound);
        }
    };

    Comunicator.prototype.eachFindEvent = function(eventName, whichEventFound, whichEventNotFound){
        var that = this;
        if(that.eventAlreadyRegistered(eventName)){
            var eventFound = that.getEvent(eventName);
            whichEventFound.call(that, eventName, eventFound);
        } else {
            whichEventNotFound.call(that, eventName);
        }
    };

    yOSON.Components.Comunicator = Comunicator;
    

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

    
//Clase que maneja la ejecución de modulos depediendo de 3 parametros (Modulo, Controlador, Accion)


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

    


    var objModularManager = new yOSON.Components.ModularManager(),
        objDependencyManager = new yOSON.Components.DependencyManager(),
        objComunicator = new yOSON.Components.Comunicator(),
        dependenceByModule = {};

    yOSON.AppCore = (function(){
        //setting the main methods in the bridge of an module
        objModularManager.addMethodToBrigde('events', function(eventNames, functionSelfEvent, instanceOrigin){
            objComunicator.subscribe(eventNames, functionSelfEvent, instanceOrigin);
        });

        objModularManager.addMethodToBrigde('trigger', function(eventName, argumentsOfEvent){
            var eventsWaiting = {};
            objModularManager.allModulesRunning(function(){
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
            getStatusModule: function(moduleName){
                var module = objModularManager.getModule(moduleName);
                return  module.getStatusModule();
            },
            whenModule: function(moduleName, status, methodWhenRun){
                objModularManager.whenModuleHaveStatus(moduleName, status, function(){
                    methodWhenRun.call(this);
                });
            },
            addModule: function(moduleName, moduleDefinition, dependences){
                setDependencesByModule(moduleName, dependences);
                objModularManager.addModule(moduleName, moduleDefinition);
            },
            runModule: function(moduleName, optionalParameter){
                var dependencesToLoad = getDependencesByModule(moduleName);
                var module = objModularManager.getModule(moduleName);
                objModularManager.syncModule(moduleName);
                objDependencyManager.ready(dependencesToLoad,function(){
                    objModularManager.runModule(moduleName, optionalParameter);
                });
            },
            setStaticHost: function(hostName){
                objDependencyManager.setStaticHost(hostName);
            },
            setVersionUrl: function(versionCode){
                objDependencyManager.setVersionUrl(versionCode);
            }
        };
    })();

    //if(yOSON.statHost){
        //yOSON.AppCore.setStaticHost(yOSON.statHost);
    //}

    //if(yOSON.statVers){
        //yOSON.AppCore.setVersionUrl(yOSON.statVers);
    //}

    return yOSON;})();



    if(typeof yOSON === "undefined"){
        var yOSON = {};
    }

    yOSON.Components = {};

    yOSON.Log = function(){
        try{
            console.log.apply(console, arguments);
        }catch(err){
            try{
                opera.postError.apply(opera, arguments);
            }catch(er){
                alert(Array.prototype.join.call(arguments), " ");
            }
        }
    };

     (function(){


    var SinglePromise = function(){
        this.callbacks = {
            succeededs:[],
            faileds:[]
        };
        this.status = "pending";
    };

    SinglePromise.prototype.eachCallBackList = function(callbackList, onEveryCallback){
        for(var indexCallback = 0; indexCallback < callbackList.length; indexCallback++){
            onEveryCallback.call(this, callbackList[indexCallback]);
        }
    };

    SinglePromise.prototype.done = function(){
        this.status = "done";

        this.eachCallBackList(this.callbacks.succeededs, function(callbackRegistered){
            callbackRegistered.call(this);
        });
    };

    //When all tasks are successful
    SinglePromise.prototype.then = function(whenItsDone, whenIsFailed){
        var callbacks = this.callbacks;

        var byStatus = {
            "pending": function(){
                callbacks.succeededs.push(whenItsDone);
                if(typeof whenIsFailed === "function"){
                    callbacks.faileds.push(whenIsFailed);
                }

            },
            "done": function(){
                if(typeof whenItsDone === "function"){
                    whenItsDone.call(this);
                }
            },
            "fail": function(){
                whenIsFailed.call(this);
            }
        };
        byStatus[this.status]();
        return this;
    };

    //When the promise is broken
    SinglePromise.prototype.fail = function(objError){
        this.status = "fail";
        this.eachCallBackList(this.callbacks.faileds, function(callbackRegistered){
            callbackRegistered.call(this, objError);
        });
    };

    yOSON.Components.SinglePromise = SinglePromise;
    

    /**
     * Class that makes a request by a url and indicates if its ready or not
     * @class Dependency
     * @constructor
     * @param {String} url Sets the url to request
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
     *              //when error occurs
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
     * Returns the status of the request
     * @method getStatus
     * @return {String} status of the request "request" | "ready" | "error"
     */
    Dependency.prototype.getStatus = function(){
        return this.status;
    };
    /**
     * Calls the request of the script
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
                that.onReadyRequest(this);
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
     * Triggers when the request has started
     * @method onRequest
     */
    Dependency.prototype.onRequest = function(){
        this.requestCallBackEvent('onRequest');
    };

    /**
     * Triggers when the request is successful
     * @method onReadyRequest
     */
    Dependency.prototype.onReadyRequest = function(instanceLoaded){
        this.status = "ready";
        this.requestCallBackEvent('onReady', instanceLoaded);
    };
    /**
     * Triggers when the request has an error when loading the script
     * @method onErrorRequest
     */
    Dependency.prototype.onErrorRequest = function(){
        this.status = "error";
        this.requestCallBackEvent('onError');
    };

    Dependency.prototype.requestCallBackEvent = function(){
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
    /**
     * Calls the request of the script for IE browser
     * @method requestIE
     * @param {Object} src the newScript created in the method request
     * @param {Object} events Sets the callbacks
     */
    Dependency.prototype.requestIE = function(scriptElement, onNoIEBrowser){
        var that = this;
        if(scriptElement.readyState){
            scriptElement.onreadystatechange = function(){
                if(scriptElement.readyState=="loaded" || scriptElement.readyState=="complete"){
                    scriptElement.onreadystatechange=null;
                    that.onReadyRequest();
                }
            };
        } else {
            onNoIEBrowser.call(that);
        }
    };

    yOSON.Components.Dependency = Dependency;
    

    /**
     * Class manager for one or more requests
     * @class DependencyManager
     * @requires Dependency
     * @constructor
     * @example
     *      // create and object setting the class
     *      var objDependencyManager = new yOSON.DependencyManager();
     *      // example of setting the static host
     *      objdependencymanager.setStaticHost("http://static.host/");
     *      // example of setting the static host
     *      objdependencymanager.setVersionUrl("?v=0.1");
     *      // request the url
     *      objDependency.ready(['url1'], function(){
     *          // execute here when ready
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
     * Sets the host of static elements
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
     * Gets saved host
     * @method getStaticHost
     * @return {String} Get the saved host with the method setStaticHost
     * @example
     *      //returns "http://cdnjs.com" if set
     *      objDependencyManager.getStaticHost();
     */
    DependencyManager.prototype.getStaticHost = function(){
        return this.config.staticHost;
    };

    /**
     * Sets the suffix for the url, ideally when working with versioned elements
     * @method setVersionUrl
     * @param {String} versionNumber the suffix or number for concatenating in the url
     * @example
     *      objDependencyManager.setVersionUrl("?v=0.1");
     */
    DependencyManager.prototype.setVersionUrl = function(versionNumber){
        this.config.versionUrl = versionNumber;
    };

    /**
     * Get saved suffix
     * @method getVersionUrl
     * @return {String} Get saved suffix with the setVersionUrl method
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
     * Transforms the url to a request
     * @method transformUrl
     * @param {String} url the url itself to be transformed and ready for request
     * @return {String} the url transformed
     */
    DependencyManager.prototype.transformUrl = function(url){
        var urlResult = "",
        regularExpresion = /((http?|https):\/\/)(www)?([\w-]+\.\w+)+(\/[\w-]+)+\.\w+/g;
        if(regularExpresion.test(url)){
            urlResult = url;
        } else {
            urlResult = this.validateDoubleSlashes( this.config.staticHost + url + this.getVersionUrl() );
        }
        return urlResult;
    };

    /**
     * Validates double slashes in url
     * @method validateDoubleSlashes
     * @param {String} url the url self to validate
     * @return {String} the url cleaned
     */
    DependencyManager.prototype.validateDoubleSlashes = function(url){
        var regularExpression = /([^\/:])\/+([^\/])/g;
        return url.replace(regularExpression, "$1/$2");
    };

    /**
     * Generates the id for the manager from the url
     * @method generateId
     * @param {String} url the url self to generate your id
     */
    DependencyManager.prototype.generateId = function(url){
        return (url.indexOf('//')!=-1)?url.split('//')[1].split('?')[0].replace(/[/.:]/g,'_'):url.split('?')[0].replace(/[/.:]/g,'_');
    };

    /**
     * Receives a url from the manager
     * @method addScript
     * @param {String} url the url self to request in the manager
     */
    DependencyManager.prototype.addScript = function(url){
        var id = this.generateId( url );
        var promiseEntity = new SinglePromise();
        if(this.alreadyInCollection(id)){
            return this.data[id].promiseEntity;
            //return 'the dependence is already appended';
        } else {
            this.data[id] = new Dependency(url);
            // Hago la consulta del script
            this.data[id].request({
                onReady: function(){
                    promiseEntity.done();
                },
                onError: function(){
                    promiseEntity.fail();
                }
            });
            this.data[id].promiseEntity = promiseEntity;
        }
        return promiseEntity;
    };

    /**
     * method that receives a list of urls to be requested and callbacks when the requests are ready
     * @method ready
     * @param {Array} urlList List of urls to request
     * @param {Function} onReady Callback to execute when the all requests are ready
     */
    DependencyManager.prototype.ready = function(urlList, onReady, onError){
        var index = 0,
        that = this;
        var queueQuering = function(list){
            if(index < list.length){
                var urlToQuery = that.transformUrl(list[index]);
                that.addScript(urlToQuery).then(function(){
                    index++;
                    queueQuering(urlList);
                }, onError);
            } else {
                onReady.apply(that);
            }
        };
        queueQuering(urlList);
    };

    /**
     * Returns saved dependency in the manager
     * @method getDependency
     * @param {String} url the url to get in the manager
     * @return {Object} the object Dependency created by the url
     */
    DependencyManager.prototype.getDependency = function(url){
        var id = this.generateId(url);
        return this.data[id];
    };

    /**
     * Queries if its appended in the collection of the manager
     * @method alreadyInCollection
     * @param {String} id the id generated by the url
     * @return {Object} the object Dependency created by the url
     */
    DependencyManager.prototype.alreadyInCollection = function(id){
        return this.data[id];
    };

    /**
     * Queries if the dependency is loaded in the manager
     * @method alreadyLoaded
     * @param {String} id the id generated by the url
     * @return {Object} the object Dependency created by the url
     */
    DependencyManager.prototype.alreadyLoaded = function(id){
        return ( typeof this.loaded[id] !== "undefined");
    };

    yOSON.Components.DependencyManager = DependencyManager;
    


    //Class with pattern factory with the idea of creating modules
    var Modular = function(entityBridge){
        this.entityBridge = entityBridge;
        this.moduleInstance = "";
        this.status = "stop";
    };

    //Creates an empty context of module
    Modular.prototype.create = function(moduleDefinition){
        this.moduleDefinition = moduleDefinition;
    };

    //Creates a definition of module self
    Modular.prototype.generateModularDefinition = function(functionName, functionSelf){
        if(typeof functionSelf === "function"){
            return function(){
                try {
                    return functionSelf.apply(this, arguments);
                } catch( ex ){
                    yOSON.Log(functionName + "(): " + ex.message);
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
    


    var ModularManager = function(){
        this.modules = {};
        this.runningModules = {};
        this.entityBridge = {};
        this.alreadyAllModulesBeRunning = false;
    };

    // Receives a method for the entity communicator on modules
    ModularManager.prototype.addMethodToBrigde = function(methodName, methodSelf){
        this.entityBridge[methodName] = methodSelf;
    };

    // Adds a module
    ModularManager.prototype.addModule = function(moduleName, moduleDefinition){
        var modules = this.modules;
        if(!this.getModule(moduleName)){
            modules[moduleName] = new Modular(this.entityBridge);
            modules[moduleName].create(moduleDefinition);
        }
    };

    // Returns the module from the collection of modules
    ModularManager.prototype.getModule = function(moduleName){
        return this.modules[moduleName];
    };

    // Runs the module
    ModularManager.prototype.runModule = function(moduleName, optionalParameters){
        var module = this.getModule(moduleName);
        if(module){
            module.start(optionalParameters);
        }
    };

    ModularManager.prototype.whenModuleHaveStatus = function(moduleName, statusName, whenHaveStatus){
        var module = this.getModule(moduleName);
        if(module.getStatusModule() === statusName){
            whenHaveStatus.call(this, moduleName, module);
        }
    };

    yOSON.Components.ModularManager = ModularManager;
    


    // This class handles the communication between modules
    var Communicator = function(){
        this.events = {};
    };

    Communicator.prototype.subscribe = function(eventNames, functionSelfEvent, instanceOrigin){
        var that = this;
        this.finderEvents(eventNames, function(){
        }, function(eventName){
            that.addEvent(eventName, functionSelfEvent, instanceOrigin);
        });
    };

    Communicator.prototype.publish = function(eventName, argumentsOfEvent){
        var that = this;
        this.finderEvents([eventName], function(eventNameFound, eventFound){
            var instanceFound = eventFound.instanceOrigin,
                functionFound = eventFound.functionSelf,
                validArguments = that.validateArguments(argumentsOfEvent);
            functionFound.apply(instanceFound, validArguments);
        }, function(){});
    };

    Communicator.prototype.validateArguments = function(argumentsToValidate){
        var validArguments = [];
        if(typeof argumentsToValidate !== "undefined"){
            validArguments = argumentsToValidate;
        }
        return validArguments;
    };

    Communicator.prototype.stopSubscribe = function(EventsToStop){
        var that = this;
        this.finderEvents(EventsToStop, function(eventNameFound, eventFound){
            that.removeEvent(eventNameFound);
        }, function(){});
    };

    Communicator.prototype.addEvent = function(eventName, functionOfEvent, instanceOrigin){
        var bodyNewEvent = {};
        bodyNewEvent.instanceOrigin = instanceOrigin;
        bodyNewEvent.functionSelf = functionOfEvent;
        this.events[eventName] = bodyNewEvent;
        return this;
    };

    Communicator.prototype.removeEvent = function(eventName){
        delete this.events[eventName];
    };

    Communicator.prototype.eventAlreadyRegistered = function(eventName){
        var response = false;
        if(this.getEvent(eventName)){
            response = true;
        }
        return response;
    };

    Communicator.prototype.getEvent = function(eventName){
        return this.events[eventName];
    };

    Communicator.prototype.finderEvents = function(eventNames, whichEventFound, whichEventNotFound){
        var that = this;
        for(var index = 0; index < eventNames.length;index++){
            that.eachFindEvent(eventNames[index], whichEventFound, whichEventNotFound);
        }
    };

    Communicator.prototype.eachFindEvent = function(eventName, whichEventFound, whichEventNotFound){
        var that = this;
        if(that.eventAlreadyRegistered(eventName)){
            var eventFound = that.getEvent(eventName);
            whichEventFound.call(that, eventName, eventFound);
        } else {
            whichEventNotFound.call(that, eventName);
        }
    };

    yOSON.Components.Communicator = Communicator;
    

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

    
// Class that handles the execution of modules depending on 3 parameters (Module, Controller, Action)


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

    


    var Sequential = function(){
        this.taskInQueueToList = {};
        this.listTaskInQueue = [];
    };

    Sequential.prototype.generateId = function(){
        return this.listTaskInQueue.length;
    };

    Sequential.prototype.getTaskById = function(id){
        return this.taskInQueueToList[id];
    };

    Sequential.prototype.inQueue = function(methodToPassingToQueue){
        var that = this;
        var id = this.generateId();
        var skeletonTask = {
            running: false,
            initAlreadyCalled: false,
            nextTask: function(methodWhenDoneTask){
                skeletonTask.running = true;
                if(typeof methodWhenDoneTask === "function"){
                    methodWhenDoneTask.call(this);
                }
                that.dispatchQueue();
            },
            init: function(){
                if(skeletonTask.initAlreadyCalled){
                    return;
                }
                skeletonTask.initAlreadyCalled = true;
                methodToPassingToQueue.call(this, skeletonTask.nextTask);
            }
        };
        this.taskInQueueToList[id] = skeletonTask;
        this.listTaskInQueue.push(this.taskInQueueToList);
        this.dispatchQueue();
        return this;
    };

    Sequential.prototype.taskIsRunning = function(id){
        return this.taskInQueueToList[id].running;
    };

    Sequential.prototype.dispatchQueue = function(){
        var that = this,
            index = 0,
            loopList = function(listQueue){
                if(index < listQueue.length){
                    var taskInQueue = that.getTaskById(index);
                    if(!that.taskIsRunning(index)){
                        taskInQueue.init();
                    } else {
                        index++;
                        loopList(listQueue);
                    }
                }
            };
        loopList(this.listTaskInQueue);
    };

    yOSON.Components.Sequential = Sequential;
    


    var objModularManager = new yOSON.Components.ModularManager(),
        objDependencyManager = new yOSON.Components.DependencyManager(),
        objCommunicator = new yOSON.Components.Communicator(),
        objSequential = new yOSON.Components.Sequential(),
        dependenceByModule = {},
        paramsTaked = [],
        triggerArgs = [];

    yOSON.AppCore = (function(){
        //Sets the main methods in the bridge of a module
        objModularManager.addMethodToBrigde('events', function(eventNames, functionSelfEvent, instanceOrigin){
            objCommunicator.subscribe(eventNames, functionSelfEvent, instanceOrigin);
        });

        objModularManager.addMethodToBrigde('trigger', function(){
            paramsTaked = paramsTaked.slice.call(arguments, 0);
            var eventNameArg = paramsTaked[0];
            if(paramsTaked.length > 1){
                triggerArgs = paramsTaked.slice(1);
            }

            objCommunicator.publish(eventNameArg, triggerArgs);
        });

        //Manages dependences
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
                objModularManager.addModule(moduleName, moduleDefinition);
            },
            runModule: function(moduleName, optionalParameter){
                var module = objModularManager.getModule(moduleName);
                if(module){
                    var dependencesToLoad = getDependencesByModule(moduleName);
                    objSequential.inQueue(function(next){
                        objDependencyManager.ready(dependencesToLoad,function(){
                            objModularManager.runModule(moduleName, optionalParameter);
                            next();
                        }, function(){
                            yOSON.Log('Error: the module ' + moduleName + ' can\'t be loaded');
                            next();
                        });
                    });
                } else {
                    yOSON.Log('Error: the module ' + moduleName + ' don\'t exists');
                }
            },
            setStaticHost: function(hostName){
                objDependencyManager.setStaticHost(hostName);
            },
            setVersionUrl: function(versionCode){
                objDependencyManager.setVersionUrl(versionCode);
            }
        };
    })();

    return yOSON;})();
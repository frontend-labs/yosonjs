define([
    "yoson",
    "comps/dependency-manager",
    "comps/modular-manager",
    "comps/comunicator",
    "comps/loader",
    "comps/single-promise",
], function(yOSON){

    var objModularManager = new yOSON.Components.ModularManager(),
        objDependencyManager = new yOSON.Components.DependencyManager(),
        objComunicator = new yOSON.Components.Comunicator(),
        dependenceByModule = {},
        paramsTaked = [],
        triggerArgs = [];

    yOSON.AppCore = (function(){
        //setting the main methods in the bridge of an module
        objModularManager.addMethodToBrigde('events', function(eventNames, functionSelfEvent, instanceOrigin){
            objComunicator.subscribe(eventNames, functionSelfEvent, instanceOrigin);
        });

        objModularManager.addMethodToBrigde('trigger', function(){
            var eventsWaiting = {};

            paramsTaked = paramsTaked.slice.call(arguments, 0);
            var eventNameArg = paramsTaked[0];
            if(paramsTaked.length > 1){
                triggerArgs = paramsTaked.slice(1);
            }

            objModularManager.allModulesRunning(function(){
                eventsWaiting[eventNameArg] = triggerArgs;
            }, function(){
                //if have events waiting
                for(var eventsForTrigger in eventsWaiting){
                    objComunicator.publish(eventsForTrigger , eventsWaiting[eventsForTrigger]);
                }
                objComunicator.publish(eventNameArg, triggerArgs);
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
        },
        toSaveInQueue = function(moduleName, parameters){
            var dependencesToLoad = getDependencesByModule(moduleName);
            var objPromiseModule = new yOSON.Components.SinglePromise();

            objDependencyManager.ready(dependencesToLoad,function(){
                objPromiseModule.done(function(){
                    if(objModularManager.getModule(moduleName).getStatusModule() !== "run"){
                        objModularManager.runModule(moduleName, parameters);
                    }
                });
            }, function(){
                objPromiseModule.fail();
            });

            return objPromiseModule;
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
                var objPromise = new yOSON.Components.SinglePromise();
                var module = objModularManager.getModule(moduleName);
                if(module){
                    console.log('runModule::', moduleName);
                    objModularManager.saveInQueue(toSaveInQueue(moduleName, optionalParameter));
                    objPromise.pipe(objModularManager.getQueueModules());
                } else {
                    console.log('Error: the module ' + moduleName + ' don\'t exists');
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

    //if(yOSON.statHost){
        //yOSON.AppCore.setStaticHost(yOSON.statHost);
    //}

    //if(yOSON.statVers){
        //yOSON.AppCore.setVersionUrl(yOSON.statVers);
    //}

    return yOSON;
});

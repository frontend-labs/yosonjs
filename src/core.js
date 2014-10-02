define([
    "yoson",
    "comps/dependency-manager",
    "comps/modular-manager",
    "comps/comunicator",
    "comps/loader",
], function(yOSON){

    var objModularManager = new yOSON.Components.ModularManager(),
        objDependencyManager = new yOSON.Components.DependencyManager(),
        objComunicator = new yOSON.Components.Comunicator(),
        dependenceByModule = {},
        eventsToTrigger= {};

    yOSON.AppCore = (function(){
        //setting the main methods in the bridge of an module
        objModularManager.addMethodToBrigde('events', function(eventNames, functionSelfEvent, instanceOrigin){
            objComunicator.subscribe(eventNames, functionSelfEvent, instanceOrigin);
        });

        objModularManager.addMethodToBrigde('trigger', function(){
            var eventsWaiting = {};
            var paramsTaked = [].slice.call(arguments, 0);
            var eventNameArg = paramsTaked[0];
            var triggerArgs = [];

            if(paramsTaked.length > 1){
                triggerArgs = paramsTaked.slice(1);
            }

            objComunicator.publish(eventNameArg, triggerArgs);
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
                if(module){
                    objModularManager.syncModule(moduleName);
                    objDependencyManager.ready(dependencesToLoad,function(){
                        objModularManager.runModule(moduleName, optionalParameter);
                    }, function(){
                        yOSON.Log('Error in Load Module ' + moduleName);
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

    //if(yOSON.statHost){
        //yOSON.AppCore.setStaticHost(yOSON.statHost);
    //}

    //if(yOSON.statVers){
        //yOSON.AppCore.setVersionUrl(yOSON.statVers);
    //}

    return yOSON;
});

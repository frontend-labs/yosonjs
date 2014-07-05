define([
    "yoson",
    "comps/dependency-manager",
    "comps/modular",
    "comps/comunicator",
    "comps/loader",
], function(yOSON){
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
            getComponents: function(){
                return {
                    'Modular': objModular,
                    'Comunicator': objComunicator,
                    'DependencyManager': dependencyManager
                };
            },
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

    return yOSON;
});

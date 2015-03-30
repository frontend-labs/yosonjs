define([
    "yoson",
    "managers/dependency",
    "managers/modular",
    "comps/communicator",
    "comps/loader",
    "comps/sequential"
], function(yOSON){

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

    return yOSON;
});

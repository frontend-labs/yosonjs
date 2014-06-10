yOSON.AppCore = (function(){
    var objModular = new yOSON.Modular(),
        dependencyManager = new yOSON.DependencyManager(),
        objComunicator = new yOSON.Comunicator(),
        dependenceByModule = {};

    //setting the main methods in the bridge of an module
    objModular.addMethodToBrigde('events', objComunicator.subscribe);
    objModular.addMethodToBrigde('trigger', objComunicator.publish);
    objModular.addMethodToBrigde('stopEvent', objComunicator.stopSubscribe);

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
        runModule: function(moduleName){
            var dependencesToLoad = getDependencesByModule(moduleName);
            dependencyManager.ready(dependencesToLoad,function(){
                objModular.runModule(moduleName);
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

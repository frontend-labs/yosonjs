//define the modules
var dependencyManager = new yOSON.DependencyManager();
var objComunicator = new yOSON.Comunicator();
var objModular = new yOSON.Modular();
//append the demo urls
var dependences = [
    'http://code.jquery.com/jquery-1.11.0.min.js',
    'http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js',
    'http://cdnjs.cloudflare.com/ajax/libs/jquery-color/2.1.2/jquery.color.min.js'
];

//setting the dependencymanager
var staticHost = "http://localhost:3000";
dependencymanager.setStaticHost(staticHost);
var version = "a1b2c3de4r5";
dependencymanager.setVersionUrl(version);
//Append the methods to Bridge with modules
objModular.addMethodToBrigde('events', objComunicator.subscribe);
objModular.addMethodToBrigde('trigger', objComunicator.publish);
objModular.addMethodToBrigde('stopEvent', objComunicator.stopSuscribe);

yOSON.AppCore = (function(){
    var dependenceByModule = {},
    setDependencesByModule = function(moduleName, dependencesOfModule){
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
        }
    };
})();

//1st executing modular with dependencyManager
yOSON.AppCore.addModule('demoA', function(Bridge){
    return {
        init: function(){
            console.log('Hello Im Ready in module A', $);
            console.log('Hello Im Ready in module A', Sb.events);
            debugger;
        }
    }
}, dependences);

//2nd executing modular with dependencyManager
yOSON.AppCore.addModule('demoB', function(){
    return {
        init: function(){
            console.log('Hello Im Ready from B', $.ui);
        }
    };
}, dependences);

yOSON.AppCore.runModule('demoA');
yOSON.AppCore.runModule('demoB');

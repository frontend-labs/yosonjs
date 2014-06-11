//define the modules
var dependencyManager = new yOSON.DependencyManager();
var objModular = new yOSON.Modular();
var objComunicator = new yOSON.Comunicator();
//setting the dependencymanager
var staticHost = "http://localhost:8000/debug-area/js/";
dependencyManager.setStaticHost(staticHost);
var version = "a1b2c3de4r5";
dependencyManager.setVersionUrl(version);

//Append the methods to Bridge with modules
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

//append the demo urls
var dependences = [
    'http://code.jquery.com/jquery-1.11.0.min.js',
    'http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js',
    'http://cdnjs.cloudflare.com/ajax/libs/jquery-color/2.1.2/jquery.color.min.js'
];
var dependencesStatic = [
    'demo.js',
    'yoson-load.js'
];
//1st executing modular with dependencyManager
yOSON.AppCore.addModule('demoA', function(Sb){
    var nuevo = function(){
    };
    return {
        init: function(){
            Sb.trigger('nuevo');
            console.log('Hello Im Ready in module A');
        }
    };
}, dependences);

//2nd executing modular with dependencyManager
yOSON.AppCore.addModule('demoB', function(Sb){
    var nuevo = function(){
        console.log('holaaaaaaaaaaaaaa :D');
    };
    return {
        init: function(){
            Sb.events(['nuevo'], nuevo, this);
            console.log('Hello Im Ready from B', yOSON);
        }
    };
}, dependences);

yOSON.AppCore.runModule('demoA');
yOSON.AppCore.runModule('demoB');

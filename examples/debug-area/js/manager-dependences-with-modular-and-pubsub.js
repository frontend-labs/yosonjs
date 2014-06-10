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

var dependencesStatic = [
    'demo.js',
    'yoson-load.js'
];
//setting the dependencymanager
var staticHost = "http://localhost:8000/debug-area/js/";
dependencyManager.setStaticHost(staticHost);
var version = "a1b2c3de4r5";
dependencyManager.setVersionUrl(version);
//Append the methods to Bridge with modules
objModular.addMethodToBrigde('events', yOSON.Comunicator, "subscribe");
objModular.addMethodToBrigde('trigger',yOSON.Comunicator, "publish");

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
yOSON.AppCore.addModule('demoA', function(Sb){
    var nuevo = function(){
        console.log('holaaaaaaaaaaaaaa');
    };
    return {
        init: function(){
            console.log('Hello Im Ready in module A', $);
            Sb.events(['nuevo'], nuevo, this);
        }
    }
}, dependences);

//2nd executing modular with dependencyManager
yOSON.AppCore.addModule('demoB', function(Sb){
    return {
        init: function(){
            Sb.trigger('nuevo');
            console.log('Hello Im Ready from B', yOSON);
        }
    };
}, []);

yOSON.AppCore.runModule('demoA');
yOSON.AppCore.runModule('demoB');

//define the modules
var dependencyManager = new yOSON.DependencyManager();
var objModular = new yOSON.Modular();
//append the demo urls
var dependences = [
    'http://code.jquery.com/jquery-1.11.0.min.js',
    'http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js',
    'http://cdnjs.cloudflare.com/ajax/libs/jquery-color/2.1.2/jquery.color.min.js'
];
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
//Append demo dependences
//dependencyManager.addScript(dependences[0]);
//dependencyManager.addScript(dependences[1]);
//dependencyManager.addScript(dependences[2]);
//when is ready
dependencyManager.ready([dependences[0]], function(){
    console.log('done!', $);
});

dependencyManager.ready(dependences, function(){
    console.log('se debe ejecutar desde la cache del manager!', $.ui);
});

//1st executing modular with dependencyManager
yOSON.AppCore.addModule('demoA', function(){
    return {
        init: function(){
            console.log('Hello Im Ready', $);
        }
    }
}, dependences);

//2nd executing modular with dependencyManager
yOSON.AppCore.addModule('demoB', function(){
    return {
        init: function(){
            console.log('Hello Im Ready from B', $.ui);
        }
    }
}, dependences);
yOSON.AppCore.runModule('demoB');

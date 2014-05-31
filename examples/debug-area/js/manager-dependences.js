//define the modules
var dependencyManager = new yOSON.DependencyManager();

//
var dependences = [
    'http://code.jquery.com/jquery-1.11.0.min.js',
    'http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js'
];
//Append demo dependences
dependencyManager.addScript(dependences[0]);
dependencyManager.addScript(dependences[1]);
//when is ready
dependencyManager.ready([ dependences[0] ], function(){
    console.log('done!', $);
});

dependencyManager.ready([ dependences[0], dependences[1] ], function(){
    console.log('se debe ejecutar desde la cache del manager!', $);
});

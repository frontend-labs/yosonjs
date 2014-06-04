//define the modules
var dependencyManager = new yOSON.DependencyManager();
//append the demo urls
var dependences = [
    'http://code.jquery.com/jquery-1.11.0.min.js',
    //'http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js'
    'http://cdnjs.cloudflare.com/ajax/libs/jquery-color/2.1.2/jquery.color.min.js'
];
//when is ready
dependencyManager.ready([dependences[0]], function(){
    console.log('done!', $);
});

dependencyManager.ready(dependences, function(){
    console.log('se debe ejecutar desde la cache del manager!', $.ui);
});

//define the modules
var dependencyManager = new yOSON.Components.DependencyManager();
dependencyManager.setStaticHost("http://cdn.aptixtus.e3.pxe/js/");
//append the demo urls
var dependences = [
    'http://code.jquery.com/jquery-1.11.0.min.js',
    'http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js'
    //'http://cdnjs.cloudflare.com/ajax/libs/jquery-color/2.1.2/jquery.color.min.js'
];

var dependencesApt = [
    'src/libs/yoson/data/rulesValidate.js',
    'src/libs/underscore.js',
    'src/libs/jquery/jqFancybox.js'
];

var empty = [];
//when is ready
dependencyManager.ready([], function(){
    console.log('mod 01');
});

dependencyManager.ready([dependencesApt[2]], function(){
    console.log('mod 02');
});

dependencyManager.ready([dependencesApt[2]], function(){
    console.log('mod 03');
});

dependencyManager.ready([dependencesApt[2]], function(){
    console.log('mod 04');
});

dependencyManager.ready([], function(){
    console.log('mod 05');
});

dependencyManager.ready([], function(){
    console.log('mod 06');
});

dependencyManager.ready(dependencesApt, function(){
    console.log('done!');
});

dependencyManager.ready([dependencesApt[1]], function(){
    console.log('mod 1');
});

dependencyManager.ready([], function(){
    console.log('mod 2');
});

dependencyManager.ready([dependencesApt[2]], function(){
    console.log('mod 3');
});


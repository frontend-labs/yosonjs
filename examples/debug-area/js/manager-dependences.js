//define the modules
var dependencyManager = new yOSON.DependencyManager();

//Append demo dependences
dependencyManager.addScript('http://code.jquery.com/jquery-1.11.0.min.js');
dependencyManager.addScript('http://code.jquery.com/jquery-1.11.0.min.js');

//
dependencyManager.ready('http://code.jquery.com/jquery-1.11.0.min.js', function(){
    console.log('done!');
});

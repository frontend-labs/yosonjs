//define the module
yOSON.AppCore.addModule('helloWorld', function(){
    var welcome = function(){
        alert('Hello Im a Module in yOSON :)');
    };
    return {
        init: welcome
    }
});
//run the module
yOSON.AppCore.runModule('helloWorld');

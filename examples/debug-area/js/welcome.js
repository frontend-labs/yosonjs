//define the module
yOSON.AppCore.addModule('helloWorld', function(){
    var welcome = function(){
        alert('welcome to yOSON!!');
    };
    return {
        init: welcome
    }
});
//run the module
yOSON.AppCore.runModule('helloWorld');

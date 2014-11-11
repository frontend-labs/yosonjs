var firstTask = function(next){
    setTimeout(function() {
        console.log('done 1st task');
        next();
    }, 1000);
};

var secondTask = function(next){
    console.log('Hello! Im the secondTask');
    next();
};

var objSequential = new yOSON.Components.Sequential();
objSequential.inQueue(firstTask).inQueue(secondTask);

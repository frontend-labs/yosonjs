var methodTest = function(){
    console.log('start methodTest');
    var objPromise = new yOSON.Components.SinglePromise();
    setTimeout(function() {
        objPromise.done();
    }, 1000);
    return objPromise;
};

var whenDone = function(){
    var objPromise = new yOSON.Components.SinglePromise();
    console.log('start 2nd method');
    setTimeout(function() {
        objPromise.done();
    }, 1000);
    return objPromise;
};

var methodTestPassingInstance = function(){
    console.log('start methodTestPassingInstance');
    var objPromise = new yOSON.Components.SinglePromise();
    var dummyObject = {"msge": "Hello from methodTestPassingInstance"};
    setTimeout(function() {
        objPromise.done(dummyObject);
    }, 1000);
    return objPromise;
};

var methodTestPassingManyInstances = function(){
    console.log('start methodTestPassingInstance');
    var objPromise = new yOSON.Components.SinglePromise();
    var dummyObject = {"msge": "Hello from methodTestPassingInstance"};
    var anotherDummyObject = {"msge": "Hello again"};
    setTimeout(function() {
        objPromise.done(dummyObject, anotherDummyObject);
    }, 1000);
    return objPromise;
};

methodTest().then(function(){
    console.log('echo 1!');
}).then(whenDone).then(function(){
    console.log('echo 2');
});

methodTestPassingInstance().then(function(objectWhenDone){
    console.log("show message: ", objectWhenDone.msge);
});

methodTestPassingManyInstances().then(function(objectWhenDone, otherObject){
    console.log("show message: ", objectWhenDone.msge);
    console.log("show message from otherObject: ", otherObject.msge);
});

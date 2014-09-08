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

methodTest().then(function(){
    console.log('echo 1!');
}).then(whenDone).then(function(){
    console.log('echo 2');
});
var subPromiseA = function(){
    var subPromiseA = new yOSON.Components.SinglePromise();
    //setTimeout(function() {
        subPromiseA.done();
    //}, Math.random() * 1000 + 1000);
    return subPromiseA;
};

var subPromiseB = function(){
    var subPromiseB = new yOSON.Components.SinglePromise();
    setTimeout(function() {
        subPromiseB.done();
    }, Math.random() * 1000 + 1000);
    return subPromiseB;
};

//promises of promises
var pipePromiseA = function(){
    var objPromiseA = new yOSON.Components.SinglePromise();
    //subpromises

    var arrayOfPromises = [subPromiseA(), subPromiseB()];
    objPromiseA.pipe(arrayOfPromises, function(){
        objPromiseA.done();
    }, whenFails);

    return objPromiseA;
};
console.log('pipePromiseA', pipePromiseA);
//pipePromiseA.then(function(){
    //console.log('all pipePromiseA done');
//},function(){
    //console.log('fail');
//});

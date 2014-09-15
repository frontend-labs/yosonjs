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
    var intPromiseA = new yOSON.Components.SinglePromise();
    //setTimeout(function() {
    intPromiseA.done(function(){
        console.log("resuelto subPromiseA");
    });
    //}, Math.random() * 1000 + 1000);
    return intPromiseA;
};

var subPromiseB = function(){
    var intPromiseB = new yOSON.Components.SinglePromise();
    setTimeout(function() {
        intPromiseB.done(function(){
            console.log("resuelto subPromiseB");
        });
    }, Math.random() * 1000 + 2000);
    return intPromiseB;
};

//promises of promises
var pipePromiseA = function(list){
    var objPromiseA = new yOSON.Components.SinglePromise();
    //subpromises

    var arrayOfPromises = list;
    objPromiseA.pipe(arrayOfPromises, function(){
        objPromiseA.done();
    }, function(){
        console.log('wuat??');
    });

    console.log('objPromiseA', objPromiseA);
    return objPromiseA;
};

console.log('pipePromiseA', pipePromiseA);
//pipePromiseA().then(function(){
   //console.log('end of pipe');
//});

//pipePromiseA([subPromiseA()]).then(function(){
   //console.log('first');
//});

pipePromiseA([subPromiseB(),subPromiseA()]).then(function(){
   console.log('second');
});

//pipePromiseA.then(function(){
    //console.log('all pipePromiseA done');
//},function(){
    //console.log('fail');
//});

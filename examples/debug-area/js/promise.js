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

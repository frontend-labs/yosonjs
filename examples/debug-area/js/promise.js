var methodTest = function(){
    console.log('start methodTest');
    var objPromise = new Promise();
    setTimeout(function() {
        objPromise.done();
    }, 1000);
    return objPromise;
};

var whenDone = function(){
    var objPromise = new Promise();
    setTimeout(function() {
        objPromise.done();
        console.log('start 2nd method');
    }, 1000);
    return objPromise;
};

methodTest().then(function(){
    console.log('echo 1!');
}).then(whenDone).then(function(){
    console.log('echo 2');
});

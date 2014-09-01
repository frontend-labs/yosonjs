//class Promise in development for yOSON
var Promise = function(){
    this.callbacks = {
        onSuccess: [],
        onBrokened: []
    };
};

Promise.prototype.eachCallback = function(callbackList, onEveryCallback){
    for(var indexCallback = 0; indexCallback < callbackList.length; indexCallback++){
        onEveryCallback.call(this, callbackList[indexCallback]);
    }
};

//
Promise.prototype.done = function(){
    this.eachCallback(this.callbacks.onSuccess, function(registeredCallback){
        registeredCallback.call(this);
    });
};

//when all tasks its success
Promise.prototype.then = function(whenItsDone, whenIsBroken){
    this.callbacks.onSuccess.push(whenItsDone);
    if(typeof whenIsBroken === "function"){
        this.callbacks.onBrokened.push(whenIsBroken);
    }
    return this;
};

//when the promise is broken
Promise.prototype.broken = function(objError){
    eachCallback(this.callbacks.onBrokened, function(registeredCallback){
        registeredCallback.call(this, objError);
    });
};

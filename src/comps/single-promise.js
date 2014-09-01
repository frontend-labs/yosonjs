define([
    "yoson"
], function(yOSON){

    var SinglePromise = function(){
        this.callbacks = {
            succeededs:[],
            faileds:[]
        };
    };

    SinglePromise.prototype.eachCallBackList = function(callbackList, onEveryCallback){
        for(var indexCallback = 0; indexCallback < callbackList.length; indexCallback++){
            onEveryCallback.call(this, callbackList[indexCallback]);
        }
    };

    SinglePromise.prototype.done = function(){
        this.eachCallBackList(this.callbacks.succeededs, function(callbackRegistered){
            callbackRegistered.call(this);
        });
    };

    //when all tasks its success
    SinglePromise.prototype.then = function(whenItsDone, whenIsFailed){
        this.callbacks.succeededs.push(whenItsDone);
        if(typeof whenIsFailed === "function"){
            this.callbacks.faileds.push(whenIsFailed);
        }
        return this;
    };

    //when the promise is broken
    SinglePromise.prototype.fail = function(objError){
        this.eachCallBackList(this.callbacks.faileds, function(callbackRegistered){
            callbackRegistered.call(this, objError);
        });
    };

    yOSON.Components.SinglePromise = SinglePromise;
    return SinglePromise;
});

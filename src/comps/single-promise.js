define([
    "yoson"
], function(yOSON){

    var SinglePromise = function(){
        this.callbacks = {
            succeededs:[],
            faileds:[]
        };
        this.status = "pending";
    };

    SinglePromise.prototype.eachCallBackList = function(callbackList, onEveryCallback){
        for(var indexCallback = 0; indexCallback < callbackList.length; indexCallback++){
            onEveryCallback.call(this, callbackList[indexCallback]);
        }
    };

    SinglePromise.prototype.done = function(){
        this.status = "done";

        this.eachCallBackList(this.callbacks.succeededs, function(callbackRegistered){
            callbackRegistered.call(this);
        });
    };

    //when all tasks its success
    SinglePromise.prototype.then = function(whenItsDone, whenIsFailed){
        var callbacks = this.callbacks;

        var byStatus = {
            "pending": function(){
                callbacks.succeededs.push(whenItsDone);
                if(typeof whenIsFailed === "function"){
                    callbacks.faileds.push(whenIsFailed);
                }

            },
            "done": function(){
                if(typeof whenItsDone === "function"){
                    whenItsDone.call(this);
                }
            },
            "fail": function(){
                whenIsFailed.call(this);
            }
        };
        byStatus[this.status]();
        return this;
    };

    //when the promise is broken
    SinglePromise.prototype.fail = function(objError){
        this.status = "fail";
        this.eachCallBackList(this.callbacks.faileds, function(callbackRegistered){
            callbackRegistered.call(this, objError);
        });
    };

    yOSON.Components.SinglePromise = SinglePromise;
    return SinglePromise;
});

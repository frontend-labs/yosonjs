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
        if(this.status === "done"){
            whenItsDone.call(this);
        } else {
            this.callbacks.succeededs.push(whenItsDone);
        }
        if(typeof whenIsFailed === "function"){
            if(this.status === "fail"){
                whenIsFailed.call(this);
            } else {
                this.callbacks.faileds.push(whenIsFailed);
            }
        }
        return this;
    };

    //when the promise is broken
    SinglePromise.prototype.fail = function(objError){
        this.status = "fail";
        this.eachCallBackList(this.callbacks.faileds, function(callbackRegistered){
            callbackRegistered.call(this, objError);
        });
    };

    SinglePromise.prototype.pipe = function(collectionOfPromises, whenAllDone, whenFails){
        var index = 0;
        var queuePromises = function(list){
            if(index < list.length){
                var itemPromise = list[index];
                itemPromise.then(function(){
                    index++;
                    queuePromises(list);
                }, whenFails);
            } else {
                whenAllDone.call(this);
            }
        }
        queuePromises(collectionOfPromises);
    }

    yOSON.Components.SinglePromise = SinglePromise;
    return SinglePromise;
});

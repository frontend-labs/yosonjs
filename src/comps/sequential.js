define([
    "yoson"
], function(yOSON){

    var Sequential = function(){
        this.taskInQueueToList = {};
        this.listTaskInQueue = [];
        this.running = {};
    };

    Sequential.prototype.generateId = function(){
        return this.listTaskInQueue.length;
    };

    Sequential.prototype.getTaskById = function(id){
        return this.taskInQueueToList[id];
    };

    Sequential.prototype.inQueue = function(methodToPassingToQueue){
        var that = this;
        var id = this.generateId();
        var skeletonTask = {
            running: false,
            initAlreadyCalled: false,
            nextTask: function(methodWhenDoneTask){
                skeletonTask.running = true;
                if(typeof methodWhenDoneTask === "function"){
                    methodWhenDoneTask.call(this);
                }
                that.dispatchQueue();
            },
            init: function(){
                if(skeletonTask.initAlreadyCalled){
                    return;
                }
                skeletonTask.initAlreadyCalled = true;
                methodToPassingToQueue.call(this, skeletonTask.nextTask);
            }
        }
        this.taskInQueueToList[id] = skeletonTask;
        this.listTaskInQueue.push(this.taskInQueueToList);
        this.dispatchQueue();
        return this;
    };

    Sequential.prototype.taskIsRunning = function(id){
        return this.taskInQueueToList[id].running;
    };

    Sequential.prototype.dispatchQueue = function(){
        var that = this,
        initialIndex = 0;
        loopList = function(listQueue, index){
            if(index < listQueue.length){
                var taskInQueue = that.getTaskById(index);
                if(!that.taskIsRunning(index)){
                    taskInQueue.init();
                } else {
                    index++;
                    loopList(listQueue, index);
                }
            }
        };
        loopList(this.listTaskInQueue, initialIndex);
    };

    yOSON.Components.Sequential = Sequential;
    return Sequential;
});

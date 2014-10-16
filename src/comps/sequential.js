var Sequential = function(){
    this.taskInQueueToList = {};
    this.listTaskInQueue = [];
};

/*
 * example of task object
 *  {
 *     "task": function(){
 *          //when ending the process put for indicate
 *          //this.nextTask();
 *     }
 *  }
 * */
Sequential.prototype.queue = function(taskSelf){
    var that = this;
    this.instanceQueueToList.status = "pending";
    this.instanceQueueToList.taskSelf = taskSelf();
    this.instanceQueueToList.nextTask = function(){
        this.running = true;
        that.dispatchQueue();
    };
    this.instanceQueueToList.running = false;
    this.listMethodsInQueue.push(this.instanceQueueToList);
    this.dispatchQueue();
};

Sequential.prototype.dispatchQueue = function(){
    var that = this,
        index = 0,
        loopList = function(){
            var taskInQueue = that.listMethodsInQueue[index];
            if(taskInQueue.running){
                taskInQueue.task();
                index++;
                if(index < that.listMethodsInQueue.length){
                    loopList(this.listMethodsInQueue);
                }
            }
        };
    loopList(this.listMethodsInQueue);
};

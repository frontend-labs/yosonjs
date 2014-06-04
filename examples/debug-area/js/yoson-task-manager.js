yOSON.taskManager = function(){
    this.tasks = [];
};

yOSON.generateIdTask = function(){
    return this.tasks.length + 1;
};

yOSON.taskManager.prototype.addTasks= function(taskList){
    var that = this;

    if(!taskList instanceof Array){
        return;
    }

    for(var index; index < taskList.length; index++){
        that.addTask(functionality);
    }

};

yOSON.tasksManager.prototype.addTask = function(functionality, optionalData){
    var data = "";

    if(typeof functionality !== "function"){
        return;
    }

    if(typeof optionaldata !== "undefined"){
        data = optionalData;
    }

    this.tasks[id] = {};
    this.tasks[id][functionality] = functionality;
    this.tasks[id][data] = data;

};

yOSON.taskManager.prototype.queueTask = function(taskList){
    var that = this,
        index = 0;

    var loopExecuteTasks = function(tasks){
            var task = that.getTask(tasks[index]);
            task.funcionality.call(this);

            if(typeof task.running === "undefined"){
                task.running = true;
            }

            index++;

            if(index < tasks){
                loopExecuteTasks(tasks);
            }
    };

    loopExecuteTasks(taskList);
};

yOSON.taskManager.prototype.removeTask = function(id){
    this.tasks[id] = null
};

yOSON.taskManager.prototype.getTask = function(id){
    return this.tasks[id];
};

yOSON.tasksManager.prototype.runTask = function(id){
    this.queueTask([ id ]);
};

yOSON.tasksManager.prototype.runTasks = function(tasks){
    this.queueTask(tasks);
};

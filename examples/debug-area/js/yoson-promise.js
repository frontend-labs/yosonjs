//class Promise in development for yOSON
var Promise = function(){
    this.tasks = [];
};

//
Promise.prototype.given = function(tasks){
    ObjTask = this.createTask(functionSelf);
    try {
        ObjTask.functionToExecute.call(this);
        ObjTask.whenFinally.call(this);
    } catch(errorExecution){
        console.log('errorExecution', errorExecution);
    }
    return this;
};

Promise.prototype.dealCoupleTaks = function(){

};

Promise.prototype.createTask = function(functionSelf){
    return {
        functionToExecute: functionSelf,
        whenFinally: function(){
            //continue with the next task
        }
    }
};
//when all tasks its success
Promise.prototype.so = function(){
};

//when some tasks fails or its broken
Promise.prototype.broken = function(){
};

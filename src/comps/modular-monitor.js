define(function(){
    var ModularMonitor = function(){
        this.modules = {};
    };

    ModularMonitor.prototype.updateStatus = function(moduleName, statusName){
        this.modules[moduleName] = statusName;
    };

    ModularMonitor.prototype.eachModules = function(eachModule){
        for(var moduleName in this.modules){
            var status = this.modules[moduleName];
            eachModule.call(this, status);
        }
    };

    ModularMonitor.prototype.getTotalModulesByStatus = function(statusName){
        var total = 0;
        this.eachModules(function(status){
            if(status === statusName){
                total++;
            }
        });
        return total;
    };

    ModularMonitor.prototype.getTotalModulesRunning = function(){
        return this.getTotalModulesByStatus('run');
    };

    ModularMonitor.prototype.getTotalModulesToStart = function(){
        return this.getTotalModulesByStatus('toStart') + this.getTotalModulesRunning();
    };

    return ModularMonitor;

});

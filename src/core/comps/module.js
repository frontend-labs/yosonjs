define(['base', 'core/comps/sandbox'],
   function(yOSON, sandbox){
     //object modules storage modules registereds
     var modules = {};
     var objectSandBox = new yOSON.sandbox();
     //collection of modules to initialize
     var collectionRunModules = [];
     var debug = false;

     var createModule = function(moduleId){
         var instance = modules[moduleId].definition(objectSandBox);
         var name, method;
         var funcLoop = function(name, method){
             return function(){
                 try{
                     return method.apply(this.arguments);
                 }catch(ex){
                     //send message of error
                 }
             };
         };
         if(!debug){
             for(name in instance){
                 method = instance[name];
                 if(typeof method === "function"){
                     var func =
                     instance[name] = funcLoop(name, method);
                 }
             }
         }
         return instance;
     },
     add = function(moduleId,funcDefinition, CollectionDependences){
         var dependences = (typeof CollectionDependences === "undefined")? []:dependences,
         schemaModule = {
             loaded: null,
             onLoaded: function(){
                queueModules();
             },
             definition: funcDefinition,
             instance: null,
             dependences: dependences
         };
         if(typeof modules[moduleId] === "undefined"){
             modules[moduleId] = schemaModule;
             return true;
         } else {
             throw "module with id" + moduleId + "already exists";
         }
     },
     get = function(moduleId){
         if(moduleId && modules[moduleId]){
             return modules[moduleId];
         } else {
             throw "module " + moduleId + "not found";
         }
     },
     runOnly = function(moduleId, params){
            if(typeof modules[moduleId] !== "undefined"){
                if(typeof params === "undefined"){
                    params = {};
                }
                params.moduleName = moduleId;
                var module = this.get(moduleId);
                var instanceModule = createModule(moduleId);

                if(instanceModule.hasOwnProperty('init')){
                    collectionRunModules.push(moduleId);
                    module.loaded = false;
                    module.instance = instanceModule;
                    if(module.dependences.length > 0){

                    } else {
                        module.params = params;
                        module.loaded = true;
                        module.onLoaded();
                    }
                }
            }
     },
     runCollection = function(moduleIds){
         for(var i = 0; i < moduleIds.length; i++){
            runOnly(moduleIds[i]);
         }
     },
     queueModules = function(){
         var x = 0,
            loopExecucion = function(modules){
                var module = get(modules[x]),
                    instance = module.instance,
                    params = module.params;

                if(module.loaded){
                    if(typeof module.running === "undefined"){
                        instance.init(params);
                        module.running = true;
                    }
                    x++;
                    if(x < module.length){
                        loopExecucion(modules);
                    }
                }
            };
        loopExecucion(collectionRunModules);
     };
     yOSON.module = {
        add:add,
        get: get,
        runOnly: runOnly,
        runCollection: runCollection
     };
     return yOSON;
});

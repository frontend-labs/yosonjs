define(['base', '../comps/sandbox'],
   function(yOSON, sandbox){
     var modules = {};
     var objectSandBox = new yOSON.sandbox();
     var collectionModules = [];
     var debug = false;

     var createModule = function(moduleId){
         var instance = modules[moduleId].definition(objectSandBox);
         var name, method;
         if(!debug){
             for(name in instance){
                 method = instance[name];
                 if(typeof method === "function"){
                     instance[name] = function(name, method){
                        return function(){
                            try{
                                return method.apply(this.arguments);
                            }catch(ex){
                                //send message of error
                            }
                        };
                     }(name, method);
                 }
             }
         }
         return instance;
     };
     yOSON.module = {
        add: function(moduleId,funcDefinition, dependences){

        },
        get: function(){

        },
        runOnly: function(){

        },
        runAll: function(){

        }
     };
});

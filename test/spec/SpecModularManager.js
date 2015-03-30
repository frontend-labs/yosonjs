define([
   '../../src/managers/modular.js',
   '../../src/comps/sequential.js'
  ],
  function(ModularManager, Sequential){

  describe('specModularManager', function(){
      var objModularManager, moduleName, moduleSelf;

      beforeEach(function(){
        objModularManager = new ModularManager();
        moduleName = "module-demo-test";
        moduleSelf = function(){
            var privateMethodA = function(){

            };
            return {
                publicMethodOfAModule: function(){

                },
                init: jasmine.createSpy()
            }
        };
      });

      it('should be add a module', function(){
          objModularManager.addModule(moduleName, moduleSelf);
          expect(objModularManager.getModule(moduleName)).toBeTruthy();
      });

      it("should be return true when the module exists", function(){
          objModularManager.addModule(moduleName, moduleSelf);
          expect(objModularManager.getModule(moduleName)).toBeTruthy();
      });

      it("should be run the module", function(){
          objModularManager.addModule(moduleName, moduleSelf);
          objModularManager.runModule(moduleName);

          var module = objModularManager.getModule(moduleName);
          expect(module.getStatusModule(moduleName)).toEqual('run');
      });

      it("should be setting the module status", function(){
          objModularManager.addModule(moduleName, moduleSelf);
          var module = objModularManager.getModule(moduleName);
          module.setStatusModule('ready');
          expect(module.getStatusModule(moduleName)).toEqual('ready');
      });

      it("should be append a method to bridge object", function(){
          var methodToBridge = jasmine.createSpy();
          objModularManager.addMethodToBrigde("dummy", methodToBridge);

          objModularManager.addModule('moduleA', function(objBridge){
              return {
                  init: function(){
                      objBridge.dummy();
                  }
              }
          });

          spyOn(objModularManager, 'runModule').and.callThrough();
          objModularManager.runModule('moduleA');
          expect(methodToBridge).toHaveBeenCalled();
      });

      describe("Handler callbacks by status of module", function(){
          var moduleName;

          it("must be execute when it start", function(done){
              var callbackStatusStart = jasmine.createSpy();
              moduleName = "moduleDemoHandler";

              objModularManager.addModule(moduleName, function(done){
                  return {init: function(){}}
              });

              var module = objModularManager.getModule(moduleName);
              module.setStatusModule("start");

              objModularManager.whenModuleHaveStatus(moduleName, "start", function(){
                callbackStatusStart();
                expect(callbackStatusStart).toHaveBeenCalled();
                done();
              });

              objModularManager.runModule(moduleName);

          });

          it("must be execute when its run", function(done){
              var callbackStatusRun = jasmine.createSpy();
                  moduleName = "moduleDemoHandler2";

              objModularManager.addModule(moduleName, function(){
                  return {init: function(){}}
              });

              objModularManager.runModule(moduleName);
              objModularManager.whenModuleHaveStatus(moduleName, "run", function(){
                callbackStatusRun();
                expect(callbackStatusRun).toHaveBeenCalled();
                done();
              });
          });
      });

      describe("Executing a synchronous mode", function(){
          var runModule, syncModule, runSequence, moduleNames, objSequential;
          beforeEach(function(){
              moduleNames = ["module-1st", "module-2nd", "module-3rd"];
              runSequence = [];
              objSequential = new Sequential();

              objModularManager.addModule(moduleNames[0], function(){
                  return {
                      init: function(){
                          runSequence.push("a");
                      }
                  }
              });

              objModularManager.addModule(moduleNames[2], function(){
                  return {
                      init: function(){
                          runSequence.push("c");
                      }
                  }
              });

              objModularManager.addModule(moduleNames[1], function(){
                  return {
                      init: function(){
                          runSequence.push("b");
                      }
                  }
              });

          });

          it("Must be execute in order", function(){
              objSequential.inQueue(function(next){
                  objModularManager.runModule(moduleNames[0]);
                  next();
              }).inQueue(function(next){
                  objModularManager.runModule(moduleNames[1]);
                  next();
              }).inQueue(function(next){
                  objModularManager.runModule(moduleNames[2]);
                  next();
              });
              expect(runSequence).toEqual(['a','b', 'c']);
          });
      });

  });
});

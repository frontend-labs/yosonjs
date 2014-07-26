define([
   '../../src/comps/modular-manager.js'
  ],
  function(ModularManager){
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
          expect(objModularManager.existsModule(moduleName)).toBeTruthy();
      });

      it("should be return true when the module exists", function(){
          objModularManager.addModule(moduleName, moduleSelf);
          expect(objModularManager.existsModule(moduleName)).toBeTruthy();
      });

      it("should be run the module", function(){
          objModularManager.addModule(moduleName, moduleSelf);
          objModularManager.runModule(moduleName);
          objModularManager.whenModuleHaveStatus(moduleName, 'run', function(name, moduleSelf){
              expect(moduleSelf.getStatusModule()).toEqual('run');
          });
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

          spyOn(objModularManager, 'runModule').andCallThrough();
          objModularManager.runModule('moduleA');
          objModularManager.whenModuleHaveStatus('moduleA', 'run', function(name, moduleSelf){
              expect(methodToBridge).toHaveBeenCalled();
          });
      });

      describe("handling many modules", function(){
          beforeEach(function(){

              objModularManager.addModule('moduleA', function(objBridge){
                  return {init: function(){}}
              });
              objModularManager.addModule('moduleB', function(objBridge){
                  return {init: function(){}}
              });
              objModularManager.addModule('moduleC', function(objBridge){
                  return {init: function(){}}
              });

              objModularManager.runModule('moduleA');
              objModularManager.runModule('moduleB');
              objModularManager.runModule('moduleC');

              jasmine.Clock.useMock();
          });

          it("should be return all modules started", function(){
              expect(objModularManager.getTotalModulesStarted()).toEqual(3);
          });

          xit("should be execute when not all modules running", function(){
              var methodWhenNotFinishRunningAll = jasmine.createSpy();
              objModularManager.allModulesRunning(methodWhenNotFinishRunningAll, function(){});
              waits(3000);
              runs(function(){
                  expect(methodWhenNotFinishRunningAll).toHaveBeenCalled();
              });
          });

          xit("should be execute when all modules running", function(){
              var methodWhenFinishRunningAll = jasmine.createSpy();
              objModularManager.allModulesRunning(function(){}, methodWhenFinishRunningAll);
              waits(3000);
              runs(function(){
                  expect(methodWhenFinishRunningAll).toHaveBeenCalled();
              });
          });
      });
  });
});

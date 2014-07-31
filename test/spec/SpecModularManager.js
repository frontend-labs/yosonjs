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
          expect(objModularManager.getModule(moduleName)).toBeTruthy();
      });

      it("should be return true when the module exists", function(){
          objModularManager.addModule(moduleName, moduleSelf);
          expect(objModularManager.getModule(moduleName)).toBeTruthy();
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

      describe("Handler callbacks by status of module", function(){
          var moduleName;
          it("must be execute when it start", function(){
              var callbackStatusStart = jasmine.createSpy();
              moduleName = "moduleDemoHandler";

              objModularManager.addModule(moduleName, function(){
                  return {init: function(){}}
              });
              objModularManager.runModule(moduleName);

              objModularManager.whenModuleHaveStatus(moduleName, "start", callbackStatusStart);

              waitsFor(function(){
                  return callbackStatusStart.callCount > 0;
              });
              runs(function(){
                  expect(callbackStatusStart).toHaveBeenCalled();
              });

          });

          it("must be execute when its run", function(){
              var callbackStatusRun = jasmine.createSpy();
                  moduleName = "moduleDemoHandler2";

              objModularManager.addModule(moduleName, function(){
                  return {init: function(){}}
              });

              objModularManager.syncModule(moduleName);
              objModularManager.runModule(moduleName);
              objModularManager.whenModuleHaveStatus(moduleName, "run", callbackStatusRun);

              waitsFor(function(){
                  return callbackStatusRun.callCount > 0;
              });

              runs(function(){
                  expect(callbackStatusRun).toHaveBeenCalled();
              });

          });
      });

  });
});

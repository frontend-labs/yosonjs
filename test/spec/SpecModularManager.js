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
          objModularManager.syncModule('moduleA');
          objModularManager.runModule('moduleA');
          waits(500);
          runs(function(){
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
              objModularManager.syncModule(moduleName);
              objModularManager.whenModuleHaveStatus(moduleName, "start", callbackStatusStart);
              objModularManager.runModule(moduleName);

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

      describe("Executing a synchronous mode", function(){
          var runModule, syncModule, runSequence, moduleNames;
          beforeEach(function(){
              moduleNames = ["module-1st", "module-2nd", "module-3rd"];
              runSequence = [];
              syncModule = objModularManager.syncModule;

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
              objModularManager.syncModule(moduleNames[0]);
              objModularManager.runModule(moduleNames[0]);

              objModularManager.syncModule(moduleNames[1]);
              objModularManager.runModule(moduleNames[1]);

              objModularManager.syncModule(moduleNames[2]);
              objModularManager.runModule(moduleNames[2]);

              waits(200);

              runs(function(){
                  expect(runSequence).toEqual(['a','b', 'c']);
              });

          });
      });

      describe("Modules Running Observer", function(){
          beforeEach(function(){
              objModularManager.addModule("moduleA", function(){
                  return {init:function(){}}
              });
              objModularManager.addModule("moduleB", function(){
                  return {init:function(){}}
              });
              objModularManager.addModule("moduleC", function(){
                  return {init:function(){}}
              });
          });

          it("Must be execute when all modules not running", function(){
              var methodToNotRunning = jasmine.createSpy();
              var methodToRunning = jasmine.createSpy();

              objModularManager.runModule("moduleA");
              objModularManager.runModule("moduleB");
              objModularManager.runModule("moduleC");

              objModularManager.allModulesRunning(methodToNotRunning, methodToRunning);
              waits(200);

              runs(function(){
                  expect(methodToNotRunning).toHaveBeenCalled();
                  expect(methodToRunning).not.toHaveBeenCalled();
              });
          });

          it("Must be execute when all modules its running", function(){
              var methodToNotRunning = jasmine.createSpy();
              var methodToRunning = jasmine.createSpy();

              objModularManager.syncModule("moduleA");
              objModularManager.runModule("moduleA");
              objModularManager.syncModule("moduleB");
              objModularManager.runModule("moduleB");
              objModularManager.syncModule("moduleC");
              objModularManager.runModule("moduleC");

              objModularManager.allModulesRunning(methodToNotRunning, methodToRunning);
              waits(200);

              runs(function(){
                  expect(methodToNotRunning).not.toHaveBeenCalled();
                  expect(methodToRunning).toHaveBeenCalled();
              });
          });
      })
  });
});

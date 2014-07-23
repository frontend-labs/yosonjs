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
          var module = objModularManager.getModule(moduleName);
          expect(module.getStatusModule()).toEqual('run');
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
          expect(methodToBridge).toHaveBeenCalled();

      });

  });
});

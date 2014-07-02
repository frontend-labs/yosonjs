define([
   '../../src/comps/modular.js'
  ],
  function(Modular){
  describe('specModular', function(){
      var objModular, moduleName, moduleSelf;

      beforeEach(function(){
        objModular = new Modular();
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
          objModular.addModule(moduleName, moduleSelf);
          expect(objModular.existsModule(moduleName)).toBeTruthy();
      });

      it("should be return the moduleDefinition method", function(){
          objModular.addModule(moduleName, moduleSelf);
          var module = objModular.getModule(moduleName);
          var hasDefinition = (typeof module.moduleDefinition === "function");
          expect(hasDefinition).toBeTruthy();
      });

      it("should be return a the public functions of the module definition", function(){
          objModular.addModule(moduleName, moduleSelf);
          var definition = objModular.getModuleDefinition(moduleName);
          expect(definition.publicMethodOfAModule).toBeDefined();
      });

      it("should be return true when the module exists", function(){
          objModular.addModule(moduleName, moduleSelf);
          expect(objModular.existsModule(moduleName)).toBeTruthy();
      });

      it("should be run the module", function(){
          objModular.addModule(moduleName, moduleSelf);
          objModular.runModule(moduleName);
          expect(objModular.moduleIsRunning(moduleName)).toBeTruthy();
      });

      it("should be setting the module status", function(){
          objModular.addModule(moduleName, moduleSelf);
          objModular.setStatusModule(moduleName, 'ready');
          expect(objModular.getStatusModule(moduleName)).toEqual('ready');
      });

      it("should be append a method to bridge object", function(){
          var methodToBridge = jasmine.createSpy();
          objModular.addMethodToBrigde("dummy", methodToBridge);

          objModular.addModule('moduleA', function(objBridge){
              return {
                  init: function(){
                      objBridge.dummy();
                  }
              }
          });

          spyOn(objModular, 'runModule').andCallThrough();
          objModular.runModule('moduleA');
          expect(methodToBridge).toHaveBeenCalled();

      });

  });
});

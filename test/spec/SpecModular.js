define([
   '../../src/comps/modular.js'
  ],
  function(Modular){
  describe('specModular', function(){
      var objModular;

      beforeEach(function(){
          objModular = new Modular();
      });

      it('should be add a module', function(){
        var moduleName = "module-demo",
            moduleSelf = function(){
                return {
                    init: function(){

                    }
                }
            };
        objModular.addModule(moduleName, moduleSelf);
        expect(objModular.existsModule(moduleName)).toBeTruthy();
      });

      it("should be return the module definition", function(){
        var moduleName = "module-demo",
            moduleSelf = function(){
                return {
                    init: function(){
                        return "hello";
                    }
                }
            };
        objModular.addModule(moduleName, moduleSelf);
        expect(objModular.getModuleDefinition(moduleName).hasOwnProperty("init")).toBeTruthy();
      });

  });
});

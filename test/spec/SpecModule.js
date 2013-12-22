define([
   '../../src/core/comps/module.js'
  ],
  function(yOSON){
  describe('specModule', function(){

      describe('creation of module', function(){
        var result,
            module,
            moduleName = 'moduleTest',
            moduleCtxTest = function(){
                return {
                    init: function(){
                        return "hello";
                    }
                }
            };

        beforeEach(function(){
            module = null;
        });

        afterEach(function(){
            result = null;
        });

        it('should create a instance', function(){
            result = yOSON.module.add(moduleName,moduleCtxTest);
            expect(result).toBeTruthy();
        });

        it('should run module', function(){
            result = yOSON.module.runOnly(moduleName);
            expect(result).toBeTruthy();
        });

      });

      describe('manage of modules', function(){
          var result, modules=[];
          beforeEach(function(){
              modules = ['moduleTestA','moduleTestB','moduleTestC','moduleTestD'];
          });

      });
  });
});

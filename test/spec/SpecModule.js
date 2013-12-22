define([
   '../../src/core/comps/module.js'
  ],
  function(yOSON){
  describe('specModule', function(){

      describe('creation of module', function(){
        var result;

        it('should create a instance', function(){
            result = yOSON.module.add('moduleTest', function(){
                return {
                    init: function(){
                        return "hello";
                    }
                }
            });
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

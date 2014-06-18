define([
   '../../src/comps/dependency.js'
  ],
  function(Dependency){
  describe('Dependency Component', function(){
      var utils, array, result, dependencyObjTest, successDependenceUrl, failDependenceUrl;

      beforeEach(function(){
       result = null;
       dependencyObjTest = new Dependency(successDependenceUrl);
       successDependenceUrl = "http://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.js";
       failDependenceUrl = "http://holamundooo.com/demo.js";
      });

      it('should be a success request', function(){
          dependencyObjTest = new Dependency(successDependenceUrl);
          dependencyObjTest.request();

          waits(1200);

          runs(function(){
              expect(dependencyObjTest.getStatus()).toEqual("ready");
          });

      });

      it('should be a fail request', function(){
          dependencyObjTest = new Dependency(failDependenceUrl);
          dependencyObjTest.request();

          waits(1000);

          runs(function(){
              expect(dependencyObjTest.getStatus()).toEqual("error");
          });

      });

  });
});

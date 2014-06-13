define([
   '../../src/core/comps/dependency.js'
  ],
  function(Dependency){
  describe('specUtils', function(){
      var utils, array, result, dependencyObjTest, successDependenceUrl, failDependenceUrl;

      beforeEach(function(){
       result = null;
       dependencyObjTest = null;
       successDependenceUrl = "http://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.js";
       failDependenceUrl = "http://hello.im/fake.js";
      });

      it('should be a success request', function(){
          dependencyObjTest = new Dependency(successDependenceUrl);
          dependencyObjTest.request();
          result = dependencyObjTest.getStatus();
          expect(result).toEqual("ready");
      });

      it('should be a fail request', function(){
          dependencyObjTest = new Dependency(failDependenceUrl);
          dependencyObjTest.request();
          result = dependencyObjTest.getStatus();
          expect(result).toEqual("error");
      });

  });
});

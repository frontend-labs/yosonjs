define([
   '../../src/comps/dependency.js'
  ],
  function(Dependency){
      describe('Dependency Component', function(){
          var utils, array, status, dependencyObjTest, successDependenceUrl, failDependenceUrl;

          beforeEach(function(){
           var status = "";
           dependencyObjTest = null;
           successDependenceUrl = "http://cdnjs.cloudflare.com/ajax/libs/Colors.js/1.2.4/colors.min.js";
           failDependenceUrl = "http://holamundooo.com/demo.js";
          });

          it('should be a success request', function(){
              dependencyObjTest = new Dependency(successDependenceUrl);
              dependencyObjTest.request({
                  onReady: function(){
                      status = "ready";
                  }
              });

              waitsFor(function(){
                  return status;
              }, 2000);

              runs(function(){
                  expect(status).toEqual("ready");
              });

          });

          it('should be a fail request', function(){
              status = "";
              dependencyObjTest = new Dependency(failDependenceUrl);
              dependencyObjTest.request({
                  onError: function(){
                      status = "error";
                  }
              });

              waitsFor(function(){
                  return status;
              }, 2000);

              runs(function(){
                  expect(status).toEqual("error");
              });

          });

      });
});

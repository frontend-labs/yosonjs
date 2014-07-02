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
              dependencyObjTest = new Dependency(failDependenceUrl);
              dependencyObjTest.request();

              waits(4000);

              runs(function(){
                  expect(dependencyObjTest.getStatus()).toEqual("error");
              });

          });

          describe('Callbacks', function(){
              var callbacks;

              beforeEach(function(){
                  callbacks = {
                      onRequest: jasmine.createSpy(),
                      onReady: jasmine.createSpy(),
                      onError: jasmine.createSpy()
                  };
              });

              it('should be execute when the state is on request', function(){
                  dependencyObjTest = new Dependency(successDependenceUrl);
                  spyOn(dependencyObjTest, 'request').andCallThrough();

                  dependencyObjTest.request({
                      onRequest: callbacks.onRequest
                  });

                  expect(callbacks.onRequest).toHaveBeenCalled();
              });

              it('should be execute when the state is on ready', function(){
                  dependencyObjTest = new Dependency(successDependenceUrl);

                  spyOn(dependencyObjTest, 'request').andCallThrough();

                  dependencyObjTest.request({
                      onReady: callbacks.onReady
                  });

                  waits(3000);

                  runs(function(){
                      expect(callbacks.onReady).toHaveBeenCalled();
                  });

              });

              it('should be execute when the state is on ready', function(){
                  dependencyObjTest = new Dependency(failDependenceUrl);

                  spyOn(dependencyObjTest, 'request').andCallThrough();

                  dependencyObjTest.request({
                      onError: callbacks.onError
                  });

                  waits(3000);

                  runs(function(){
                      expect(callbacks.onError).toHaveBeenCalled();
                  });

              });

          });

      });
});

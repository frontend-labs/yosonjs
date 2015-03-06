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

          it('should be a success request', function(done){
              var successCallback = jasmine.createSpy();
              dependencyObjTest = new Dependency(successDependenceUrl);
              dependencyObjTest.request({
                  onReady: function(){
                      successCallback();
                      expect(successCallback).toHaveBeenCalled();
                      done();
                  }
              });
          });

          it('should be a fail request', function(done){
              var failCallBack = jasmine.createSpy();
              dependencyObjTest = new Dependency(failDependenceUrl);
              dependencyObjTest.request({
                  onError: function(){
                      failCallBack();
                      expect(failCallBack).toHaveBeenCalled();
                      done();
                  }
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

              it('should be execute when the state is on request', function(done){
                  dependencyObjTest = new Dependency(successDependenceUrl);
                  dependencyObjTest.request({
                      onRequest: function(){
                          callbacks.onRequest();
                          expect(callbacks.onRequest).toHaveBeenCalled();
                          done();
                      }
                  });
              });

              it('should be execute when the state is on ready', function(done){
                  dependencyObjTest = new Dependency(successDependenceUrl);
                  dependencyObjTest.request({
                      onReady: function(){
                          callbacks.onReady();
                          expect(callbacks.onReady).toHaveBeenCalled();
                          done();
                      }
                  });
              });

              it('should be execute when the state is on ready', function(done){
                  dependencyObjTest = new Dependency(successDependenceUrl);
                  dependencyObjTest.request({
                      onReady: function(instanceLoaded){
                          expect(instanceLoaded).not.toBeUndefined();
                          done();
                      }
                  });
              });

              it('should be execute when the state is on Error', function(done){
                  dependencyObjTest = new Dependency(failDependenceUrl);
                  dependencyObjTest.request({
                      onError: function(){
                          callbacks.onError();
                          expect(callbacks.onError).toHaveBeenCalled();
                          done();
                      }
                  });
              });
          });
      });
});

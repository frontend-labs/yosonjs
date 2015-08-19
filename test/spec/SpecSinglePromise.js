define([
   '../../src/comps/single-promise.js'
  ],
  function(SinglePromise){
      describe('SinglePromise Component', function(){
          var objSinglePromiseTest, dummyFunction, randomTimeout;

          beforeEach(function(){
              randomTimeout = Math.ceil(Math.random() * 1000) + 1;
              objSinglePromiseTest = null;
              dummyFunction = function(){};
          });

          it('should be execute the success callback when invoke "then"', function(done){
              var successCallback = jasmine.createSpy();
              dummyFunction = function(){
                  objSinglePromiseTest = new SinglePromise();
                  setTimeout(function(){
                      objSinglePromiseTest.done();
                  }, randomTimeout);
                  return objSinglePromiseTest;
              };
              dummyFunction().then(function(){
                  successCallback();
                  expect(successCallback).toHaveBeenCalled();
                  done();
              });
          });


          it('should be execute the success callback with params when invoke "then"', function(done){
              var message = "data";
              dummyFunction = function(){
                  objSinglePromiseTest = new SinglePromise();
                  setTimeout(function(){
                      objSinglePromiseTest.done(message);
                  }, randomTimeout);
                  return objSinglePromiseTest;
              };
              dummyFunction().then(function(paramMessage){
                  expect(message).toEqual(paramMessage);
                  done();
              });
          });

          it('should be execute the fail callback when invoke "then"', function(done){
              var failCallback = jasmine.createSpy();
              dummyFunction = function(){
                  objSinglePromiseTest = new SinglePromise();
                  setTimeout(function(){
                      objSinglePromiseTest.fail();
                  }, randomTimeout);
                  return objSinglePromiseTest;
              };
              dummyFunction().then(function(){},function(){
                  failCallback();
                  expect(failCallback).toHaveBeenCalled();
                  done();
              });
          });

      });
});

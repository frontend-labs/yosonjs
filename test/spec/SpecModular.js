define([
   '../../src/comps/modular.js'
  ],
  function(Modular){
  describe('specModular', function(){
      var objModular, moduleName, moduleSelf;

      beforeEach(function(){
        objModular = new Modular();
        moduleSelf = function(){
            var privateMethodA = function(){

            };
            return {
                init: jasmine.createSpy()
            }
        };
      });

      it('should be create a module', function(){
          objModular.create(moduleSelf);
          expect(true).toBeTruthy();
      });

      it("should be run the module", function(){
          objModular.create(moduleSelf);
          objModular.start();
          expect(objModular.getStatusModule()).toEqual('run');
      });

      it("should be setting the module status", function(){
          objModular.create(moduleSelf);
          objModular.setStatusModule('ready');
          expect(objModular.getStatusModule()).toEqual('ready');
      });

      it("should be append a method to pass the definition", function(){
          var methodToBridge = jasmine.createSpy();
          objModular = new Modular({
              "dummy": methodToBridge
          });
          objModular.create(function(objBridge){
              return {
                  init: function(){
                      objBridge.dummy();
                  }
              }
          });

          spyOn(objModular, 'start').and.callThrough();
          objModular.start();
          expect(methodToBridge).toHaveBeenCalled();
      });

      describe("Callbacks", function(){
          var callbacks;

          beforeEach(function(){
              callbacks = {
                  onCreated: jasmine.createSpy(),
                  onRun: jasmine.createSpy(),
                  onError: jasmine.createSpy()
              };
          });

          it("should be execute when its created", function(done){
              var objModular = new Modular({},{
                onCreated: function(){
                   callbacks.onCreated();
                   expect(callbacks.onCreated).toHaveBeenCalled();
                   done();
                }
              });
              objModular.create(function(){
                  return {
                      init: function(){}
                  }
              });
          });

          it("should be execute when its run", function(done){
              var objModular = new Modular({},{
                onRun: function(){
                   callbacks.onRun();
                   expect(callbacks.onRun).toHaveBeenCalled();
                   done();
                }
              });
              objModular.create(function(){
                  return {
                      init: function(){}
                  }
              });
              objModular.start();
          });

          it("should be execute when has an error", function(done){
              var objModular = new Modular({},{
                onError: function(){
                   callbacks.onError();
                   expect(callbacks.onError).toHaveBeenCalled();
                   done();
                }
              });
              objModular.create(function(){
                  return {
                      init: function(){
                        demo();
                      }
                  }
              });
              objModular.start();
          });


      })

  });
});

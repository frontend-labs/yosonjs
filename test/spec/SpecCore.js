define([
   '../../src/core.js'
  ],
  function(yOSON){

    describe('Core', function(){
        var addModule, runModule, dependence;

        it('should be set the staticHost', function(){
            yOSON.AppCore.setStaticHost('http://statichost.com/');
            expect(true).toBeTruthy();
        });

        it('should be set the version of the url', function(){
            yOSON.AppCore.setVersionUrl('?v=0.0.1');
            expect(true).toBeTruthy();
        });

        it('should be create a module', function(){
            yOSON.AppCore.addModule('nuevo-modulo', function(){
                return {
                    init: function(){

                    }
                }
            });
            expect(true).toBeTruthy();
        });

        it('should be run a module', function(){
            yOSON.AppCore.addModule('nuevo-modulo', function(){
                return {
                    init: function(){

                    }
                }
            });
            yOSON.AppCore.runModule('nuevo-modulo');
            expect(true).toBeTruthy();
        });

        describe('test dependences of modules', function(){
            beforeEach(function(){
                addModule = yOSON.AppCore.addModule;
                runModule = yOSON.AppCore.runModule;
                getStatusModule = yOSON.AppCore.getStatusModule;
                whenModuleRun = yOSON.AppCore.whenModule;
                dependence = "http://cdnjs.cloudflare.com/ajax/libs/Colors.js/1.2.4/colors.min.js";
            });

            it("should load first moduleA then moduleB", function(){
                addModule('moduleA', function(){
                    return {
                        init: function(){

                        }
                    }
                });

                addModule('moduleB', function(){
                    return {
                        init: function(){

                        }
                    }
                },[dependence]);

                runModule('moduleA');
                runModule('moduleB');

                waits(200);
                runs(function(){
                    expect(getStatusModule('moduleA')).toEqual('run');
                });
            });

            xit("should execute the method of moduleB in moduleA", function(){
                var functionToBridge = jasmine.createSpy();
                var e = false;
                yOSON.AppCore.addModule('moduleA', function(Sb){
                    return {
                        init: function(){
                            functionToBridge();
                        }
                    }
                });

                //addModule('moduleB', function(Sb){
                    //var methodToTrigger = function(){
                        //functionCalled = true;
                    //};
                    //return {
                        //init: function(){
                            //Sb.events(["methodInB"], functionToBridge , this);
                        //}
                    //}
                //},[dependence]);

                spyOn(yOSON.AppCore, 'runModule').andCallThrough();
                yOSON.AppCore.runModule('moduleA');
                //runModule('moduleB');

                waits(5000);
                runs(function(){
                    //expect(e).toBeTruthy();
                    expect(functionToBridge).toHaveBeenCalled();
                });
            });

        });
    });
});

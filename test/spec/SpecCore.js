define([
   '../../src/core.js'
  ],
  function(yOSON){

    describe('Core', function(){
        it('should be set the staticHost', function(){
            yOSON.AppCore.setStaticHost('http://statichost.com/');
            expect(true).toBeTruthy();
        });

        it('should be set the version of the url', function(){
            yOSON.AppCore.setVersionUrl('?v=0.0.1');
            expect(true).toBeTruthy();
        });

        it('should be create a module', function(){
            yOSON.AppCore.addModule('nombreModulo', function(){
                return {
                    init: function(){

                    }
                }
            });
            expect(true).toBeTruthy();
        });

        it('should be run a module', function(done){
            var functionMustRun = jasmine.createSpy();
            yOSON.AppCore.addModule('moduleA', function(){
                return {
                    init: function(){
                        functionMustRun();
                        expect(functionMustRun).toHaveBeenCalled();
                        done();
                    }
                }
            });
            yOSON.AppCore.runModule('moduleA');
        });

        it('should be execute method from moduleA1 to moduleB1', function(done){
            var functionToBridge = jasmine.createSpy();
            yOSON.AppCore.addModule('moduleA1', function(Sb){
                var privateMethodA1 = function(){
                    functionToBridge();
                    expect(functionToBridge).toHaveBeenCalled();
                    done();
                };
                return {
                    init: function(){
                        Sb.events(['publicMethodInModuleA1'], privateMethodA1, this);
                    }
                }
            });
            yOSON.AppCore.addModule('moduleB1', function(Sb){
                return {
                    init: function(){
                        Sb.trigger('publicMethodInModuleA1');
                    }
                }
            });
            yOSON.AppCore.runModule('moduleA1');
            yOSON.AppCore.runModule('moduleB1');
        });

        it('should be execute method from moduleB2 to moduleA2', function(done){
            var functionToBridge2 = jasmine.createSpy();
            var dependence = "http://cdnjs.cloudflare.com/ajax/libs/Colors.js/1.2.4/colors.min.js";

            yOSON.AppCore.addModule('moduleA2', function(Sb){
                return {
                    init: function(){
                        Sb.trigger('publicMethodInModuleB2');
                    }
                }
            });

            yOSON.AppCore.addModule('moduleB2', function(Sb){
                var privateMethodB2 = function(){
                    functionToBridge2();
                    expect(functionToBridge2).toHaveBeenCalled();
                    done();
                };
                return {
                    init: function(){
                        Sb.events(['publicMethodInModuleB2'], privateMethodB2 , this);
                    }
                }
            });

            yOSON.AppCore.runModule('moduleA2');
            yOSON.AppCore.runModule('moduleB2');
        });

        it('should be execute method with params from moduleB3 to moduleA3', function(done){
            var functionToBridge3 = jasmine.createSpy();
            var dependence = "http://cdnjs.cloudflare.com/ajax/libs/Colors.js/1.2.4/colors.min.js";

            yOSON.AppCore.addModule('moduleA3', function(Sb){
                return {
                    init: function(){
                        Sb.trigger('publicMethodInModuleB3', "hello", "world");
                    }
                }
            });

            yOSON.AppCore.addModule('moduleB3', function(Sb){
                var privateMethodB3 = function(paramA, paramB){
                    functionToBridge3(paramA, paramB);
                    expect(functionToBridge3).toHaveBeenCalledWith(paramA, paramB);
                    done();
                };
                return {
                    init: function(){
                        Sb.events(['publicMethodInModuleB3'], privateMethodB3 , this);
                    }
                }
            }, [ dependence ]);

            yOSON.AppCore.runModule('moduleA3');
            yOSON.AppCore.runModule('moduleB3');
        });

        xit('should be execute method with params from moduleB4 to moduleA4 and moduleC4', function(done){
            var functionToBridge4 = jasmine.createSpy();
            var dependence = "http://cdnjs.cloudflare.com/ajax/libs/Colors.js/1.2.4/colors.min.js";

            var dataCount = {
                index: 0,
                increment: function(){
                    this.index+=1;
                }
            }
            yOSON.AppCore.addModule('moduleA4', function(Sb){
                return {
                    init: function(){
                        Sb.trigger('publicMethodInModuleB4', "hello", "world",function(data){
                            dataCount.increment();
                        });
                    }
                }
            });

            yOSON.AppCore.addModule('moduleC4', function(Sb){
                return {
                    init: function(){
                        Sb.trigger('publicMethodInModuleB4', "hello2", "world2",function(data){
                            expect(data.index).toEqual(2);
                            done();
                        });
                    }
                }
            });

            yOSON.AppCore.addModule('moduleB4', function(Sb){
                var privateMethodB4 = function(paramA, paramB, callback){
                    functionToBridge4(paramA, paramB);
                    callback.call(this, dataCount);
                };
                return {
                    init: function(){
                        Sb.events(['publicMethodInModuleB4'], privateMethodB4 , this);
                    }
                }
            }, [ dependence ]);

            yOSON.AppCore.runModule('moduleB4');
            yOSON.AppCore.runModule('moduleA4');
            yOSON.AppCore.runModule('moduleC4');
        });
    });
});

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

        xit('should be run a module', function(done){
            yOSON.AppCore.addModule('nuevo-modulo', function(){
                return {
                    init: function(){
                        expect(true).toBeTruthy();
                        done();
                    }
                }
            });
            yOSON.AppCore.runModule('nuevo-modulo');
        });
    });
});

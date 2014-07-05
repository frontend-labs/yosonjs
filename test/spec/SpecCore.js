define([
   '../../src/core.js'
  ],
  function(yOSON){

    describe('Core', function(){

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

        it('should be set the staticHost', function(){
            yOSON.AppCore.setStaticHost('http://statichost.com/');
            expect(true).toBeTruthy();
        });

        it('should be set the version of the url', function(){
            yOSON.AppCore.setVersionUrl('?v=0.0.1');
            expect(true).toBeTruthy();
        });

        it('should be get all components of the core', function(){
            var components = yOSON.AppCore.getComponents();
            expect(true).toEqual();
        });
    });

});

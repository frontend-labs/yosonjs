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

        });

        it('should be remove a module', function(){

        });

        it('should be set the staticHost', function(){

        });

        it('should be set the version of the url', function(){

        });
    });

});

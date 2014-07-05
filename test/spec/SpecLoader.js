define([
   '../../src/comps/loader.js',
   '../scripts/schema-demo.js'
  ],
  function(Loader, SchemaDemo){
      describe('LoaderComp', function(){
          var objLoader;

          beforeEach(function(){
              objLoader = new Loader(SchemaDemo);
          });

          it('should run the default module', function(){
              var defaultModule = jasmine.createSpy("defaultModule");
              SchemaDemo.modules.byDefault = defaultModule;
              objLoader.init();
              expect(defaultModule).toHaveBeenCalled();
          });

      });
});

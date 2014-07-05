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

          it('should run the allModules node', function(){
              var allModules = jasmine.createSpy("allModules");
              SchemaDemo.modules.allModules = allModules;

              objLoader.init();
              expect(allModules).toHaveBeenCalled();
          });

          it('should run the default module', function(){
              var defaultModule = jasmine.createSpy("defaultModule");
              SchemaDemo.modules.byDefault = defaultModule;

              objLoader.init();
              expect(defaultModule).toHaveBeenCalled();
          });

          it('should run the allControllers node', function(){
              var allControllers = jasmine.createSpy("allControllers");
              SchemaDemo.modules.application.allControllers = allControllers;

              objLoader.init('application');
              expect(allControllers).toHaveBeenCalled();
          });

          it('should run the default controller by module application', function(){
              var defaultController = jasmine.createSpy("defaultController");
              SchemaDemo.modules.application.controllers.byDefault = defaultController;

              objLoader.init('application');
              expect(defaultController).toHaveBeenCalled();
          });

          it('should run the allActions of index controller by module application', function(){

              var allActions = jasmine.createSpy("allActions");
              SchemaDemo.modules.application.controllers.index.allActions = allActions;
              objLoader.init('application', 'index');
              expect(allActions).toHaveBeenCalled();
          });

          it('should run the default action of index controller by module application', function(){

              var defaultAction = jasmine.createSpy("defaultAction");
              SchemaDemo.modules.application.controllers.index.actions.byDefault = defaultAction;
              objLoader.init('application', 'index');
              expect(defaultAction).toHaveBeenCalled();
          });

          it('should run the index action of index controller by module application', function(){

              var indexAction = jasmine.createSpy("indexAction");
              SchemaDemo.modules.application.controllers.index.actions.index = indexAction;
              objLoader.init('application', 'index', 'index');
              expect(indexAction).toHaveBeenCalled();
          });

      });
});

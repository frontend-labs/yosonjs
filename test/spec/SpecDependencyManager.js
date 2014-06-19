define([
   '../../src/comps/dependency-manager.js'
  ],
  function(DependencyManager){
      describe("DependencyManager Component", function(){
          var versionUrl, objDependencyManager;
          beforeEach(function(){
              versionUrl = null
          });

          it('should be set the url of static server', function(){
              objDependencyManager = new DependencyManager();
              var staticHost = "http://stat.host.com/";
              objDependencyManager.setStaticHost(staticHost);

              var currentStaticHost = objDependencyManager.getStaticHost();
              expect(currentStaticHost).toEqual("pepito");
          });

      });
});

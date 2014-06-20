define([
   '../../src/comps/dependency-manager.js'
  ],
  function(DependencyManager){
      describe("DependencyManager Component", function(){
          var versionUrl,
              staticHost,
              urlTest,
              objDependencyManager;

          beforeEach(function(){
              staticHost = "http://stat.host.com/";
              versionUrl = "?v12022008";
              objDependencyManager = new DependencyManager();
          });

          it('should be set the url of static server', function(){
              objDependencyManager.setStaticHost(staticHost);

              currentStaticHost = objDependencyManager.getStaticHost();
              expect(currentStaticHost).toEqual(staticHost);
          });

          it('should be set the version url', function(){
              objDependencyManager.setVersionUrl(versionUrl);

              currentVersion = objDependencyManager.getVersionUrl();
              expect(currentVersion).toEqual(versionUrl);
          });

          describe("Dealing the url of dependency", function(){

              var urlOfOtherSite,
                  urlSelfSite;

              beforeEach(function(){
                  urlOfOtherSite = "http://st.host.pe/js/jq.demo.js";
                  urlSelfSite = "libs/js/jq.demo.js";

                  objDependencyManager.setVersionUrl(versionUrl);
                  objDependencyManager.setStaticHost(staticHost);
              });

              it('should be transform the url when come with http protocol', function(){
                  var urlTransformed = objDependencyManager.transformUrl(urlOfOtherSite);
                  expect(urlOfOtherSite).toEqual(urlTransformed);
              });

              it('should be transform the url when come with self server', function(){
                  versionUrl = "?v12022008";
                  objDependencyManager.setVersionUrl(versionUrl);
                  var urlTransformed = objDependencyManager.transformUrl(urlSelfSite);
                  var urlExpected = "http://stat.host.com/libs/js/jq.demo.js?v12022008";
                  expect(urlExpected).toEqual(urlTransformed);
              });

              it('should be generate the unique id by url', function(){
                  var urlDummy = "stat_host_com_libs_js_jq_demo_js";
                  var id = objDependencyManager.generateId(urlDummy);
                  expect(id).toEqual(urlDummy);
              });

          });

      });
});

define([
   '../../src/comps/single-promise.js',
   '../../src/comps/dependency.js',
   '../../src/managers/dependency.js'
  ],
  function(SinglePromise, Dependency, DependencyManager){
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

              describe('validate the url entered', function(){
                  var urlExpected = null;
                  beforeEach(function(){
                      urlExpected = staticHost + "js/dist/libs/fancybox/source/helpers/jquery.fancybox-buttons.js" + versionUrl;
                  });
                  it('should be validate the url without double slashes', function () {
                      var urlGood = staticHost + "js/dist/libs/fancybox/source/helpers/jquery.fancybox-buttons.js" + versionUrl;
                      var urlDummy = objDependencyManager.validateDoubleSlashes(urlGood);
                      expect(urlDummy).toEqual(urlExpected);
                  });
                  it('should be validate the url with double slashes', function () {
                      var urlWrong1 = staticHost + "/js/dist/libs/fancybox/source/helpers/jquery.fancybox-buttons.js" + versionUrl;
                      var urlDummy = objDependencyManager.validateDoubleSlashes(urlWrong1);
                      expect(urlDummy).toEqual(urlExpected);
                  });
                  it('should be validate the url with double slashes', function () {
                      var urlWrong2 = staticHost + "//js/dist/libs///fancybox/source/helpers/jquery.fancybox-buttons.js" + versionUrl;
                      var urlDummy = objDependencyManager.validateDoubleSlashes(urlWrong2);
                      expect(urlDummy).toEqual(urlExpected);
                  });
              });

          });

          it('should be append a dependency ', function(done){
            var dependence = "http://cdnjs.cloudflare.com/ajax/libs/Colors.js/1.2.4/colors.min.js";
            objDependencyManager.addScript(dependence).then(function(){
                expect(true).toBe(true);
                done();
            });
          });

          xit('should be validate when append a dependency already registered', function(){
            var dependence = "http://cdnjs.cloudflare.com/ajax/libs/Colors.js/1.2.4/colors.min.js";
            objDependencyManager.addScript(dependence);
            expect(objDependencyManager.addScript(dependence)).toBe("the dependence already appended");
          });

          it('should be run the callback when the dependences are ready', function(done){
            var dependence = "http://cdnjs.cloudflare.com/ajax/libs/Colors.js/1.2.4/colors.min.js",
                onReady = jasmine.createSpy();

            objDependencyManager.ready([dependence], function(){
                onReady();
                expect(onReady).toHaveBeenCalled();
                done();
            });

          });

          xit('should be dont run the callback error when the dependence return an error', function(done){
            var dependence = "http://helloworld.cc/js/wrongscripthellloworld.js",
                onNotAvaliable = jasmine.createSpy();

            objDependencyManager.addScript(dependence).then(function(){}, function(){
                onNotAvaliable();
                expect(onNotAvaliable).toHaveBeenCalled();
                done();
            });

          });

          it('should be get the dependence self', function(){
            var dependence = "http://cdnjs.cloudflare.com/ajax/libs/Colors.js/1.2.4/colors.min.js";

            objDependencyManager.addScript(dependence);
            var resultDependence = objDependencyManager.getDependency(dependence);
            expect(resultDependence instanceof Dependency).toBeTruthy();
          });

          it('should be return if the dependence its already in the collection of the manager', function(){
            var dependence = "http://cdnjs.cloudflare.com/ajax/libs/Colors.js/1.2.4/colors.min.js";

            objDependencyManager.addScript(dependence);
            var idOfDependence = objDependencyManager.generateId(dependence);
            var resultDependence = objDependencyManager.alreadyInCollection(idOfDependence);
            expect(resultDependence instanceof Dependency).toBeTruthy();
          });


      });
});

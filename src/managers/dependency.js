define([
    "yoson",
    "../../src/comps/single-promise.js",
    "../../src/comps/dependency.js"
], function(yOSON, SinglePromise, Dependency){
    /**
     * Class manager for one or more requests
     * @class DependencyManager
     * @requires Dependency
     * @constructor
     * @example
     *      // create and object setting the class
     *      var objDependencyManager = new yOSON.DependencyManager();
     *      // example of setting the static host
     *      objdependencymanager.setStaticHost("http://static.host/");
     *      // example of setting the static host
     *      objdependencymanager.setVersionUrl("?v=0.1");
     *      // request the url
     *      objDependency.ready(['url1'], function(){
     *          // execute here when ready
     *      });
     */
    var DependencyManager = function(){
        this.data = {};
        this.loaded = {};

        this.config = {
            staticHost: yOSON.statHost || "",
            versionUrl: yOSON.statVers || ""
        };
    };

    /**
     * Sets the host of static elements
     * @method setStaticHost
     * @param {String} hostName the host of the static elements,
     * like a CDN url
     * @example
     *      objDependencyManager.setStaticHost("http://cdnjs.com");
     */
    DependencyManager.prototype.setStaticHost = function(hostName){
        this.config.staticHost = hostName;
    };

    /**
     * Gets saved host
     * @method getStaticHost
     * @return {String} Get the saved host with the method setStaticHost
     * @example
     *      //returns "http://cdnjs.com" if set
     *      objDependencyManager.getStaticHost();
     */
    DependencyManager.prototype.getStaticHost = function(){
        return this.config.staticHost;
    };

    /**
     * Sets the suffix for the url, ideally when working with versioned elements
     * @method setVersionUrl
     * @param {String} versionNumber the suffix or number for concatenating in the url
     * @example
     *      objDependencyManager.setVersionUrl("?v=0.1");
     */
    DependencyManager.prototype.setVersionUrl = function(versionNumber){
        this.config.versionUrl = versionNumber;
    };

    /**
     * Get saved suffix
     * @method getVersionUrl
     * @return {String} Get saved suffix with the setVersionUrl method
     * @example
     *      //if setting "?v=0.1" return that
     *      objDependencyManager.getVersionUrl();
     */
    DependencyManager.prototype.getVersionUrl = function(){
        var result = "";
        if(this.config.versionUrl !== ""){
            result = this.config.versionUrl;
        }
        return result;
    };

    /**
     * Transforms the url to a request
     * @method transformUrl
     * @param {String} url the url itself to be transformed and ready for request
     * @return {String} the url transformed
     */
    DependencyManager.prototype.transformUrl = function(url){
        var urlResult = "",
        regularExpresion = /((http?|https):\/\/)(www)?([\w-]+\.\w+)+(\/[\w-]+)+\.\w+/g;
        if(regularExpresion.test(url)){
            urlResult = url;
        } else {
            urlResult = this.validateDoubleSlashes( this.config.staticHost + url + this.getVersionUrl() );
        }
        return urlResult;
    };

    /**
     * Validates double slashes in url
     * @method validateDoubleSlashes
     * @param {String} url the url self to validate
     * @return {String} the url cleaned
     */
    DependencyManager.prototype.validateDoubleSlashes = function(url){
        var regularExpression = /([^\/:])\/+([^\/])/g;
        return url.replace(regularExpression, "$1/$2");
    };

    /**
     * Generates the id for the manager from the url
     * @method generateId
     * @param {String} url the url self to generate your id
     */
    DependencyManager.prototype.generateId = function(url){
        return (url.indexOf('//')!=-1)?url.split('//')[1].split('?')[0].replace(/[/.:]/g,'_'):url.split('?')[0].replace(/[/.:]/g,'_');
    };

    /**
     * Receives a url from the manager
     * @method addScript
     * @param {String} url the url self to request in the manager
     */
    DependencyManager.prototype.addScript = function(url){
        var id = this.generateId( url );
        var promiseEntity = new SinglePromise();
        if(this.alreadyInCollection(id)){
            return this.data[id].promiseEntity;
            //return 'the dependence is already appended';
        } else {
            this.data[id] = new Dependency(url);
            // Hago la consulta del script
            this.data[id].request({
                onReady: function(){
                    promiseEntity.done();
                },
                onError: function(){
                    promiseEntity.fail();
                }
            });
            this.data[id].promiseEntity = promiseEntity;
        }
        return promiseEntity;
    };

    /**
     * method that receives a list of urls to be requested and callbacks when the requests are ready
     * @method ready
     * @param {Array} urlList List of urls to request
     * @param {Function} onReady Callback to execute when the all requests are ready
     */
    DependencyManager.prototype.ready = function(urlList, onReady, onError){
        var index = 0,
        that = this;
        var queueQuering = function(list){
            if(index < list.length){
                var urlToQuery = that.transformUrl(list[index]);
                that.addScript(urlToQuery).then(function(){
                    index++;
                    queueQuering(urlList);
                }, onError);
            } else {
                onReady.apply(that);
            }
        };
        queueQuering(urlList);
    };

    /**
     * Returns saved dependency in the manager
     * @method getDependency
     * @param {String} url the url to get in the manager
     * @return {Object} the object Dependency created by the url
     */
    DependencyManager.prototype.getDependency = function(url){
        var id = this.generateId(url);
        return this.data[id];
    };

    /**
     * Queries if its appended in the collection of the manager
     * @method alreadyInCollection
     * @param {String} id the id generated by the url
     * @return {Object} the object Dependency created by the url
     */
    DependencyManager.prototype.alreadyInCollection = function(id){
        return this.data[id];
    };

    /**
     * Queries if the dependency is loaded in the manager
     * @method alreadyLoaded
     * @param {String} id the id generated by the url
     * @return {Object} the object Dependency created by the url
     */
    DependencyManager.prototype.alreadyLoaded = function(id){
        return ( typeof this.loaded[id] !== "undefined");
    };

    yOSON.Components.DependencyManager = DependencyManager;
    return DependencyManager;
});

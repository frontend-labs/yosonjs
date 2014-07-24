    var Dependency = function(url){
        this.url = url;
        this.status = "request";
        this.message = "";
        this.events = {};
    };
    /**
     * Return the status of the request
     * @method getStatus
     * @return {String} status of the request "request" | "ready" | "error"
     */
    Dependency.prototype.getStatus = function(){
        return this.status;
    };
    /**
     * Call the request of the script
     * @method request
     * @param {Object} events Settings the callbacks
     */
    Dependency.prototype.request = function(events){
        var that = this;

        if(typeof events !== "undefined"){
            that.events = events;
        }

        that.onRequest();
        var newScript = that.createNewScript(that.url);
        that.requestIE(newScript, function(){
            newScript.onload = function(){
                that.onReadyRequest();
            };
            newScript.onerror = function(){
                that.onErrorRequest();
            };
        });
        document.getElementsByTagName("head")[0].appendChild(newScript);
    };

    Dependency.prototype.createNewScript = function(urlSource){
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = urlSource;
        return script;
    };

    /**
     * Trigger when the request its started
     * @method onRequest
     */
    Dependency.prototype.onRequest = function(){
        this.requestCallBackEvent('onRequest');
    };

    /**
     * Trigger when the request its successfully
     * @method onReadyRequest
     */
    Dependency.prototype.onReadyRequest = function(){
        this.status = "ready";
        this.requestCallBackEvent('onReady');
    };
    /**
     * Trigger when the request have an error in the load of the script
     * @method onErrorRequest
     */
    Dependency.prototype.onErrorRequest = function(){
        this.status = "error";
        this.requestCallBackEvent('onError');
    };

    Dependency.prototype.requestCallBackEvent = function(eventName){
        var eventSelf = this.events[eventName];
        if(typeof eventSelf === "function"){
            eventSelf.call(this);
        }
    };
    /**
     * Call the request of the script for IE browser
     * @method requestIE
     * @param {Object} src the newScript created in the method request
     * @param {Object} events Settings the callbacks
     */
    Dependency.prototype.requestIE = function(scriptElement, onNoIEBrowser){
        var that = this;
        if(scriptElement.readyState){
            scriptElement.onreadystatechange = function(){
                if(scriptElement.readyState=="loaded" || scriptElement.readyState=="complete"){
                    scriptElement.onreadystatechange=null;
                    that.onReadyRequest();
                } else {
                    that.onErrorRequest();
                }
            };
        } else {
            onNoIEBrowser.call(that);
        }
    };

    var DependencyManager = function(){
        this.data = {};
        this.loaded = {};
        this.config = {
            staticHost: "",
            versionUrl: ""
        };
    };

    /**
     * Setting the host of the static elements
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
     * Get the host saved
     * @method getStaticHost
     * @return {String} Get the host saved with the method setStaticHost
     * @example
     *      //if setting "http://cdnjs.com" return that
     *      objDependencyManager.getStaticHost();
     */
    DependencyManager.prototype.getStaticHost = function(){
        return this.config.staticHost;
    };

    /**
     * Setting the suffix for the url, ideally when working with elements versioned
     * @method setVersionUrl
     * @param {String} versionNumber the suffix or number for concatenate in the url
     * @example
     *      objDependencyManager.setVersionUrl("?v=0.1");
     */
    DependencyManager.prototype.setVersionUrl = function(versionNumber){
        this.config.versionUrl = versionNumber;
    };

    /**
     * Get the suffix saved
     * @method getVersionUrl
     * @return {String} Get the suffix saved with the method setVersionUrl
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
     * method what transform the url to request
     * @method transformUrl
     * @param {String} url the url self to transform and ready for request
     * @return {String} the url transformed
     */
    DependencyManager.prototype.transformUrl = function(url){
        var urlResult = "",
        regularExpresion = /((http?|https):\/\/)(www)?([\w-]+\.\w+)+(\/[\w-]+)+\.\w+/g;
        if(regularExpresion.test(url)){
            urlResult = url;
        } else {
            urlResult = this.config.staticHost + url + this.getVersionUrl();
        }
        return urlResult;
    };

    /**
     * method what use the url and generateid the id for the manager
     * @method generateId
     * @param {String} url the url self to generate your id
     */
    DependencyManager.prototype.generateId = function(url){
        return (url.indexOf('//')!=-1)?url.split('//')[1].split('?')[0].replace(/[/.:]/g,'_'):url.split('?')[0].replace(/[/.:]/g,'_');
    };

    /**
     * method what receive an url to the manager
     * @method addScript
     * @param {String} url the url self to request in the manager
     */
    DependencyManager.prototype.addScript = function(url){
        var id = this.generateId( url );
        if(this.alreadyInCollection(id)){
            return 'the dependence already appended';
        } else {
            this.data[id] = new Dependency(url);
            //Hago la consulta del script
            this.data[id].request();
            return true;
        }
    };

    /**
     * method what receive an list of urls to request and callbacks when the requests are ready
     * @method ready
     * @param {Array} urlList List of urls to request
     * @param {Function} onReady Callback to execute when the all requests are ready
     */
    DependencyManager.prototype.ready = function(urlList, onReady){
        var index = 0,
        that = this;
        var queueQuering = function(list){
            var urlToQuery = that.transformUrl(list[index]);
            if(index < list.length){
                that.addScript(urlToQuery);
                that.avaliable(urlToQuery, function(){
                    index++;
                    queueQuering(urlList);
                });
            } else {
                onReady.apply(that);
            }
        };
        queueQuering(urlList);
    };

    /**
     * method what verify the avaliability of an Dependency
     * @method avaliable
     * @param {String} url the url to query if its avaliable or not
     * @param {Function} onAvaliable Callback to execute when the url its avaliable
     * @return {Boolean} if the dependency its avaliable return true
     */
    DependencyManager.prototype.avaliable = function(url, onAvaliable){
        var that = this,
        id = that.generateId(url),
        dependency = that.getDependency(url);
        if(!this.alreadyLoaded(id)){
            var checkStatusDependency = setInterval(function(){
                if(dependency.getStatus() == "ready"){
                    that.loaded[id] = true;
                    clearInterval(checkStatusDependency);
                    onAvaliable.apply(that);
                }
                if(dependency.getStatus() == "error"){
                    onAvaliable = null;
                    clearInterval(checkStatusDependency);
                }
            }, 500);
        } else {
            return true;
        }
    };

    /**
     * return the dependency saved in the manager
     * @method getDependency
     * @param {String} url the url to get in the manager
     * @return {Object} the object Dependency created by the url
     */
    DependencyManager.prototype.getDependency = function(url){
        var id = this.generateId(url);
        return this.data[id];
    };

    /**
     * Query if its appened in the collection of the manager
     * @method alreadyInCollection
     * @param {String} id the id generated by the url
     * @return {Object} the object Dependency created by the url
     */
    DependencyManager.prototype.alreadyInCollection = function(id){
        return this.data[id];
    };

    /**
     * Query if its loaded the dependency in the manager
     * @method alreadyLoaded
     * @param {String} id the id generated by the url
     * @return {Object} the object Dependency created by the url
     */
    DependencyManager.prototype.alreadyLoaded = function(id){
        return this.loaded[id];
    };

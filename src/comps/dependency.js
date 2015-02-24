define([
    'yoson'
], function(yOSON){
    /**
     * Class that makes a request by a url and indicates if its ready or not
     * @class Dependency
     * @constructor
     * @param {String} url Sets the url to request
     * @example
     *      var url = "http://misite.com/mylib.js";
     *      //create and object setting the url to call
     *      var objDependency = new yOSON.Dependency(url);
     *      //request the url
     *      objDependency.request({
     *          onRequest: function(){
     *              //when request
     *          },
     *          onReady: function(){
     *              //when ready
     *          },
     *          onError: function(){
     *              //when error occurs
     *          },
     *      });
     */
    var Dependency = function(url){
        this.url = url;
        this.status = "request";
        this.message = "";
        this.events = {};
    };
    /**
     * Returns the status of the request
     * @method getStatus
     * @return {String} status of the request "request" | "ready" | "error"
     */
    Dependency.prototype.getStatus = function(){
        return this.status;
    };
    /**
     * Calls the request of the script
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
                that.onReadyRequest(this);
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
     * Triggers when the request has started
     * @method onRequest
     */
    Dependency.prototype.onRequest = function(){
        this.requestCallBackEvent('onRequest');
    };

    /**
     * Triggers when the request is successful
     * @method onReadyRequest
     */
    Dependency.prototype.onReadyRequest = function(instanceLoaded){
        this.status = "ready";
        this.requestCallBackEvent('onReady', instanceLoaded);
    };
    /**
     * Triggers when the request has an error when loading the script
     * @method onErrorRequest
     */
    Dependency.prototype.onErrorRequest = function(){
        this.status = "error";
        this.requestCallBackEvent('onError');
    };

    Dependency.prototype.requestCallBackEvent = function(){
        var arrayOfArguments = [].slice.call(arguments, 0);
        var eventName = arrayOfArguments[0];
        var eventSelf = this.events[eventName];
        var paramsToPass = [];
        if(arrayOfArguments.length > 1){
            paramsToPass = arrayOfArguments.slice(1);
        }
        if(typeof eventSelf === "function"){
            eventSelf.apply(this, paramsToPass);
        }
    };
    /**
     * Calls the request of the script for IE browser
     * @method requestIE
     * @param {Object} src the newScript created in the method request
     * @param {Object} events Sets the callbacks
     */
    Dependency.prototype.requestIE = function(scriptElement, onNoIEBrowser){
        var that = this;
        if(scriptElement.readyState){
            scriptElement.onreadystatechange = function(){
                if(scriptElement.readyState=="loaded" || scriptElement.readyState=="complete"){
                    scriptElement.onreadystatechange=null;
                    that.onReadyRequest();
                }
            };
        } else {
            onNoIEBrowser.call(that);
        }
    };

    yOSON.Components.Dependency = Dependency;
    return Dependency;
});

//Creando el manejo de dependencias
//Clase que trata con una url
//Objeto que como objetivo invoca a la dependencia a travez de su url
//y notifica el status del mismo
define([
    'yoson'
], function(yOSON){


    /**
     * @class Dependency
     * @constructor
     * @param {String} url Setting the url to request
     * @example
     *      var url = "http://misite.com/mylib.js";
     *      var objDependency = new yOSON.Dependency(url);
     *      objDependency.request({
     *          onRequest: function(){
     *              //when request
     *          },
     *          onReady: function(){
     *              //when ready
     *          },
     *          onError: function(){
     *              //when occurs and error
     *          },
     *      });
     */
    var Dependency = function(url){
        this.url = url;
        this.status = "request";
        this.message = "";
    };

    /**
     * Call the request of the script
     * @method request
     * @param {Object} events Settings the callbacks
     */
    Dependency.prototype.request = function(events){

        var that = this;
        //console.log('solicitando url', this.url);

        this.events = events || {};

        this.onRequest();
        newScript = document.createElement("script");
        newScript.type = "text/javascript";
        newScript.src = this.url;

        if( newScript.readyState ){
            this.requestIE(newScript, events);
        } else {
            newScript.onload = function(){
                that.onReadyRequest();
            };
            newScript.onerror = function(){
                that.onErrorRequest();
            };
        }
        document.getElementsByTagName("head")[0].appendChild(newScript);
    };
    /**
     * Call the request of the script for IE browser
     * @method requestIE
     * @param {Object} src the newScript created in the method request
     * @param {Object} events Settings the callbacks
     */
    Dependency.prototype.requestIE = function(src, events){
        var that = this;
        src.onreadystatechange = function(){
            if(src.readyState=="loaded" || src.readyState=="complete"){
                src.onreadystatechange=null;
                that.onReadyRequest();
            } else {
                that.onErrorRequest();
            }
        };
    };

    /**
     * Trigger when the request its started
     * @method onRequest
     */
    Dependency.prototype.onRequest = function(){
        var onRequestEvent = this.events.onRequest;
        onRequestEvent && onRequestEvent.call(this);
    };

    /**
     * Trigger when the request its successfully
     * @method onReadyRequest
     */
    Dependency.prototype.onReadyRequest = function(){
        var onReadyEvent = this.events.onReady;
        this.setStatus("ready");
        onReadyEvent && onReadyEvent.call(this);
    };

    /**
     * Trigger when the request have an error in the load of the script
     * @method onErrorRequest
     */
    Dependency.prototype.onErrorRequest = function(){
        var onErrorEvent = this.events.onError;
        this.setStatus("error");
        onErrorEvent && onErrorEvent.call(this);
        //this.setErrorMessage("No pudo cargarse el script "+ this.url);
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
     * Set the status of the request
     * @method setStatus
     */
    Dependency.prototype.setStatus = function(status){
        this.status = status;
    };

    yOSON.Dependency = Dependency;
    return Dependency;
});

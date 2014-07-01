//Creando el manejo de dependencias
//Clase que trata con una url
//Objeto que como objetivo invoca a la dependencia a travez de su url
//y notifica el status del mismo
define([
    'yoson'
], function(yOSON){

    var Dependency = function(url){
        this.url = url;
        this.status = "request";
        this.message = "";
    };
    //realiza el request
    Dependency.prototype.request = function(events){

        var that = this;
        var events = that.dealCallbackEvents(events);
        //console.log('solicitando url', this.url);

        newScript = document.createElement("script");
        newScript.type = "text/javascript";
        newScript.src = this.url;

        if( newScript.readyState ){
            this.requestIE(newScript, events);
        } else {
            newScript.onload = function(){
                events.onReady();
            };
            newScript.onerror = function(){
                events.onError();
            };
        }
        document.getElementsByTagName("head")[0].appendChild(newScript);
    };
    //en caso sea IExplorer realiza el request
    Dependency.prototype.requestIE = function(src, events){
        var that = this;
        src.onreadystatechange = function(){
            if(src.readyState=="loaded" || src.readyState=="complete"){
                src.onreadystatechange=null;
                events.onReady();
            } else {
                events.onError();
            }
        };
    };

    Dependency.prototype.dealCallbackEvents = function(options){
        var that = this,
            result = {
                onRequest: function(){
                    that.onRequest();
                },
                onReady: function(){
                    that.onReadyRequest();
                },
                onError: function(){
                    that.onErrorRequest();
                }
            };

        if(typeof options !== "undefined"){
            result = {
                onRequest: function(){
                    that.onRequest(options.onRequest);
                },
                onReady: function(){
                    that.onReadyRequest(options.onReady);
                },
                onError: function(){
                    that.onErrorRequest(options.onError);
                }
            };
        };

        return result;
    };

    Dependency.prototype.onRequest = function(whenRequest){
        whenRequest && whenRequest.call(this);
    };

    Dependency.prototype.onReadyRequest = function(whenReady){
        this.setStatus("ready");
        whenReady && whenReady.call(this);
    };

    Dependency.prototype.onErrorRequest = function(whenError){
        this.setStatus("error");
        whenError && whenError.call(this);
        //this.setErrorMessage("No pudo cargarse el script "+ this.url);
    };

    //retorna el status del request
    Dependency.prototype.getStatus = function(){
        return this.status;
    };

    Dependency.prototype.setStatus = function(status){
        this.status = status;
    };

    //retorna el mensage de error
    Dependency.prototype.getErrorMessage = function(){
        return this.message;
    };

    //retorna el mensage de error
    Dependency.prototype.setErrorMessage = function(message){
        this.message = message;
    };

    yOSON.Dependency = Dependency;
    return Dependency;
});

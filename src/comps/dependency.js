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
    //en caso sea IExplorer realiza el request
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

    Dependency.prototype.onRequest = function(){
        var onRequestEvent = this.events.onRequest;
        onRequestEvent && onRequestEvent.call(this);
    };

    Dependency.prototype.onReadyRequest = function(){
        var onReadyEvent = this.events.onReady;
        this.setStatus("ready");
        onReadyEvent && onReadyEvent.call(this);
    };

    Dependency.prototype.onErrorRequest = function(){
        var onErrorEvent = this.events.onError;
        this.setStatus("error");
        onErrorEvent && onErrorEvent.call(this);
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

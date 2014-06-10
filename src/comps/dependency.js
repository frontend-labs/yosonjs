//Creando el manejo de dependencias
//Clase que trata con una url
//Objeto que como objetivo invoca a la dependencia a travez de su url
//y notifica el status del mismo
yOSON.Dependency = function(url){
    this.url = url;
    this.status = "request";
    this.message = "";
};
//realiza el request
yOSON.Dependency.prototype.request = function(){
    console.log('solicitando url', this.url);
    var that = this,
        newScript = document.createElement("script");
    newScript.type = "text/javascript";
    newScript.src = this.url;
    if( newScript.readyState ){
        this.requestIE(newScript);
    } else {
        newScript.onload = function(){
            that.status = "ready";
        }
        newScript.onerror = function(){
            that.onErrorRequest();
        };
    }
    document.getElementsByTagName("head")[0].appendChild(newScript);
};
//en caso sea IExplorer realiza el request
yOSON.Dependency.prototype.requestIE = function(src){
    var that = this;
    src.onreadystatechange = function(){
        if(src.readyState=="loaded" || scr.readyState=="complete"){
          scr.onreadystatechange=null;
          that.status = "ready";
        } else {
            that.onErrorRequest();
        }
    };
};

yOSON.Dependency.prototype.onErrorRequest = function(){
    this.status = "error";
    this.setErrorMessage("No pudo cargarse el script "+ this.url);
};
//retorna el status del request
yOSON.Dependency.prototype.getStatus = function(){
    return this.status;
};

//retorna el mensage de error
yOSON.Dependency.prototype.getErrorMessage = function(){
    return this.message;
};

//retorna el mensage de error
yOSON.Dependency.prototype.setErrorMessage = function(message){
    this.message = message;
};

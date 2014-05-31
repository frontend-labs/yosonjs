//Usando la url para crear un objeto dependencia
yOSON.Dependency = function(url){
    this.url = url;
    this.status = false;
};

yOSON.Dependency.prototype.generateId = function(){
 var url = this.url;
 this.id = (url.indexOf('//')!=-1)?url.split('//')[1].split('?')[0].replace(/[/.:]/g,'_'):url.split('?')[0].replace(/[/.:]/g,'_');
};

yOSON.Dependency.prototype.request = function(){
    log('solicitando url', url);
    this.tag = document.createElement("script");
    this.tag.type = "text/javascript";
    var src = this.tag;
    this.requestIE();
    if(src.onload){  /*IE*/
        scr.onload = function(){
            that.status = true;
        }
    }
    document.getElementsByTagName("head")[0].appendChild(scr);
};

yOSON.Dependency.prototype.requestIE = function(){
    var that = this,
        src = this.tag;
    if( src.readyState ){
        src.onreadystatechange = function(){
            if(src.readyState=="loaded" || scr.readyState=="complete"){
              scr.onreadystatechange=null;
              that.status = true;
            }
        };
    }
};

yOSON.Dependency.prototype.getStatus = function(){
    return this.status;
};

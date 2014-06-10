//clase manager de los objetos Dependency
//Administrador de dependencias
yOSON.DependencyManager = function(){
    this.data = {};
    this.loaded = {};
    this.config = {
        staticHost: "",
        versionUrl: ""
    };
};

yOSON.DependencyManager.prototype.setStaticHost = function(hostName){
    this.config.staticHost = hostName;
};

yOSON.DependencyManager.prototype.setVersionUrl = function(versionNumber){
    this.config.versionUrl = versionNumber;
};

yOSON.DependencyManager.prototype.getVersionUrl = function(){
    var result = "";
    if(this.config.versionUrl != ""){
        result = "?" + this.config.versionUrl;
    }
    return result;
};

yOSON.DependencyManager.prototype.transformUrl = function(url){
    var urlResult = "",
        regularExpresion = /((http?|https):\/\/)(www)?([\w-]+\.\w+)+(\/[\w-]+)+\.\w+/g;
    if(regularExpresion.test(url)){
        urlResult = url;
    } else {
        urlResult = this.config.staticHost + url + this.getVersionUrl();
    }
    return urlResult;
};

//método que crea el id segun la url ingresada
yOSON.DependencyManager.prototype.generateId = function(url){
 return (url.indexOf('//')!=-1)?url.split('//')[1].split('?')[0].replace(/[/.:]/g,'_'):url.split('?')[0].replace(/[/.:]/g,'_');
};

//Adiciona la dependencia a administrar con su url
yOSON.DependencyManager.prototype.addScript = function(url){
    var id = this.generateId( url );
    if(!this.alreadyInCollection(id)){
        this.data[id] = new yOSON.Dependency(url);
        //Hago la consulta del script
        this.data[id].request();
    } else {
        console.log('dependency in cache', this.data[id]);
    }
};
//Metodo que indica que está lista la dependencia
yOSON.DependencyManager.prototype.ready = function(urlList, onReady){
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
//Método que verifica si está lista el script agregado
yOSON.DependencyManager.prototype.avaliable = function(url, onAvaliable){
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
                console.warn(dependency.getErrorMessage());
                clearInterval(checkStatusDependency);
                onAvaliable = null;
            }
        }, 500);
    } else {
        return true;
    }
};
//retorna la dependencia en memoria
yOSON.DependencyManager.prototype.getDependency = function(url){
    var id = this.generateId(url);
    return this.data[id];
};
//Consulta si está agregada en la data del administrador
yOSON.DependencyManager.prototype.alreadyInCollection = function(id){
    return this.data[id];
};
//retorna si ya está cargado la dependencia completamente
yOSON.DependencyManager.prototype.alreadyLoaded = function(id){
    return this.loaded[id];
};

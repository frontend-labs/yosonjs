window.log = (typeof (log) != "undefined") ? log : function () {
    if (typeof (console) != "undefined") {
        if (typeof (console.log.apply) != "undefined") {
            console.log.apply(console, arguments)
        } else {
            console.log(Array.prototype.slice.call(arguments))
        }
    }
};
//Array.prototype.indexOf
if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(needle) {
        for(var i = 0; i < this.length; i++) {
            if(this[i] === needle) {
                return i;
            }
        }
        return -1;
    };
}

if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function(searchElement /*, fromIndex*/) {
        //'use strict';

        if (this == null) {
            throw new TypeError();
        }

        var n, k,
        t = Object(this),
        len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }

        n = len;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) {
                n = 0;
            }
            else if (n != 0 && n != (1 / 0) && n != -(1 / 0)) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }

        for (k = n >= 0
            ? Math.min(n, len - 1)
            : len - Math.abs(n); k >= 0; k--) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
    };
}



if (!Array.prototype.charAt) {
    String.prototype.charAt = function(pos){
        //CheckCoercible(this);
        var S = this.toString();
        var position = Number(pos);
        var size = S.length;
        if (position < 0 || position >= size) return '';
        //console.log(S[pos]);
        return S[pos];
    }
}

String.prototype.substrByLastSign = function(sign){
    return this.substr(this.lastIndexOf(sign)+1, this.length);
}


var fnyOSON={
    copy:function(el,aArray){
        for(var x=0; x<aArray.length; x++){el.push(aArray[x]);}
        return el;
    },
    /**-----------------------------------------------------------------------------------------------------
     * Remover Items de un array
     * Remove the second item from the array           :        array.remove(1);
     * Remove the second-to-last item from the array   :        array.remove(-2);
     * Remove the second and third items from the array:        array.remove(1,2);
     * Remove the last and second-to-last items from the array: array.remove(-2,-1);
     *
     * @return {Array} Array con elemento ya eliminado
     *//*-------------------------------------------------------------------------------------------------*/
     /*Ext Array(detectar existencia: typeof(Array().remove)=='function' o typeof(Array.prototype.push) o Array.prototype.hasOwnProperty('push'))*/
    remove:function(el,from,to){
        var rest = el.slice((to || from) + 1 || el.length);
        el.length = from < 0 ? el.length + from : from;
        el.push.apply(el, rest);return el;
    },
    /**-----------------------------------------------------------------------------------------------------
     * Verificar si un elemento esta dentro de un array
     * @return {Boolean} Si hay una coincidencia retorna true de lo contrario false
    *//*-------------------------------------------------------------------------------------------------*/
    inArray:function(el){
        for(var j in el){if(el[j]==arguments[0]){return true;}}
        return false;
    }
};
/* gestiona todos los oyentes y los notificadores de la aplicación
 * requires :Core.js
 * type :Object */
yOSON.AppSandbox = function(){
    return {
        /* member :Sandbox
         * notifica un evento para todos los modulos que escuchan el evento
         * oTrigger.event type :String   oTrigger.data type :Array
         * ejemplo: { event:'hacer-algo', data:{name:'jose', edad:27} }*/
        trigger: function(sType, aData){
            var oAction;
            if(typeof(yOSON.AppSandbox.aActions[sType])!="undefined"){ /*Si existe en las acciones*/
                var nActL=yOSON.AppSandbox.aActions[sType].length;
                while(nActL--){
                    oAction = yOSON.AppSandbox.aActions[sType][nActL];   /*oAction <> {module:oModule, handler:fpHandler}*/
                    if (typeof aData === "undefined") {
                        aData = [];
                    }
                    oAction.handler.apply(oAction.module, aData);         /*handler ??*/
                }
            }else{
                //log("Action["+sType+"]: No existe!");
            }
        },
        stopEvents: function(aEventsToStopListen,oModule){//Sandbox.stopEvents deja de escuchar algunos eventos en cualquier modulo
            var aAuxActions = [];
            var nLenEventsToListen=aEventsToStopListen.length;

            for(var nEvent=0; nEvent < nLenEventsToListen; nEvent++){
                var sEvent = aEventsToStopListen[nEvent];
                var nLenActions = yOSON.AppSandbox.aActions[sEvent].length;
                for(var nAction = 0; nAction < nLenActions; nAction++){
                    if(oModule != yOSON.AppSandbox.aActions[sEvent][nAction].module){
                        aAuxActions.push(yOSON.AppSandbox.aActions[sEvent][nAction]);
                    }
                }
                yOSON.AppSandbox.aActions[sEvent] = aAuxActions;
                if(yOSON.AppSandbox.aActions[sEvent].length == 0){delete yOSON.AppSandbox.aActions[sEvent];}
            }

        },
        events: function(aEventsToListen, fpHandler, oModule){ //this.event  empieza a escuchar algunos eventos en cualquier módulo
            /*log('|events-->');log(fpHandler);*/
            var nLenEventsToListen = aEventsToListen.length;
            for(var nEvent = 0; nEvent < nLenEventsToListen; nEvent++){
                var sEvent = aEventsToListen[nEvent];
                if(typeof yOSON.AppSandbox.aActions[sEvent] == "undefined"){ /*Si no existe en las acciones*/
                    yOSON.AppSandbox.aActions[sEvent] = [];
                }
                /*log("Sandbox-listen - line:45 - notifyListen:"+sEvent+" <--> module:"+oModule);*/
                yOSON.AppSandbox.aActions[sEvent].push({module:oModule, handler:fpHandler});
            }return this;
        },
        objMerge: function(){//param : obj1 obj2 obj3 ...
            var out={}, argL=arguments.length;
            if(!argL) return out;
            while(--argL)
                for(var key in arguments[argL])
                    out[key]=arguments[argL][key];
            return out;
        },
        request: function(sUrl, oData, oHandlers, sDatatype){//debe utilizarse para realizar llamadas ajax dentro de los modulos
            Core.ajaxCall(sUrl,oData,oHandlers,sDatatype);
        }
    };
};
/*Sandbox.aActions is the static variable that stores all the listeners of all the modules*/
yOSON.AppSandbox.aActions = [];
/**----------------------------------------------------------------------------------------------------
 * applicaction :yOSON.AppScript
 * description :Carga script Javascript o Css en la pagina para luego ejecutar funcionalidades dependientes.
 * example :yOSON.AppScript.charge('lib/plugins/colorbox.js,plugins/colorbox.css', function(){ load! } );
 *//*-------------------------------------------------------------------------------------------------*/
yOSON.AppScript = (function(statHost, filesVers){

    var urlDirJs  = "";    /*Directorio relativo Js*/
    var urlDirCss = "";    /*Directorio relativo Css*/
    var version   = "";    /*Release version*/
    var ScrFnc    = {/**/}; /* u_r_l:{state:true, fncs:[fn1,..]} Funciones y estado para un script cargandose*/
    /* Constructor */
    (function(url, vers){
        urlDirJs=url+'js/'; urlDirCss=url+'styles/'; version=(true)?vers:'';
    })(statHost, typeof(filesVers)!=="undefined"?filesVers:'');
    /* Convierte una cadena url separada de _ */
    var codear = function(url){
        return (url.indexOf('//')!=-1)?url.split('//')[1].split('?')[0].replace(/[/.:]/g,'_'):url.split('?')[0].replace(/[/.:]/g,'_');
    };
    /* Agregando funciones para ejecutar una vez cargado el Script */
    var addFnc = function(url, fnc){
        if( !ScrFnc.hasOwnProperty(codear(url)) ){
            ScrFnc[codear(url)]={state:true, fncs:[]};/* State:true, para seguir agregando mas funcs a fncs) */
        }ScrFnc[codear(url)].fncs.push(fnc);
    };
    /* Ejecuta las funciones aosciadas a un script */
    var execFncs = function(url){
        ScrFnc[codear(url)].state = false;
        for(var i=0; i<ScrFnc[codear(url)].fncs.length; i++){
            if(ScrFnc[codear(url)].fncs[i]=='undefined'){
                //log(ScrFnc[codear(url)].fncs[i])
            }
            ScrFnc[codear(url)].fncs[i]();
        }
    };
    /* Cargador de Javascript */
    var loadJs = function(url, fnc, onLoadScript){
        log('solicitando url', url);
        var scr = document.createElement("script");
        scr.type = "text/javascript";
        if(scr.readyState){  /*IE*/
            scr.onreadystatechange = function(){
                if(scr.readyState=="loaded" || scr.readyState=="complete"){
                  scr.onreadystatechange=null;
                  if(onLoadScript) {
                    onLoadScript();
                  } else {
                    fnc(url);
                  }
                }
            };
          }else{
              scr.onload=function(){
                  if(onLoadScript) {
                    onLoadScript();
                  } else {
                    fnc(url);
                  }
              }
        }
        scr.src = url;
        document.getElementsByTagName("head")[0].appendChild(scr);
    };
    /* description :Cargador de Css */
    var loadCss = function(url, fnc){ /*Para WebKit (FF, Opera ...)*/

        var link = document.createElement('link');
        link.type='text/css';link.rel='stylesheet';link.href=url;
        document.getElementsByTagName('head')[0].appendChild(link);
        if(document.all){link.onload=function(){fnc(url);}}
        else{
            //log("Creando IMG charge para: "+url);
            var img=document.createElement('img');
            img.onerror=function(){
                //log("dentro de img.onerror: "+url);
                if(fnc){fnc(url);}document.body.removeChild(this);
            }
            document.body.appendChild(img);
            img.src=url;
        }
    };
    /* description :Carga el Script (js o css para luego ejecutar funcionalidades asociadas)
     * dependency : Es necesario tener implementado el metodo remove extendido al objeto array
     **/
    return {
        chargeSync: function(aUrl, fFnc, sMod, lev){
            var x = 0;

            var loopArray = function(src){
                    var srcItem=src[x],
                          isJs   = (srcItem.indexOf('.js') !=-1),
                          isCss  = (srcItem.indexOf('.css')!=-1);

                    if(!isJs && !isCss)return false;

                    var parts = srcItem.split('/');
                    parts[parts.length-1]=((yOSON.min!=='undefined'&&isJs)?yOSON.min:'')+parts[parts.length-1];
                    //aUrl = parts.join('/');
                    var urlDir = isJs?urlDirJs:urlDirCss;
                    var srcItem = (srcItem.indexOf('http')!=-1) ? (srcItem+version) : (urlDir+srcItem+version+(isCss?(new Date().getTime()):''));
                    //if(!ScrFnc.hasOwnProperty(codear(srcItem))){
                    if(!ScrFnc.hasOwnProperty(codear(srcItem))){
                        //Adicionando a la collecion de requests
                        ScrFnc[codear(srcItem)] = {};
                        ScrFnc[codear(srcItem)].item = srcItem;
                        ScrFnc[codear(srcItem)].status = 0;
                    }
                    //loading
                    loadJs(srcItem, execFncs, function(){
                        log('srcItem', srcItem);
                        //ready!
                        //ScrFnc[codear(srcItem)].status = 1;
                        //addFnc(srcItem, fFnc);
                        //execFncs(srcItem);
                        //siguiente item
                        x++;
                        //existe mas items en el array?
                        if(x < src.length){
                            loopArray(src);
                            //cuando termine la carga
                        } else {
                            fFnc();
                        }
                    });
            };
            log("aUrl::",aUrl);
            loopArray(aUrl);
        },
        charge : function(aUrl, fFnc, sMod, lev){
            var THAT = this;  /*Referencia a este objeto*/
            if(aUrl.length==0||aUrl=='undefined'||aUrl==''){return false;} /*aUrl no valido*/
            if(aUrl.constructor.toString().indexOf('Array')!=-1 && aUrl.length==1){var aUrl = aUrl[0];} /*Array de 1 elemento*/
            var lev = (typeof(lev)!='number')?1:lev;   /*Nivel de anidamiento en esta funcion*/
            //log('[mod:'+sMod+'][level:'+lev+'][script:'+aUrl+']', ( aUrl.indexOf && aUrl.indexOf('ColorB')!=-1 )); /*Debug niveles de anidamiento*/
            //log("ScrFnc ---------> ");log(ScrFnc);
            if(aUrl.constructor.toString().indexOf('String')!=-1){    /*Si es una String*/
                var isJs   = (aUrl.indexOf('.js') !=-1); /*Es script Js*/
                var isCss  = (aUrl.indexOf('.css')!=-1); /*Es script Css*/
                if(!isJs && !isCss)return false;         /*Si no es un script css o js termina la ejecucion*/
                var parts = aUrl.split('/');
                parts[parts.length-1]=((yOSON.min!=='undefined'&&isJs)?yOSON.min:'')+parts[parts.length-1];
                aUrl = parts.join('/');
                var urlDir = isJs?urlDirJs:urlDirCss;
                if(isJs||isCss){  /* Si se va a cargar un Css o Js  (El numero randon es para SF-5.0.3 el cual necesita request diferentes para disparar onerror en img)*/
                    var aUrl = (aUrl.indexOf('http')!=-1) ? (aUrl+version) : (urlDir+aUrl+version+(isCss?(new Date().getTime()):''));
                    if( !ScrFnc.hasOwnProperty(codear(aUrl)) ){  /* Si es que no esta Registrado el script*/
                        addFnc(aUrl, fFnc); isJs?loadJs(aUrl, execFncs):loadCss(aUrl, execFncs); /*neoScr(url, true) true?? no va creo?*/
                    }else{                      /* Si se va a cargar un CSS*/
                        if(ScrFnc[codear(aUrl)].state){addFnc(aUrl,fFnc)}else{fFnc();}
                    }
                }
            }else{
                if(aUrl.constructor.toString().indexOf('Array')!=-1){  /*Si es una Array de 2 a mas aelementos (Arrba de valida 0 a 1 elementos)*/
                    this.charge(aUrl[0], function(){//log((lev+1),(sMod.indexOf('popup')!=-1));
                        THAT.charge(fnyOSON.remove(aUrl,0), fFnc, sMod, (lev+2))
                    }, sMod, (lev+1));
                }else{
                    //log(aUrl+' - no es un Array');
            }
            }
        }
    };
})(yOSON.statHost, yOSON.statVers);
/*****************/

/*-----------------------------------------------------------------------------------------------------
 * Core :      : Estructure v1.0
 * @Description: Codigo para la manipulacion de los modulos en la aplicacion
 * Dependency :: yOSON.AppSandbox & yOSON.AppScript in appSandBox.js
 *//*-------------------------------------------------------------------------------------------------*/
/*
var loadElement = function(id, fnc, t){
    var t    = t?t:1;
    var oE   = document.getElementById(id);
    var time = window.setInterval(function(){
        if(oE){
            window.clearInterval(time);
            log(oE); fnc();
        }else{ log("nada"); }
    }, t);
    //window.load = function(){ window.clearInterval(time) };
};
loadElement('login-and-register',function(){alert('Exite!')},1);*/

yOSON.AppCore = (function(){
    /*member :Core*/
    var oSandBox = new yOSON.AppSandbox(); /*private :Entorno de trabajo de todos los modulos (Caja de arena)*/
    var oModules = {};                      /*private :Almacena todos los modulos registrados*/
    var sModules = [];                      /*private: Almacena los módulos que han pasado por runModule*/
    var oTask = {};                      /*private: Almacena los módulos que han pasado por runModule*/
    var debug    = false;                   /*private :Habilitar-Deshabilitar modo de depuracion*/
    window.cont  = 0;
    /*private :crea instancia del módulo al ejecutar AppCore.start */
    /*return :Instacia del modulo*/
    var doInstance = function(sModuleId){
        /*metodo creator se asigna a un modulo al llamar al registrar un modulo con el metodo register del AppCore*/
        var instance = oModules[sModuleId].definition( oSandBox );
        var name, method;
        if(!debug){
            for(name in instance){
                method = instance[name];
                if(typeof method == "function"){
                    instance[name] = function(name, method){
                        return function(){
                            try{
                                return method.apply(this,arguments);
                            }
                            catch(ex){
                                //log(name + "(): " + ex.message);
                            }
                        };
                    }(name, method);
                }
            }
        } return instance; /*retornamos la Instancia del modulo*/
    };

    var generateIdTask = function(){
        return sModules.length - 1;
    };
    return {
        /*path.module*/
        addModule: function(sModuleId, fDefinition, aDep){
            var _this = this,aDep = (typeof(aDep)=='undefined') ? [] : aDep;
            if(typeof(oModules[sModuleId])=='undefined'){
                oModules[sModuleId]={loaded: null, onLoaded: function(){_this.getModulesQueue();},definition:fDefinition, instance:null, dependency:aDep}; /*log(oModules[sModuleId].definition);*/
            }else{
                log ( 'module "'+sModuleId+'" is already defined, Please set it again' );
                if(/(local)/gi.test(document.baseURI)){
                    //log("["+sModuleId+"] ya existe!! crea otro!!!")
                };
            }
        },

        getModule: function(sModuleId){
            if (sModuleId && oModules[sModuleId]){ return oModules[sModuleId]; }
            else{ log ( 'structureline58 param "sModuleId" is not defined or module not found' ); }
        },

        getModuleWithTask: function(index){
             return oTask[index];
        },

        runModule: function(sModuleId, oParams){

            if(typeof oModules[sModuleId] !== "undefined"){

                if(oParams === undefined){ var oParams = {}; }
                oParams.moduleName = sModuleId;  /*Un primer valor de oParams*/
                var mod = this.getModule(sModuleId);
                var thisInstance = mod.instance = doInstance(sModuleId);

                if(thisInstance.hasOwnProperty('init')){   /*if(sModuleId=='modal-images')log('hay init()');*/
                   //agrego al modulo en una coleccion
                   sModules.push(sModuleId);
                   //creo la tarea del modulo
                   var taskId = generateIdTask();
                   oTask[taskId] = {};
                   oTask[taskId].mod = mod;
                   oTask[taskId].loaded = false;
                   //inicio logs
                   //log("sModuleId", sModuleId);
                   //log("sModules en runModule", sModules);
                   //log("taskId", taskId);
                   //fin logs
                   oTask[taskId].mod.instance = thisInstance;
                   if(mod.dependency.length>0){ // [>if(sModuleId=='modal-images')log('core60---> length:'+mod.dependency.length);<]
                        //log('dependencias::', mod.dependency);
                        yOSON.AppScript.chargeSync(fnyOSON.copy([],mod.dependency), function(){
                        //log('run module with dependences:'+sModuleId);
                        //thisInstance.init(oParams);
                        oTask[taskId].mod.oParams = oParams;
                        oTask[taskId].loaded = true;
                        oTask[taskId].mod.onLoaded();
                        }, sModuleId+window.cont, 1);
                    }else{
                        //log('taskId-normal:::', taskId);
                      //thisInstance.init(oParams);
                      //log('run module: '+sModuleId);
                      oTask[taskId].mod.oParams = oParams;
                      oTask[taskId].loaded = true;
                      oTask[taskId].mod.onLoaded();
                    }
                    //sTask.push(oTask);

                }else{ log ( ' ---> init function is not defined in the module "'+oModules[sModuleId]+'"' ); }

            }else{ log('module "'+sModuleId+'" is not defined or module not found' ); }
        },
        runModules: function(aModuleIds){
            for(var id in aModuleIds){ this.runModule(aModuleIds[id]); }
        },
        //retorna los modulos que aún están corriendo
        getModulesQueue: function(){
            var _this = this,
                  x =0,
                  loopArray = function (modules){
                    //var module = _this.getModule(modules[x]),
                    var task = _this.getModuleWithTask( x );
                    //log("CORRIENDO?", module.oParams.moduleName, (typeof task.running === "undefined")?"no":"si");
                    if(task.loaded){
                        var module = task.mod,
                           instance = module.instance,
                           oParams = module.oParams;
                        //log("cargado  modulo con tarea", x, _this.getModuleWithTask( x ));
                       if(typeof task.running === "undefined"){
                            log("ejecutando modulo con tarea", x, _this.getModuleWithTask( x ));
                            log('|runModule'+(++window.cont)+'|:---> ', modules[x]);
                            instance.init(oParams);
                            task.running = true;
                       }
                       x++;
                       if(x < modules.length){
                          loopArray(modules);
                       }
                    }
                };

            //log("sModules", sModules);
            //log("sModules:: total", sModules.length);
            loopArray(sModules);
        }
  }
})();

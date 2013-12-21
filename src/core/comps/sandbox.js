//define(function(){
    //var yOSON.AppSandbox.collectionActions = [];
    //return {
        //trigger: function(eventName, collectionData){
            //var action;
            //if(typeof yOSON.AppSandbox.collectionActions(eventName) != 'undefined'){
                //var currentAction = yOSON.AppSandbox.collectionActions[eventName].length;
                //while(currentAction--){
                    //action = yOSON.AppSandbox.collectionActions[eventName][currentAction];
                    //action.handler.apply(action.module, collectionData);
                //}
            //} else {

            //}
        //}
        ////stopEvents: function (collectionToStopListen, module) {
            ////var collectionActionsAux = [],
                ////totalEventsToListen = collectionToStopListen.length;

            ////for(var i=0; i < totalEventsToListen; i++){
                ////var eventToStopListen = collectionToStopListen[i],
                    ////totalActions = yOSON.AppSandbox.collectionActions[eventToStopListen].length;

                ////for(var j =0; j < totalActions;j++){
                    ////if(module != yOSON.AppSandbox.collectionActions[eventToStopListen][j].module){
                        ////collectionActionsAux.push(yOSON.AppSandbox.collectionActions[eventToStopListen][j]);
                    ////}
                ////}

                ////yOSON.AppSandbox.collectionActions[eventToStopListen] = collectionActionsAux;
                ////if(!yOSON.AppSandbox.collectionActions[eventToStopListen].length){
                    ////delete yOSON.AppSandbox.collectionActions[eventToStopListen];
                ////}
            ////}
        ////},
        ////events: function (collectionToListen, handler, module) {
            ////var totalEventsToListen = collectionToListen.length;
            ////for(var i = 0; i < totalEventsToListen.length; i++){
                ////var event = collectionToListen[i];
                ////if(typeof yOSON.AppSandbox.collectionActions[event] == "undefined"){
                    ////yOSON.AppSandbox.collectionActions[event] = [];
                ////}
                ////yOSON.AppSandbox.collectionActions[event].push({
                    ////module: module,
                    ////handler: handler
                ////});
            ////}
            ////return this;
        ////},
        ////mergeObjects: function(){
            ////var out={},
                ////totalArgs = arguments.length;
            ////if(!totalArgs){
                ////return out;
            ////}
            ////while(--totalArgs){
                ////for(var key in arguments[totalArgs]){
                    ////out[key]=arguments[totalArgs][key];
                ////}
            ////}
            ////return out;
        ////},
        ////request: function(url, objectData, objectHandler, dataType){
            ////Core.ajaxCall(url, objectData, objectHandler, dataType);
  //[>      }<]
    //};
//});

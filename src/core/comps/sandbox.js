//define(['base'],
       //function(yOSON){
    //yOSON.sandbox.collectionActions = [];
    //return {
        //trigger: function(eventName, collectionData){
            //var action;
            //if(typeof yOSON.sandbox.collectionActions(eventName) != 'undefined'){
                //var currentAction = yOSON.sandbox.collectionActions[eventName].length;
                //while(currentAction--){
                    //action = yOSON.sandbox.collectionActions[eventName][currentAction];
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
                    ////totalActions = yOSON.sandbox.collectionActions[eventToStopListen].length;

                ////for(var j =0; j < totalActions;j++){
                    ////if(module != yOSON.sandbox.collectionActions[eventToStopListen][j].module){
                        ////collectionActionsAux.push(yOSON.sandbox.collectionActions[eventToStopListen][j]);
                    ////}
                ////}

                ////yOSON.sandbox.collectionActions[eventToStopListen] = collectionActionsAux;
                ////if(!yOSON.sandbox.collectionActions[eventToStopListen].length){
                    ////delete yOSON.sandbox.collectionActions[eventToStopListen];
                ////}
            ////}
        ////},
        ////events: function (collectionToListen, handler, module) {
            ////var totalEventsToListen = collectionToListen.length;
            ////for(var i = 0; i < totalEventsToListen.length; i++){
                ////var event = collectionToListen[i];
                ////if(typeof yOSON.sandbox.collectionActions[event] == "undefined"){
                    ////yOSON.sandbox.collectionActions[event] = [];
                ////}
                ////yOSON.sandbox.collectionActions[event].push({
                    ////module: module,
                    ////handler: handler
                ////});
            ////}
            ////return this;
        ////},
        //mergeObjects: function(){
            //var out={},
                //totalArgs = arguments.length;
            //if(!totalArgs){
                //return out;
            //}
            //while(--totalArgs){
                //for(var key in arguments[totalArgs]){
                    //out[key]=arguments[totalArgs][key];
                //}
            //}
            //return out;
        //},
        ////request: function(url, objectData, objectHandler, dataType){
            ////Core.ajaxCall(url, objectData, objectHandler, dataType);
    //};
//});

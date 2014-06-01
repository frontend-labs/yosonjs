//Clase que se orienta al manejo de comunicacion entre modulos
yOSON.comunicator = function(){
    this.events = {};
};

yOSON.comunicator.prototype.publish = function(eventName, argumentsOfEvent){
    var that = this;
    this.finderEvents([eventName], function(eventNameFound, eventFound){
        var instanceFound = eventFound.instanceOrigin,
            functionFound = eventFound.functionSelf,
            validArguments = that.validateArguments(argumentsOfEvent);
        functionFound.call(instanceFound, validArguments);
    }, function(){});
};

yOSON.comunicator.prototype.subscribe = function(eventNames, functionSelfEvent, instanceOrigin){
    var that = this;
    console.log('searching...');
    this.finderEvents(eventNames, function(){
    }, function(eventName){
        console.log('registering', eventName);
        that.addEvent(eventName, functionSelfEvent, instanceOrigin);
    });
};

yOSON.comunicator.prototype.validateArguments = function(argumentsToValidate){
    var validArguments = [];
    if(typeof argumentsToValidate !== "undefined"){
        validArguments = argumentsToValidate;
    }
    return validArguments;
};

yOSON.comunicator.prototype.stopSuscribe = function(EventsToStop, instanceOrigin){
    var that = this;
    this.finderEvents(EventsToStop, function(eventNameFound, eventFound){
        that.removeEvent(eventNameFound);
    }, function(){});
};

yOSON.comunicator.prototype.addEvent = function(eventName, functionOfEvent, instanceOrigin){
    var bodyNewEvent = {};
    bodyNewEvent['instanceOrigin'] = instanceOrigin;
    bodyNewEvent['functionSelf'] = functionOfEvent;
    this.events[eventName] = bodyNewEvent;
    return this;
};

yOSON.comunicator.prototype.removeEvent = function(eventName){
    this.events[eventName] = null;
};

yOSON.comunicator.prototype.eventAlreadyRegistered = function(eventName){
    var response = null;
    if(this.getEvent(eventName)){
        response = true;
    }
    return response;
};

yOSON.comunicator.prototype.getEvent = function(eventName){
    return this.events[eventName];
};

yOSON.comunicator.prototype.finderEvents = function(eventNames, whichEventFound, whichEventNotFound){
    var that = this;
    for(var index = 0; index < eventNames.length;index++){
        var eventName = eventNames[index];
        if(that.eventAlreadyRegistered(eventName)){
            var eventFound = that.getEvent(eventName);
            console.log('encontrado', eventName);
            whichEventFound.call(that, eventName, eventFound);
        } else {
            console.log('no encontrado', eventName);
            whichEventNotFound.call(that, eventName);
        }
    }
};

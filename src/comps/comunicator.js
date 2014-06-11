//Clase que se orienta al manejo de comunicacion entre modulos
yOSON.Comunicator = function(){
    this.events = {};
};

yOSON.Comunicator.prototype.publish = function(eventName, argumentsOfEvent){
    var that = this;
    this.finderEvents([eventName], function(eventNameFound, eventFound){
        var instanceFound = eventFound.instanceOrigin,
            functionFound = eventFound.functionSelf,
            validArguments = that.validateArguments(argumentsOfEvent);
        console.log('execute event', eventName);
        functionFound.call(instanceFound, validArguments);
    }, function(){});
};

yOSON.Comunicator.prototype.subscribe = function(eventNames, functionSelfEvent, instanceOrigin){
    var that = this;
    this.finderEvents(eventNames, function(){
    }, function(eventName){
        console.log('register event', eventName);
        that.addEvent(eventName, functionSelfEvent, instanceOrigin);
    });
};

yOSON.Comunicator.prototype.validateArguments = function(argumentsToValidate){
    var validArguments = [];
    if(typeof argumentsToValidate !== "undefined"){
        validArguments = argumentsToValidate;
    }
    return validArguments;
};

yOSON.Comunicator.prototype.stopSubscribe = function(EventsToStop, instanceOrigin){
    var that = this;
    this.finderEvents(EventsToStop, function(eventNameFound, eventFound){
        that.removeEvent(eventNameFound);
    }, function(){});
};

yOSON.Comunicator.prototype.addEvent = function(eventName, functionOfEvent, instanceOrigin){
    var bodyNewEvent = {};
    bodyNewEvent['instanceOrigin'] = instanceOrigin;
    bodyNewEvent['functionSelf'] = functionOfEvent;
    this.events[eventName] = bodyNewEvent;
    return this;
};

yOSON.Comunicator.prototype.removeEvent = function(eventName){
    this.events[eventName] = null;
};

yOSON.Comunicator.prototype.eventAlreadyRegistered = function(eventName){
    var response = null;
    if(this.getEvent(eventName)){
        response = true;
    }
    return response;
};

yOSON.Comunicator.prototype.getEvent = function(eventName){
    return this.events[eventName];
};

yOSON.Comunicator.prototype.finderEvents = function(eventNames, whichEventFound, whichEventNotFound){
    var that = this;
    for(var index = 0; index < eventNames.length;index++){
        var eventName = eventNames[index];
        if(that.eventAlreadyRegistered(eventName)){
            var eventFound = that.getEvent(eventName);
            whichEventFound.call(that, eventName, eventFound);
        } else {
            whichEventNotFound.call(that, eventName);
        }
    }
};

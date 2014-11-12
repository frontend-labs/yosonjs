define([
    "yoson"
], function(yOSON){

    // This class handles the communication between modules
    var Communicator = function(){
        this.events = {};
    };

    Communicator.prototype.subscribe = function(eventNames, functionSelfEvent, instanceOrigin){
        var that = this;
        this.finderEvents(eventNames, function(){
        }, function(eventName){
            that.addEvent(eventName, functionSelfEvent, instanceOrigin);
        });
    };

    Communicator.prototype.publish = function(eventName, argumentsOfEvent){
        var that = this;
        this.finderEvents([eventName], function(eventNameFound, eventFound){
            var instanceFound = eventFound.instanceOrigin,
                functionFound = eventFound.functionSelf,
                validArguments = that.validateArguments(argumentsOfEvent);
            functionFound.apply(instanceFound, validArguments);
        }, function(){});
    };

    Communicator.prototype.validateArguments = function(argumentsToValidate){
        var validArguments = [];
        if(typeof argumentsToValidate !== "undefined"){
            validArguments = argumentsToValidate;
        }
        return validArguments;
    };

    Communicator.prototype.stopSubscribe = function(EventsToStop){
        var that = this;
        this.finderEvents(EventsToStop, function(eventNameFound, eventFound){
            that.removeEvent(eventNameFound);
        }, function(){});
    };

    Communicator.prototype.addEvent = function(eventName, functionOfEvent, instanceOrigin){
        var bodyNewEvent = {};
        bodyNewEvent.instanceOrigin = instanceOrigin;
        bodyNewEvent.functionSelf = functionOfEvent;
        this.events[eventName] = bodyNewEvent;
        return this;
    };

    Communicator.prototype.removeEvent = function(eventName){
        delete this.events[eventName];
    };

    Communicator.prototype.eventAlreadyRegistered = function(eventName){
        var response = false;
        if(this.getEvent(eventName)){
            response = true;
        }
        return response;
    };

    Communicator.prototype.getEvent = function(eventName){
        return this.events[eventName];
    };

    Communicator.prototype.finderEvents = function(eventNames, whichEventFound, whichEventNotFound){
        var that = this;
        for(var index = 0; index < eventNames.length;index++){
            that.eachFindEvent(eventNames[index], whichEventFound, whichEventNotFound);
        }
    };

    Communicator.prototype.eachFindEvent = function(eventName, whichEventFound, whichEventNotFound){
        var that = this;
        if(that.eventAlreadyRegistered(eventName)){
            var eventFound = that.getEvent(eventName);
            whichEventFound.call(that, eventName, eventFound);
        } else {
            whichEventNotFound.call(that, eventName);
        }
    };

    yOSON.Components.Communicator = Communicator;
    return Communicator;
});

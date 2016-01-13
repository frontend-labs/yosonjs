define([
    "yoson"
], function(yOSON){

    // This class handles the communication between modules
    var Communicator = function(){
        this.events = {};
    };

    Communicator.prototype.subscribe = function(eventNames, functionSelfEvent, instanceOrigin){
        var that = this;
        this.finderEvents(eventNames, function(eventNameFound){
            that.addSubscription(eventNameFound, functionSelfEvent, instanceOrigin);    
        }, function(eventNameFound){
            that.addEvent(eventNameFound);
            that.addSubscription(eventNameFound, functionSelfEvent, instanceOrigin);    
        });
    };

    Communicator.prototype.unsubscribe = function(eventNames, functionSelfEvent){
        var that = this;
        this.finderEvents(eventNames, function(eventNameFound){
            if(that.subscriptionAlreadyRegistered(eventNameFound, functionSelfEvent.id)){
                that.removeSubscription(eventNameFound, functionSelfEvent.id)
            }
        }, function(){});
    };

    Communicator.prototype.publish = function(eventName, argumentsOfEvent){
        var that = this;
        this.finderEvents([eventName], function(eventNameFound){
            that.findSubscriptions(eventNameFound, function(subscriptionFound){
                var instanceFound = subscriptionFound.instanceOrigin,
                    functionFound = subscriptionFound.functionSelf,
                    validArguments = that.validateArguments(argumentsOfEvent);
                functionFound.apply(instanceFound, validArguments);
            }, function(){});
        }, function(){});
    };

    Communicator.prototype.validateId = function(idToValidate){
        var validId = Math.random().toString(36).substr(2,9);
        if(typeof idToValidate !== "undefined"){
            validId = idToValidate;
        }
        return validId;
    };

    Communicator.prototype.validateArguments = function(argumentsToValidate){
        var validArguments = [];
        if(typeof argumentsToValidate !== "undefined"){
            validArguments = argumentsToValidate;
        }
        return validArguments;
    };

    Communicator.prototype.addSubscription = function(eventName, functionEvent, instanceOrigin){
        var bodyNewSubscription = {};
        bodyNewSubscription.instanceOrigin = instanceOrigin;
        bodyNewSubscription.functionSelf = functionEvent;

        functionEvent.id = this.validateId(functionEvent.id);
        this.events[eventName][functionEvent.id] = bodyNewSubscription;
        return this;
    }

    Communicator.prototype.removeSubscription = function(eventName, functionEventId){
        delete this.events[eventName][functionEventId]
    }

    Communicator.prototype.addEvent = function(eventName){
        return this.events[eventName] = {};
    }

    Communicator.prototype.removeEvent = function(eventName){
        delete this.events[eventName];
    };

    Communicator.prototype.subscriptionAlreadyRegistered = function(eventName, functionEventId){
        var response = false;
        if(this.getSubscription(eventName, functionEventId)){
            response = true;
        }
        return response;
    }

    Communicator.prototype.getSubscription = function(eventName, functionEventId){
        return this.events[eventName][functionEventId];
    }
    
    Communicator.prototype.findSubscriptions = function(eventName, whichSubscriptionFound, whichSubscriptionNotFound){
        var that = this;
        for(var subscriptionFound in this.getEvent(eventName)){
            that.eachFindSubscription(eventName, subscriptionFound, whichSubscriptionFound, whichSubscriptionNotFound)
        }
    };

    Communicator.prototype.eachFindSubscription = function(eventName, functionEventId, whichSubscriptionFound, whichSubscriptionNotFound){
        var that = this;
        if(this.subscriptionAlreadyRegistered(eventName, functionEventId)){
            var subscriptionFound = that.getSubscription(eventName, functionEventId);
            whichSubscriptionFound.call(that, subscriptionFound);
        } else {
            whichSubscriptionNotFound.call(that);
        }
    };

    Communicator.prototype.eventAlredyRegistered = function(eventName){
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
        if(that.eventAlredyRegistered(eventName)){
            var eventFound = that.getEvent(eventName);
            whichEventFound.call(that, eventName, eventFound);
        } else {
            whichEventNotFound.call(that, eventName);
        }
    };

    yOSON.Components.Communicator = Communicator;
    return Communicator;
});

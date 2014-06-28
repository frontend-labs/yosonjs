define([
    '../../src/comps/comunicator.js'
],
function(Comunicator){
    var objComunicator;

    beforeEach(function(){
        objComunicator = new Comunicator();
    });

    describe('specComunicator', function(){

        it('should be subscribe a method', function(){
            var eventName = "fakeMethod";
            var fakeMethodSelf = function(){};
            objComunicator.subscribe([eventName], fakeMethodSelf, this);

            var existMethod = objComunicator.eventAlreadyRegistered(eventName);
            expect(existMethod).toBeTruthy();
        });

        it('should be publish a method', function(){
            var eventName = "fakeMethod";
            var methodSpy = jasmine.createSpy("methodSpy");
            objComunicator.subscribe([eventName], methodSpy, this);
            objComunicator.publish(eventName);
            expect(methodSpy).toHaveBeenCalled();
        });

        it('should be work when passing arguments in publish', function(){
            var argsOfevent = [3, 5];
            var eventName = "fakeMethod";
            var methodSpy = jasmine.createSpy("methodSpy");
            objComunicator.subscribe([eventName], methodSpy, this);
            objComunicator.publish(eventName, argsOfevent);
            expect(methodSpy).toHaveBeenCalled();
            expect(methodSpy).toHaveBeenCalledWith(3, 5);
        });

        describe("Validate the arguments", function(){
            it('should be return empty array when no exists arguments', function(){
                expect(objComunicator.validateArguments()).toEqual([]);
            });

            it('should be return an array of the arguments', function(){
                var args = ["argument1", "argument2", "argument2"];
                expect(objComunicator.validateArguments(args)).toBe(args);
            });
        });

        it('should be stop an event subscribed', function(){
            var eventName = "methodToStop";
            var methodSpy = jasmine.createSpy("methodSpy");
            objComunicator.subscribe([eventName], methodSpy, this);
            objComunicator.stopSubscribe([ eventName ]);
            expect(objComunicator.getEvent(eventName)).toBeUndefined();
        });

        it('should be append a new method to subscribe', function(){
            var eventName = "fakeMethod";
            var fakeMethodSelf = function(){};
            objComunicator.addEvent(eventName, fakeMethodSelf, this);

            var existMethod = objComunicator.eventAlreadyRegistered(eventName);
            expect(existMethod).toBeTruthy();
        });

        it('should be remove an event subscribed', function(){
            var eventName = "methodToRemove";
            var eventSelf = function(){};
            objComunicator.subscribe([eventName], eventSelf, this);
            objComunicator.removeEvent(eventName);
            expect(objComunicator.getEvent(eventName)).toBeUndefined();
        });

        describe("Verify if the event already exists", function(){

            it("should return true if exists", function(){
                var eventName = "methodToRegister";
                var eventSelf = function(){};
                objComunicator.addEvent(eventName, eventSelf, this);
                expect(objComunicator.eventAlreadyRegistered(eventName)).toBeTruthy();
            });

            it("should return false if not exists", function(){
                var eventName = "methodUnregistered";
                expect(objComunicator.eventAlreadyRegistered(eventName)).toBeFalsy();
            });

        });

        describe("Get the event self", function(){

            it("should return the function self", function(){
                var eventName = "methodToRegister";
                var eventSelf = function(){};
                objComunicator.addEvent(eventName, eventSelf, this);
                var resultGetEvent = objComunicator.getEvent(eventName);
                expect(resultGetEvent).not.toBeUndefined();
            });

            it("should return undefined if not exists", function(){
                var eventName = "methodToRegister";
                var eventSelf = function(){};
                var resultGetEvent = objComunicator.getEvent(eventName);
                expect(resultGetEvent).toBeUndefined();
            });

        });

        describe("Finder of events", function(){

            it("should be when found an event", function(){
                var eventName = "methodToRegister";
                var eventSelf = function(){};
                var onFoundEvent = jasmine.createSpy("onFoundEvent");

                objComunicator.addEvent(eventName, eventSelf, this);
                objComunicator.finderEvents([eventName], onFoundEvent, function(){});
                expect(onFoundEvent).toHaveBeenCalled();
            });

            it("should be when not found an event", function(){
                var eventName = "methodNotToRegister";
                var onNotFoundEvent = jasmine.createSpy("onNotFoundEvent");
                objComunicator.finderEvents([eventName], function(){}, onNotFoundEvent);
                expect(onNotFoundEvent).toHaveBeenCalled();
            });

        });

    });
});

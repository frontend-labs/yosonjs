define([
    '../../src/comps/communicator.js'
],
function(Communicator){
    var objCommunicator;

    beforeEach(function(){
        objCommunicator = new Communicator();
    });

    describe('specCommunicator', function(){

        it('should be subscribe a method', function(){
            var eventName = "fakeMethod";
            var fakeMethodSelf = function(){};
            objCommunicator.subscribe([eventName], fakeMethodSelf, this);

            var existMethod = objCommunicator.eventAlreadyRegistered(eventName);
            expect(existMethod).toBeTruthy();
        });

        it('should be publish a method', function(){
            var eventName = "fakeMethod";
            var methodSpy = jasmine.createSpy("methodSpy");
            objCommunicator.subscribe([eventName], methodSpy, this);
            objCommunicator.publish(eventName);
            expect(methodSpy).toHaveBeenCalled();
        });

        it('should be work when passing arguments in publish', function(){
            var argsOfevent = [3, 5];
            var eventName = "fakeMethod";
            var methodSpy = jasmine.createSpy("methodSpy");
            objCommunicator.subscribe([eventName], methodSpy, this);
            objCommunicator.publish(eventName, argsOfevent);
            expect(methodSpy).toHaveBeenCalled();
            expect(methodSpy).toHaveBeenCalledWith(3, 5);
        });

        describe("Validate the arguments", function(){
            it('should be return empty array when no exists arguments', function(){
                expect(objCommunicator.validateArguments()).toEqual([]);
            });

            it('should be return an array of the arguments', function(){
                var args = ["argument1", "argument2", "argument2"];
                expect(objCommunicator.validateArguments(args)).toBe(args);
            });
        });

        it('should be stop an event subscribed', function(){
            var eventName = "methodToStop";
            var methodSpy = jasmine.createSpy("methodSpy");
            objCommunicator.subscribe([eventName], methodSpy, this);
            objCommunicator.stopSubscribe([ eventName ]);
            expect(objCommunicator.getEvent(eventName)).toBeUndefined();
        });

        it('should be append a new method to subscribe', function(){
            var eventName = "fakeMethod";
            var fakeMethodSelf = function(){};
            objCommunicator.addEvent(eventName, fakeMethodSelf, this);

            var existMethod = objCommunicator.eventAlreadyRegistered(eventName);
            expect(existMethod).toBeTruthy();
        });

        it('should be remove an event subscribed', function(){
            var eventName = "methodToRemove";
            var eventSelf = function(){};
            objCommunicator.subscribe([eventName], eventSelf, this);
            objCommunicator.removeEvent(eventName);
            expect(objCommunicator.getEvent(eventName)).toBeUndefined();
        });

        describe("Verify if the event already exists", function(){

            it("should return true if exists", function(){
                var eventName = "methodToRegister";
                var eventSelf = function(){};
                objCommunicator.addEvent(eventName, eventSelf, this);
                expect(objCommunicator.eventAlreadyRegistered(eventName)).toBeTruthy();
            });

            it("should return false if not exists", function(){
                var eventName = "methodUnregistered";
                expect(objCommunicator.eventAlreadyRegistered(eventName)).toBeFalsy();
            });

        });

        describe("Get the event self", function(){

            it("should return the function self", function(){
                var eventName = "methodToRegister";
                var eventSelf = function(){};
                objCommunicator.addEvent(eventName, eventSelf, this);
                var resultGetEvent = objCommunicator.getEvent(eventName);
                expect(resultGetEvent).not.toBeUndefined();
            });

            it("should return undefined if not exists", function(){
                var eventName = "methodToRegister";
                var eventSelf = function(){};
                var resultGetEvent = objCommunicator.getEvent(eventName);
                expect(resultGetEvent).toBeUndefined();
            });

        });

        describe("Finder of events", function(){

            it("should be when found an event", function(){
                var eventName = "methodToRegister";
                var eventSelf = function(){};
                var onFoundEvent = jasmine.createSpy("onFoundEvent");
                var onNotFoundEvent = jasmine.createSpy("onNotFoundEvent");

                objCommunicator.addEvent(eventName, eventSelf, this);
                objCommunicator.finderEvents([eventName], onFoundEvent, onNotFoundEvent);
                expect(onFoundEvent).toHaveBeenCalled();
                expect(onNotFoundEvent).not.toHaveBeenCalled();
            });

            it("should be when not found an event", function(){
                var eventName = "methodNotToRegister";
                var onFoundEvent = jasmine.createSpy("onFoundEvent");
                var onNotFoundEvent = jasmine.createSpy("onNotFoundEvent");
                objCommunicator.finderEvents([eventName], onFoundEvent, onNotFoundEvent);
                expect(onFoundEvent).not.toHaveBeenCalled();
                expect(onNotFoundEvent).toHaveBeenCalled();
            });

        });

    });
});

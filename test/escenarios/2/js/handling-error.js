yOSON.AppCore.addModule("moduleWithPossibleError", function(){
    var st = {};
    return {
        init: function(){
            frikiFunction();
        }
    }
});

yOSON.AppCore.addModule("moduleWithPossibleError2", function(){
    var st = {};
    var catchDOM = function(){
        document.writeln("moduleWithPossibleError2");
    };
    return {
        init: function(){
            catchDOM();
        }
    }
});

yOSON.AppCore.addModule("moduleWithPossibleError3", function(){
    var st = {};
    var catchDOM = function(){
        events.click();
    };
    var events = {
        click: function(){
            evt.fakeEvent();
        }
    }
    return {
        init: function(){
            catchDOM();
        }
    }
});

yOSON.AppCore.runModule("moduleWithPossibleError");
yOSON.AppCore.runModule("moduleWithPossibleError2");
yOSON.AppCore.runModule("moduleWithPossibleError3");

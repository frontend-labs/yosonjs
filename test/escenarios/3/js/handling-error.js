yOSON.AppCore.addModule("moduleANeedsTheHostProtocol", function(){
    var st = {};
    var frikiFunction = function(){
        
    };
    return {
        init: function(){
            frikiFunction();
        }
    };
}, ['//cdnjs.cloudflare.com/ajax/libs/Colors.js/1.2.4/colors.min.js']);

yOSON.AppCore.runModule("moduleANeedsTheHostProtocol");

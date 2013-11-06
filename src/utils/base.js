/**
 *  Basehelpers JS we needs for yOSON
 */
var yOSON = {};
yOSON.utils = {
    copy: function(element, collection){
        for(var x = 0; x < collection.length; x++){
            element.push(collection[x]);
        }
        return element;
    },
    remove: function(element, from, to){
        var index =(to || from),
            elementLength = element.length,
            rest = element.slice(index + 1 || elementLength);

        if(from < 0){
            elementLength = elementLength + from;
        } else {
            elementLength = from;
        }

        element.push.apply(element, rest);

        return element;
    },
    inArray: function(collection){
        for(var item in collection){
           if(collection[item] === arguments[0]){
               return true;
           }
        }

        return false;
    }
};

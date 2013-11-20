/**
 *  Basehelpers JS we needs for yOSON
 */
define(function(){
    return {
        copy: function(element, collection){
            for(var x = 0; x < collection.length; x++){
                element.push(collection[x]);
            }
            return element;
        },
        remove: function(element, from, to){
            var index =(to || from) + 1,
                elementLength = element.length,
                rest = element.slice(index || element.length);

            if(from < 0){
                element.length = elementLength + from;
            } else {
                element.length = from;
            }

            element.push.apply(element, rest);

            return element;
        },
        inArray: function(collection, value){
            var result = false;
            for(var i= 0;i<collection.length; i++){
                if(collection[i] === value){
                    result = true;
                }
            }
            return result;
        }
    };
});


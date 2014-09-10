define(function(){

    if(typeof yOSON === "undefined"){
        var yOSON = {};
    }

    yOSON.Components = {};

    yOSON.Log = function(){
        try{
            console.log.apply(console, arguments);
        }catch(err){
            try{
                opera.postError.apply(opera, arguments);
            }catch(er){
                alert(Array.prototype.join.call(arguments), " ");
            }
        }
    };

    return yOSON;
});

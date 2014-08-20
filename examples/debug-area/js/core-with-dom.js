yOSON.AppCore.addModule("moduleA", function(){

    return {
        init: function(){
            console.log('eeeee');
        }
    }
});

yOSON.AppCore.addModule("moduleB", function(){

    return {
        init: function(){
            console.log('eeeee');
        }
    }
});

yOSON.AppCore.addModule("moduleC", function(){

    return {
        init: function(){
            console.log('eeeeeC');
        }
    }
});

yOSON.AppCore.runModule("moduleA");
yOSON.AppCore.runModule("moduleB");
yOSON.AppCore.runModule("moduleC");
yOSON.AppCore.runModule("moduleD");

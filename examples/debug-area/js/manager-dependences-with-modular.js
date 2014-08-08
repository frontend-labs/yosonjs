yOSON.AppCore.setStaticHost("http://cdn.aptitus.e3.pe/js/");
//append the demo urls
var dependences = [
    'http://code.jquery.com/jquery-1.11.0.min.js',
    'http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js',
    'faked.js',
    'http://cdnjs.cloudflare.com/ajax/libs/jquery-color/2.1.2/jquery.color.min.js'
];

var dependencesApt = [
    'src/libs/yoson/data/rulesValidate.js',
    'src/libs/underscore.js',
    'http://cdnjs.cloudflare.com/ajax/libs/jquery-color/2.1.2/jquery.color.min.js'
];

var empty = [];
window.flag = false;
var escribir = function(){
    document.body.innerHTML = "echo";
}
//1st executing modular with dependencyManager
yOSON.AppCore.addModule('o1', function(Sb){
    return {
        init: function(){
            console.log('o1');
            Sb.trigger('po2');
            window.flag = true;
        }
    }
}, empty);

console.log('outside', window.flag);
yOSON.AppCore.addModule('o2', function(Sb){
    var publicMethodOfAModule = function(){
        escribir();
    };
    return {
        init: function(){
            Sb.events(['po2'], publicMethodOfAModule, this);
            console.log('o2');
        }
    }
}, dependences);

yOSON.AppCore.addModule('o3', function(){
    return {
        init: function(){
            console.log('o3');
        }
    }
}, [dependencesApt[2]]);

yOSON.AppCore.addModule('o4', function(){
    return {
        init: function(){
            console.log('o4');
        }
    }
}, [dependencesApt[2]]);

yOSON.AppCore.addModule('o5', function(){
    return {
        init: function(){
            console.log('o5');
        }
    }
}, empty);

yOSON.AppCore.addModule('o6', function(){
    return {
        init: function(){
            console.log('o6');
        }
    }
}, empty);

yOSON.AppCore.addModule('m1', function(){
    return {
        init: function(){
            console.log('m1');
        }
    }
}, [dependencesApt[1]]);

yOSON.AppCore.addModule('m2', function(){
    return {
        init: function(){
            console.log('m2');
        }
    }
}, empty);

yOSON.AppCore.addModule('m3', function(){
    return {
        init: function(){
            console.log('m3');
        }
    }
}, [dependencesApt[2]]);

yOSON.AppCore.addModule('mall1', function(){
    return {
        init: function(){
            console.log('mall1');
        }
    }
}, empty);
//dependencyManager.ready(dependencesApt, function(){
    //console.log('done!');
//});


yOSON.AppCore.whenModule('o1', 'start', function(){
    console.log('only before run');
});
yOSON.AppCore.runModule('o2');
yOSON.AppCore.runModule('o1');
//yOSON.AppCore.runModule('o3');
//yOSON.AppCore.runModule('o4');
//yOSON.AppCore.runModule('o5');
//yOSON.AppCore.runModule('o6');
//yOSON.AppCore.runModule('mall1');
//yOSON.AppCore.runModule('m1');
//yOSON.AppCore.runModule('m2');
//yOSON.AppCore.runModule('m3');

yOSON.AppCore.whenModule('o1', 'run', function(){
    console.log('only when its run');
});
//yOSON.AppCore.runModule('demoA');
//yOSON.AppCore.runModule('demoB');

//when is ready

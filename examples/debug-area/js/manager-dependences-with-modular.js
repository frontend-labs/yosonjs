yOSON.AppCore.setStaticHost("http://cdn.aptitus.e3.pe/js/");
//append the demo urls
var dependences = [
    'http://code.jquery.com/jquery-1.11.0.min.js',
    'http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js',
    'http://cdnjs.cloudflare.com/ajax/libs/jquery-color/2.1.2/jquery.color.min.js'
];

var dependencesApt = [
    'src/libs/yoson/data/rulesValidate.js',
    'src/libs/underscore.js',
    'src/libs/jquery/jqFancybox.js'
];

var empty = [];
//1st executing modular with dependencyManager
yOSON.AppCore.addModule('01', function(){
    return {
        init: function(){
            console.log('01');
        }
    }
}, empty);


yOSON.AppCore.addModule('02', function(){
    return {
        init: function(){
            console.log('02');
        }
    }
}, [dependencesApt[2]]);

yOSON.AppCore.addModule('03', function(){
    return {
        init: function(){
            console.log('03');
        }
    }
}, [dependencesApt[2]]);

yOSON.AppCore.addModule('04', function(){
    return {
        init: function(){
            console.log('04');
        }
    }
}, [dependencesApt[2]]);

yOSON.AppCore.addModule('05', function(){
    return {
        init: function(){
            console.log('05');
        }
    }
}, empty);

yOSON.AppCore.addModule('06', function(){
    return {
        init: function(){
            console.log('06');
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
}, dependencesApt);
//dependencyManager.ready(dependencesApt, function(){
    //console.log('done!');
//});

yOSON.AppCore.runModule('01');
yOSON.AppCore.runModule('02');
yOSON.AppCore.runModule('03');
yOSON.AppCore.runModule('04');
yOSON.AppCore.runModule('05');
yOSON.AppCore.runModule('06');
yOSON.AppCore.runModule('mall1');
yOSON.AppCore.runModule('m1');
yOSON.AppCore.runModule('m2');
yOSON.AppCore.runModule('m3');

//yOSON.AppCore.runModule('demoA');
//yOSON.AppCore.runModule('demoB');

//when is ready

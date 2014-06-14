var require = {
    baseUrl: './src',
    paths:{
        'spec':'spec',
        'yoson':'./yoson',

        'jquery':'../test/lib/jquery',

        'sinon':'../lib/sinon',
        'jasmine':'../lib/jasmine-1.3.1/jasmine',
        'jasmine-html':'../lib/jasmine-1.3.1/jasmine-html',
        'jasmine-jquery':'../lib/jasmine-jquery'
    },
    shim:{
        'jasmine':{
            exports:'jasmine'
        },
        'sinon':{
            exports:'sinon'
        },
        'jasmine-html':['jasmine'],
        'jasmine-jquery':[ 'jasmine' ]
    }
};

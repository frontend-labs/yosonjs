var schema = {
    'modules':{
        'allModules': function(){
            //alert("sector donde corre sin importar el nombre del modulo");
        },
        'default':{
            'allControllers': function(){
                //alert("sector donde corre sin importar el nombre del controller en el modulo usuario");
            },
            'controllers':{
                'index': {
                    'allActions':function(){
                    },
                    'actions':{
                        'index': function(){
                            yOSON.AppCore.runModule("my-first-module");
                        },
                        'byDefault':function(){
                            //alert("si no existe un action, este action corre por defecto");
                        }
                    }
                },
                'byDefault': function(){
                    //alert("si no existe un controller debería ser por default este controller");
                }
            }
        },
        'byDefault': function(){
            //alert('corriendo modulo por defecto');
        }
    }
};

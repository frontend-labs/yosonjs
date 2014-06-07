var schema = {
    'modules':{
        'allModules': function(){
            //alert("sector donde corre sin importar el nombre del modulo");
        },
        'usuario':{
            'allControllers': function(){
                //alert("sector donde corre sin importar el nombre del controller en el modulo usuario");
            },
            'controllers':{
                'aviso': {
                    'allActions':function(){
                        //alert("corre sin importar si hay actions o no");
                    },
                    'actions':{
                        'dashboard': function(){
                            yOSON.AppCore.runModule("demoA");
                            yOSON.AppCore.runModule("demoB");
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

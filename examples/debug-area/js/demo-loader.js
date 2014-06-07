var schema = {
    'modules':{
        'allModules': function(){
            alert("sector donde corre sin importar el nombre del modulo");
        },
        'usuario':{
            'allControllers': function(){
                alert("sector donde corre sin importar el nombre del controller en el modulo usuario");
            },
            'controllers':{
                'aviso': {
                    'allActions':function(){
                        alert("corre sin importar si hay actions o no");
                    },
                    'actions':{
                        'dashboard': function(){
                            alert('corriendo action dashboard del controller aviso');
                        },
                        'byDefault':function(){
                            alert("si no existe un action, este action corre por defecto");
                        }
                    }
                },
                'byDefault': function(){
                    alert("si no existe un controller debería ser por default este controller");
                }
            }
        },
        'byDefault': function(){
            alert('corriendo modulo por defecto');
        }
    }
};
var objLoader = new yOSON.Loader(schema);
//
var querys = {
    "nothing":"",
    "onlyModule":"usuario",
    "moduleWithController":{
        "module": "usuario",
        "controller": "aviso"
    },
    "moduleControllerAction":{
        "module": "usuario",
        "controller": "aviso",
        "action": "dashboard"
    }
}
//querys.nothing
var query = querys.nothing;
objLoader.init(querys.nothing);
//querys.onlymodule
alert("querys.onlyModule");
query = querys.onlyModule;
objLoader.init(query);
alert("modulewithcontroller");
query = querys.moduleWithController;
objLoader.init(query.module, query.controller);
//querys.modulewithcontrollerAction
alert("moduleControllerAction");
query = querys.moduleControllerAction;
objLoader.init(query.module, query.controller, query.action);

define(function(){
    var SchemaDemo = {
        "modules": { //list of modules
            //module application
            "application":{
                //list of controllers of application module
                "controllers":{
                    //index controller
                    "index":{
                        //list of actions of index controller
                        "actions":{
                            //index Action
                            "index": function(){

                            },
                            "action-two": function(){

                            },
                            //action byDefault if not exists an action in the controller runs here
                            "byDefault": function(){

                            }
                        },
                        //this action dont care what action its executing in the controller same runs
                        "allActions": function(){

                        }
                    },
                    //page-products controller
                    "page-products":{
                        "actions":{
                            "index": function(){

                            },
                            "detail": function(){

                            },
                            "cart": function(){

                            },
                            "byDefault": function(){

                            }
                        },
                        "allActions": function(){

                        }
                    },
                    //if not exists an controller runs here
                    "byDefault": function(){

                    }
                },
                //this controller dont care what controller in the module its executing same runs
                "allControllers": function(){

                }
            },
            //the default module if not exists an module runs here
            "byDefault": function(){

            },
            //this module dont care what module its executing same runs
            "allModules": function(){

            }
        }
    };

    return SchemaDemo;
});

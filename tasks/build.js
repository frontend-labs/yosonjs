module.exports = function(grunt){
    "use strict";
    var fs = require("fs"),
        requirejs = require("requirejs"),
        srcFolder = __dirname + "../../../src/",
        rdefineEnd =  /\}\);[^}\w]*$/,
        config = {
            baseUrl: "src",
            name: "yoson",
            out: "build/yoson.js",
            optimize: "none",
            findNestedDependencies: true,
            skipSemiColonInsertion: true,
            wrap:{
                startFile: "src/intro.js",
                startFile: "src/outro.js"
            },
            onBuildWrite: convert
        }

    var convert = function(name, path, contents){

    }
};

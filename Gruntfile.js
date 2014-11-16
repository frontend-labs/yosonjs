module.exports = function(grunt){

    var defaultOptsTmpl = {
        requireConfigFile: 'RequireConfig.js'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta:{
            bin:{
                coverage: 'bin/coverage'
            },
            port:{
                coverage: 8082
            }
        },
        connect: {
            test: {
                port: 8000,
                base: '.'
            },
            coverage:{
                options:{
                    port: '<%= meta.port.coverage %>',
                    middleware: function(connect, options){
                        var src = [];
                        var adjustMethod = function(file){
                            src.push('/'+file);
                        };
                        grunt.file.expand(grunt.config.get("jasmine.coverage.src")).forEach(adjustMethod);
                        var staticConnection = connect.static(options.base);
                        return [
                            function(request, response, next){
                                if(src.indexOf(request.url) > -1){
                                    request.url = "/.grunt/grunt-contrib-jasmine"+request.url;
                                }
                                return staticConnection.apply(this, arguments);
                            }
                        ];
                    }
                }
            }
        },
        //compress
        uglify: {
            production:{
                files: {
                    'build/yoson-min.js':['dist/yoson.js']
                },
                options:{
                    preserveComments: false,
                    sourceMap: "dist/yoson.min.map",
                    sourceMappingURL: "yoson.min.map",
                    report: "min",
                    beautify:{
                        ascii_only: true
                    },
                    banner: "/*! FrontendLabs comunity | yOSONJS v<%=pkg.version%> | " +
                            "(c) 2014, <%=grunt.template.today('yyyy')%> FrontendLabs comunity */",
                    compress: {
                        hoist_funs: false,
                        loops: false,
                        unused: false
                    }
                }
            }
        },
        //for validation
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['src/**/*.js', 'spec/**/*.js', '!src/yoson.js']
        },
        //for execute shell commands
        exec: {
            cleanDist: {
                command: 'rm -fr dist'
            },
            cleanBuild: {
                command: 'rm -fr build'
            }
        },
        jasmine:{
            requirejs:{
                src: 'src/**/*.js',
                options: {
                    specs: 'test/spec/Spec*.js',
                    helpers: 'test/helper/Helper*.js',
                    host: 'http://127.0.0.1:<%= connect.test.port %>/',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: defaultOptsTmpl
                }
            },
            coverage:{
                src: 'src/**/*.js',
                options: {
                    specs: 'test/spec/Spec*.js',
                    host: 'http://127.0.0.1:<%= meta.port.coverage %>/',
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: '<%= meta.bin.coverage%>/coverage.json',
                        report: [
                            {
                                type: "html",
                                options: {
                                    dir: "<%= meta.bin.coverage%>/html"
                                },
                            },
                            {
                                type: "text-summary"
                            }
                        ],
                        replace: false,
                        template: require("grunt-template-jasmine-requirejs"),
                        templateOptions:defaultOptsTmpl
                    }
                }
            }
        },
        //for documentation
        yuidoc:{
            all: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options:{
                    paths: ['src'],
                    outdir: './docs/'
                }
            }
        },
        //for complexity
        complexity: {
            generic: {
                src: ["src/**/*.js"],
                options:{
                    "jsLintXML": "report/jslint.xml",
                    "checkstyleXML":"report/checkstyle.xml",
                    "cyclomatic": 3,
                    "halstead": 8,
                    "maintainability": 100,
                    "broadcast": false
                }
            }
        },
        //for changelog
        changelog: {
            options: {

            }
        }
   });

   //load package for task of requirejs
   grunt.loadNpmTasks('grunt-contrib-requirejs');
   //load package for task of jshint
   grunt.loadNpmTasks('grunt-contrib-jshint');
   //load package for task of jshint
   grunt.loadNpmTasks('grunt-complexity');
   //módulo para emular la conexión por consola de los tests
   grunt.loadNpmTasks('grunt-contrib-connect');
   //load package for task of uglify compress
   grunt.loadNpmTasks('grunt-contrib-uglify');
   //load package for task of shell
   grunt.loadNpmTasks('grunt-exec');
   //Load the plugin that provides the jasmine test
   grunt.loadNpmTasks('grunt-contrib-jasmine');
   //Load the plugin that provides the yuidoc
   grunt.loadNpmTasks('grunt-contrib-yuidoc');
   //Load the plugin that provides the generator of changelog file
   grunt.loadNpmTasks('grunt-conventional-changelog');

   //Load the tasks
   grunt.loadTasks('tasks');

   //log the tasks
   grunt.log.write("running grunt for yoson");
   //enroll tasks
   grunt.registerTask('hint', ['jshint', 'complexity']);
   grunt.registerTask('spec', ['connect', 'jasmine:requirejs']);
   grunt.registerTask('coverage', ['connect:coverage', 'jasmine:coverage']);
   grunt.registerTask('dist', ['exec:cleanDist', 'generateDist']);
   grunt.registerTask('build', ['exec:cleanBuild', 'uglify']);
   grunt.registerTask('doc', ['yuidoc']);
   grunt.registerTask('default', ['spec', 'dist', 'build', 'doc']);
   //grunt.registerTask('default', ['spec']);
};

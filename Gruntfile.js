module.exports = function(grunt){

    var defaultOptsTmpl = {
        requireConfigFile: 'RequireConfig.js'
    };

    grunt.initConfig({
        connect: {
            test: {
                port: 8000,
                base: '.'
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
                    banner: "frontendlabs comunity",
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
            all: ['src/**/*.js', 'spec/**/*.js']
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
            }
        }
   });

   //load package for task of requirejs
   grunt.loadNpmTasks('grunt-contrib-requirejs');
   //load package for task of jshint
   grunt.loadNpmTasks('grunt-contrib-jshint');
   //módulo para emular la conexión por consola de los tests
   grunt.loadNpmTasks('grunt-contrib-connect');
   //load package for task of uglify compress
   grunt.loadNpmTasks('grunt-contrib-uglify');
   //load package for task of shell
   grunt.loadNpmTasks('grunt-exec');
   //Load the plugin that provides the jasmine test
   grunt.loadNpmTasks('grunt-contrib-jasmine');

   //Load the tasks
   grunt.loadTasks('tasks');

   //log the tasks
   grunt.log.write("running grunt for yoson");
   //enroll tasks
   grunt.registerTask('spec', ['connect', 'jasmine:requirejs']);
   grunt.registerTask('dist', ['exec:cleanDist', 'generateDist']);
   grunt.registerTask('build', ['exec:cleanBuild', 'uglify']);
   grunt.registerTask('default', ['spec', 'dist', 'build']);
   //grunt.registerTask('default', ['spec']);
};

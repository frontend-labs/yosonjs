module.exports = function(grunt){
    var defaultOptsTmpl = {
        requireConfigFile: 'RequireConfig.js',
        requireConfig: {
            baseUrl: './src/',
        }
    };
    grunt.initConfig({
        connect: {
            test: {
                port: 8000,
                base: '.'
            }
        },
        //compile the scripts
         requirejs:{
            compile:{
                options: {
                    mainConfigFile: 'src/RequireConfig.js',
                    baseUrl: "src",
                    name:'yOSON',
                    out:'build/src/yoson.js'
                }
            }
        },
        copy: {
            build: {
                files: [
                    {expand: true, src: ['src/RequireConfig.js'], dest: 'build'},
                    {expand: true, src: ['lib/require.js'], dest: 'build'},
                    {expand: true, src: ['css/*.css'], dest: 'build'},
                    {expand: true, src: ['index.html'], dest: 'build'}
                ]
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
            clean: {
                command: 'rm -rf build'
            }
        },
        jasmine:{
            requirejs:{
                src: 'src/**/*.js',
                options: {
                    specs: 'test/spec/Spec*.js',
                    helpers: 'test/spec/*Helper.js',
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
   //load package for task of copy
   grunt.loadNpmTasks('grunt-contrib-copy');
   //load package for task of shell
   grunt.loadNpmTasks('grunt-exec');
   //Load the plugin that provides the jasmine test
   grunt.loadNpmTasks('grunt-contrib-jasmine');

   //log the tasks
   grunt.log.write("running grunt for yoson");
   //enroll tasks
   grunt.registerTask('spec', ['jshint', 'connect', 'jasmine:requirejs']);
   //grunt.registerTask('build', ['exec:clean', 'copy:build']);
   //grunt.registerTask('default', ['spec', 'build']);
   grunt.registerTask('default', ['spec']);
}

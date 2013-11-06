module.exports = function(grunt){
    var utilsJs = 'src/core/*.js';
    //Project configuration
    //grunt.initConfig({
        //pkg: grunt.file.readJSON('package.json'),
        //concat:{
            //files:{
                //"yoson.js":[utilsJs]
            //}
        //},
        //uglify: {
            //options:{
                //banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            //},
            //build:{
                //src:'src/<%= pkg.name %>.js',
                //dest: 'build/<%= pkg.name %>.min.js'
            //}
        //}
    //});
    grunt.initConfig({
        //watch a files
         watch: {
             scripts: {
                 files: ['src/**/*.js', 'spec/**/*.js', 'lib/**/*.js'],
                 tasks: ['spec']
             }
         },
         concat:{
            files:{
                src:['src/*.js'],
                dest:'build/src/yoson.js'
            }
        },
        //compile the scripts
        /* requirejs:{*/
            //compile:{
                //options: {
                    //mainConfigFile: 'src/RequireConfig.js',
                    //baseUrl: "src",
                    //name:'yOSON',
                    //out:'build/src/yoson.js'
                //}
            //}
        /*},*/
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
        }
   });
   //load package for task of watch
   grunt.loadNpmTasks('grunt-contrib-watch');
   //load package for task of requirejs
   //grunt.loadNpmTasks('grunt-contrib-requirejs');
   //load package for task of jshint
   grunt.loadNpmTasks('grunt-contrib-jshint');
   //grunt.loadNpmTasks('grunt-contrib-connect');
   //load package for task of copy
   grunt.loadNpmTasks('grunt-contrib-copy');
   //load package for task of shell
   grunt.loadNpmTasks('grunt-exec');
   //Load the plugin that provides the "uglify" task
   //grunt.loadNpmTasks('grunt-contrib-requirejs');
   grunt.loadNpmTasks('grunt-contrib-concat');

   //log the tasks
   grunt.log.write("running grunt for yoson");
   //enroll tasks
   //grunt.registerTask('spec', ['jshint', 'connect', 'exec:jasmine']);
   grunt.registerTask('spec', ['jshint']);
   grunt.registerTask('build', ['exec:clean', 'copy:build', 'concat:files']);
   grunt.registerTask('default', ['spec', 'build']);
}

//running the specs
require([
    'jquery',
    'jasmine',
    'jasmine-html',
    //specs
    'SpecUtils',
], function($, jasmine){
    //traemos el enviroment actual
    var jasmineEnv = jasmine.getEnv();

    var htmlReporter = new jasmine.HtmlReporter();
    jasmineEnv.addReporter(htmlReporter);
    jasmineEnv.specFilter = function(spec){
        return htmlReporter.specFilter(spec);
    };

    $(function(){
        jasmine.getEnv().execute();
    });
});

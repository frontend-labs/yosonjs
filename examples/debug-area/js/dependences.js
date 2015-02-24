var objDependency = new yOSON.Components.Dependency('http://code.jquery.com/jquery-1.11.0.min.js');
objDependency.request({
    onReady:function(instanceLoaded){
        console.log('instanceLoaded', instanceLoaded);
    }
});

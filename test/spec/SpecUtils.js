define([
   '../src/utils/base.js'
  ],
  function(){
  describe('yosonUtils', function(){
      var yoson;

      beforeEach(function(){
        yoson = yOSON;
      });

      it('should be a copy an array', function(){
          var array = [1,"a","b"],
              target = yoson.utils.copy([], array);
          expect(target).toEqual(array);
      });

      it('should be remove a one element of array', function(){
          //var array = [1,"a","b"];
          //var result = yoson.utils.remove(array, 0, 1);
          //expect(result).toEqual(["b"]);
      });
  });
});

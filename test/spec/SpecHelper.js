define([
    'jasmine',
    'jasmine-jquery'
], function(jasmine){
    jasmine.getFixtures().fixturesPath = 'spec/fixtures';
    beforeEach(function() {
        this.addMatchers({
            toBePlaying: function(expectedSong) {
                var player = this.actual;
                return player.currentlyPlayingSong === expectedSong &&
                    player.isPlaying;
            },
            toBeAGoodInvestment: function() {
                var investment = this.actual;
                var what = this.isNot?'bad' : 'good';

                this.message = function(){
                    return 'Expected investment to be a ' + what +' good investment';
                };

                return investment.isGood();
            }
        });
    });
});

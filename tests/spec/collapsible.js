// documentation on jasmine and jasmine-jquery:
//   https://github.com/pivotal/jasmine/wiki
//   https://github.com/velesin/jasmine-jquery
define({
    describe: function($) {
        describe('init', function() {
            it("creates panel-content", function() {
                expect($('#implicit-open')).toContain('.panel-content');
            });
            it("implicit open", function() {
                var $el = $('#implicit-open'),
                    $panel = $('.panel-content', $el);
                expect($el).toHaveClass('open');
                //expect($panel).not.toHaveAttr('style', 'display: none; ');
            });
            it("explicit open", function() {
                var $el = $('#explicit-open'),
                    $panel = $('.panel-content', $el);
                expect($el).toHaveClass('open');
                //expect($panel).not.toHaveAttr('style', 'display: none; ');
            });
            it("explicit closed", function() {
                var $el = $('#explicit-closed'),
                    $panel = $('.panel-content', $el);
                expect($el).toHaveClass('closed');
                //expect($panel).toHaveAttr('style', 'display: none; ');
            });
        });
    }
});
define(function() {
    return function($) {
        describe('init', function() {
            it("creates panel-content", function() {
                assert($('#implicit-open')).contains('.panel-content');
            });
            it("implicit open", function() {
                var $el = $('#implicit-open'),
                    $panel = $('.panel-content', $el);
                assert($el).hasClass('open');
                //assert($panel).not.toHaveAttr('style', 'display: none; ');
            });
            it("explicit open", function() {
                var $el = $('#explicit-open'),
                    $panel = $('.panel-content', $el);
                assert($el).hasClass('open');
                //assert($panel).not.toHaveAttr('style', 'display: none; ');
            });
            it("explicit closed", function() {
                var $el = $('#explicit-closed'),
                    $panel = $('.panel-content', $el);
                assert($el).hasClass('closed');
                //assert($panel).toHaveAttr('style', 'display: none; ');
            });
        });
    };
});
define(function() {
    return function($) {
        describe('single injection with same id', function() {
            it("handles id as part of href", function() {
                var $el = $('#id-in-href'),
                    $target = $('#srctgt');
                    $el.click();
                // XXX: check for inject event
                // XXX: instead of wait, switch inject into synchronous mode
                wait(500, function() {
                    var $target = $('#srctgt');
                    assert($target).contains('#srctgt-content');
                });
            });
        });
    };
});
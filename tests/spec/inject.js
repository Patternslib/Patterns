// documentation on jasmine and jasmine-jquery:
//   https://github.com/pivotal/jasmine/wiki
//   https://github.com/velesin/jasmine-jquery
define(function() {
    return function($) {
        describe('single injection with same id', function() {
            it("handles id as part of href", function() {
                runs(function() {
                    var $el = $('#id-in-href'),
                        $target = $('#srctgt');
                    spyOnEvent($target, 'inject');
                    $el.click();
                });
                // XXX: properly wait for injection/ajax to finish
                waits(500);
                runs(function() {
                    var $target = $('#srctgt');
                    expect('inject').toHaveBeenTriggeredOn($target);
                });
                runs(function() {
                    var $target = $('#srctgt');
                    expect($target).toContain('#srctgt-content');
                });
            });
        });
    };
});
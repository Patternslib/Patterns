define([
    'require',
    '../../src/lib/jquery',
    '../../src/patterns'
], function(require) {
    var patterns = require('../../src/patterns');
    var dom = function() {
        return $('#jasmine-fixtures');
    };

    describe('inject', function() {
        beforeEach(function() {
            loadFixtures('inject.html');
            patterns.scan(dom());
        });

        describe('single injection with same id', function() {
            it("handles id as part of href", function() {
                runs(function() {
                    var $el = $('#id-in-href', dom()),
                        $target = $('#srctgt', dom());
                    spyOnEvent($target, 'inject');
                    $el.click();
                });
                // XXX: properly wait for injection/ajax to finish
                waits(500);
                runs(function() {
                    var $target = $('#srctgt', dom());
                    expect('inject').toHaveBeenTriggeredOn($target);
                });
                runs(function() {
                    var $target = $('#srctgt', dom());
                    expect($target).toContain('#srctgt-content');
                });
            });
        });
    });
});
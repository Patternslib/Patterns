// documentation on jasmine and jasmine-jquery:
//   https://github.com/pivotal/jasmine/wiki
//   https://github.com/velesin/jasmine-jquery
define([
    'require',
    '../../src/lib/jquery',
    '../../src/patterns'
], function(require) {
    var patterns = require('../../src/patterns');
    var dom = function() {
        return $('#jasmine-fixtures');
    };

    describe('modal', function() {
        beforeEach(function() {
            loadFixtures('modal.html');
            patterns.scan(dom());
        });

        describe('init', function() {
            it("creates panel-content", function() {
                expect(dom()).toContain('.panel-content');
            });
        });
    });
});
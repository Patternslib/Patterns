define([
    'require',
    '../../src/lib/jquery',
    '../../src/patterns'
], function(require) {
    describe('collapsible', function() {
        loadFixtures('collapsible.html');
        var dom = $('#jasmine-fixtures'),
            patterns = require('../../src/patterns');
        patterns.scan(dom);

        describe('init', function() {
            it("creates panel-content", function() {
                expect(dom).toContain('.panel-content');
            });
            it("implicit open", function() {
                var $el = $('#implicit-open', dom),
                    $panel = $('.panel-content', $el);
                expect($el).toHaveClass('open');
                expect($panel).not.toHaveAttr('style', 'display: none; ');
            });
            it("explicit open", function() {
                var $el = $('#explicit-open', dom),
                    $panel = $('.panel-content', $el);
                expect($panel).not.toHaveAttr('style', 'display: none; ');
            });
            it("explicit closed", function() {
                var $el = $('#explicit-closed', dom),
                    $panel = $('.panel-content', $el);
                expect($panel).toHaveAttr('style', 'display: none; ');
            });
        });
    });
});
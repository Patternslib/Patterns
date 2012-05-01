define([
    'require',
    '../lib/dist/underscore',
    '../../lib/chosen.jquery',
    '../logging'
], function(require) {
    var log = require('../logging').getLogger('breadcrumbs');

    var init = function($el, opts) {
        // wrap elements in a DIV that will be shifted around
        var $content = $el.children()
                .wrapAll('<div class="breadcrumbs-content"></div>').parent();

        // set fixed width on content
        var width = $content.children().toArray().reduce(function(acc, el) {
            var $el = $(el);
            console.log(acc + $el.outerWidth(true));
            return acc + $el.outerWidth(true);
        }, 0);
        $content.width(width);

        // shift ctrl
        var $shift = $('<span class="button shift">shift</span>')
                .prependTo($el);

    };

    var pattern = {
        markup_trigger: 'nav.breadcrumbs',
        init: init
    };
    return pattern;
});
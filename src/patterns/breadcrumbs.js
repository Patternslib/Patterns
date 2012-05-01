define([
    'require',
    '../lib/dist/underscore',
    '../../lib/chosen.jquery',
    '../logging'
], function(require) {
    var log = require('../logging').getLogger('breadcrumbs');

    var init = function($el, opts) {
        // wrap elements in a DIV that will be shifted around
        $el.children().wrapAll('<div class="breadcrumbs-content"></div>');

        // shift ctrl
        var $shift = $('<span class="shift shift-right">shift</span>')
                .prependTo($el);
    };

    var pattern = {
        markup_trigger: 'nav.breadcrumbs',
        init: init
    };
    return pattern;
});
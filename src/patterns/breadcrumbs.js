define([
    'require',
    '../lib/dist/underscore',
    '../../lib/chosen.jquery',
    '../logging'
], function(require) {
    var log = require('../logging').getLogger('breadcrumbs');

    var init = function($el, opts) {
        // wrap elements in a UL in case none exists
        if (!$el.is(':has(ul)')) {
            $el.children().wrapAll('<ul></ul>').wrap('<li></li>');
        }
        var $ul = $el.find('ul');

        // put content into a container that can be shifted around
        var $shift = $('<span class="shift shift-right">shift</span>')
                .prependTo($el).hide();
    };

    var pattern = {
        markup_trigger: 'nav.breadcrumbs',
        init: init
    };
    return pattern;
});
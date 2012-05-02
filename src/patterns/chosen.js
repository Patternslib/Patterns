define([
    'require',
    '../../lib/chosen.jquery',
    '../logging'
], function(require) {
    var log = require('../logging').getLogger('chosen');

    var init = function($el, opts) {
        $el.chosen();
        return $el;
    };

    var pattern = {
        markup_trigger: 'select.chosen',
        register_jquery_plugin: false,
        init: init
    };
    return pattern;
});
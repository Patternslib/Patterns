define([
    'require',
    '../../lib/jquery.placeholder',
    '../logging'
], function(require) {
    var log = require('../logging').getLogger('placeholder');

    var init = function($el, opts) {
        $el.placeholder();
    };

    var pattern = {
        markup_trigger: '[placeholder]',
        register_jquery_plugin: false,
        init: init
    };
    return pattern;
});
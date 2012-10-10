define([
    '../logging',
    '../../lib/chosen.jquery'
], function(logging) {
    var log = logging.getLogger('chosen');

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
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

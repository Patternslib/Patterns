define([
    '../logging',
    '../3rdparty/jquery.placeholder'
], function(logging) {
    var log = logging.getLogger('placeholder');

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
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

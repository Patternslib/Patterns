define([
    'require',
    '../logging'
], function(require) {
    var log = require('../logging').getLogger('old-injection');

    var init = function($el, opts) {
        log.info($el);
    };

    return {
        markup_trigger: '.injection,[data-injection]',
        init: init
    };
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

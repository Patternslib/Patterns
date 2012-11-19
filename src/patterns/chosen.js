define([
    '../core/logger',
    '../registry',
    'jquery_chosen'
], function(logger, registry) {
    var log = logger.getLogger('pat.chosen');

    var _ = {
        name: "chosen",
        trigger: "select.pat-chosen",
        init: function($el) {
            $el.chosen();
            return $el;
        },
        destroy: function($el) {
            // XXX
        }
    };

    registry.register(_);
    return _;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

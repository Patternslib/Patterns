define([
    '../logging',
    '../registry',
    'jquery_chosen'
], function(logging, registry) {
    var log = logging.getLogger('chosen');

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

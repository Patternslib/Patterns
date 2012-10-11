define([
    '../logging',
    '../registry',
    '../../lib/chosen.jquery'
], function(logging, registry) {
    var log = logging.getLogger('chosen');

    var _ = {
        name: "chosen",
        trigger: "select.pat-chosen",
        init: function($el, opts) {
            $el.chosen();
            return $el;
        },
        destroy: function($el) {
            // XXX
        }
    };

    return registry.register(_);
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

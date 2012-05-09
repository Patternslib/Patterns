define(function(require) {
    var log = require('../logging').getLogger('ajaxlib');

    var submit = function($el, opts) {
        if ($el.is('form')) {
            log.error('forms not supported yet');
            return;
        }

        // XXX: make these only defaults
        opts.context = $el;
        opts.error = function(a,b,c,d) {
            log.error(arguments);
        };

        $.ajax(opts);
    };

    return submit;
});
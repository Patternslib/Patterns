define([
        "../core/logging"
], function(logging) {
    var log = logging.getLogger('ajaxlib');

    var submit = function($el, opts) {
        // XXX: make these only defaults
        opts.context = $el;
        opts.error = function(a,b,c,d) {
            log.error(arguments);
        };

        if ($el.is('form')) {
            log.debug('form submit', $el);
            opts.url = $el.attr('action');
            if (opts.beforeSerialize) {
                opts.beforeSerialize();
            }
            opts.data = $el.serialize() + '&submit=submit';
            opts.type = $el.attr('method') || 'POST';
            $.ajax(opts);
        } else {
            log.debug('submit', $el);
            $.ajax(opts);
        }
    };

    return submit;
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

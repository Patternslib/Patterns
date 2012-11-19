define([
    "jquery",
    "../core/logger"
], function($, logger) {
    var log = logger.getLogger('ajaxlib');

    // XXX: this should become a pattern to make use of jquery.form's
    // captureClick among others
    var ajax = function($el, opts) {
        opts = opts || {};

        var args = {
            context: $el,
            url: opts.url || undefined,
            error: function(jqxhr, status, error) {
                // error can als stem from a javascript exception, not
                // only errors described in the jqxhr
                log.error({error: error, jqxhr: jqxhr});
                $el.trigger({
                    type: "pat-ajax-error",
                    error: error,
                    jqxhr: jqxhr
                });
            },
            success: function(data, status, jqxhr) {
                log.debug("success: jqxhr:", jqxhr);
                $el.trigger({
                    type: "pat-ajax-success",
                    jqxhr: jqxhr
                });
            }
        };

        if ($el.is('form')) {
            log.debug('form submit', $el);
            // XXX: switch to default GET (jquery and jquery.form)
            args.type = $el.attr('method') || 'POST';
            // XXX: to be handled as default by ajaxSubmit/ajaxForm
            args.url = $el.attr('action');
            // XXX: to be handled as default by ajaxSubmit/ajaxForm
            if (opts.beforeSerialize) {
                opts.beforeSerialize();
            }
            // XXX: this needs to become extra-data passed to the
            // ajax/inject pattern
            args.data = $el.serialize() + '&submit=submit';
            $.ajax(args);
        } else {
            log.debug('submit', $el);
            $.ajax(args);
        }
    };

    return ajax;
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

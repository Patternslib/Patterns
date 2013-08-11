/**
 * Patterns selfhealing - Remove elements from the DOM after some time.
 *
 * Copyright 2013 Marko Durkovic
 */
define([
    "jquery",
    "../registry",
    "../core/logger",
    "../core/parser"
], function($, patterns, logger, Parser) {
    var log = logger.getLogger("checkedflag"),
        parser = new Parser("selfhealing");

    parser.add_argument("delay", "3");

    var _ = {
        name: "selfhealing",
        trigger: ".pat-selfhealing",

        init: function($el) {
            return $el.each(function() {
                var cfg = parser.parse($el);

                setTimeout(function() {
                    _.onSelfHeal($el);
                }, cfg.delay*1000);

                return $el;
            });
        },

        onSelfHeal: function($el) {
            log.info('onSelfHeal triggered');
            var $parent = $el.parent();
            $el.remove();
            $parent.trigger('pat-update', {pattern: 'selfhealing'});
        }
    };

    patterns.register(_);
    return _;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

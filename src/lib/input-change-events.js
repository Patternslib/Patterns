// helper functions to make all input elements
define([
    "jquery",
    "pat-logger"
], function($, logging) {
    var namespace = "input-change-events",
        log = logging.getLogger(namespace);

    var _ = {
        setup: function($form, pat) {

            if (!$form.is("form,.pat-subform")) {
                log.error("Input change event handler can only be set on forms.");
                return;
            }

            if (!pat) {
                log.error("The name of the calling pattern has to be set.");
                return;
            }

            // list of patterns that installed input-change-event handlers
            var patterns = $form.data(namespace) || [];
            log.debug("setup handlers for " + pat);

            if (!patterns.length) {
                log.debug("installing handlers");
                _.setupInputHandlers($form);

                $form.on("patterns-injected." + namespace, function(event) {
                    _.setupInputHandlers($(event.target));
                });
            }

            if (patterns.indexOf(pat) === -1) {
                patterns.push(pat);
                $form.data(namespace, patterns);
            }
        },

        setupInputHandlers: function($parent) {
            $parent.findInclusive(":input").each(function() {
                var $el = $(this),
                    isText = $el.is("input:text, input[type=search], textarea");

                if (isText) {
                    if ("oninput" in window) {
                        $el.on("input." + namespace, function() {
                            log.debug("translating input");
                            $el.trigger("input-change");
                        });
                    } else {
                        // this is the legacy code path for IE8
                        // Work around buggy placeholder polyfill.
                        if ($el.attr("placeholder")) {
                            $el.on("keyup." + namespace, function() {
                                log.debug("translating keyup");
                                $el.trigger("input-change");
                            });
                        } else {
                            $el.on("propertychange." + namespace, function(ev) {
                                if (ev.originalEvent.propertyName === "value") {
                                    log.debug("translating propertychange");
                                    $el.trigger("input-change");
                                }
                            });
                        }
                    }
                } else {
                    $el.on("change." + namespace, function() {
                        log.debug("translating change");
                        $el.trigger("input-change");
                    });
                }

                $el.on("blur", function() {
                    $el.trigger("input-defocus");
                });
            });
        },

        remove: function($form, pat) {
            var patterns = $form.data(namespace) || [];
            if (patterns.indexOf(pat) === -1) {
                log.warn("input-change-events were never installed for " + pat);
            } else {
                patterns = patterns.filter(function(e){return e!==pat;});
                if (patterns.length) {
                    $form.data(namespace, patterns);
                } else {
                    log.debug("remove handlers");
                    $form.removeData(namespace);
                    $form.find(":input").off("." + namespace);
                    $form.off("." + namespace);
                }
            }
        }
    };

    return _;

});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

/**
 * @license
 * Patterns @VERSION@ selfhealing - self healing messages (like growl)
 *
 * Copyright 2008-2012 Simplon B.V.
 * Copyright 2011 Humberto Sermeño
 * Copyright 2011 SYSLAB.COM GmbH
 */
define([
    'require',
    '../core/init',
    '../core/store',
    '../utils'
], function(require) {
    var mapal = require('../core/init');
    var selfHealing = {
        options: {
            confirm: null,
            "show": null,
            "remove": null,
            "disable": null,
            removeOnClick: true,
            displayTime: 8
        },

        execute: function( elem, url, sources, params, event ) {
            var container = $("#selfhealing-messages"), paramObjs = {}, p = {};

            var options = $.extend({}, selfHealing.options);

            // split up the params
            $.extend(options, params);

            if (typeof options["disable"] !== 'string' ) {
                options['disable'] = elem;
            }

            if (container.length == 0) {
                container = $("<div />").attr("id", "selfhealing-messages").appendTo(document.body);
            }

            var count = ++selfHealing.count;

            //  $("<div />").attr("id", "selfhealing-message-" + count).attr("opacity", 0).appendTo(container);

            if ( typeof options['confirm'] == 'string' ) {
                if (!confirm(options['confirm'])) return;
            }

            if (options['disable'] !== null) {
                $(options['disable']).attr('disabled', 'disabled');
            }

            // create the message element
            mapal.injection.load(elem, url, "selfhealing-messages>selfhealing-message-" + count, sources, function($target) {
                var doMouseLeave = function() {
                    var $this = $(this);
                    $this.data("persistent", false);
                    selfHealing.remove($this);
                };

                $target.attr("id", "selfhealing-message-" + count).bind(
                    {
                        "mouseenter.mapal-selfHealing": function(event) {
                            $(this).data("persistent", true);
                        },
                        "mouseleave.mapal-selfHealing.": doMouseLeave,
                        "click": function(event) {
                            $(this).unbind('.mapal-selfHealing');
                            doMouseLeave.apply(this, []);
                        }
                    }
                );

                $target.appendTo(container);

                if (options['remove'] !== null ) {
                    // we have an ID to delete
                    if (typeof options['remove'] == 'string') {
                        $('#' + options['remove']).slideUp('slow');
                    } else {
                        $(options['remove']).slideUp('slow');
                    }
                }

                if (options['show'] !== null ) {
                    // we have an ID to delete
                    if (typeof options['show'] == 'string') {
                        $('#' + options['show']).slideDown('slow');
                    } else {
                        $(options['show']).slideDown('slow');
                    }
                }

                $target.animate({"opacity": 1}, "fast", function() {
                    $target.data("timer", setTimeout(function() {
                        selfHealing.remove($target);
                    }, selfHealing.options.displayTime*1000));
                });

                mapal.patterns.callListener($(elem), 'selfHealing', 'onFinished');
            });
        },

        remove: function($element) {
            if ( $element.data("persistent") || $element.data("inFx") ) return;
            $element.animate({"opacity": 0}, {
                step: function() {
                    if ( $element.data("persistent") ) {
                        // remove the timer
                        clearTimeout($element.data("timer"));

                        // cancel hiding
                        $element.stop(true);
                        $element.css({"opacity": 1});

                        return false;
                    }
                },

                complete: function() {
                    var $this = $(this);
                    $this.slideUp('slow', function() {
                        $this.data("inFx", false);
                        $this.remove();
                    }).data("inFx", true);
                }
            });
        },

        count: 0
    };
    return selfHealing;
});

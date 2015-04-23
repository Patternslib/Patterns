/**
 * Patterns depends - show/hide/disable content based on form status
 *
 * Copyright 2012-2013 Florian Friesdorf
 * Copyright 2012-2013 Simplon B.V. - Wichert Akkerman
 */
define([
    "jquery",
    "pat-registry",
    "pat-utils",
    "pat-logger",
    "pat-dependshandler",
    "pat-parser"
], function($, patterns, utils, logging, DependsHandler, Parser) {
    var log = logging.getLogger("depends"),
        parser = new Parser("depends");

    parser.add_argument("condition");
    parser.add_argument("action", "show", ["show", "enable", "both"]);
    parser.add_argument("transition", "none", ["none", "css", "fade", "slide"]);
    parser.add_argument("effect-duration", "fast");
    parser.add_argument("effect-easing", "swing");

    var depends = {
        name: "depends",
        trigger: ".pat-depends",
        jquery_plugin: true,

        transitions: {
            none: {hide: "hide", show: "show"},
            fade: {hide: "fadeOut", show: "fadeIn"},
            slide: {hide: "slideUp", show: "slideDown"}
        },

        init: function($el, opts) {
            return $el.each(function() {
                var slave = this,
                    $slave = $(this),
                    options = parser.parse($slave, opts),
                    handler, state;

                try {
                    handler=new DependsHandler($slave, options.condition);
                } catch (e) {
                    log.error("Invalid condition: " + e.message, slave);
                    return;
                }

                state=handler.evaluate();
                switch (options.action) {
                    case "show":
                        if (state)
                            $slave.show();
                        else
                            $slave.hide();
                        break;
                    case "enable":
                        if (state)
                            depends._enable($slave);
                        else
                            depends._disable($slave);
                        break;
                    case "both":
                        if (state) {
                            $slave.show();
                            depends._enable($slave);
                        } else {
                            $slave.hide();
                            depends._disable($slave);
                        }
                        break;
                }

                var data = {handler: handler,
                            options: options,
                            slave: slave};

                handler.getAllInputs().each(function() {
                    if (this.form) {
                        var $form = $(this.form),
                            slaves = $form.data("patDepends.slaves");
                        if (!slaves) {
                            slaves=[data];
                            $form.on("reset.pat-depends", depends.onReset);
                        } else if (slaves.indexOf(data)===-1)
                            slaves.push(data);
                        $form.data("patDepends.slaves", slaves);
                    }
                    $(this).on("change.pat-depends", null, data, depends.onChange);
                    $(this).on("keyup.pat-depends", null, data, depends.onChange);
                });
            });
        },

        onReset: function(event) {
            var slaves = $(this).data("patDepends.slaves"),
                i;

            setTimeout(function() {
                for (i=0; i<slaves.length; i++) {
                    event.data=slaves[i];
                    depends.onChange(event);
                }
            }, 50);
        },

        _enable: function($slave) {
            if ($slave.is(":input"))
                $slave[0].disabled=null;
            else if ($slave.is("a"))
                $slave.off("click.patternDepends");
            else if ($slave.hasClass("pat-autosuggest")) {
                $slave.findInclusive("input.pat-autosuggest").trigger("pat-update", {
                    pattern: "depends",
                    enabled: true
                });
            }
            $slave.removeClass("disabled");
        },

        _disable: function($slave) {
            if ($slave.is(":input"))
                $slave[0].disabled="disabled";
            else if ($slave.is("a"))
                $slave.on("click.patternDepends", depends.blockDefault);
            else if ($slave.hasClass("pat-autosuggest")) {
                $slave.findInclusive("input.pat-autosuggest").trigger("pat-update", {
                    pattern: "depends",
                    enabled: false
                });
            }
            $slave.addClass("disabled");
        },

        onChange: function(event) {
            var handler = event.data.handler,
                options = event.data.options,
                slave = event.data.slave,
                $slave = $(slave),
                state = handler.evaluate();

            switch (options.action) {
                case "show":
                    utils.hideOrShow($slave, state, options, depends.name);
                    break;
                case "enable":
                    if (state)
                        depends._enable($slave);
                    else
                        depends._disable($slave);
                    break;
                case "both":
                    utils.hideOrShow($slave, state, options, depends.name);
                    if (state)
                        depends._enable($slave);
                    else
                        depends._disable($slave);
                    break;
            }
        },

        blockDefault: function(event) {
            event.preventDefault();
        }
    };

    patterns.register(depends);
    return depends; // XXX for tests only
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

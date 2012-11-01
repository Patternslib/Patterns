define([
    "jquery",
    "../registry",
    "../logging",
    "../lib/dependshandler",
    "../core/parser"
], function($, patterns, logging, DependsHander, Parser) {
    var log = logging.getLogger("depends"),
        parser = new Parser("depends");

    parser.add_argument("condition");
    parser.add_argument("action", "show", ["show", "enable"]);
    parser.add_argument("transition", "none", ["none", "css", "fade", "slide"]);
    parser.add_argument("effect-duration", "fast");

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
                    handler=new DependsHander($slave, options.condition);
                } catch (e) {
                    log.error("Invalid condition: " + e.message);
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
                        if (state) {
                            slave.disabled=null;
                            $slave.removeClass("disabled");
                        } else {
                            slave.disabled="disabled";
                            $slave.addClass("disabled");
                        }
                        break;
                }

                handler.getAllInputs().on("change.pat-depends", null,
                        {handler: handler, options: options, slave: slave},
                        depends.onChange);
            });
        },

        onChange: function(event) {
            var handler = event.data.handler,
                options = event.data.options,
                slave = event.data.slave,
                $slave = $(slave),
                state = handler.evaluate();

            switch (options.action) {
                case "show":
                    $slave.removeClass("visible hidden in-progress");
                    if (options.transition==="css")
                        $slave.addClass(state ? "visible" : "hidden");
                    else {
                        $slave.addClass("in-progress");
                        var t = depends.transitions[options.transition],
                            duration = (options.transition==="none" ? null : options.effectDuration);
                        $slave[state ? t.show : t.hide](duration, function() {
                            $slave.removeClass("hidden").addClass(state ? "visible" : "hidden");
                        });
                    }
                    break;
                case "enable":
                    if (state) {
                        slave.disabled=null;
                        $slave.removeClass("disabled");
                    } else {
                        slave.disabled="disabled";
                        $slave.addClass("disabled");
                    }
                    break;
            }
        }
    };

    patterns.register(depends);
    return depends; // XXX for tests only
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

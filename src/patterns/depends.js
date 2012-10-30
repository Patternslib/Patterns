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
    parser.add_argument("action", "show");

    var depends = {
        name: "depends",
        trigger: ".pat-depends",
        jquery_plugin: true,

        init: function($el, opts) {
            return $el.each(function() {
                var slave = this,
                    $slave = $(this),
                    options = parser.parse($slave, opts),
                    handler, state;

                try {
                    handler=new DependsHander($slave, options.condition);
                } catch (e) {
                    log.error("Invalid condition: " + 4);
                    return;
                }

                state=handler.evaluate();
                if (options.action==="show") {
                    if (state)
                        $slave.show();
                    else
                        $slave.hide();
                } else if (command.action==="enable") {
                    if (state) {
                        slave.disabled=null;
                        $slave.removeClass("disabled");
                    } else {
                        slave.disabled="disabled";
                        $slave.addClass("disabled");
                    }
                }

                handler.getAllInputs().on("change.pat-depends", null,
                        {handler: handler, options: options, $slave: $slave},
                        depends.onChange);

            });
        },

        onChange: function(event) {
            var handler = event.data.handler,
                options = event.data.options,
                $slave = event.data.$slave,
                state = handler.evaluate();

            switch (options.action) {
                case "show":
                    if (state)
                        $slave.slideDown();
                    else
                        $slave.slideUp();
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

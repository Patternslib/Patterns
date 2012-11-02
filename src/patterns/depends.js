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

    var depends = {
        name: "depends",
        trigger: ".pat-depends",
        jquery_plugin: "patternDepends",

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

        onChange: function(event) {
            var handler = event.data.handler,
                options = event.data.options,
                slave = event.data.slave,
                $slave = $(slave),
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

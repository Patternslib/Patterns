define([
    "jquery",
    "../registry",
    "../core/parser"
], function($, patterns, Parser) {
    var parser = new Parser("depends");

    parser.add_argument("name");
    parser.add_argument("operator", "on");
    parser.add_argument("value");
    parser.add_argument("type", "and");
    parser.add_argument("action", "show");

    var depends = {
        name: "depends",
        trigger: ".pat-depends",
        jquery_plugin: true,

        verify: function($slave, command) {
            var result=[],
                $form = $slave.closest("form"),
                $input, i, value, test;

            if (!$form.length)
                $form=$(document);

            for (i=0; i<command.on.length; i++) {
                test=command.on[i];

                $input = $form.find(":input[name="+test.name+"]");
                if (!$input.length) {
                    result.push(false);
                    continue;
                }

                if ($input.attr("type")==="radio" || $input.attr("type")==="checkbox")
                    value = $input.filter(":checked").val();
                else
                    value = $input.val();

                if (test.operator==="on" && !value) {
                    result.push(false);
                    continue;
                } else if (test.operator==="off" && value) {
                    result.push(false);
                    continue;
                } else if (test.value) {
                    if (test.operator==="equals" && test.value!==value) {
                        result.push(false);
                        continue;
                    } else if (test.operator==="notEquals" && test.value===value) {
                        result.push(false);
                        continue;
                    }
                }
                result.push(true);
            }

            if (command.type==="or") {
                for (i=0; i<result.length; i++) {
                    if (result[i])
                        return true;
                }
                return false;
            } else {
                for (i=0; i<result.length; i++)
                    if (!result[i])
                        return false;
                return true;
            }
        },

        getMasters: function($slave, command) {
            var $result = $(),
                $form = $slave.closest("form"),
                i, test;

            if (!$form.length)
                $form=$(document);

            for (i=0; i<command.on.length; i++) {
                test=command.on[i];
                if (!test)
                    continue;

                $result=$result.add($form.find(":input[name="+test.name+"]"));
            }

            return $result;
        },

        parse: function($el, opts) {
            var options = parser.parse($el, opts, true);
            var command = {"on" : options,
                           "action" : "show",
                           "type": "and"
                           };
            if (options[0].action)
                command.action=options[0].action;
            if (options[0].type)
                command.type=options[0].type;
            return command;
        },

        init: function($root, opts) {
            return $root.each(function() {
                var slave = this,
                    $slave = $(this),
                    command, state;

                command=depends.parse($slave, opts);
                state=depends.verify($slave, command);

                if (command.action==="show") {
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

                depends.getMasters($slave, command).on("change.pat-depends", function() {
                    state=depends.verify($slave, command);
                    if (command.action==="show") {
                        if (state)
                            $slave.slideDown();
                        else
                            $slave.slideUp();
                    } else if (command.action==="enable" ) {
                        if (state) {
                            slave.disabled=null;
                            $slave.removeClass("disabled");
                        } else {
                            slave.disabled="disabled";
                            $slave.addClass("disabled");
                        }
                    }
                });
            });
        }
    };

    patterns.register(depends);
    return depends; // XXX for tests only
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

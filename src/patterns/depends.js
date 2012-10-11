define([
    'jquery',
    "../registry"
], function($, patterns) {
    var depends = {
        name: "depends",
        trigger: "[class*='pat-depends-']",

        verify: function($slave, command) {
            var result=[],
                $form = $slave.closest("form"),
                $input, i, value, parts;

            if (!$form.length)
                $form=$(document);

            for (i=0; i<command.on.length; i++) {
                parts=command.on[i];

                $input = $form.find(":input[name="+parts[0]+"]");
                if (!$input.length) {
                    result.push(false);
                    continue;
                }

                if ($input.attr("type")==="radio" || $input.attr("type")==="checkbox")
                    value = $input.filter(":checked").val();
                else
                    value = $input.val();

                if ((parts.length===1 || parts[1]==="on") && !value) {
                    result.push(false);
                    continue;
                } else if (parts[1]==="off" && value) {
                    result.push(false);
                    continue;
                } else if (parts.length>2) {
                    if (parts[1]==="equals" && parts[2]!==value) {
                        result.push(false);
                        continue;
                    } else if (parts[1]==="notEquals" && parts[2]===value) {
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
                i, parts;

            if (!$form.length)
                $form=$(document);

            for (i=0; i<command.on.length; i++) {
                parts=command.on[i];
                if (!parts)
                    continue;

                $result=$result.add($form.find(":input[name="+parts[0]+"]"));
            }

            return $result;
        },

        parse: function(data) {
            var classes = data.split(" "),
                command = {"on" : [],
                           "action" : "show",
                           "type": "and"
                           },
                i, a, parts;

            for (i=0; i<classes.length; i++) {
                parts=classes[i].split("-");
                if (parts[0].indexOf("depends")===0) {
                    a=parts[0].substr(7).toLowerCase();
                    if (a==="on") {
                        if (parts.length>4) {
                            parts=parts.slice(0,3).concat(parts.slice(3).join("-"));
                        }
                        command.on.push(parts.slice(1));
                    } else {
                        command[a]=parts[1];
                    }
                }
            }
            return command;
        },

        init: function($root) {
            return $root.each(function() {
                var slave = this,
                    $slave = $(this),
                    command, state;

                command=depends.parse($slave.attr("class"));
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

                depends.getMasters($slave, command).on("change.patterns", function() {
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

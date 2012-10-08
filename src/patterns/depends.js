define([
    'jquery'
], function($) {
    var depends = {
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

        initContent: function(root) {
            $("*[class*='dependsOn-']", root).each(function() {
                var slave = this,
                    $slave = $(this),
                    $visible = $(this),
                    $panel = $slave.data("mapal.infoPanel"),
                    classes = $slave.attr("class").split(" "),
                    command = {"on" : [],
                               "action" : "show",
                               "type": "and"
                               };
                var i, a, parts, state;

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

                state=depends.verify($slave, command);
                if ($panel!==undefined)
                    $visible=$visible.add($panel);

                if (command.action==="show") {
                    if (state)
                        $visible.show();
                    else
                        $visible.hide();
                } else if (command.action==="enable") {
                    if (state) {
                        slave.disabled=null;
                        $slave.removeClass("disabled");
                    } else {
                        slave.disabled="disabled";
                        $slave.addClass("disabled");
                    }
                }

                depends.getMasters($slave, command).bind("change.mapal", function() {
                    state=depends.verify($slave, command);
                    if (command.action==="show") {
                        if (state)
                            $visible.slideDown();
                        else
                            $visible.slideUp();
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

    return depends;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

/**
 * @license
 * Patterns @VERSION@ tooltip - tooltips
 *
 * Copyright 2008-2012 Simplon B.V.
 * Copyright 2011 Humberto Sermeño
 * Copyright 2011 SYSLAB.COM GmbH
 */
(function($) {
    mapal = mapal || {passivePatterns: {}};
    // Register as active pattern to prevent errors on clicks.
    $.extend(mapal.patterns, {
    "tooltip": {
        execute: function() {}
    }});

    $.extend(mapal.passivePatterns, {
    "tooltip": {
        count: 0,

        init: function() {
        },

        initContent: function(root) {
            var tooltip = mapal.passivePatterns.tooltip;
            $("*[data-tooltip]", root).each(function() {
                var $trigger = $(this);

                tooltip.parseOptions($trigger);
                tooltip.setupShowEvents($trigger);
            });
        },

        parseOptions: function($trigger) {
            var input = $trigger.data("tooltip") || "",
                params = input.split("!"),
                options = {}, name, value, index;

            for (var i=0; i<params.length; i++) {
                index = params[i].indexOf("=");
                if (index === -1) {
                    name = params[i];
                    value = true;
                } else {
                    name = params[i].slice(0, index);
                    value = params[i].slice(index+1);
                }
                options[name] = value;
            }
            $trigger.data("mapal.tooltip", options);
        },

        setupShowEvents: function($trigger) {
            var tooltip = mapal.passivePatterns.tooltip,
                parameters = $trigger.data("mapal.tooltip");
            if (parameters.click) {
                $trigger.on("click.tooltip", $trigger, tooltip.show);
            } else {
                $trigger.on("mouseover.tooltip", $trigger, tooltip.show);
                // Make sure click on the trigger element becomes a NOP
                $trigger.on("click.tooltip", $trigger, tooltip.blockDefault);
            }
        },

        removeShowEvents: function($trigger) {
            $trigger.off(".tooltip");
        },

        setupHideEvents: function($trigger) {
            var tooltip = mapal.passivePatterns.tooltip,
                $container = tooltip.getContainer($trigger),
                parameters = $trigger.data("mapal.tooltip");
            if (parameters.sticky) {
                $container.find(".closePanel")
                    .on("click.tooltip", $trigger, tooltip.hide);
                // Make sure click on the trigger element becomes a NOP
                $trigger.on("click.tooltip", $trigger, tooltip.blockDefault);
            } else {
                $container.on("click.tooltip", $trigger, tooltip.hide);
                if (parameters.click) {
                    $trigger.on("click.tooltip", $trigger, tooltip.hide);
                } else {
                    $trigger.on("mouseleave.tooltip", $trigger, tooltip.hide);
                    $trigger.on("click.tooltip", $trigger, tooltip.blockDefault);
                }
            }
        },

        removeHideEvents: function($trigger) {
            var tooltip = mapal.passivePatterns.tooltip,
                $container = tooltip.getContainer($trigger);
            $container.off(".tooltip");
            $container.find(".closePanel").off(".tooltip");
            $trigger.off(".tooltip");
        },

        blockDefault: function(event) {
            event.preventDefault();
        },

        show: function(event) {
            var tooltip = mapal.passivePatterns.tooltip,
                $trigger = event.data,
                $container = tooltip.getContainer($trigger),
                options = $trigger.data("mapal.tooltip");

            tooltip.removeShowEvents($trigger);
            tooltip.setupHideEvents($trigger);

            function ajax_show() {
                $container.find(">div >*").css("opacity", 1);
                tooltip.positionContainer($trigger, $container);
            }

            if (options.ajax) {
                var source = $trigger.attr("href").split("#"),
                    target_id = $container.find("progress").attr("id");
                mapal.injection.load($trigger, source[0], target_id+":replace", source[1] || [],
                        ajax_show, true);
                delete options.ajax;
                $trigger.data("mapal.tooltip", options);
            }

            tooltip.positionContainer($trigger, $container);
            $container.css("visibility", "visible");

            event.preventDefault();
        },

        hide: function(event) {
            var tooltip = mapal.passivePatterns.tooltip,
                $trigger = event.data,
                $container = tooltip.getContainer($trigger);
            tooltip.removeHideEvents($trigger);
            $container.css("visibility", "hidden");
            tooltip.setupShowEvents($trigger);
            event.preventDefault();
        },

        getContainer: function($trigger) {
            var tooltip = mapal.passivePatterns.tooltip,
                $container = $trigger.data("mapal.tooltip.container");
            if ($container===undefined) {
                $container=tooltip.createContainer($trigger);
                $trigger.data("mapal.tooltip.container", $container);
            }
            return $container;
        },

        createContainer: function($trigger) {
            var tooltip = mapal.passivePatterns.tooltip,
                title = $trigger.attr("title"),
                options = $trigger.data("mapal.tooltip"),
                $content;
            $trigger.removeAttr("title");

            $container = $("<div/>", {"class": "tooltip-container"});
            $container.css("visibility", "hidden");
            if (options.ajax) {
                $content = $("<progress/>", {"id": "tooltip-" + ++tooltip.count});
            } else {
                $content = $("<p/>").text(title || "");
            }
            $container.append(
                $("<div/>").css("display", "block").append($content))
                .append($("<span></span>", {"class": "pointer"}));
            if (options.sticky) {
                $("<button/>", {"class": "closePanel"})
                    .text("Close")
                    .insertBefore($container.find("*"));
            }
            $("body").append($container);
            return $container;
        },

        boundingBox: function($el) {
            var box = $el.offset();
            box.height = $el.height();
            box.width = $el.width();
            box.bottom = box.top + box.height;
            box.right = box.left + box.width;
            return box;
        },

        positionContainer: function($trigger, $container) {
            var tooltip = mapal.passivePatterns.tooltip,
                trigger_box = tooltip.boundingBox($trigger),
                tooltip_box = tooltip.boundingBox($container),
                $window = $(window),
                window_width = $window.width(),
                window_height = $window.height(),
                trigger_center,
                space_top, space_right, space_bottom, space_left,
                container_offset = {},
                tip_offset = {}
                cls = "";

            trigger_center = {top: trigger_box.top + (trigger_box.height/2),
                              left: trigger_box.left + (trigger_box.width/2)};
            space_top = trigger_box.top - $window.scrollTop();
            space_bottom = window_height - space_top - trigger_box.height;
            space_left = trigger_box.left - $window.scrollLeft();
            space_right = window_width - space_left - trigger_box.width;

            if (space_top > Math.max(space_right, space_bottom, space_left)) {
                container_offset.top = trigger_box.top - tooltip_box.height + 10;
                tip_offset.top = tooltip_box.height - 23;
                cls = "t";
            } else if (space_right > Math.max(space_bottom, space_left, space_top)) {
                container_offset.left = trigger_box.right + 20;
                tip_offset.left = 0;
                cls = "r";
            } else if (space_bottom > Math.max(space_left, space_top, space_right)) {
                container_offset.top = trigger_box.bottom + 20;
                tip_offset.top = 0;
                cls = "b";
            } else {
                container_offset.left = trigger_box.left - tooltip_box.width - 20;
                tip_offset.left = tooltip_box.width - 23;
                cls = "l";
            }

            if (container_offset.left===undefined) {
                if (Math.abs(space_left-space_right) < 20) {
                    cls += "m";
                    container_offset.left = trigger_center.left - (tooltip_box.width/2);
                    tip_offset.left = tooltip_box.width/2;
                } else if (space_left > space_right) {
                    cls += "r";
                    container_offset.left = trigger_center.left + 20 - tooltip_box.width;
                    tip_offset.left = tooltip_box.width - 20;
                } else {
                    cls += "l";
                    container_offset.left = trigger_center.left - 20;
                    tip_offset.left = 0;
                }
            } else {
                if (Math.abs(space_top-space_bottom) < 20) {
                    cls += "m";
                    container_offset.top = trigger_center.top - (tooltip_box.height/2);
                    tip_offset.top = tooltip_box.height/2;
                } else if (space_top > space_bottom) {
                    cls += "b";
                    container_offset.top = trigger_center.top + 20 - tooltip_box.height;
                    tip_offset.top = tooltip_box.height - 20;
                } else {
                    cls += "t";
                    container_offset.top = trigger_center.top - 30;
                    tip_offset.top = 0;
                }
            }

            $container.attr("class", "tooltip-container " + cls);
            $container.css({
                top: container_offset.top+"px",
                left: container_offset.left+"px"});
            $container.find(".pointer").css({
                top: tip_offset.top+"px",
                left: tip_offset.left+"px"});
        }
    }});
})(jQuery);

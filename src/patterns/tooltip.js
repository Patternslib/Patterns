/**
 * @license
 * Patterns @VERSION@ tooltip - tooltips
 *
 * Copyright 2008-2012 Simplon B.V.
 * Copyright 2011 Humberto Sermeño
 * Copyright 2011 SYSLAB.COM GmbH
 */
define([
    'require',
    '../core/init',
    '../utils'
], function(require) {
    var utils = require('../utils'),
        mapal = require('../core/init');

    var tooltip = {
        count: 0,

        init: function() {
        },

        initContent: function(root) {
            var $root = $(root);
            var init = function($trigger) {
                var options = utils.parseOptions($trigger.data("tooltip"));
                options.title = $trigger.attr("title");
                $trigger.removeAttr("title");
                $trigger.data("mapal.tooltip", options);
                tooltip.setupShowEvents($trigger);
            };
            if ($root.is('[data-tooltip]')) init($root);
            $("*[data-tooltip]", $root).each(function() {
                init($(this));
            });
        },

        setupShowEvents: function($trigger) {
            var parameters = $trigger.data("mapal.tooltip");
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
            var $container = tooltip.getContainer($trigger),
                parameters = $trigger.data("mapal.tooltip");
            if (parameters.sticky) {
                $container.find(".closePanel")
                    .on("click.tooltip", $trigger, tooltip.hide);
                // Make sure click on the trigger element becomes a NOP
                $trigger.on("click.tooltip", $trigger, tooltip.blockDefault);
            } else {
                if (parameters.click) {
                    $container.on("click.tooltip", $trigger, function(ev) {
                        ev.stopPropagation();
                    });
                    $(document).on("click.tooltip", $trigger, tooltip.hide);
                    $trigger.on("click.tooltip", tooltip.blockDefault);
                    // close if something inside the tooltip triggered an injection
                    $container.on('patterns-inject-triggered.tooltip',
                                  $trigger, tooltip.hide);
                    $container.on('patterns-inject_interim-triggered.tooltip',
                                  $trigger, tooltip.hide);
                    $container.on('submit.tooltip', $trigger, tooltip.hide);
                } else {
                    $container.on("click.tooltip", $trigger, tooltip.hide);
                    $trigger.on("mouseleave.tooltip", $trigger, tooltip.hide);
                    $trigger.on("click.tooltip", tooltip.blockDefault);
                }
            }
        },

        removeHideEvents: function($trigger) {
            var $container = tooltip.getContainer($trigger);
            $(document).off(".tooltip");
            $container.off(".tooltip");
            $container.find(".closePanel").off(".tooltip");
            $trigger.off(".tooltip");
        },

        blockDefault: function(event) {
            event.preventDefault();
        },

        show: function(event) {
            var $trigger = event.data,
                $container = tooltip.getContainer($trigger),
                options = $trigger.data("mapal.tooltip");

            tooltip.removeShowEvents($trigger);
	    // Wrap in a timeout to make sure this click is not used to
	    // trigger a hide as well.
	    setTimeout(function() { tooltip.setupHideEvents($trigger) }, 50);

            function ajax_show() {
                $container.find(">div >*").css("opacity", 1);
                tooltip.positionContainer($trigger, $container);
            }

            if (options.ajax) {
                var source = $trigger.attr("href").split("#"),
                    target_id = $container.find("progress").attr("id");
                mapal.injection.load($trigger, source[0], target_id+":replace", source[1] || [],
                        ajax_show, true);
                // always load fresh tooltips
                // delete options.ajax;
                $trigger.data("mapal.tooltip", options);
            }

            tooltip.positionContainer($trigger, $container);
            $container.css("visibility", "visible");

	    // reposition tooltip everytime we scroll
	    $trigger.parents(':scrollable').scroll(function () {
                 tooltip.positionContainer($trigger, $container);
	    });

            event.preventDefault();
        },

        hide: function(event) {
            var $trigger = event.data,
                $container = tooltip.getContainer($trigger);
            tooltip.removeHideEvents($trigger);
            $container.css("visibility", "hidden");
            tooltip.setupShowEvents($trigger);
        },

        getContainer: function($trigger) {
            var $container = $trigger.data("mapal.tooltip.container");
            if ($container===undefined) {
                $container=tooltip.createContainer($trigger);
                $trigger.data("mapal.tooltip.container", $container);
            }
            return $container;
        },

        createContainer: function($trigger) {
            var options = $trigger.data("mapal.tooltip"),
                $content, $container;

            $container = $("<div/>", {"class": "tooltip-container"});
            $container.css("visibility", "hidden");
            if (options.ajax) {
                $content = $("<progress/>", {"id": "tooltip-" + ++tooltip.count});
            } else {
                $content = $("<p/>").text(options.title);
            }
            $container.append(
                $("<div/>").css("display", "block").append($content))
                .append($("<span></span>", {"class": "pointer"}));
            if (options.sticky && !options.noclose) {
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

        positionStatus: function($trigger, $container) {
            var trigger_box = tooltip.boundingBox($trigger),
                tooltip_box = tooltip.boundingBox($container),
                $window = $(window),
                window_width = $window.width(),
                window_height = $window.height(),
                trigger_center,
                space = {},
                container_offset = {},
                tip_offset = {},
                cls = "";

            trigger_center = {top: trigger_box.top + (trigger_box.height/2),
                              left: trigger_box.left + (trigger_box.width/2)};
            space.top = trigger_box.top - $window.scrollTop();
            space.bottom = window_height - space.top - trigger_box.height;
            space.left = trigger_box.left - $window.scrollLeft();
            space.right = window_width - space.left - trigger_box.width;

            return {"space": space,
                    "trigger_center": trigger_center,
                    "trigger_box": trigger_box,
                    "tooltip_box": tooltip_box};
        },

        // Help function to determine the best position for a tooltip.  Takes
        // the positioning status (as generated by positionStatus) as input
        // and returns a two-character position indiciator.
        findBestPosition: function(status) {
            var space = status.space,
                 cls = "";

            if (space.top > Math.max(space.right, space.bottom, space.left)) {
                cls = "b";
            } else if (space.right > Math.max(space.bottom, space.left, space.top)) {
                cls = "l";
            } else if (space.bottom > Math.max(space.left, space.top, space.right)) {
                cls = "t";
            } else {
                cls = "r";
            }

            switch (cls[0]) {
            case "t":
            case "b":
                if (Math.abs(space.left-space.right) < 20) {
                    cls += "m";
                } else if (space.left > space.right) {
                    cls += "r";
                } else {
                    cls += "l";
                }
                break;
            case "l":
            case "r":
                if (Math.abs(space.top-space.bottom) < 20) {
                    cls += "m";
                } else if (space.top > space.bottom) {
                    cls += "b";
                } else {
                    cls += "t";
                }
            }
            return cls;
        },

        isVisible: function(status, position) {
            var space = status.space,
                tooltip_box = status.tooltip_box;

            switch (position[0]) {
            case "t":
                if (tooltip_box.height > space.bottom) {
                    return false;
                }
                break;
            case "r":
                if (tooltip_box.width > space.left) {
                    return false;
                }
                break;
            case "b":
                if (tooltip_box.height > space.top) {
                    return false;
                }
                break;
            case "l":
                if (tooltip_box.width > space.right) {
                    return false;
                }
                break;
            default:
                return false;
            }

            switch (position[0]) {
            case "t":
            case "b":
                switch (position[1]) {
                    case "l":
                        if ((tooltip_box.width-20)>space.right) {
                            return false;
                        }
                        break;
                    case "m":
                        if ((tooltip_box.width/2)>space.left || (tooltip_box.width/2)>space.right) {
                            return false;
                        }
                        break;
                    case "r":
                        if ((tooltip_box.width-20)>space.left) {
                            return false;
                        }
                        break;
                    default:
                        return false;
                }
                break;
            case "l":
            case "r":
                switch (position[1]) {
                    case "t":
                        if ((tooltip_box.height-20)>space.bottom) {
                            return false;
                        }
                        break;
                    case "m":
                        if ((tooltip_box.height/2)>space.top || (tooltip_box.height/2)>space.bottom) {
                            return false;
                        }
                        break;
                    case "b":
                        if ((tooltip_box.height-20)>space.top) {
                            return false;
                        }
                    default:
                        return false;
                }
                break;
            }
            return true;
        },

        VALIDPOSITION: /^([lr][tmb]|[tb][lmr])$/,

        positionContainer: function($trigger, $container) {
            var status = tooltip.positionStatus($trigger, $container),
                options = $trigger.data("mapal.tooltip"),
                container_offset = {},
                tip_offset = {},
                position;

            if (options.position) {
                var positions = options.position.split("-"), i;
                for (i=0; i<positions.length; i++) {
                    if (!tooltip.VALIDPOSITION.test(positions[i])) {
                        continue;
                    }

                    if (options.forcePosition || tooltip.isVisible(status, positions[i])) {
                        position = positions[i];
                        break;
                    }
                }
            }

            if (!position) {
                position = tooltip.findBestPosition(status);
            }

            var trigger_box = status.trigger_box,
                tooltip_box = status.tooltip_box,
                trigger_center = status.trigger_center;

            switch (position[0]) {
            case "t":
                container_offset.top = trigger_box.bottom + 20;
                tip_offset.top = -23;
                break;
            case "l":
                container_offset.left = trigger_box.right + 20;
                tip_offset.left = -23;
                break;
            case "b":
                container_offset.top = trigger_box.top - tooltip_box.height + 10;
                tip_offset.top = tooltip_box.height;
                break;
            case "r":
                container_offset.left = trigger_box.left - tooltip_box.width - 20;
                tip_offset.left = tooltip_box.width;
                break;
            }

            switch (position[0]) {
            case "t":
            case "b":
                switch (position[1]) {
                case "l":
                    container_offset.left = trigger_center.left - 20;
                    tip_offset.left = 0;
                    break;
                case "m":
                    container_offset.left = trigger_center.left - (tooltip_box.width/2);
                    tip_offset.left = tooltip_box.width/2 - 10;
                    break;
                case "r":
                    container_offset.left = trigger_center.left + 29 - tooltip_box.width;
                    tip_offset.left = tooltip_box.width - 20;
                    break;
                }
                break;
            case "l":
            case "r":
                switch (position[1]) {
                    case "t":
                        container_offset.top = trigger_center.top - 30;
                        tip_offset.top = 0;
                        break;
                    case "m":
                        container_offset.top = trigger_center.top - (tooltip_box.height/2);
                        tip_offset.top = tooltip_box.height/2 - 10;
                        break;
                    case "b":
                        container_offset.top = trigger_center.top + 20 - tooltip_box.height;
                        tip_offset.top = tooltip_box.height - 20;
                        break;
                }
                break;
            }

            $container.attr("class", "tooltip-container " + position);
            $container.css({
                top: container_offset.top+"px",
                left: container_offset.left+"px"});
            $container.find(".pointer").css({
                top: tip_offset.top+"px",
                left: tip_offset.left+"px"});
        }
    };

    return tooltip;
});

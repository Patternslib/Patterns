/**
 * @license
 * Patterns @VERSION@ tooltip - tooltips
 *
 * Copyright 2008-2012 Simplon B.V.
 * Copyright 2011 Humberto Sermeño
 * Copyright 2011 SYSLAB.COM GmbH
 */
define([
    "jquery",
    "../registry",
    "../core/parser",
    "./inject",
    "../core/remove"
], function($, patterns, Parser, inject) {
    var parser = new Parser("tooltip");

    parser.add_argument("position");
    parser.add_argument("click", false);
    parser.add_argument("force", false);
    parser.add_argument("sticky", false);
    parser.add_argument("close", true);
    parser.add_argument("ajax", false);
    parser.add_argument("title", function($el) {
        return $el.attr("title");
    });

    var tooltip = {
        name: "tooltip",
        trigger: ".pat-tooltip",

        count: 0,

        init: function($el, opts) {
            return $el.each(function() {
                var $trigger = $(this),
                    options = parser.parse($trigger, opts);
                $trigger
                    .removeAttr("title")
                    .data("patterns.tooltip", options)
                    .on("destroy", $trigger, tooltip.onDestroy);
                tooltip.setupShowEvents($trigger);
                $trigger.addClass("inactive");
            });
        },

        setupShowEvents: function($trigger) {
            var options = $trigger.data("patterns.tooltip");
            if (options.click) {
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
                options = $trigger.data("patterns.tooltip");
            if (options.sticky) {
                $container.find(".close-panel")
                    .on("click.tooltip", $trigger, tooltip.hide);
                // Make sure click on the trigger element becomes a NOP
                $trigger.on("click.tooltip", $trigger, tooltip.blockDefault);
            } else {
                if (options.click) {
                    $container.on("click.tooltip", $trigger, function(ev) {
                        ev.stopPropagation();
                    });
                    $(document).on("click.tooltip", $trigger, tooltip.hide);
                    $trigger.on("click.tooltip", tooltip.blockDefault);
                    // close if something inside the tooltip triggered an injection
                    $container.on("patterns-inject-triggered.tooltip",
                                  $trigger, tooltip.hide);
                    $container.on("submit.tooltip", $trigger, tooltip.hide);
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
            $container.find(".close-panel").off(".tooltip");
            $trigger.off(".tooltip");
        },

        blockDefault: function(event) {
            event.preventDefault();
        },

        show: function(event) {
            event.preventDefault();
            var $trigger = event.data,
                $container = tooltip.getContainer($trigger, true),
                namespace = $container.attr("id"),
                options = $trigger.data("patterns.tooltip");

            tooltip.removeShowEvents($trigger);
            // Wrap in a timeout to make sure this click is not used to
            // trigger a hide as well.
            setTimeout(function() { tooltip.setupHideEvents($trigger); }, 50);

            if (options.ajax) {
                var source = $trigger.attr("href").split("#"),
                    target_id = $container.find("progress").attr("id");
                inject.execute([{
                    url: source[0],
                    source: "#" + source[1],
                    target: "#" + target_id + "::element",
                    dataType: "html"
                }], $trigger);
            }

            tooltip.positionContainer($trigger, $container);
            $container.css("visibility", "visible");

            // reposition tooltip everytime we scroll or resize
            $(window).on("scroll." + namespace + " resize." + namespace, function () {
                 tooltip.positionContainer($trigger, $container);
            });

            $trigger.removeClass("inactive").addClass("active");
        },

        hide: function(event) {
            var $trigger = event.data,
                $container = tooltip.getContainer($trigger),
                namespace = $container.attr("id");
            tooltip.removeHideEvents($trigger);
            $container.css("visibility", "hidden");
            $(window).off("." + namespace);
            tooltip.setupShowEvents($trigger);
            $trigger.removeClass("active").addClass("inactive");
        },

        onDestroy: function(event) {
            var $trigger = event.data,
                $container = $trigger.data("patterns.tooltip.container");
            if ($container!==undefined)
                $container.remove();
        },

        getContainer: function($trigger, create) {
            var $container = $trigger.data("patterns.tooltip.container");

            if (create) {
                if ($container !== undefined) {
                    $container.remove();
                }
                $container = tooltip.createContainer($trigger);
                $trigger.data("patterns.tooltip.container", $container);
            }

            return $container;
        },

        createContainer: function($trigger) {
            var options = $trigger.data("patterns.tooltip"),
                count = ++tooltip.count,
                $content, $container;

            $trigger.data("patterns.tooltip.number", count);
            $container = $("<div/>", {"class": "tooltip-container",
                                     "id": "tooltip" + count});
            $container.css("visibility", "hidden");
            if (options.ajax) {
                $content = $("<progress/>", {"id": "tooltip-load-" + count});
            } else {
                $content = $("<p/>").text(options.title);
            }
            $container.append(
                $("<div/>").css("display", "block").append($content))
                .append($("<span></span>", {"class": "pointer"}));
            if (options.sticky && options.close) {
                $("<button/>", {"class": "close-panel"})
                    .text("Close")
                    .insertBefore($container.find("*:first"));
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
                scroll = {},
                space = {};

            scroll.top = $window.scrollTop();
            scroll.left = $window.scrollLeft();
            trigger_center = {top: trigger_box.top + (trigger_box.height/2),
                              left: trigger_box.left + (trigger_box.width/2)};
            space.top = trigger_box.top - scroll.top;
            space.bottom = window_height - space.top - trigger_box.height;
            space.left = trigger_box.left - scroll.left;
            space.right = window_width - space.left - trigger_box.width;

            return {space: space,
                    trigger_center: trigger_center,
                    trigger_box: trigger_box,
                    tooltip_box: tooltip_box,
                    scroll: scroll,
                    window: {width: window_width, height: window_height}
            };
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
                        break;
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
                options = $trigger.data("patterns.tooltip"),
                container_offset = {},
                tip_offset = {},
                position;

            if (options.position) {
                var positions = options.position.split("-"), i;
                for (i=0; i<positions.length; i++) {
                    if (!tooltip.VALIDPOSITION.test(positions[i])) {
                        continue;
                    }

                    if (options.force || tooltip.isVisible(status, positions[i])) {
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
                trigger_center = status.trigger_center,
                content_css = {"max-height": "", "max-width": ""},
                bottom_row, x;

            switch (position[0]) {
            case "t":
                container_offset.top = trigger_box.bottom + 20;
                tip_offset.top = -23;
                bottom_row = status.scroll.top + status.window.height,
                content_css["max-height"] = (bottom_row - container_offset.top - 30) + "px";
                break;
            case "l":
                container_offset.left = trigger_box.right + 20;
                tip_offset.left = -23;
                x = status.window.width + status.scroll.left;
                content_css["max-width"] = (x - container_offset.left - 30) + "px";
                break;
            case "b":
                container_offset.top = trigger_box.top - tooltip_box.height + 10;
                tip_offset.top = tooltip_box.height;
                x = (status.scroll.top + 10) - container_offset.top;
                if (x>0) {
                    tip_offset.top -= x;
                    content_css["max-height"] = (tooltip_box.height - x) + "px";
                    container_offset.top += x;
                }
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

            $container.find("> div").css(content_css);
            $container.attr("class", "tooltip-container " + position);
            $container.css({
                top: container_offset.top+"px",
                left: container_offset.left+"px"
            });
            $container.find(".pointer").css({
                top: tip_offset.top+"px",
                left: tip_offset.left+"px"});
        }
    };

    patterns.register(tooltip);
    return tooltip; // XXX Replace for tests
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

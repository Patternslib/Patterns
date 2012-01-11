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
        init: function() {
        },

        initContent: function(root) {
            var tooltip = mapal.passivePatterns.tooltip;
            $('a[rel^=".tooltip"]', root).each(function() {
                var $trigger = $(this),
                    rel = $trigger.attr("rel"),
                    parameters = mapal.patterns.extractParameters(rel, []);

                $trigger.data("mapal.tooltip", parameters);
                tooltip.setupShowEvents($trigger);
            });
        },

        setupShowEvents: function($trigger) {
            var tooltip = mapal.passivePatterns.tooltip,
                parameters = $trigger.data("mapal.tooltip");
            if (parameters.click) {
                $trigger.on("click.tooltip", tooltip.show);
            } else {
                $trigger.on("mouseover.tooltip", tooltip.show);
            }
        },

        removeShowEvents: function($trigger) {
            $trigger.off("click.tooltip");
            $trigger.on("mouseover.tooltip");
        },

        setupHideEvents: function($trigger, $container) {
            var tooltip = mapal.passivePatterns.tooltip,
                parameters = $trigger.data("mapal.tooltip"),
                data = {trigger: $trigger,
                        container: $container};
            if (parameters.click) {
                $trigger.on("click.tooltip", data, tooltip.hide);
            } else {
                $trigger.on("mouseleave.tooltip", data, tooltip.hide);
            }
        },

        removeHideEvents: function($trigger) {
            $trigger.off("click.tooltip");
            $trigger.on("mouseleave.tooltip");
        },

        show: function(event) {
            var tooltip = mapal.passivePatterns.tooltip,
                $trigger = $(this),
                $target = $($trigger.attr("href")),
                $container;

            if ($target.length===0) {
                return;
            }

            $container=tooltip.getContainer($target);
            $container.show();
            tooltip.removeShowEvents($trigger);
            tooltip.setupHideEvents($trigger, $container);
        },

        hide: function(event) {
            var tooltip = mapal.passivePatterns.tooltip,
                $trigger = event.data.trigger,
                $container = event.data.container;

            $container.hide();
            tooltip.removeHideEvents($trigger);
            tooltip.setupShowEvents($trigger);
        },

        getContainer: function($target) {
            var $container = $target.data("mapal.tooltip.container");

            if ($container!==undefined) {
                return $container;
            }

            $container = $("<div/>", {class: "tooltip-container"});
            $container.css("visibility: visible");
            $target.wrap($container).show();
            $container = $target.parent()
            $container.append($("<span></span>", {class: "pointer"}));
            $target.data("mapal.tooltip.container", $container);
            return $container;
        }
    }});
})(jQuery);

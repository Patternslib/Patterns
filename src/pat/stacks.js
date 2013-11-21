/**
 * Patterns stacks
 *
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 */
define([
    "jquery",
    "../core/parser",
    "../registry"
], function($, Parser, registry) {
    var parser = new Parser("stacks");

    parser.add_argument("transition", "none", ["none", "css", "fade", "slide"]);
    parser.add_argument("effect-duration", "fast");
    parser.add_argument("selector", "> *[id]");

    var stacks = {
        name: "stacks",
        trigger: ".pat-stacks",
        _triggers: {},

        init: function($el, opts) {
            var fragment = this._currentFragment();

            $(document).on("click", "a", this._onClick);

            return $el.each(function() {
                var $container = $(this),
                    options = parser.parse($container, opts),
                    $leaves = $container.find(options.selector),
                    $visible, $hidden;
                if ($leaves.length<2)
                    return;
                $container.data("pat-stacks", options);

                if (fragment && $leaves.filter(fragment).length)
                    $visible=$leaves.filter(fragment);
                else
                    $visible=$leaves.first();
                $invisible=$leaves.not($visible);

                $visible.addClass("visible").removeClass("hidden").show();
                $invisible.removeClass("visible").addClass("hidden").hide();

                $leaves.each(function() {
                    stacks._triggers["#"+this.id]=$container;
                });
            });
        },

        _currentFragment: function() {
            var parts = document.URL.split("#");
            if (parts.length===1)
                return null;
            return "#"+parts[parts.length-1];
        },

        _onClick: function(e) {
            var base_url = document.URL.split("#")[0],
                href = e.target.href.replace(base_url, ""),
                $container=stacks._triggers[href];
            if ($container===undefined)
                return;
            e.preventDefault();
            stacks._switch($container, href);
        },

        _switch: function($container, leave_id) {
            var $leave = $container.find(leave_id);
            if (!$leave.length || $leave.hasClass("visible"))
                return;

            var options = $container.data("pat-stacks"),
                $invisible = $container.find(options.selector).not($leave);
            $leave.addClass("visible").removeClass("hidden").show();
            $invisible.removeClass("visible").addClass("hidden").hide();
        }
    };

    registry.register(stacks);
    return stacks;
});

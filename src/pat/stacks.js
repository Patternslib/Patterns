/**
 * Patterns stacks
 *
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 */
define([
    "jquery",
    "../core/parser",
    "../core/logger",
    "../registry"
], function($, Parser, logging, registry) {
    var log = logging.getLogger("stacks"),
        parser = new Parser("stacks");

    parser.add_argument("transition", "none", ["none", "css", "fade", "slide"]);
    parser.add_argument("effect-duration", "fast");
    parser.add_argument("selector", "> *[id]");

    var stacks = {
        name: "stacks",
        trigger: ".pat-stacks",
        _triggers: {},

        init: function($el, opts) {
            var fragment = this._currentFragment();

            return $el.each(function() {
                stacks._setupStack(this, opts, fragment);
            });
        },

        _setup: function() {
            $(document).on("click", "a", this._onClick);
        },

        _setupStack: function(container, options, selected) {
            var $container = $(container),
                $leaves, $visible, $invisible;
            options=parser.parse($container, options);
            $container.data("pat-stacks", options);
            $leaves=$container.find(options.selector);
            if ($leaves.length<2) {
                log.warn("Stacks pattern: must have more than one leaf.", $container[0]);
                return;
            }

            $visible=[];
            if (selected)
                $visible=$leaves.filter("#"+selected);
            if (!$visible.length) {
                $visible=$leaves.first();
                selected=$visible[0].id;
            }
            $invisible=$leaves.not($visible);
            $visible.addClass("visible").removeClass("hidden").show();
            $invisible.removeClass("visible").addClass("hidden").hide();
            stacks._updateAnchors($container, selected);
        },

         _base_URL: function() {
            return document.URL.split("#")[0];
         },

        _currentFragment: function() {
            var parts = document.URL.split("#");
            if (parts.length===1)
                return null;
            return parts[parts.length-1];
        },

        _onClick: function(e) {
            var base_url = stacks._base_URL(),
                href_parts = e.target.href.split("#"),
                $stack;
            // Check if this is an in-document link and has a fragment
            if (base_url!==href_parts[0] || !href_parts[1])
                return;
            $stack=$(stacks.trigger+":has(#"+href_parts[1]+")");
            if (!$stack.length)
                return;
            e.preventDefault();
            stacks._updateAnchors($stack, href_parts[1]);
            stacks._switch($stack, href_parts[1]);
        },

        _updateAnchors: function($container, selected) {
            var options = $container.data("pat-stacks"),
                $leaves = $container.find(options.selector),
                base_url = stacks._base_URL();
            for (var i=0; i<$leaves.length; i++) {
                var leaf = $leaves[i],
                    $anchors = $("a[href=\""+base_url+"#"+leaf.id+"\"],a[href=\"#"+leaf.id+"\"]");
                if (leaf.id===selected)
                    $anchors.addClass("current");
                else
                    $anchors.removeClass("current");
            }
        },

        _switch: function($container, leaf_id) {
            var $leaf = $container.find("#"+leaf_id);
            if (!$leaf.length || $leaf.hasClass("visible"))
                return;

            var options = $container.data("pat-stacks"),
                $invisible = $container.find(options.selector).not($leaf);
            $leaf.addClass("visible").removeClass("hidden").show();
            $invisible.removeClass("visible").addClass("hidden").hide();
        }
    };

    stacks._setup();
    registry.register(stacks);
    return stacks;
});

/**
 * equaliser - Equalise height of elements in a row
 *
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 */
define([
    import $ from "jquery";,
    import registry from "../../core/registry";
    import Parser from "../../core/parser";
    import utils from "../../core/utils";
    "imagesloaded"
], function($, patterns, Parser, utils, imagesLoaded) {
    var parser = new Parser("equaliser");
    parser.addArgument("transition", "none", ["none", "grow"]);
    parser.addArgument("effect-duration", "fast");
    parser.addArgument("effect-easing", "swing");

    var equaliser = {
        name: "equaliser",
        trigger: ".pat-equaliser, .pat-equalizer",

        init: function($el, opts) {
            return $el.each(function() {
                var $container = $(this),
                    options = parser.parse($container, opts);
                $container.data("pat-equaliser", options);
                /* Assumotion, we don't need this anymore if we use Mutation observers
                // $container.on("pat-update.pat-equaliser", null, this, utils.debounce(equaliser._onEvent, 100));
                // $container.on("patterns-injected.pat-equaliser", null, this, utils.debounce(equaliser._onEvent, 100));
                // $container.parents('.pat-stacks').on("pat-update", null, this, utils.debounce(equaliser._onEvent, 100));
                */
                $(window).on(
                    "resize.pat-equaliser",
                    null,
                    this,
                    utils.debounce(equaliser._onEvent, 100)
                );
                imagesLoaded(
                    this,
                    $.proxy(function() {
                        equaliser._update(this);
                    }, this)
                );
                const callback = utils.debounce(
                    equaliser._update.bind(this),
                    100
                );
                const observer = new MutationObserver(callback);
                const config = {
                    childList: true,
                    subtree: true,
                    characterData: true,
                    attributes: true
                };
                observer.observe(document.body, config);
            });
        },

        _update: function(container) {
            var $container = $(container),
                options = $container.data("pat-equaliser"),
                $children = $container.children(),
                max_height = 0;

            for (var i = 0; i < $children.length; i++) {
                var $child = $children.eq(i),
                    css = $child.css("height"),
                    height;
                $child.css("height", "").removeClass("equalised");
                height = $child.height();
                if (height > max_height) max_height = height;
                if (css) $child.css("height", css);
            }

            var new_css = { height: max_height + "px" };

            switch (options && options.transition) {
                case "none":
                    $children.css(new_css).addClass("equalised");
                    break;
                case "grow":
                    $children.animate(
                        new_css,
                        options.effect.duration,
                        options.effect.easing,
                        function() {
                            $(this).addClass("equalised");
                        }
                    );
                    break;
            }
            $container.trigger("pat-update", { pattern: "equaliser" });
        },

        _onEvent: function(event) {
            if (typeof event.data !== "undefined") {
                equaliser._update(event.data);
            }
        }
    };

    patterns.register(equaliser);
    return equaliser;
});

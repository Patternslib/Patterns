/**
 * equaliser - Equalise height of elements in a row
 *
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 */
import $ from "jquery";
import registry from "../../core/registry";
import Parser from "../../core/parser";
import utils from "../../core/utils";

export const parser = new Parser("equaliser");
parser.addArgument("transition", "none", ["none", "grow"]);
parser.addArgument("effect-duration", "fast");
parser.addArgument("effect-easing", "swing");

var equaliser = {
    name: "equaliser",
    trigger: ".pat-equaliser, .pat-equalizer",

    init($el, opts) {
        return $el.each(function () {
            const container = this;
            const $container = $(container);
            const options = parser.parse($container, opts);
            $container.data("pat-equaliser", options);
            $(window).on(
                "resize.pat-equaliser",
                null,
                container,
                utils.debounce(equaliser._onEvent, 100),
            );

            const update = utils.debounce(() => {
                if (container.isConnected) {
                    equaliser._update(container);
                }
            }, 100);

            // Re-equalise when images within the container have been loaded.
            // The load and error events do not bubble, but can be captured.
            // This also catches images which are added later.
            container.addEventListener("load", update, true);
            container.addEventListener("error", update, true);

            const observer = new MutationObserver((mutations) => {
                if (!container.isConnected) {
                    // The container was removed from the DOM. Stop observing.
                    observer.disconnect();
                    return;
                }
                // Ignore the changes done by any equaliser itself on its
                // children, otherwise we end up in an infinite loop.
                const is_relevant = mutations.some(
                    (mutation) =>
                        !(
                            mutation.type === "attributes" &&
                            ["style", "class"].includes(mutation.attributeName) &&
                            $(mutation.target.parentElement).data("pat-equaliser")
                        ),
                );
                if (is_relevant) {
                    update();
                }
            });
            const config = {
                childList: true,
                subtree: true,
                characterData: true,
                attributes: true,
            };
            observer.observe(document.body, config);

            equaliser._update(container);
        });
    },

    _update: function (container) {
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
                    function () {
                        $(this).addClass("equalised");
                    },
                );
                break;
        }
        $container.trigger("pat-update", {
            pattern: "equaliser",
            action: "attribute-changed",
            dom: container,
        });
    },

    _onEvent: function (event) {
        if (typeof event.data !== "undefined") {
            equaliser._update(event.data);
        }
    },
};

registry.register(equaliser);
export default equaliser;

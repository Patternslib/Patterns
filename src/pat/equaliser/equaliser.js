/**
 * equaliser - Equalise height of elements in a row
 *
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 */
import $ from "jquery";
import { BasePattern } from "../../core/basepattern";
import registry from "../../core/registry";
import Parser from "../../core/parser";
import utils from "../../core/utils";

export const parser = new Parser("equaliser");
parser.addArgument("transition", "none", ["none", "grow"]);
parser.addArgument("effect-duration", "fast");
parser.addArgument("effect-easing", "swing");

class Pattern extends BasePattern {
    static name = "equaliser";
    static trigger = ".pat-equaliser, .pat-equalizer";
    static parser = parser;

    observer = null;

    init() {
        const debounced_update = utils.debounce(() => {
            if (!this.destroyed) {
                this.update();
            }
        }, 100);

        this.add_event_listener(window, "resize", "update-on-resize", debounced_update);

        // Re-equalise when images within the container have been loaded.
        // The load and error events do not bubble, but can be captured.
        // This also catches images which are added later.
        this.add_event_listener(this.el, "load", "update-on-load", debounced_update, {
            capture: true,
        });
        this.add_event_listener(this.el, "error", "update-on-error", debounced_update, {
            capture: true,
        });

        this.observer = new MutationObserver((mutations) => {
            // Ignore the changes done by any equaliser itself on its
            // children, otherwise we end up in an infinite loop.
            const is_relevant = mutations.some(
                (mutation) =>
                    !(
                        mutation.type === "attributes" &&
                        ["style", "class"].includes(mutation.attributeName) &&
                        mutation.target.parentElement?.["pattern-equaliser"]
                    ),
            );
            if (is_relevant) {
                debounced_update();
            }
        });
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
        });

        this.update();
    }

    destroy() {
        this.observer?.disconnect();
        super.destroy();
    }

    update() {
        const $container = $(this.el);
        const $children = $container.children();
        let max_height = 0;

        for (const child of $children) {
            const $child = $(child);
            const css = $child.css("height");
            $child.css("height", "").removeClass("equalised");
            const height = $child.height();
            if (height > max_height) {
                max_height = height;
            }
            if (css) {
                $child.css("height", css);
            }
        }

        const new_css = { height: max_height + "px" };

        switch (this.options.transition) {
            case "none":
                $children.css(new_css).addClass("equalised");
                break;
            case "grow":
                $children.animate(
                    new_css,
                    this.options.effect.duration,
                    this.options.effect.easing,
                    function () {
                        $(this).addClass("equalised");
                    },
                );
                break;
        }
        $container.trigger("pat-update", {
            pattern: "equaliser",
            action: "attribute-changed",
            dom: this.el,
        });
    }
}

registry.register(Pattern);
export default Pattern;
export { Pattern };

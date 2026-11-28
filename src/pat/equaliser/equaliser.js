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

// The style properties which are set by the equaliser - including those set
// temporarily by jQuery's animate for the "grow" transition.
const EQUALISER_STYLES = ["height", "overflow", "overflow-x", "overflow-y"];
const _style_el = document.createElement("div");

/**
 * Normalize a style attribute value without the styles set by the equaliser.
 *
 * @param {string} style - The style attribute value.
 * @returns {string} - The normalized style without the equaliser styles.
 */
const strip_equaliser_styles = (style) => {
    _style_el.setAttribute("style", style || "");
    for (const name of EQUALISER_STYLES) {
        _style_el.style.removeProperty(name);
    }
    return _style_el.style.cssText;
};

/**
 * Strip the class set by the equaliser and normalize the class list.
 *
 * @param {string} classes - The class attribute value.
 * @returns {string} - The sorted classes without the equaliser class.
 */
const strip_equaliser_class = (classes) => {
    return (classes || "")
        .split(/\s+/)
        .filter((it) => it && it !== "equalised")
        .sort()
        .join(" ");
};

/**
 * Check if a mutation is caused by an equaliser on one of its children.
 *
 * That is a change of the height style (and the overflow styles during the
 * grow animation) or of the ``equalised`` class.
 *
 * @param {MutationRecord} mutation - The mutation record. Must be recorded
 *                                    with ``attributeOldValue: true``.
 * @returns {boolean} - True, if the mutation is caused by an equaliser.
 */
export const is_equaliser_change = (mutation) => {
    if (
        mutation.type !== "attributes" ||
        !mutation.target.parentElement?.["pattern-equaliser"]
    ) {
        return false;
    }
    const current = mutation.target.getAttribute(mutation.attributeName);
    if (mutation.attributeName === "style") {
        return (
            strip_equaliser_styles(mutation.oldValue) === strip_equaliser_styles(current)
        );
    }
    if (mutation.attributeName === "class") {
        return (
            strip_equaliser_class(mutation.oldValue) === strip_equaliser_class(current)
        );
    }
    return false;
};

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
            // Ignore the changes done by any equaliser itself, otherwise we
            // end up in an infinite loop.
            if (mutations.some((mutation) => !is_equaliser_change(mutation))) {
                debounced_update();
            }
        });
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeOldValue: true,
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

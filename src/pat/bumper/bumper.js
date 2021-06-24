/**
 * Patterns bumper - Add bumping classes for sticky elements.
 */

import Base from "../../core/base";
import Parser from "../../core/parser";
import utils from "../../core/utils";

export const parser = new Parser("bumper");
parser.addArgument("selector");
parser.addArgument("bump-add", "bumped");
parser.addArgument("bump-remove");
parser.addArgument("unbump-add");
parser.addArgument("unbump-remove", "bumped");

export default Base.extend({
    name: "bumper",
    trigger: ".pat-bumper",

    init() {
        // Based on: https://davidwalsh.name/detect-sticky

        this.options = parser.parse(this.el, this.options);

        this.target_element = this.options.selector
            ? document.querySelector(this.options.selector)
            : this.el;

        const scroll_container_y = this.findScrollContainer("y");
        const scroll_container_x = this.findScrollContainer("x");

        const pos = {
            top: utils.getCSSValue(this.el, "top", true),
            right: utils.getCSSValue(this.el, "right", true),
            bottom: utils.getCSSValue(this.el, "bottom", true),
            left: utils.getCSSValue(this.el, "left", true),
        };
        const intersection_observer_config_y = {
            threshold: [1, 0.99, 0.97, 0.96, 0.95, 0.94, 0.93, 0.92, 0.91, 0.9],
            root: scroll_container_y,
            rootMargin: `
                    ${-pos.top - 1}px
                    ${-pos.right - 1}px
                    ${-pos.bottom - 1}px
                    ${-pos.left - 1}px`, // add margin as inverted sticky positions.
        };

        const observer_y = new IntersectionObserver(
            this._intersection_observer_callback.bind(this),
            intersection_observer_config_y
        );
        observer_y.observe(this.el);

        if (scroll_container_x !== scroll_container_y) {
            const intersection_observer_config_x = Object.assign(
                {},
                intersection_observer_config_y,
                { root: scroll_container_x }
            );
            const observer_x = new IntersectionObserver(
                this._intersection_observer_callback.bind(this),
                intersection_observer_config_x
            );
            observer_x.observe(this.el);
        }
    },

    _intersection_observer_callback(entries) {
        const el = this.target_element;
        for (const entry of entries) {
            if (entry.intersectionRatio < 1) {
                if (this.options.bump.add) {
                    el.classList.add(this.options.bump.add);
                }
                if (this.options.bump.remove) {
                    el.classList.remove(this.options.bump.remove);
                }
                const root = entry.rootBounds;
                const bounds = entry.boundingClientRect;
                if (bounds.left <= root.left) {
                    el.classList.add("bumped-left");
                } else {
                    el.classList.remove("bumped-left");
                }
                if (bounds.top <= root.top) {
                    el.classList.add("bumped-top");
                } else {
                    el.classList.remove("bumped-top");
                }
                if (bounds.right >= root.right) {
                    el.classList.add("bumped-right");
                } else {
                    el.classList.remove("bumped-right");
                }
                if (bounds.bottom >= root.bottom) {
                    el.classList.add("bumped-bottom");
                } else {
                    el.classList.remove("bumped-bottom");
                }
            } else {
                if (this.options.unbump.add) {
                    el.classList.add(this.options.unbump.add);
                }
                if (this.options.unbump.remove) {
                    el.classList.remove(this.options.unbump.remove);
                }
                el.classList.remove("bumped-left");
                el.classList.remove("bumped-top");
                el.classList.remove("bumped-right");
                el.classList.remove("bumped-bottom");
            }
        }
    },

    findScrollContainer(direction = null) {
        let parent = this.el.parentElement;
        let overflow;
        while (parent && parent !== document.body) {
            if (!direction || direction === "y") {
                overflow = utils.getCSSValue(parent, "overflow-y");
                if (overflow === "auto" || overflow === "scroll") {
                    return parent;
                }
            }
            if (!direction || direction === "x") {
                overflow = utils.getCSSValue(parent, "overflow-x");
                if (overflow === "auto" || overflow === "scroll") {
                    return parent;
                }
            }
            parent = parent.parentElement;
        }
        return null;
    },
});

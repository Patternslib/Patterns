/**
 * Patterns bumper - Add bumping classes for sticky elements.
 */

import Base from "../../core/base";
import dom from "../../core/dom";
import logging from "../../core/logging";
import Parser from "../../core/parser";
import utils from "../../core/utils";

const logger = logging.getLogger("tabs");

export const parser = new Parser("bumper");
parser.addArgument("selector");
parser.addArgument("bump-add", "bumped");
parser.addArgument("bump-remove");
parser.addArgument("unbump-add");
parser.addArgument("unbump-remove", "bumped");

export default Base.extend({
    name: "bumper",
    trigger: ".pat-bumper",

    async init() {
        // Based on: https://davidwalsh.name/detect-sticky

        if (!utils.checkCSSFeature("position", "sticky")) {
            // IE11
            logger.warn("No position sticky support.");
            return;
        }

        this.options = parser.parse(this.el, this.options);

        this.target_element = this.options.selector
            ? document.querySelector(this.options.selector)
            : this.el;

        // wait for next repaint for things to settle.
        // e.g. CSS applied for injected content.
        await utils.timeout(1);
        this._init();
    },

    _init() {
        const scroll_container_y = dom.find_scroll_container(
            this.el.parentElement,
            "y",
            null
        );
        const scroll_container_x = dom.find_scroll_container(
            this.el.parentElement,
            "x",
            null
        );

        const pos = {
            top: dom.get_css_value(this.el, "top", true),
            right: dom.get_css_value(this.el, "right", true),
            bottom: dom.get_css_value(this.el, "bottom", true),
            left: dom.get_css_value(this.el, "left", true),
        };
        const intersection_observer_config_y = {
            threshold: [1, 0.99, 0.97, 0.96, 0.95, 0.94, 0.93, 0.92, 0.91, 0.9],
            root: scroll_container_y,
            // add margin as inverted sticky positions.
            rootMargin: `${-pos.top - 1}px ${-pos.right - 1}px ${-pos.bottom - 1}px ${-pos.left - 1}px`, // prettier-ignore
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
                if (!root) {
                    // No root found - e.g. CSS not fully applied when scroll
                    // container was searched - as can happen as a corner case
                    // after injecting content and initializing this pattern in
                    // the same repaint cycle.
                    // This is actually prevented by the 1ms timeout in the
                    // init method.
                    return;
                }
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
});

/**
 * Patterns bumper - Add bumping classes for sticky elements.
 */

import Base from "../../core/base";
import Parser from "../../core/parser";
import utils from "../../core/utils";

export const parser = new Parser("bumper");
parser.addArgument("margin", 0);
parser.addArgument("selector");
parser.addArgument("bump-add", "bumped");
parser.addArgument("bump-remove");
parser.addArgument("unbump-add");
parser.addArgument("unbump-remove", "bumped");
parser.addArgument("side", "top", ["all", "top", "right", "bottom", "left"]);

export default Base.extend({
    name: "bumper",
    trigger: ".pat-bumper",

    init() {
        // Based on: https://davidwalsh.name/detect-sticky

        this.options = parser.parse(this.el, this.options);

        const target_element = this.options.selector
            ? document.querySelector(this.options.selector)
            : this.el;

        const side = this.options.side;
        const bump_all = side.indexOf("all") > -1;
        this.bump_top = bump_all || side.indexOf("top") > -1;
        this.bump_right = bump_all || side.indexOf("right") > -1;
        this.bump_bottom = bump_all || side.indexOf("bottom") > -1;
        this.bump_left = bump_all || side.indexOf("left") > -1;

        const scroll_container = this._findScrollContainer();

        const pos = {
            top: utils.getCSSValue(this.el, "top", true),
            right: utils.getCSSValue(this.el, "right", true),
            bottom: utils.getCSSValue(this.el, "bottom", true),
            left: utils.getCSSValue(this.el, "left", true),
        };

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.intersectionRatio < 1) {
                        if (this.options.bump.add) {
                            target_element.classList.add(this.options.bump.add);
                        }
                        if (this.options.bump.remove) {
                            target_element.classList.remove(this.options.bump.remove);
                        }
                        const root = entry.rootBounds;
                        const bounds = entry.boundingClientRect;
                        if (bounds.left <= root.left) {
                            this.el.classList.add("bumped-left");
                        } else {
                            this.el.classList.remove("bumped-left");
                        }
                        if (bounds.top <= root.top) {
                            this.el.classList.add("bumped-top");
                        } else {
                            this.el.classList.remove("bumped-top");
                        }
                        if (bounds.right >= root.right) {
                            this.el.classList.add("bumped-right");
                        } else {
                            this.el.classList.remove("bumped-right");
                        }
                        if (bounds.bottom >= root.bottom) {
                            this.el.classList.add("bumped-bottom");
                        } else {
                            this.el.classList.remove("bumped-bottom");
                        }
                    } else {
                        if (this.options.unbump.add) {
                            target_element.classList.add(this.options.unbump.add);
                        }
                        if (this.options.unbump.remove) {
                            target_element.classList.remove(this.options.unbump.remove);
                        }
                        this.el.classList.remove("bumped-left");
                        this.el.classList.remove("bumped-top");
                        this.el.classList.remove("bumped-right");
                        this.el.classList.remove("bumped-bottom");
                    }
                }
            },
            {
                threshold: [1, 0.99, 0.97, 0.96, 0.95, 0.94, 0.93, 0.92, 0.91, 0.9],
                root: scroll_container,
                rootMargin: `
                    ${-pos.top - 1}px
                    ${-pos.right - 1}px
                    ${-pos.bottom - 1}px
                    ${-pos.left - 1}px`, // add margin as inverted sticky positions.
            }
        );
        observer.observe(this.el);
    },

    _findScrollContainer() {
        let parent = this.el.parentElement;
        let overflow;
        while (parent && parent !== document.body) {
            if (this.bump_top || this.bump_bottom) {
                overflow = utils.getCSSValue(parent, "overflow-y");
                if (overflow === "auto" || overflow === "scroll") {
                    return parent;
                }
            }
            if (this.bump_left || this.bump_right) {
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

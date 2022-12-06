import { BasePattern } from "@patternslib/patternslib/src/core/basepattern";
import dom from "../../core/dom";
import events from "../../core/events";
import Parser from "../../core/parser";
import registry from "../../core/registry";
import utils from "../../core/utils";

export const parser = new Parser("bumper");
parser.addArgument("selector");
parser.addArgument("bump-add", "bumped");
parser.addArgument("bump-remove");
parser.addArgument("unbump-add");
parser.addArgument("unbump-remove", "bumped");

class Pattern extends BasePattern {
    static name = "bumper";
    static trigger = ".pat-bumper";
    static parser = parser;
    ticking = false;

    async init() {
        this.target_element = this.options.selector
            ? document.querySelector(this.options.selector)
            : this.el;

        // wait for next repaint for things to settle.
        // e.g. CSS applied for injected content.
        await utils.timeout(1);

        const parent_el = this.el.parentElement;
        this.container_x = dom.find_scroll_container(parent_el, "x", null);
        this.container_y = dom.find_scroll_container(parent_el, "y", null);

        const containers = new Set([this.container_x, this.container_y]);
        for (const container of containers) {
            events.add_event_listener(
                container || document,
                "scroll",
                "pat_bumper__scroll",
                async () => {
                    if (!this.ticking) {
                        this.ticking = true;
                        await utils.animation_frame();
                        this.set_bumping_classes();
                        this.ticking = false;
                    }
                }
            );
        }
        this.set_bumping_classes();
    }

    /**
     * Get the container position values.
     *
     * @param {DOMElement} container - The container element.
     * @param {Objcet} dimensions - The dimension Object of the container,
     *                              which were initialized in the init method.
     *
     * @returns {Object} The position values.
     */
    _get_container_positions(container) {
        if (!container) {
            // No container = viewport as scrolling container
            return {
                top: 0,
                right: document.documentElement.clientWidth,
                bottom: document.documentElement.clientHeight,
                left: 0,
            };
        }

        // Bounds are dynamic, so we cannot cache them.
        const bounds = container.getBoundingClientRect();

        // Container dimensions
        const dimensions = {
            border_top_width: dom.get_css_value(container, "border-top-width", true),
            border_left_width: dom.get_css_value(container, "border-left-width", true),
            padding_top: dom.get_css_value(container, "padding-top", true),
            padding_right: dom.get_css_value(container, "padding-right", true),
            padding_bottom: dom.get_css_value(container, "padding-bottom", true),
            padding_left: dom.get_css_value(container, "padding-left", true),
        };

        const left =
            bounds.left +
            dimensions.border_left_width +
            dimensions.padding_left; // prettier-ignore
        const top =
            bounds.top +
            dimensions.border_top_width +
            dimensions.padding_top; // prettier-ignore

        const right =
            bounds.left +
            dimensions.border_left_width +
            container.clientWidth -
            dimensions.padding_right;

        const bottom =
            bounds.top +
            dimensions.border_top_width +
            container.clientHeight -
            dimensions.padding_bottom;

        return {
            top: Math.round(top),
            right: Math.round(right),
            bottom: Math.round(bottom),
            left: Math.round(left),
        };
    }

    /**
     * Get the element position values.
     *
     * @returns {Object} The position values.
     */
    _get_element_positions() {
        const bounds = this.el.getBoundingClientRect();

        // Element positions
        const positions = {
            top: dom.get_css_value(this.el, "top", true),
            right: dom.get_css_value(this.el, "right", true),
            bottom: dom.get_css_value(this.el, "bottom", true),
            left: dom.get_css_value(this.el, "left", true),
        };

        return {
            top: Math.round(bounds.top - positions.top),
            right: Math.round(bounds.right + positions.right),
            bottom: Math.round(bounds.bottom + positions.bottom),
            left: Math.round(bounds.left - positions.left),
        };
    }

    /**
     * Get the bumping state of the element.
     *
     * @returns {Object} The bumping state.
     */
    get_bumping_state() {
        const pos_el = this._get_element_positions();
        const pos_x = this._get_container_positions(this.container_x);
        const pos_y =
            this.container_x === this.container_y
                ? pos_x
                : this._get_container_positions(this.container_y);

        const bump_top = pos_el.top <= pos_y.top && pos_el.bottom >= pos_y.top;
        const bump_right = pos_el.right >= pos_x.right && pos_el.left <= pos_x.right;
        const bump_bottom = pos_el.bottom >= pos_y.bottom && pos_el.top <= pos_y.bottom;
        const bump_left = pos_el.left <= pos_x.left && pos_el.right >= pos_x.left;

        const is_bumping = bump_top || bump_right || bump_bottom || bump_left;

        return {
            bump_top,
            bump_right,
            bump_bottom,
            bump_left,
            is_bumping,
        };
    }

    /**
     * Set the bumping classes on the element.
     */
    set_bumping_classes() {
        const bumping_state = this.get_bumping_state();

        const classes_to_add = [];
        const classes_to_remove = [];

        if (bumping_state.is_bumping) {
            this.options.bump.add && classes_to_add.push(this.options.bump.add);
            this.options.bump.remove && classes_to_remove.push(this.options.bump.remove);

            bumping_state.bump_top
                ? classes_to_add.push("bumped-top")
                : classes_to_remove.push("bumped-top");
            bumping_state.bump_right
                ? classes_to_add.push("bumped-right")
                : classes_to_remove.push("bumped-right");
            bumping_state.bump_bottom
                ? classes_to_add.push("bumped-bottom")
                : classes_to_remove.push("bumped-bottom");
            bumping_state.bump_left
                ? classes_to_add.push("bumped-left")
                : classes_to_remove.push("bumped-left");
        } else {
            this.options.unbump.add && classes_to_add.push(this.options.unbump.add);
            this.options.unbump.remove &&
                classes_to_remove.push(this.options.unbump.remove);
            classes_to_remove.push(
                "bumped-top",
                "bumped-right",
                "bumped-bottom",
                "bumped-left"
            );
        }

        this.el.classList.remove(...classes_to_remove);
        this.el.classList.add(...classes_to_add);
    }
}

registry.register(Pattern);

export default Pattern;
export { Pattern };

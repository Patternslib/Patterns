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

        // Viewport dimensions
        this.dim_viewport = {
            top:
                0 +
                dom.get_css_value(document.body, "margin-top", true) +
                dom.get_css_value(document.body, "padding-top", true),
            left:
                0 +
                dom.get_css_value(document.body, "margin-left", true) +
                dom.get_css_value(document.body, "padding-left", true),
        };
        this.dim_viewport.right =
            document.documentElement.clientWidth -
            dom.get_css_value(document.body, "margin-right", true) -
            dom.get_css_value(document.body, "padding-right", true);
        this.dim_viewport.bottom =
            document.documentElement.clientHeight -
            dom.get_css_value(document.body, "margin-bottom", true) -
            dom.get_css_value(document.body, "padding-bottom", true);

        this.dim_element = {
            top: dom.get_css_value(this.el, "top", true),
            right: dom.get_css_value(this.el, "right", true),
            bottom: dom.get_css_value(this.el, "bottom", true),
            left: dom.get_css_value(this.el, "left", true),
            margin_top: dom.get_css_value(this.el, "margin-top", true),
            margin_bottom: dom.get_css_value(this.el, "margin-bottom", true),
            margin_right: dom.get_css_value(this.el, "margin-right", true),
            margin_left: dom.get_css_value(this.el, "margin-left", true),
        };

        this.dim_container_x = this.container_x
            ? {
                  border_top_width: dom.get_css_value(this.container_x, "border-top-width", true), // prettier-ignore
                  border_left_width: dom.get_css_value(this.container_x, "border-left-width", true), // prettier-ignore
                  padding_top: dom.get_css_value(this.container_x, "padding-top", true), // prettier-ignore
                  padding_right: dom.get_css_value(this.container_x, "padding-right", true), // prettier-ignore
                  padding_bottom: dom.get_css_value(this.container_x, "padding-bottom", true), // prettier-ignore
                  padding_left: dom.get_css_value(this.container_x, "padding-left", true), // prettier-ignore
              }
            : {};

        this.dim_container_y = this.container_y
            ? {
                  border_top_width: dom.get_css_value(this.container_y, "border-top-width", true), // prettier-ignore
                  border_left_width: dom.get_css_value(this.container_y, "border-left-width", true), // prettier-ignore
                  padding_top: dom.get_css_value(this.container_y, "padding-top", true), // prettier-ignore
                  padding_right: dom.get_css_value(this.container_y, "padding-right", true), // prettier-ignore
                  padding_bottom: dom.get_css_value(this.container_y, "padding-bottom", true), // prettier-ignore
                  padding_left: dom.get_css_value(this.container_y, "padding-left", true), // prettier-ignore
              }
            : {};

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
    _get_container_positions(container, dimensions) {
        if (!container) {
            // No container = document.body
            return this.dim_viewport;
        }

        // Bounds are dynamic, so we cannot cache them.
        const bounds = container.getBoundingClientRect();

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
        return {
            top: Math.round(
                bounds.top -
                this.dim_element.top -
                this.dim_element.margin_top // prettier-ignore
            ),
            right: Math.round(
                bounds.right +
                this.dim_element.right +
                this.dim_element.margin_right // prettier-ignore
            ),
            bottom: Math.round(
                bounds.bottom +
                this.dim_element.bottom +
                this.dim_element.margin_bottom // prettier-ignore
            ),
            left: Math.round(
                bounds.left -
                this.dim_element.left -
                this.dim_element.margin_left // prettier-ignore
            ),
        };
    }

    /**
     * Get the bumping state of the element.
     *
     * @returns {Object} The bumping state.
     */
    get_bumping_state() {
        const pos_el = this._get_element_positions();
        const pos_x = this._get_container_positions(this.container_x, this.dim_container_x); // prettier-ignore
        const pos_y = this._get_container_positions(this.container_y, this.dim_container_y); // prettier-ignore

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

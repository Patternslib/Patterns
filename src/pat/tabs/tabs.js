import $ from "jquery";
import Base from "../../core/base";
import logging from "../../core/logging";
import utils from "../../core/utils";
import dom from "../../core/dom";

const logger = logging.getLogger("tabs");
export const DEBOUNCE_TIMEOUT = 10;

//logger.setLevel(logging.Level.DEBUG);

export default Base.extend({
    name: "tabs",
    trigger: ".pat-tabs",
    jquery_plugin: true,
    allowed_update_patterns: [
        "stacks",
        "switch",
        "auto-scale",
        "grid",
        "equaliser",
        "masonry",
        "zoom",
    ],

    init() {
        // debounce_resize to cancel previous runs of adjust_tabs
        const debounced_resize = utils.debounce(
            this.adjust_tabs.bind(this),
            DEBOUNCE_TIMEOUT
        );

        // ResizeObserver allows for calling the adjust_tabs method after an
        // animation is done, e.g. a menu is slided in. At the end of the
        // animation the calculation is done with the final layout.
        let previous_parent_width = utils.get_bounds(this.el.parentElement).width;
        this.resize_observer = new ResizeObserver((entry) => {
            const width = parseInt(entry[0].contentRect.width, 10);
            // Only run the resize callback for changes in width.
            // Apply a threshold of 3 pixels to compensate for rounding errors
            // and not run this adjust_tabs for very small layout changes.
            if (Math.abs(width - previous_parent_width) > 3) {
                logger.debug("Entering resize observer");
                previous_parent_width = width;
                debounced_resize();
            }
        });
        this.resize_observer.observe(this.el.parentElement); // observe on size changes of parent.

        // Also listen for ``pat-update`` event for cases where no resize but
        // an immediate display of the element is done.
        $("body").on("pat-update", (e, data) => {
            if (this.allowed_update_patterns.includes(data.pattern)) {
                logger.debug("pat-update received.");
                debounced_resize();
            }
        });

        debounced_resize();
    },

    async adjust_tabs() {
        logger.debug("Entering adjust_tabs");
        logger.debug("Element:");
        logger.debug(this.el);

        this.el.classList.remove("tabs-ready");
        this.el.classList.remove("tabs-wrapped");
        this._flatten_tabs();
        this.dimensions = this._get_dimensions();
        await this._adjust_tabs();
        this.el.classList.add("tabs-ready");
    },

    _flatten_tabs() {
        // Remove the extra-tabs structure and place all tabs directly under .pat-tabs
        const extra_wrapper = this.el.querySelector(".extra-tabs");
        if (extra_wrapper) {
            this.el.append(...extra_wrapper.children);
            extra_wrapper.remove();
        }
    },

    _get_dimensions() {
        const bounds = utils.get_bounds(this.el);
        const x = bounds.x;
        const width = bounds.width;
        const border_left = utils.getCSSValue(this.el, "border-left", true);
        const padding_left = utils.getCSSValue(this.el, "padding-left", true);
        const border_right = utils.getCSSValue(this.el, "border-right", true);
        const padding_right = utils.getCSSValue(this.el, "padding-right", true);
        const max_width =
            width - border_left - padding_left - padding_right - border_right;
        const max_x = bounds.x + max_width + border_left + padding_left;

        const dimensions = {
            x: x,
            max_x: max_x,
            width: width,
            max_width: max_width,
            border_left: border_left,
            border_right: border_right,
            padding_left: padding_left,
            padding_right: padding_right,
        };

        logger.debug("dimensions:");
        logger.debug(dimensions);

        return dimensions;
    },

    async _adjust_tabs() {
        logger.debug("Entering _adjust_tabs");
        const children = [...this.el.children].filter(
            (it) =>
                dom.is_visible(it) && utils.getCSSValue(it, "position") !== "absolute"
        ); // remove elements, which do not count against available width.

        if (children.length === 0) {
            // nothing to do.
            logger.debug("no children, exit _adjust_tabs.");
            return;
        }

        // Check if tabs fit into one line by checking their start position not
        // exceeding the available inner width or if they are not broken to a
        // new line.
        // This also takes whitespace between elements into account.
        let last_x;
        let tabs_fit = true;
        // iterate over all children excluding absolutely positioned or invisible elements.
        for (const it of children) {
            const bounds = utils.get_bounds(it);
            const it_x = bounds.x;
            const it_w = bounds.width + utils.getCSSValue(this.el, "margin-right", true);

            logger.debug("Item:");
            logger.debug(it);
            logger.debug(`
                item dimensions: x: ${it_x},
                width: ${it_w},
                max x: ${it_x + it_w},
                last_x: ${last_x}
            `);

            if (
                (last_x && last_x - 3 > it_x) ||
                it_x + it_w - 3 > this.dimensions.max_x
                // -3 pixel to compensate for rounding errors (x, width, margin-right).
            ) {
                // this tab exceeds initial available width or
                // breaks into a new line when width
                tabs_fit = false;
                break;
            }

            // Next position-left must be greater than last position-left plus element width.
            last_x = it_x + it_w;
        }
        if (tabs_fit) {
            // allright, nothing to do
            logger.debug("tabs fit, exit _adjust_tabs.");
            return;
        }

        logger.debug("Breaks into new line.");

        let extra_tabs = this.el.querySelector(".extra-tabs");
        if (!extra_tabs) {
            logger.debug("Creating .extra-tabs element.");
            extra_tabs = document.createElement("span");
            extra_tabs.classList.add("extra-tabs");
            this.el.classList.add("closed");
            this.el.classList.add("tabs-wrapped");

            extra_tabs.addEventListener("click", () => {
                // Toggle opened/closed class on extra-tabs
                if (this.el.classList.contains("open")) {
                    this.el.classList.remove("open");
                    this.el.classList.add("closed");
                } else {
                    this.el.classList.remove("closed");
                    this.el.classList.add("open");
                }
            });

            this.el.append(extra_tabs);
            await utils.animation_frame(); // Wait for CSS to be applied.
            this.dimensions = this._get_dimensions(); // Update dimensions after CSS was applied
        }

        logger.debug("Prepend last tab to .extra_tabs.");
        // ... but exclude `.extra-tabs` if it is part of children.
        extra_tabs.prepend(
            children.filter((it) => !it.classList.contains("extra-tabs")).pop()
        );

        await utils.animation_frame();
        this._adjust_tabs();
    },
});

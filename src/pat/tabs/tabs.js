import $ from "jquery";
import Base from "../../core/base";
import logging from "../../core/logging";
import utils from "../../core/utils";
import dom from "../../core/dom";

const logger = logging.getLogger("tabs");
export const DEBOUNCE_TIMEOUT = 10;

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
            () => this.adjust_tabs(),
            DEBOUNCE_TIMEOUT
        );
        const resize_observer = new ResizeObserver(() => {
            logger.debug("Entering resize observer");
            debounced_resize();
        });
        resize_observer.observe(this.el.parentElement); // observe on size changes of parent.

        // Also listen for ``pat-update`` event for cases where no resize but
        // an immediate display of the element is done.
        $("body").on("pat-update", (e, data) => {
            if (this.allowed_update_patterns.includes(data.pattern)) {
                debounced_resize();
            }
        });

        debounced_resize();
    },

    adjust_tabs() {
        logger.debug("Entering adjust_tabs");
        this.el.classList.remove("tabs-ready");
        this.el.classList.remove("tabs-wrapped");
        this._flatten_tabs();
        this.max_x = this._get_max_x();
        this._adjust_tabs();
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

    _get_max_x() {
        const max_x =
            parseInt(this.el.getBoundingClientRect().x, 10) +
            parseInt(utils.getCSSValue(this.el, "border-right") || 0, 10) +
            parseInt(this.el.clientWidth, 10) -
            parseInt(utils.getCSSValue(this.el, "padding-right") || 0, 10);
        logger.debug(`Max right position max_x: ${max_x}px.`);

        return max_x;
    },

    _adjust_tabs() {
        logger.debug("Entering _adjust_tabs");
        const children = [...this.el.children].filter(
            (it) =>
                dom.is_visible(it) && utils.getCSSValue(it, "position") !== "absolute"
        ); // remove elements, which do not count against available width.

        if (children.length === 0) {
            // nothing to do.
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
            const bounds = it.getBoundingClientRect();
            const it_x = parseInt(bounds.x, 10);
            const it_w =
                parseInt(bounds.width, 10) +
                parseInt(utils.getCSSValue(this.el, "margin-right") || 0, 10);
            logger.debug(`New tab right position: ${it_x + it_w}px.`);
            if ((last_x && last_x > it_x) || it_x + it_w > this.max_x) {
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
            this.max_x = this._get_max_x();
        }

        logger.debug("Prepend last tab to .extra_tabs.");
        // ... but exclude `.extra-tabs` if it is part of children.
        extra_tabs.prepend(
            children.filter((it) => !it.classList.contains("extra-tabs")).pop()
        );

        this._adjust_tabs();
    },
});

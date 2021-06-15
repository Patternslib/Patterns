import $ from "jquery";
import Base from "../../core/base";
import utils from "../../core/utils";

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
        const debounced_resize = utils.debounce(() => this.adjust_tabs(), 10);
        const resize_observer = new ResizeObserver(() => {
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
        this.el.classList.remove("tabs-ready");
        this.el.classList.remove("tabs-wrapped");
        this._flatten_tabs();
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

    _adjust_tabs() {
        const children = [...this.el.children].filter(
            (it) => !it.classList.contains("extra-tabs")
        );

        if (children.length === 0) {
            // nothing to do.
            return;
        }

        // Check if tabs are broken into multiple lines.
        // This is done by comparing the positions, which need to be increasing.
        // Instead of calculating the width of each element, this has methods
        // also taking whitespace between elements into account.
        let last_x;
        let all_in_line = true;
        for (const it of this.el.children) {
            const bounds = it.getBoundingClientRect();
            if (last_x && last_x > bounds.x) {
                // broke into new line
                all_in_line = false;
                break;
            }
            // Next position-left must be greater than last position-left plus element width.
            last_x = bounds.x + bounds.width;
        }
        if (all_in_line) {
            // allright, nothing to do
            return;
        }

        let extra_tabs = this.el.querySelector(".extra-tabs");
        if (!extra_tabs) {
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
        }
        extra_tabs.prepend(children.pop());

        this._adjust_tabs();
    },
});

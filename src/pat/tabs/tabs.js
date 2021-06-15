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
        const padding_left = utils.getCSSValue(this.el, "padding-left", true);
        const padding_right = utils.getCSSValue(this.el, "padding-right", true);
        const container_width = this.el.clientWidth - padding_left - padding_right;

        const children = [...this.el.children].filter(
            (it) => !it.classList.contains("extra-tabs")
        );

        if (children.length === 0) {
            // nothing to do.
            return;
        }

        // precalculate the collective size of all the tabs
        const total_width = [...this.el.children].reduce((val, it) => {
            const rect = it.getBoundingClientRect();
            const margin_left = utils.getCSSValue(it, "margin-left", true);
            const margin_right = utils.getCSSValue(it, "margin-right", true);
            return val + rect.width + margin_left + margin_right;
        }, 0);

        if (total_width <= container_width) {
            // allright, nothing to do
            return;
        }

        let extra_tabs = document.querySelector(".extra-tabs");
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

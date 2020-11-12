import $ from "jquery";
import Base from "../../core/base";
import utils from "../../core/utils";

export default Base.extend({
    name: "tabs",
    trigger: ".pat-tabs",
    jquery_plugin: true,
    skip_adjust: false, // do not run into an resize/adjust loop
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
        const debounced_resize = utils.debounce(() => this.adjust_tabs(), 50);
        const resize_observer = new ResizeObserver(() => {
            if (!this.skip_adjust) {
                debounced_resize();
            }
            this.skip_adjust = false;
        });
        resize_observer.observe(this.el);

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
        this.skip_adjust = true;
        const container_width = this.$el.width() * 0.95;

        // here we want to gather all tabs including those that may be in a special 'extra-tabs'
        // span and place them all as equal children, before we recalculate which tabs are
        // visible and which are potentially fully or partially obscured.
        let extratabs = [];
        let children = [...this.el.children].filter((it) => {
            if (it.classList.contains("extra-tabs")) {
                extratabs.push(...it.children);
                return false;
            }
            return true;
        });
        children.push(...extratabs);

        if (children.length === 0) {
            // nothing to do.
            return;
        }

        this.el.innerHTML = "";
        this.el.append(...children);

        // precalculate the collective size of all the tabs
        let total_width = [...this.el.children].reduce((val, it) => {
            return val + $(it).outerWidth(true);
        }, 0);

        if (total_width <= container_width) {
            // allright, nothing to do
            return;
        }

        const extra_el = document.createElement("span");
        extra_el.setAttribute("class", "extra-tabs");
        this.el.classList.add("closed");
        extra_el.addEventListener("click", () => {
            // Toggle opened/closed class on extra-tabs
            if (this.el.classList.contains("open")) {
                this.el.classList.remove("open");
                this.el.classList.add("closed");
            } else {
                this.el.classList.remove("closed");
                this.el.classList.add("open");
            }
        });
        this.el.append(extra_el);
        const extra_width = $(extra_el).width();

        extratabs = [];
        total_width = extra_width;
        for (const [idx, it] of [...children].entries()) {
            total_width += $(it).outerWidth(true);
            if (total_width > container_width) {
                extratabs = children.splice(idx);
                break;
            }
        }
        this.el.innerHTML = "";
        this.el.append(...children);
        extra_el.append(...extratabs);
        this.el.append(extra_el);
    },
});

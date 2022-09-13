import Base from "../../core/base";
import Parser from "../../core/parser";
import logging from "../../core/logging";

const log = logging.getLogger("navigation");

export const parser = new Parser("navigation");
parser.addArgument("item-wrapper", "li");
parser.addArgument("in-path-class", "navigation-in-path");
parser.addArgument("current-class", "current");

export default Base.extend({
    name: "navigation",
    trigger: "nav, .navigation, .pat-navigation",

    init() {
        this.options = parser.parse(this.el, this.options);

        this.init_listeners();

        this.mark_current();
    },

    /**
     * Initialize listeners for the navigation.
     */
    init_listeners() {
        const current = this.options.currentClass;

        // Mark the navigation items after pat-inject triggered within this navigation menu.
        this.$el.on("patterns-inject-triggered", "a", (ev) => {
            // Remove all set current classes
            this.clear_items();

            // Mark the current item
            this.mark_current(ev.target);
        });

        // Automatically and recursively load the ``.current`` item.
        if (this.el.classList.contains("navigation-load-current")) {
            // Check for current elements injected here.
            this.$el.on("patterns-injected-scanned", (ev) => {
                const target = ev.target;
                if (target.matches(`a.${current}`)) target.click();
                else if (target.matches(`.${current}`)) target.querySelector("a")?.click(); // prettier-ignore
            });
            this.el.querySelector(`a.${current}, .${current} a`)?.click();
        }

        // Re-init when navigation changes.
        const observer = new MutationObserver(() => {
            this.init_listeners();
            this.mark_current();
        });
        observer.observe(this.el, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false,
        });
    },

    /**
     * Get a matching parent or stop at stop_el.
     *
     * @param {Node} item - The item to start with.
     * @param {String} selector - The CSS selector to search parent elements for.
     * @param {Node} stop_el - The element to stop at.
     *
     * @returns {Node} - The matching parent or null.
     */
    get_parent(item, selector, stop_el) {
        let matching_parent = item.parentNode;
        while (matching_parent) {
            if (matching_parent === stop_el || matching_parent === document) {
                return null;
            }
            if (matching_parent.matches(selector)) {
                return matching_parent;
            }
            matching_parent = matching_parent.parentNode;
        }
    },

    /**
     * Mark an item and it's wrapper as current.
     *
     * @param {Node} [current_el] - The item to mark as current.
     *                              If not given, the element's tree will be searched for an existing current item.
     *                              This is to also mark the wrapper and it's path appropriately.
     */
    mark_current(current_el) {
        const current_els = current_el
            ? [current_el]
            : document.querySelectorAll(`.current > a, a.current`);

        for (const item of current_els) {
            item.classList.add(this.options.currentClass);
            const wrapper = item.closest(this.options.itemWrapper);
            wrapper?.classList.add(this.options.currentClass);
            this.mark_in_path(wrapper || item);
            log.debug("Statically set current item marked as current", item);
        }
    },

    /**
     * Mark all parent navigation elements as in path.
     *
     * @param {Node} start_el - The element to start with.
     *
     */
    mark_in_path(start_el) {
        let path_el = this.get_parent(start_el, this.options.itemWrapper, this.el);
        while (path_el) {
            if (!path_el.matches(`.${this.options.currentClass}`)) {
                path_el.classList.add(this.options.inPathClass);
                log.debug("Marked item as in-path", path_el);
            }
            path_el = this.get_parent(path_el, this.options.itemWrapper, this.el);
        }
    },

    /**
     * Clear all navigation items from the inPath and current classes
     */
    clear_items() {
        const items = this.el.querySelectorAll(
            `.${this.options.inPathClass}, .${this.options.currentClass}`
        );
        for (const item of items) {
            item.classList.remove(this.options.inPathClass);
            item.classList.remove(this.options.currentClass);
        }
    },
});

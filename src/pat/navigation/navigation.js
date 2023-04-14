import $ from "jquery";
import { BasePattern } from "../../core/basepattern";
import Parser from "../../core/parser";
import logging from "../../core/logging";
import events from "../../core/events";
import registry from "../../core/registry";

const log = logging.getLogger("navigation");

export const parser = new Parser("navigation");
parser.addArgument("item-wrapper", "li");
parser.addArgument("in-path-class", "navigation-in-path");
parser.addArgument("current-class", "current");

class Pattern extends BasePattern {
    static name = "navigation";
    static trigger = ".pat-navigation";
    static parser = parser;

    parser_group_options = false;

    init() {
        this.$el = $(this.el);

        this.init_listeners();
        this.init_markings();
    }

    /**
     * Initialize listeners for the navigation.
     */
    init_listeners() {
        const current = this.options["current-class"];

        events.add_event_listener(
            this.el,
            "click",
            "pat_navigation_click_handler",
            (ev) => {
                if (ev.target.matches("a:not(.pat-inject)")) {
                    // Remove all set current classes
                    this.clear_items();
                    // Mark the current item
                    this.mark_current(ev.target);
                }
            }
        );

        // Mark the navigation items after pat-inject triggered within this navigation menu.
        this.$el.on("patterns-inject-triggered", "a", (ev) => {
            // Remove all set current classes
            this.clear_items();
            // Mark the current item
            this.mark_current(ev.target);
        });

        // Mark the navigation items after pat-inject injected into this navigation menu.
        this.$el.on("patterns-injected-scanned", () => {
            this.init_markings();
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
    }

    /**
     * Initial run to mark the current item and its parents.
     */
    init_markings() {
        if (this.el.querySelector(`.${this.options["current-class"]}`)) {
            log.debug("Mark navigation items based on existing current class");
            this.mark_current();
        } else {
            log.debug("Mark navigation items based on URL pattern.");
            this.mark_items_url();
        }
    }

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
    }

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
            : this.el.querySelectorAll(`.current > a, a.current`);

        for (const item of current_els) {
            item.classList.add(this.options["current-class"]);
            const wrapper = item.closest(this.options["item-wrapper"]);
            wrapper?.classList.add(this.options["current-class"]);
            this.mark_in_path(wrapper || item);
            log.debug("Statically set current item marked as current", item);
        }
    }

    /**
     * Mark all parent navigation elements as in path.
     *
     * @param {Node} start_el - The element to start with.
     *
     */
    mark_in_path(start_el) {
        let path_el = this.get_parent(start_el, this.options["item-wrapper"], this.el);
        while (path_el) {
            if (!path_el.matches(`.${this.options["current-class"]}`)) {
                path_el.classList.add(this.options["in-path-class"]);
                for (const it of [...path_el.children].filter((it) => it.matches("a"))) {
                    it.classList.add(this.options["in-path-class"]);
                }
                log.debug("Marked item as in-path", path_el);
            }
            path_el = this.get_parent(path_el, this.options["item-wrapper"], this.el);
        }
    }

    /**
     * Mark all navigation items that are in the path of the current url.
     *
     * @param {String} [url] - The url to check against.
     *                         If not given, the current url will be used.
     */
    mark_items_url(url) {
        const current_url = url || this.base_url();
        const current_url_prepared = this.prepare_url(current_url);

        const portal_url = this.prepare_url(document.body.dataset?.portalUrl);
        const nav_items = this.el.querySelectorAll("a");

        for (const nav_item of nav_items) {
            // Get the nav item's url and rebase it against the current url to
            // make absolute or relative URLs FQDN URLs.
            const nav_url = this.prepare_url(
                new URL(nav_item.getAttribute("href", ""), current_url)?.href
            );

            const wrapper = nav_item.closest(this.options["item-wrapper"]);

            if (nav_url === current_url_prepared) {
                nav_item.classList.add(this.options["current-class"]);
                wrapper?.classList.add(this.options["current-class"]);
                this.mark_in_path(nav_item);
            } else if (
                // Compare the current navigation item url with a slash at the
                // end - if it is "inPath" it must have a slash in it.
                current_url_prepared.indexOf(`${nav_url}/`) === 0 &&
                // Do not set inPath for the "Home" url, as this would always
                // be in the path.
                nav_url !== portal_url
            ) {
                nav_item.classList.add(this.options["in-path-class"]);
                wrapper?.classList.add(this.options["in-path-class"]);
            } else {
                // Not even in path.
                continue;
            }
        }
    }

    /**
     * Clear all navigation items from the inPath and current classes
     */
    clear_items() {
        const items = this.el.querySelectorAll(
            `.${this.options["in-path-class"]}, .${this.options["current-class"]}`
        );
        for (const item of items) {
            item.classList.remove(this.options["in-path-class"]);
            item.classList.remove(this.options["current-class"]);
        }
    }

    /**
     * Prepare a URL for comparison.
     * Plone-specific "/view" and "@@" will be removed as well as a trailing slash.
     *
     * @param {String} url - The url to prepare.
     *
     * @returns {String} - The prepared url.
     */
    prepare_url(url) {
        return url?.replace("/view", "").replaceAll("@@", "").replace(/\/$/, "");
    }

    /**
     * Get the URL of the current page.
     * If a ``canonical`` meta tag is found, return this.
     * Otherwise return the window.location URL.
     * Already prepare the URL for comparison.
     *
     * @returns {String} - The current URL.
     */
    base_url() {
        return this.prepare_url(
            document.querySelector('head link[rel="canonical"]')?.href ||
                window.location.href
        );
    }
}

registry.register(Pattern);
export default Pattern;
export { Pattern };

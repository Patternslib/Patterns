import $ from "jquery";
import { BasePattern } from "../../core/basepattern";
import Parser from "../../core/parser";
import ScrollMarker from "../scroll-marker/scroll-marker";
import dom from "../../core/dom";
import logging from "../../core/logging";
import events from "../../core/events";
import registry from "../../core/registry";
import utils from "../../core/utils";

const log = logging.getLogger("navigation");

export const parser = new Parser("navigation");
parser.addArgument("item-wrapper", "li");
parser.addArgument("in-path-class", "navigation-in-path");
parser.addArgument("in-view-class", "in-view");
parser.addArgument("current-class", "current");
parser.addArgument("current-content-class", "navigation-current");

parser.addArgument("scroll-item-side", "top", ["top", "bottom", "middle", "auto"]);
parser.addArgument("scroll-item-distance", "50%");
parser.addArgument("scroll-item-visibility", null, [null, "none", "most-visible"]);
parser.addArgument("scroll-trigger-selector", "a[href^='#'].scroll-trigger");

class Pattern extends BasePattern {
    static name = "navigation";
    static trigger = ".pat-navigation";
    static parser = parser;

    parser_group_options = false;

    init() {
        this.$el = $(this.el);

        this.init_listeners();
        this.init_markings();

        if (utils.is_option_truthy(this.options["scroll-trigger-selector"])) {
            this.scroll_marker = new ScrollMarker(this.el, {
                "current-class": this.options["current-class"],
                "current-content-class": this.options["current-content-class"],
                "in-view-class": this.options["in-view-class"],
                "side": this.options["scroll-item-side"],
                "distance": this.options["scroll-item-distance"],
                "visibility": this.options["scroll-item-visibility"],
                "selector": this.options["scroll-trigger-selector"],
            });

            this.debounced_scroll_marker_enabler = utils.debounce(() => {
                log.debug("Enable scroll-marker.");
                this.scroll_marker.set_current_disabled = false;
                events.remove_event_listener(
                    this.scroll_marker.scroll_container === window
                        ? document
                        : this.scroll_marker.scroll_container,
                    "pat-navigation__scroll_marker_enable"
                );
            }, 200);
        }
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
                // Get the click target's anchor element. The click target
                // might be a child of the link, e.g. a span wrapped within an
                // anchor.
                const target = ev.target.closest("a");
                if (target?.matches(":not(.pat-inject)")) {

                    // Remove all set current classes
                    this.clear_items();
                    // Mark the current item
                    this.mark_current(target);

                    if (
                        !utils.is_option_truthy(this.options["scroll-trigger-selector"])
                    ) {
                        // Don't do the scroll-marker stuff below, if it is disabled by the settings.
                        return;
                    }
                    // Disable scroll marker to set the current class after
                    // clicking in the menu and scrolling to the target.
                    log.debug("Disable scroll-marker.");
                    this.scroll_marker.set_current_disabled = true;
                    this.debounced_scroll_marker_enabler();
                    events.add_event_listener(
                        this.scroll_marker.scroll_container === window
                            ? document
                            : this.scroll_marker.scroll_container,
                        "scroll",
                        "pat-navigation__scroll_marker_enable",
                        this.debounced_scroll_marker_enabler.bind(this)
                    );
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

            // Clear all previous current content items.
            for (const it of [
                ...document.querySelectorAll(
                    `.${this.options["current-content-class"]}`
                ),
            ]) {
                it.classList.remove(this.options["current-content-class"]);
            }
            // Mark the current content item, if it is a hash link.
            if (item.matches("a[href^='#']")) {
                const content_item = document.querySelector(
                    dom.escape_css_id(item.hash)
                );
                if (content_item) {
                    content_item.classList.add(this.options["current-content-class"]);
                }
            }
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

/**
 * pat-reload - Reload the content of an element on an event.
 *
 * The "when" and "from which URL" is defined by pat-reload, the "what" and
 * "where" is delegated to pat-inject.
 */
import $ from "jquery";
import { BasePattern } from "../../core/basepattern";
import events from "../../core/events";
import inject from "../inject/inject";
import logging from "../../core/logging";
import Parser from "../../core/parser";
import registry from "../../core/registry";
import utils from "../../core/utils";

const log = logging.getLogger("pat-reload");

export const parser = new Parser("reload");
// URL to reload from. Relative URLs are resolved against the base URL.
parser.addArgument("url", null);
// Event which triggers the reload.
parser.addArgument("trigger-event", "navigatesuccess");
// Debounce time for successive events.
parser.addArgument("delay", 0);

// Events which are dispatched on `window.navigation`.
const NAVIGATION_EVENTS = [
    "navigate",
    "navigatesuccess",
    "navigateerror",
    "currententrychange",
];

/**
 * Strip query string and hash from an URL.
 *
 * @param {String} url - The URL.
 * @returns {String} - The URL without query string and hash.
 */
const strip_url = (url) => url.split(/[?#]/)[0];

class Pattern extends BasePattern {
    static name = "reload";
    static trigger = ".pat-reload";
    static parser = parser;

    parser_group_options = false;

    async init() {
        if (!this.options.url) {
            log.error("No `url` defined. Not initializing.", this.el);
            return;
        }

        this.is_navigation_event = NAVIGATION_EVENTS.includes(
            this.options["trigger-event"]
        );
        this.event_source = this.is_navigation_event ? window.navigation : document;
        if (!this.event_source) {
            log.warn("Navigation API not available. Not initializing.", this.el);
            return;
        }

        try {
            this.delay = utils.parseTime(this.options.delay) || 0;
        } catch {
            log.warn("Invalid delay value: ", this.options.delay);
            this.delay = 0;
        }

        this.event_id = `pat-reload--${this.uuid}`;
        this.last_url = strip_url(window.location.href);
        this.reloading = false;
        this.pending = false;

        events.add_event_listener(
            this.el,
            "pat-inject-finished",
            this.event_id,
            this.on_inject_finished.bind(this)
        );

        const debounced_reload = utils.debounce(() => this.reload(), this.delay);
        events.add_event_listener(
            this.event_source,
            this.options["trigger-event"],
            this.event_id,
            () => {
                if (!this.el.isConnected) {
                    // The element was removed from the DOM. Clean up.
                    this.destroy();
                    return;
                }
                if (this.is_navigation_event) {
                    // Only reload on actual URL changes. Ignore hash changes
                    // and same-URL `replaceState` calls.
                    const current_url = strip_url(window.location.href);
                    if (current_url === this.last_url) {
                        return;
                    }
                    this.last_url = current_url;
                }
                debounced_reload();
            }
        );
    }

    /**
     * Get the base URL against which relative URLs are resolved.
     *
     * TODO: Allow configuring the base URL (e.g. via a CSS selector for
     *       `[data-base-url]` or `link[rel=canonical]`). Note: those are not
     *       updated on same-document navigation, while `window.location` is.
     *
     * @returns {String} - The base URL, ending with a slash.
     */
    get_base_url() {
        return strip_url(window.location.href).replace(/\/?$/, "/");
    }

    /**
     * Get the URL to reload from.
     *
     * Absolute URLs (with scheme, starting with `//` or `/`) are used as-is.
     * Relative URLs are appended to the base URL.
     *
     * @returns {String} - The reload URL.
     */
    get_url() {
        return new URL(this.options.url, this.get_base_url()).href;
    }

    /**
     * Reload the content via pat-inject.
     */
    reload() {
        if (!this.el.isConnected) {
            this.destroy();
            return;
        }

        if (this.reloading) {
            // A reload is in progress. Reload once more after it has
            // finished, so that the latest state is reflected.
            this.pending = true;
            return;
        }

        // Note: pat-inject's API expects jQuery objects.
        const $el = $(this.el);
        const cfgs = inject.extractConfig($el, { url: this.get_url() });
        for (const cfg of cfgs) {
            // Inject into the element itself by default instead of into the
            // body - which is pat-inject's default.
            cfg.target = cfg.target || "self";
        }
        log.debug("Reloading from", cfgs[0].url);
        this.reloading = inject.execute(cfgs, $el) === true;
    }

    /**
     * Handle the end of an injection started by this pattern.
     *
     * @param {Event} event - The `pat-inject-finished` event.
     */
    on_inject_finished(event) {
        if (event.target !== this.el) {
            // Ignore bubbling events from injections within this element.
            return;
        }
        this.reloading = false;
        if (this.pending) {
            this.pending = false;
            this.reload();
        }
    }

    destroy() {
        if (this.event_source && this.event_id) {
            // Guard: Without element and id, `remove_event_listener` would
            // remove all registered event listeners.
            events.remove_event_listener(this.event_source, this.event_id);
            events.remove_event_listener(this.el, this.event_id);
        }
        super.destroy();
    }
}

registry.register(Pattern);
export default Pattern;
export { Pattern };

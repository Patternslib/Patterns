import $ from "jquery";
import { BasePattern } from "../../core/basepattern";
import events from "../../core/events";
import logging from "../../core/logging";
import Parser from "../../core/parser";
import registry from "../../core/registry";
import utils from "../../core/utils";

const log = logging.getLogger("stacks");

export const parser = new Parser("stacks");
parser.addArgument("selector", "> *[id]");
parser.addArgument("transition", "none", ["none", "css", "fade", "slide"]);
parser.addArgument("effect-duration", "fast");
parser.addArgument("effect-easing", "swing");
// pat-scroll support
parser.addArgument("scroll-selector");
parser.addArgument("scroll-offset", 0);

const debounce_scroll_timer = { timer: null };

class Pattern extends BasePattern {
    static name = "stacks";
    static trigger = ".pat-stacks";
    static parser = parser;
    document = document;

    async init() {
        this.$el = $(this.el);

        // pat-scroll support
        if (this.options.scroll?.selector && this.options.scroll.selector !== "none") {
            const Scroll = (await import("../scroll/scroll")).default;
            this.scroll = new Scroll(this.el, {
                trigger: "manual",
                selector: this.options.scroll.selector,
                offset: this.options.scroll?.offset,
            });
            await events.await_pattern_init(this.scroll);

            // scroll debouncer for later use.
            this.debounce_scroll = utils.debounce(
                this.scroll.scrollTo.bind(this.scroll),
                10,
                debounce_scroll_timer
            );
        }

        this._setupStack();
        $(this.document).on("click", "a", this._onClick.bind(this));
    }

    _setupStack() {
        let selected = this._currentFragment();
        const $sheets = this.$el.find(this.options.selector);
        this.$active = [];

        if ($sheets.length < 2) {
            log.warn("Stacks pattern: must have more than one sheet.", this.$el[0]);
            return;
        }

        if (selected) {
            try {
                this.$active = $sheets.filter("#" + selected);
            } catch (e) {
                selected = undefined;
            }
        }

        if (!this.$active.length) {
            this.$active = $sheets.first();
            selected = this.$active[0].id;
        }
        const $invisible = $sheets.not(this.$active);
        utils.hideOrShow(this.$active, true, { transition: "none" }, this.name);
        utils.hideOrShow($invisible, false, { transition: "none" }, this.name);
        this._updateAnchors(selected);
    }

    _base_URL() {
        return this.document.URL.split("#")[0];
    }

    _currentFragment() {
        const parts = this.document.URL.split("#");
        if (parts.length === 1) {
            return null;
        }
        return parts[parts.length - 1];
    }

    _onClick(e) {
        const base_url = this._base_URL();
        const href_parts = e.currentTarget.href.split("#");
        // Check if this is an in-document link and has a fragment
        if (base_url !== href_parts[0] || !href_parts[1]) {
            return;
        }
        if (!this.$el.has(`#${href_parts[1]}`).length) {
            return;
        }
        e.preventDefault();
        this._updateAnchors(href_parts[1]);
        this._switch(href_parts[1]);

        this.debounce_scroll?.(); // debounce scroll, if available.

        // Notify other patterns
        $(e.target).trigger("pat-update", {
            pattern: "stacks",
            action: "attribute-changed",
            dom: this.$active[0],
            originalEvent: e,
        });
    }

    _updateAnchors(selected) {
        const $sheets = this.$el.find(this.options.selector);
        const base_url = this._base_URL();
        for (const sheet of $sheets) {
            // This may appear odd, but: when querying a browser uses the
            // original href of an anchor as it appeared in the document
            // source, but when you access the href property you always get
            // the fully qualified version.
            const $anchors = $(
                `a[href="${base_url}#${sheet.id}"], a[href="#${sheet.id}"]`
            );
            if (sheet.id === selected) {
                $anchors.addClass("current");
            } else {
                $anchors.removeClass("current");
            }
        }
    }

    _switch(sheet_id) {
        this.$active = this.$el.find("#" + sheet_id);
        if (!this.$active.length || this.$active.hasClass("visible")) {
            return;
        }
        const $invisible = this.$el.find(this.options.selector).not(this.$active);
        utils.hideOrShow($invisible, false, this.options, this.name);
        utils.hideOrShow(this.$active, true, this.options, this.name);
    }
}

registry.register(Pattern);

export default Pattern;
export { Pattern };

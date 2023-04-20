import $ from "jquery";
import "../../core/jquery-ext";
import { BasePattern } from "../../core/basepattern";
import events from "../../core/events";
import inject from "../inject/inject";
import logging from "../../core/logging";
import Parser from "../../core/parser";
import registry from "../../core/registry";
import store from "../../core/store";
import utils from "../../core/utils";

const log = logging.getLogger("pat.collapsible");

export const parser = new Parser("collapsible");
parser.addArgument("load-content");
parser.addArgument("store", "none", ["none", "session", "local"]);
parser.addArgument("transition", "slide", [
    "none",
    "css",
    "fade",
    "slide",
    "slide-horizontal",
]);
parser.addArgument("effect-duration", "fast");
parser.addArgument("effect-easing", "swing");
parser.addArgument("closed", false);
parser.addArgument("trigger", "::first");
parser.addArgument("close-trigger");
parser.addArgument("open-trigger");
// pat-scroll support
parser.addArgument("scroll-selector");
parser.addArgument("scroll-offset", 0);

const debounce_scroll_timer = { timer: null };

class Pattern extends BasePattern {
    static name = "collapsible";
    static trigger = ".pat-collapsible";
    static parser = parser;

    transitions = {
        "none": { closed: "hide", open: "show" },
        "fade": { closed: "fadeOut", open: "fadeIn" },
        "slide": { closed: "slideUp", open: "slideDown" },
        "slide-horizontal": { closed: "slideOut", open: "slideIn" },
    };

    async init() {
        const $el = (this.$el = $(this.el));

        let $content;

        if (this.options.trigger === "::first") {
            this.$trigger = $el.children(":first");
            $content = $el.children(":gt(0)");
        } else {
            this.$trigger = $(this.options.trigger);
            $content = $el.children();
        }
        if (this.$trigger.length === 0) {
            log.error("Collapsible has no trigger.", $el[0]);
            return;
        }

        this.$panel = $el.children(".panel-content");
        if (this.$panel.length === 0) {
            if ($content.length) {
                this.$panel = $content.wrapAll("<div class='panel-content' />").parent();
            } else {
                this.$panel = $("<div class='panel-content' />").insertAfter(
                    this.$trigger
                );
            }
        }

        let state = this.options.closed || $el.hasClass("closed") ? "closed" : "open";
        if (this.options.store !== "none") {
            const storage = (
                this.options.store === "local" ? store.local : store.session
            )(this.name);
            state = storage.get($el.attr("id")) || state;
        }

        if (state === "closed") {
            this.$trigger.removeClass("collapsible-open").addClass("collapsible-closed");
            $el.removeClass("open").addClass("closed");
            this.$panel.hide();
        } else {
            if (this.options.loadContent) {
                this._loadContent($el, this.options.loadContent, this.$panel);
            }
            this.$trigger.removeClass("collapsible-closed").addClass("collapsible-open");
            $el.removeClass("closed").addClass("open");
            this.$panel.show();
        }

        this.$trigger
            .off(".pat-collapsible")
            .on("click.pat-collapsible", null, $el, this._onClick.bind(this))
            .on("keypress.pat-collapsible", null, $el, this._onKeyPress.bind(this));

        if (this.options.closeTrigger) {
            $(document).on("click", this.options.closeTrigger, this.close.bind(this));
        }
        if (this.options.openTrigger) {
            $(document).on("click", this.options.openTrigger, this.open.bind(this));
        }

        // pat-scroll support
        if (this.options.scroll?.selector) {
            const Scroll = (await import("../scroll/scroll")).default;
            this.scroll = new Scroll(this.el, {
                trigger: "manual",
                selector: this.options.scroll.selector,
                offset: this.options.scroll?.offset,
            });
            await events.await_pattern_init(this.scroll);
        }

        // scroll debouncer for later use.
        this.debounce_scroll = utils.debounce(
            this._scroll.bind(this),
            10,
            debounce_scroll_timer
        );

        return $el;
    }

    async _scroll() {
        const scroll_selector = this.options.scroll?.selector;
        if (!scroll_selector) {
            return;
        }
        await this.scroll.scrollTo();
    }

    open() {
        if (!this.$el.hasClass("open")) this.toggle();
        return this.$el;
    }

    close() {
        if (!this.$el.hasClass("closed")) this.toggle();
        return this.$el;
    }

    _onClick(event) {
        this.toggle(event.data);
    }

    _onKeyPress(event) {
        const keycode = event.keyCode ? event.keyCode : event.which;
        if (keycode === 13) this.toggle();
    }

    _loadContent($el, url, $target) {
        const components = url.split("#");
        const base_url = components[0];
        const id = components[1] ? "#" + components[1] : "body";
        const opts = [
            {
                url: base_url,
                source: id,
                $target: $target,
                dataType: "html",
            },
        ];
        inject.execute(opts, $el);
    }

    // jQuery method to force loading of content.
    loadContent($el) {
        return $el.each(
            function (idx, el) {
                if (this.options.loadContent)
                    this._loadContent($(el), this.options.loadContent, this.$panel);
            }.bind(this)
        );
    }

    toggle() {
        const new_state = this.$el.hasClass("closed") ? "open" : "closed";
        if (this.options.store !== "none") {
            const storage = (
                this.options.store === "local" ? store.local : store.session
            )(this.name);
            storage.set(this.$el.attr("id"), new_state);
        }
        if (new_state === "open") {
            this.$el.trigger("patterns-collapsible-open");
            this._transit(this.$el, "closed", "open");
            this.debounce_scroll();
        } else {
            this.$el.trigger("patterns-collapsible-close");
            this._transit(this.$el, "open", "closed");
        }
        return this.$el; // allow chaining
    }

    async _transit($el, from_cls, to_cls) {
        if (to_cls === "open" && this.options.loadContent) {
            this._loadContent($el, this.options.loadContent, this.$panel);
        }
        const duration =
            this.options.transition === "css" || this.options.transition === "none"
                ? null
                : this.options.effect.duration;
        if (!duration) {
            this.$trigger
                .removeClass("collapsible-" + from_cls)
                .addClass("collapsible-" + to_cls);
            $el.removeClass(from_cls).addClass(to_cls).trigger("pat-update", {
                pattern: "collapsible",
                action: "attribute-changed",
                dom: $el[0],
                transition: "complete",
            });
        } else {
            const t = this.transitions[this.options.transition];
            $el.addClass("in-progress").trigger("pat-update", {
                pattern: "collapsible",
                action: "attribute-changed",
                dom: $el[0],
                transition: "start",
            });
            this.$trigger.addClass("collapsible-in-progress");
            await this.$panel[t[to_cls]](
                duration,
                this.options.effect.easing,
                function () {
                    this.$trigger
                        .removeClass("collapsible-" + from_cls)
                        .removeClass("collapsible-in-progress")
                        .addClass("collapsible-" + to_cls);
                    $el.removeClass(from_cls)
                        .removeClass("in-progress")
                        .addClass(to_cls)
                        .trigger("pat-update", {
                            pattern: "collapsible",
                            action: "attribute-changed",
                            dom: $el[0],
                            transition: "complete",
                        });
                }.bind(this)
            ).promise();
        }
    }
}

registry.register(Pattern);

export default Pattern;
export { Pattern };

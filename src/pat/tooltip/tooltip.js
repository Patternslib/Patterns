import $ from "jquery";
import { BasePattern } from "../../core/basepattern";
import logging from "../../core/logging";
import Parser from "../../core/parser";
import events from "../../core/events";
import registry from "../../core/registry";
import utils from "../../core/utils";

// Initialize close-panel functionality.
import "../close-panel/close-panel";

const log = logging.getLogger("pat-tooltip");

export const parser = new Parser("tooltip");
const all_positions = [
    "tl",
    "tm",
    "tr",
    "rt",
    "rm",
    "rb",
    "br",
    "bm",
    "bl",
    "lb",
    "lm",
    "lt",
];
parser.addArgument("position-list", [], all_positions, true);
parser.addArgument("position-policy", "auto", ["auto", "force"]);
parser.addArgument("trigger", "click", ["click", "hover", "none"]);
parser.addArgument("source", "title", ["ajax", "content", "title"]);
parser.addArgument("ajax-data-type", "html", ["html", "markdown"]);
parser.addArgument("closing", "auto", ["auto", "sticky", "close-button"]);
parser.addArgument("delay");
parser.addArgument("mark-inactive", true);
parser.addArgument("class");
parser.addArgument("target", "body");
parser.addArgument("arrow-padding", null);
parser.addArgument("url", null);

// Tippy Lifecycle-hooks
// See: https://tippyjs.bootcss.com/lifecycle-hooks/
// onCreate
// onTrigger
// onShow
// onMount
// onShown
// onUntrigger
// onHide
// onHidden
//
// onBeforeUpdate
// onAfterUpdate
// onDestroy

class Pattern extends BasePattern {
    static name = "tooltip";
    static trigger = ".pat-tooltip, .pat-tooltip-ng";
    static parser = parser;

    tippy = null;

    active_class = "tooltip-active-hover";
    inactive_class = "tooltip-inactive";

    async init() {
        const el = this.el;

        if (window.__patternslib_import_styles) {
            import("tippy.js/dist/tippy.css");
        }
        const Tippy = (await import("tippy.js")).default;
        this.tippy_options = this.parseOptionsForTippy(this.options);

        const defaultProps = {
            animation: false,
            arrow: true,
            //'delay': [0, 1800],
            //'duration': [325, 275],
            hideOnClick: this.options.closing === "close-button" ? false : true,
            ignoreAttributes: true,
            interactive: true,
            onHide: this._onHide.bind(this),
            onShow: this._onShow.bind(this),
            trigger: "click",
        };

        Tippy.setDefaultProps(defaultProps);
        this.tippy = new Tippy(el, this.tippy_options);

        if (this.options.source === "title") {
            // Remove ``title`` attribute when source is set to ``title`` to
            // disable the browser's built-in tooltip feature
            el.removeAttribute("title");
        }

        if (this.options.trigger === "click" && this.options.source === "ajax") {
            // prevent default action for "click" and "mouseenter click"
            events.add_event_listener(
                el,
                "click",
                "pat-tooltip--click-prevent-default",
                (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                }
            );
        }

        if (this.options.trigger === "click") {
            this.active_class = "tooltip-active-click";
        }
        if (this.options.markInactive) {
            // Initially mark as inactive
            el.classList.add(this.inactive_class);
        }
    }

    show() {
        // Show this tooltip
        this.tippy.show();
    }

    async hide() {
        // Hide this tooltip
        await utils.timeout(1); // wait a tick for event being processed by other handlers.
        this.tippy.hide();
    }

    destroy() {
        // Remove this tooltip
        super.destroy(); // Unregister
        this.tippy.destroy();
    }

    parseOptionsForTippy(opts) {
        const placement = (pos) => {
            // note that Cornelis needs the positioning to be the placement of the thingy on the bubble
            // tippy though refers to positioning as the placement of the bubble relatively to the reference element
            // so we invert the meaning below. It's intentional.
            const primary = (pos0) =>
                ({
                    t: "bottom",
                    r: "left",
                    b: "top",
                    l: "right",
                }[pos0]);

            const secondary = (pos1) =>
                ({
                    l: "-start",
                    r: "-end",
                    m: "",
                    t: "-start",
                    b: "-end",
                }[pos1]);

            return `${primary(pos[0])}${secondary(pos[1])}`;
        };

        const tippy_options = { popperOptions: { modifiers: [] } };

        if (opts.arrowPadding !== null) {
            tippy_options.popperOptions.modifiers.push({
                name: "arrow",
                options: {
                    padding: parseInt(opts.arrowPadding, 10),
                },
            });
        }

        const parsers = {
            position: () => {
                if (!opts.position?.list?.length) {
                    return;
                }
                tippy_options.placement = placement(opts.position.list[0]); // main position

                const flip_options = {
                    name: "flip",
                    enabled: true,
                };

                if (opts.position.policy === "force") {
                    flip_options.enabled = false;
                } else if (opts.position.length > 1) {
                    const fallbacks = opts.position.list.slice(1).map(placement);
                    flip_options.fallbackPlacements = fallbacks;
                }

                tippy_options.popperOptions.modifiers.push(flip_options);
            },

            trigger() {
                if (opts.trigger === "hover") {
                    tippy_options.trigger = "mouseenter focus";
                } else if (opts.trigger === "none") {
                    tippy_options.trigger = "manual";
                    tippy_options.hideOnClick = false;
                }
            },

            source: () => {
                let content;
                if (opts.source === "title") {
                    // Tooltip content from title attribute
                    content = this.el.getAttribute("title");
                } else if (opts.source === "content") {
                    // Tooltip content from trigger childs.
                    content = this.el.innerHTML;
                    tippy_options.allowHTML = true;
                } else if (opts.source === "ajax") {
                    // Tooltiop content from AJAX request.
                    content = document.createElement("progress");
                    tippy_options.allowHTML = true;
                }
                tippy_options.content = content;
            },

            delay() {
                if (opts.delay) {
                    tippy_options.delay = [utils.parseTime(opts.delay), 0];
                }
            },

            target: () => {
                if (!opts.target) {
                    return;
                }
                if (opts.target === "parent") {
                    tippy_options.appendTo = "parent";
                } else if (opts.target === "body") {
                    tippy_options.appendTo = document.body;
                } else {
                    tippy_options.appendTo = document.querySelector(opts.target);
                }
            },
        };

        for (let arg in opts) {
            switch (arg) {
                case "ajax-data-type":
                    arg = "ajaxDataType";
                    break;
                case "mark-inactive":
                    arg = "markInactive";
                    break;
            }
            parsers[arg] && parsers[arg](arg);
        }

        return tippy_options;
    }

    _initialize_content() {
        // Initialize any other patterns.
        registry.scan(this.tippy.popper);
    }

    async _onShow() {
        const tippy_classes = [];

        // Group DOM manipulations

        if (this.options.class) {
            tippy_classes.push(...this.options.class.split(" "));
        }

        // Add a generic non-tippy related class to identify the tooltip container
        tippy_classes.push("tooltip-container");

        if (this.options.closing === "close-button") {
            // First, remove previously automatically added close buttons.
            // Otherwise we would end up adding another close button with every
            // click on it.
            for (const close_button of this.tippy.popper.querySelectorAll(
                ".pat-tooltip--close-button"
            )) {
                close_button.remove();
            }

            const close_button = document.createElement("button");
            close_button.setAttribute("class", "close-panel pat-tooltip--close-button");
            const content = this.tippy.popper.querySelector(".tippy-content");
            content.parentNode.insertBefore(close_button, content);
        }

        // Store reference to method for closing panels on the tooltip element instance.
        events.add_event_listener(
            this.tippy.popper,
            "close-panel",
            "pat-tooltip--close-panel",
            () => this.hide()
        );

        this.tippy.popper.classList.add(...tippy_classes);

        if (this.options.markInactive) {
            this.el.classList.remove(this.inactive_class);
            this.el.classList.add(this.active_class);
        }

        if (this.options.closing !== "auto" && this.options.trigger === "hover") {
            // no auto-close when hovering when closing mode is "sticky" or "close-button".
            this.tippy.setProps({ trigger: "click" });
        }

        if (this.options.source === "ajax") {
            await this._get_content();
        }

        // Notify parent patterns about injected content.
        // Do not call pat-inject's handler, because all necessary
        // initialization after injection is done here.
        $(this.tippy.popper).trigger("patterns-injected", [
            { skipPatInjectHandler: true },
            this.el,
            this.tippy.popper,
        ]);

        this._initialize_content();
    }

    _onHide() {
        if (this.options.markInactive) {
            this.el.classList.remove(this.active_class);
            this.el.classList.add(this.inactive_class);
        }

        if (this.options.closing !== "auto" && this.options.trigger === "hover") {
            // re-set hover behavior
            this.tippy.setProps({ trigger: "mouseenter focus" });
        }

        if (this.options.source === "ajax") {
            this.tippy.setContent(document.createElement("progress"));
        }
    }

    async _get_content(url = this.options.url) {
        let selector;
        ({ url, selector } = this.get_url_parts(url || this.el.getAttribute("href")));
        let content;
        if (url) {
            // Tooltip from remote page.
            const handler = this.data_type_handlers[this.options.ajaxDataType];
            try {
                // TODO: use pat-inject, once it supports async
                const response = await fetch(url, {
                    headers: {
                        Accept: "text/html,application/xhtml+xml,application/xml",
                    },
                });
                const text = await response.text();
                content = await handler(text, url, selector);
            } catch {
                log.error("Error on ajax request. ${e}");
            }
        } else if (selector) {
            // Tooltip content from current DOM tree.
            content = document.querySelector(selector);
            content = content?.innerHTML || undefined;
        }
        if (content) {
            this.tippy.setContent(content);
            await utils.timeout(1); // Wait a tick before forceUpdate. Might fail due to unset popperInstance.
            this.tippy.popperInstance.forceUpdate(); // re-position tippy after content is known.
        }
    }

    async get_content(url = this.options.url) {
        // API method: _get_content + _initialize_content
        await this._get_content(url);
        this._initialize_content();
    }

    get_url_parts(href) {
        // Return the URL and a CSS ID selector.
        let url, selector, query;
        if (!href) {
            return { url, selector };
        }
        [url, selector] = href.split("#");
        if (selector) {
            selector = `#${selector}`;
            [selector, query] = selector.split("?");
        }
        if (query) {
            url = `${url}?${query}`;
        }
        return { url, selector };
    }

    static data_type_handlers = {
        html(text, url, selector) {
            let tmp = document.createElement("div");
            tmp.innerHTML = text;
            if (selector) {
                tmp = tmp.querySelector(selector);
            }
            return tmp?.innerHTML || "";
        },

        async markdown(text, url, selector) {
            const Markdown = registry.patterns.markdown;
            if (!Markdown) {
                return text;
            }

            const instance = new Markdown($("<div/>"));
            await events.await_pattern_init(instance);

            const cfg = { url };
            if (selector) {
                cfg.source = selector;
            }

            const ret = await instance.renderForInjection(cfg, text);
            return ret[0];
        },
    };

    static register_type_handler(type, handler) {
        Pattern.data_type_handlers[type] = handler;
    }

    constructor(...args) {
        super(...args);

        this.register_type_handler = this.constructor.register_type_handler;
        this.data_type_handlers = this.constructor.data_type_handlers;
    }
}

registry.register(Pattern);
export default Pattern;
export { Pattern };

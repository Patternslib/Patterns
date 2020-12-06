import "regenerator-runtime/runtime"; // needed for ``await`` support
import $ from "jquery";
import Base from "../../core/base";
import logging from "../../core/logging";
import Parser from "../../core/parser";
import registry from "../../core/registry";
import utils from "../../core/utils";

// Lazy loading modules.
let Tippy;

const log = logging.getLogger("pat-tooltip");

const parser = new Parser("tooltip");
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
parser.addArgument("trigger", "click", ["click", "hover"]);
parser.addArgument("source", "title", ["ajax", "content", "title"]);
parser.addArgument("ajax-data-type", "html", ["html", "markdown"]);
parser.addArgument("closing", "auto", ["auto", "sticky", "close-button"]);
parser.addArgument("delay");
parser.addArgument("mark-inactive", true);
parser.addArgument("class");
parser.addArgument("target", "body");
parser.addArgument("arrow-padding", null);

export default Base.extend({
    name: "tooltip",
    trigger: ".pat-tooltip, .pat-tooltip-ng",

    tippy: null,
    ajax_state: {
        isFetching: false,
        canFetch: true,
    },

    async init($el, opts) {
        const el = this.el;

        Tippy = await import("tippy.js");
        Tippy = Tippy.default;

        this.options = parser.parse(el, opts);
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
            onMount: this._onMount.bind(this),
            trigger: "click",
        };

        Tippy.setDefaultProps(defaultProps);
        this.tippy = new Tippy(el, this.tippy_options);

        if (el.getAttribute("title")) {
            // Remove title attribute to disable browser's built-in tooltip feature
            el.removeAttribute("title");
        }

        if (this.options.markInactive) {
            // Initially mark "inactive"
            el.classList.add("inactive");
        }

        if (
            this.options.trigger === "click" &&
            this.options.source === "ajax"
        ) {
            // prevent default action for "click" and "mouseenter click"
            el.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
            });
        }
    },

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
                    const fallbacks = opts.position.list
                        .slice(1)
                        .map(placement);
                    flip_options.fallbackPlacements = fallbacks;
                }

                tippy_options.popperOptions.modifiers.push(flip_options);
            },

            trigger() {
                if (opts.trigger === "hover") {
                    tippy_options.trigger = "mouseenter focus";
                }
            },

            source: () => {
                let content;
                if (opts.source === "title") {
                    // Tooltip content from title attribute
                    content = this.el.getAttribute("title");
                } else if (opts.source === "content") {
                    // Tooltiop content from trigger child content.
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
                    tippy_options.appendTo = document.querySelector(
                        opts.target
                    );
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
    },

    _initializeContent() {
        // Initialize all .close-panel elements
        const close_els = this.tippy.popper.querySelectorAll(".close-panel");
        const close_buttons = this.tippy.popper.querySelectorAll(
            ".pat-tooltip--close-button"
        );
        for (let close_el of close_els) {
            close_el.addEventListener("click", () => {
                for (let close_button of close_buttons) {
                    // Also remove the close button
                    close_button.parentNode.removeChild(close_button);
                }
                this.tippy.hide();
            });
        }
        // Initialize any other patterns.
        registry.scan(this.tippy.popper);
    },

    async _onMount() {
        if (this.options.source === "ajax") {
            await this._getContent();
        }

        this._initializeContent();

        // Notify parent patterns about injected content.
        // Do not call pat-inject's handler, because all necessary
        // initialization after injection is done here.
        $(this.tippy.popper).trigger("patterns-injected", [
            { skipPatInjectHandler: true },
            this.el,
            this.tippy.popper,
        ]);
    },

    _onShow() {
        if (
            this.options.closing !== "auto" &&
            this.options.trigger === "hover"
        ) {
            // no auto-close when hovering when closing mode is "sticky" or "close-button".
            this.tippy.setProps({ trigger: "click" });
        }

        if (this.options.closing === "close-button") {
            const close_button = document.createElement("button");
            close_button.setAttribute(
                "class",
                "close-panel pat-tooltip--close-button"
            );
            const content = this.tippy.popper.querySelector(".tippy-content");
            content.parentNode.insertBefore(close_button, content);
        }

        if (this.options.markInactive) {
            this.el.classList.remove("inactive");
            this.el.classList.add("active");
        }

        if (this.options.class) {
            for (let class_ of this.options.class.split(" ")) {
                this.tippy.popper.classList.add(class_);
            }
        }

        // Add a generic non-tippy related class to identify the tooltip container
        this.tippy.popper.classList.add("tooltip-container");
    },

    _onHide() {
        if (this.options.markInactive) {
            this.el.classList.remove("active");
            this.el.classList.add("inactive");
        }

        if (
            this.options.closing !== "auto" &&
            this.options.trigger === "hover"
        ) {
            // re-set hover behavior
            this.tippy.setProps({ trigger: "mouseenter focus" });
        }

        if (this.options.source === "ajax") {
            this.tippy.setContent(document.createElement("progress"));
            this.ajax_state.canFetch = true;
        }
    },

    async _getContent() {
        if (this.ajax_state.isFetching || !this.ajax_state.canFetch) {
            return undefined;
        }
        const { url, selector } = this.get_url_parts(
            this.el.getAttribute("href")
        );
        let content;
        if (url) {
            // Tooltip from remote page.
            this.ajax_state = {
                isFetching: true,
                canFetch: false,
            };
            const handler = this._ajaxDataTypeHandlers[
                this.options.ajaxDataType
            ];
            try {
                // TODO: use pat-inject, once it supports async
                const response = await fetch(url);
                const text = await response.text();
                content = await handler(text, url, selector);
            } catch (e) {
                log.error(`Error on ajax request ${e}`);
            }
            this.ajax_state.isFetching = false;
        } else if (selector) {
            // Tooltip content from current DOM tree.
            content = document.querySelector(selector);
            content = content?.innerHTML || undefined;
        }
        if (content) {
            this.tippy.setContent(content);
            this.tippy.popperInstance.forceUpdate(); // re-position tippy after content is known.
        }
    },

    get_url_parts(href) {
        // Return the URL and a CSS ID selector.
        let url, selector;
        if (!href) {
            return { url, selector };
        }
        url = href.split("#")[0] || undefined;
        selector = href.split("#")[1] || undefined;
        selector = selector ? `#${selector}` : undefined;
        return { url, selector };
    },

    _ajaxDataTypeHandlers: {
        html(text, url, selector) {
            let tmp = document.createElement("div");
            tmp.innerHTML = text;
            if (selector) {
                tmp = tmp.querySelector(selector);
            }
            return tmp?.innerHTML || "";
        },

        async markdown(text, url, selector) {
            const pat_markdown = await import("../markdown/markdown");
            const pat = pat_markdown.default.init($("<div/>"));
            const cfg = { url };
            if (selector) {
                cfg.source = selector;
            }
            const ret = await pat.renderForInjection(cfg, text);
            return ret[0];
        },
    },
});

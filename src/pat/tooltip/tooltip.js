import "../inject/inject"; // Register ``patterns-injected`` event handler
import "regenerator-runtime/runtime"; // needed for ``await`` support
import $ from "jquery";
import Base from "../../core/base";
import logging from "../../core/logging";
import Parser from "../../core/parser";
import pat_markdown from "../markdown/markdown";
import registry from "../../core/registry";
import tippy from "tippy.js";
import utils from "../../core/utils";

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

export default Base.extend({
    name: "tooltip",
    trigger: ".pat-tooltip, .pat-tooltip-ng",

    jquery_plugin: true,

    tippy: null,

    ajax_state: {
        isFetching: false,
        canFetch: true,
    },

    init(el, opts) {
        if (el.jquery) {
            el = el[0];
        }
        this.el = el;
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

        tippy.setDefaultProps(defaultProps);
        this.tippy = tippy(el, this.tippy_options);

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

        const tippy_options = {};

        const parsers = {
            position: () => {
                if (!opts.position?.list?.length) {
                    return;
                }
                tippy_options.placement = placement(opts.position.list[0]); // main position

                if (opts.position.policy !== "force") {
                    tippy_options.popperOptions = {
                        modifiers: [
                            {
                                name: "flip",
                                enabled: true,
                            },
                        ],
                    };
                    if (opts.position.length > 1) {
                        const fallbacks = opts.position.list
                            .slice(1)
                            .map(placement);
                        tippy_options.popperOptions.modifiers[0].options = {
                            fallbackPlacements: fallbacks,
                        };
                    }
                } else {
                    tippy_options.popperOptions = {
                        modifiers: [
                            {
                                name: "flip",
                                enabled: false,
                            },
                        ],
                    };
                }
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

    _onMount() {
        // Notify parent patterns about injected content.
        // Do not call pat-inject's handler, because all necessary
        // initialization after injection is done here.
        $(this.tippy.popper).trigger("patterns-injected", [
            { skipPatInjectHandler: true },
            this.el,
            this.tippy.popper,
        ]);
    },

    async _onShow() {
        if (
            this.options.closing !== "auto" &&
            this.options.trigger === "hover"
        ) {
            // no auto-close when hovering when closing mode is "sticky" or "close-button".
            this.tippy.setProps({ trigger: "click" });
        }

        if (this.options.source === "ajax") {
            await this._getContent();
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

        this._initializeContent();
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
        const { url, selector, modifier } = this.get_url_parts(
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
                content = handler(text, url, selector, modifier);
            } catch (e) {
                log.error(`Error on ajax request ${e}`);
            }
            this.ajax_state.isFetching = false;
        } else if (selector) {
            // Tooltip content from current DOM tree.
            content = document.querySelector(selector);
            content = content ? content[modifier] : undefined;
        }
        if (content) {
            this.tippy.setContent(content);
        }
    },

    get_url_parts(href) {
        // Return the URL, a CSS ID selector and a DOM query modifier.
        // The modifier is a as defined in pat-inject:
        // ::element selects the element itself and not it's children.
        let url, selector, modifier;
        if (!href) {
            return { url, selector, modifier };
        }
        url = (href.split("#")[0] || "").split("::")[0] || undefined;
        selector = (href.split("#")[1] || "").split("::")[0] || undefined;
        selector = selector ? `#${selector}` : undefined;
        modifier = (href.split("#")[1] || "").split("::")[1] || undefined;
        modifier = modifier === "element" ? "outerHTML" : "innerHTML";
        return { url, selector, modifier };
    },

    _ajaxDataTypeHandlers: {
        html(text, url, selector, modifier) {
            const tmp = document.createElement("div");
            tmp.innerHTML = text;
            if (selector) {
                const el = tmp.querySelector(selector);
                return el ? el[modifier] : "";
            }
            return tmp.innerHTML;
        },

        // eslint-disable-next-line no-unused-vars
        markdown(text, url, selector, modifier) {
            const pat = pat_markdown.init($("<div/>"));
            const cfg = { url };
            if (selector) {
                cfg.source = selector;
            }
            return pat.renderForInjection(cfg, text)[0];
        },
    },
});

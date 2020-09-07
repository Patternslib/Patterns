import $ from "jquery";
import _ from "underscore";
import Base from "../../core/base";
import logging from "../../core/logging";
import Parser from "../../core/parser";
import pat_markdown from "../markdown/markdown";
import registry from "../../core/registry";
import tippy from "tippy.js";
import utils from "../../core/utils";

let start = 0;
const log = logging.getLogger("pat-tooltip-ng");
const timelog = (msg) => {
    log.debug(`${Date.now() - start} ${msg}`);
};
log.setLevel(20);
timelog("Initializing pat-tooltip-ng");

const parser = new Parser("tooltip-ng");
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
parser.addArgument("source", "title", [
    "auto",
    "ajax",
    "content",
    "content-html",
    "title",
]);
parser.addArgument("ajax-data-type", "html", ["html", "markdown"]);
parser.addArgument("delay");
parser.addArgument("mark-inactive", true);
parser.addArgument("class");
parser.addArgument("target", "body");

parser.addArgument("height", "auto", ["auto", "max"]);
parser.addArgument("closing", "auto", ["auto", "sticky", "close-button"]);
parser.addArgument("distance");

export default Base.extend({
    name: "tooltip-ng",
    trigger: ".pat-tooltip-ng",

    jquery_plugin: true,

    tippy: null,

    init(el, opts, debuglevel = 20) {
        if (el.jquery) {
            el = el[0];
        }
        this.el = el;

        log.setLevel(debuglevel);
        start = Date.now();

        const defaultProps = {
            animation: false,
            arrow: true,
            //'delay': [0, 1800],
            //'duration': [325, 275],
            distance: 20,
            flipOnUpdate: true,
            hideOnClick: true,
            ignoreAttributes: true,
            interactive: false,
            onHide: this._onHide.bind(this),
            onMount: this._onMount.bind(this),
            onShow: this._onShow.bind(this),
            trigger: "click",
            boundary: "viewport",
        };

        this.options = parser.parse(el, opts);
        this.tippy_options = this.parseOptionsForTippy(this.options);

        tippy.setDefaults(defaultProps);
        this.tippy = tippy(el, this.tippy_options);

        if (el.getAttribute("title")) {
            // Remove title attribute to disable browser's built-in tooltip feature
            el.removeAttribute("title");
        }

        if (this.options.markInactive) {
            // Initially mark "inactive"
            el.classList.add("inactive");
        }

        if (this.options.class) {
            this.el.addEventListener("pat-tippy-mount", (event) => {
                event.detail.tooltip.classList.add(this.options.class);
            });
        }

        if (this.options.trigger === "click") {
            // prevent default action for "click" and "mouseenter click"
            el.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
            });
        }
    },

    parseOptionsForTippy(opts) {
        const notImplemented = (name) => {
            log.error(`${name} not implemented`);
        };
        const placement = (pos) => {
            // note that Cornelis needs the positioning to be the placement of the thingy on the bubble
            // tippy though refers to positioning as the placement of the bubble relatively to the reference element
            // so we invert the meaning below. It's intentional.
            const primary = (pos) =>
                ({
                    t: "bottom",
                    r: "left",
                    b: "top",
                    l: "right",
                }[pos]);

            const secondary = (pos) =>
                ({
                    l: "-start",
                    r: "-end",
                    m: "",
                    t: "-start",
                    b: "-end",
                }[pos]);

            return `${primary(pos[0])}${secondary(pos[1])}`;
        };
        const flipBehavior = (pos) => placement(`${pos[0]}m`);

        const tippy_options = {};

        const parsers = {
            position: () => {
                if (opts.position) {
                    const prefs = opts.position.list;
                    if (prefs.length > 0) {
                        const pos = prefs[0];
                        tippy_options.placement = placement(pos);

                        if (prefs.length > 1) {
                            tippy_options.flipBehavior = prefs.map(
                                flipBehavior
                            );
                            tippy_options.flip = true;
                            tippy_options.flipOnUpdate = true;
                        }
                    }
                    if (opts.position.policy === "force") {
                        tippy_options.flip = false;
                        tippy_options.flipOnUpdate = false;
                    }
                }
            },

            height: notImplemented,

            trigger() {
                if (opts.trigger === "hover") {
                    tippy_options.trigger = "mouseenter focus";
                }
            },

            closing: notImplemented,

            source: () => {
                if (opts.source === "auto") {
                    const href = this.el.getAttribute("href");
                    if (typeof href !== "string") {
                        log.error(
                            `href must be specified if 'source' is set to 'auto'`
                        );
                        return;
                    }
                    if (href.indexOf("#") === 0) {
                        opts.source = "content";
                    } else {
                        opts.source = "ajax";
                    }
                }
                let content;
                if (opts.source === "title") {
                    // Tooltip content from title attribute
                    content = this.el.getAttribute("title");
                }
                if (opts.source === "content") {
                    // Tooltip content from current DOM tree.
                    content = document.createElement("div");
                    tippy_options.allowHTML = true;
                    const href = this.el.getAttribute("href");
                    const is_string = typeof href === "string";
                    const has_hash = href.indexOf("#") !== -1;
                    const has_more = href.length > 1;
                    if (is_string && has_hash && has_more) {
                        content.innerHTML = document.querySelector(
                            "#" + href.split("#")[1]
                        ).innerHTML;
                    } else {
                        content.innerHTML = this.el.innerHTML;
                    }
                    registry.scan(content.innerHTML); // TODO: this won't work...
                }
                if (opts.source === "ajax") {
                    // Tooltiop content from AJAX request.
                    content = document.createElement("progress");
                    tippy_options.allowHTML = true;
                    tippy_options.onShow = this._onAjax();
                    tippy_options.onHidden = (instance) => {
                        timelog("ONAJAXHIDDEN");
                        instance.setContent(content);
                        instance.state.ajax.canFetch = true;
                    };
                }
                tippy_options.content = content;
            },

            delay() {
                if (opts.delay) {
                    tippy_options.delay = [utils.parseTime(opts.delay), 0];
                }
            },

            distance() {
                if (opts.distance) {
                    tippy_options.distance = [parseInt(opts.distance), 20];
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
            log.debug(arg);
            parsers[arg] && parsers[arg](arg);
        }

        return tippy_options;
    },

    _onMount() {
        timelog("ONMOUNT");
        this.el.dispatchEvent(
            new CustomEvent("pat-tippy-mount", {
                detail: { tooltip: this.tippy.popperChildren.tooltip },
            })
        );
    },

    _onShow() {
        timelog("ONSHOW");
        if (this.options.markInactive) {
            this.el.classList.remove("inactive");
            this.el.classList.add("active");
        }
    },

    _onHide() {
        timelog("ONHIDE");
        if (this.options.markInactive) {
            this.el.classList.remove("active");
            this.el.classList.add("inactive");
        }
    },

    _onAjax() {
        timelog("OnAJAX");
        const source = this.el.getAttribute("href").split("#");
        return (instance) => {
            timelog("in ajax content function");
            timelog(
                `instance.state.ajax ${JSON.stringify(instance.state.ajax)}`
            );
            if (instance.state.ajax === undefined) {
                instance.state.ajax = {
                    isFetching: false,
                    canFetch: true,
                };
            }

            if (
                instance.state.ajax.isFetching ||
                !instance.state.ajax.canFetch
            ) {
                return this._onAjaxBypass();
            }

            instance.state.ajax = {
                isFetching: true,
                canFetch: false,
            };
            this._onAjaxCallback(instance, source);
        };
    },

    _onAjaxCallback(instance, src) {
        timelog("AJAXCALLBACK");
        const handler = this._ajaxDataTypeHandlers[this.options.ajaxDataType];
        fetch(src[0]).then((response) => {
            return response
                .text()
                .then((text) => {
                    instance.setContent(handler(text, src));
                })
                .finally(() => {
                    this._onAjaxContentSet(instance);
                    registry.scan(instance.popper);
                });
        });
    },

    _onAjaxBypass() {
        timelog("AJAX BYPASSED");
        return undefined;
    },

    _onAjaxContentSet(instance) {
        timelog("AJAXCONTENTSET");
        instance.state.ajax.isFetching = false;
    },

    _ajaxDataTypeHandlers: {
        html(text, src) {
            const tmp = document.createElement("div");
            tmp.innerHTML = text;
            if (src[1]) {
                return tmp.querySelector(`#${src[1]}`)?.innerHTML || "";
            }
            return tmp.innerHTML;
        },

        markdown(text, src) {
            const pat = pat_markdown.init($("<div/>"));
            const [url, source] = src;
            const cfg = { url };
            if (source) {
                cfg.source = `#${source}`;
            }
            return pat.renderForInjection(cfg, text)[0];
        },
    },
});

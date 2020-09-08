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
parser.addArgument("distance");
parser.addArgument("mark-inactive", true);
parser.addArgument("class");
parser.addArgument("target", "body");

export default Base.extend({
    name: "tooltip-ng",
    trigger: ".pat-tooltip-ng",

    jquery_plugin: true,

    tippy: null,

    init($el, opts, debuglevel = 20) {
        log.setLevel(debuglevel);

        const defaultProps = {
            allowHTML: true,
            animation: false,
            arrow: true,
            //'delay': [0, 1800],
            //'duration': [325, 275],
            distance: 20,
            flipOnUpdate: true,
            hideOnClick: true,
            ignoreAttributes: true,
            interactive: false,
            onHidden: this._onHidden.bind(this),
            onHide: this._onHide.bind(this),
            onMount: this._onMount.bind(this),
            onShow: this._onShow.bind(this),
            onShown: this._onShown.bind(this),
            onTrigger: this._onTrigger.bind(this),
            trigger: "click",
            boundary: "viewport",
        };

        start = Date.now();

        tippy.setDefaults(defaultProps);
        this.options = parser.parse($el, opts);

        $el.data("patterns.tooltip-ng", _.clone(this.options)).on(
            "destroy.pat-tooltip-ng",
            this._onDestroy.bind(this)
        );

        this.options = this.parseOptionsForTippy(this.options, $el);
        this.tippy = tippy($el[0], this.options);
        this.setupShowEvents($el);
    },

    _returnBody: function _returnBody(args) {
        return document.body;
    },

    parseOptionsForTippy(opts, $trigger) {
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
        const parsers = {
            position: () => {
                if (opts.hasOwnProperty("position")) {
                    const prefs = opts.position.list;
                    if (prefs.length > 0) {
                        const pos = prefs[0];
                        opts.placement = placement(pos);

                        if (prefs.length > 1) {
                            opts.flipBehavior = prefs.map(flipBehavior);
                            opts.flip = true;
                            opts.flipOnUpdate = true;
                        }
                    }
                    if (opts.position.policy === "force") {
                        opts.flip = false;
                        opts.flipOnUpdate = false;
                    }
                    delete opts.position;
                }
            },

            height: notImplemented,

            trigger() {
                if (opts.trigger === "hover") {
                    opts.trigger = "mouseenter focus";
                }
            },

            closing: notImplemented,

            source: () => {
                if (opts.hasOwnProperty("source")) {
                    if (opts.source === "title") {
                        opts.content = $trigger.attr("title");
                    }
                    if (opts.source === "auto") {
                        const href = $trigger.attr("href");
                        if (typeof href !== "string") {
                            log.error(
                                `href must be specified if 'source' is set to 'auto'`
                            );
                            return;
                        }
                        if (href.indexOf("#") === 0) {
                            this._setSource(opts, "content");
                        } else {
                            this._setSource(opts, "ajax");
                        }
                    }
                    if (opts.source === "content") {
                        const href = $trigger.attr("href"),
                            is_string = typeof href === "string",
                            has_hash = href.indexOf("#") !== -1,
                            has_more = href.length > 1;
                        let $content;

                        if (is_string && has_hash && has_more) {
                            $content = $("#" + href.split("#")[1])
                                .children()
                                .clone();
                        } else {
                            $content = $trigger.children().clone();
                            if (!$content.length) {
                                $content = $("<p/>").text($trigger.text());
                            }
                        }
                        opts.content = $content[0];
                        registry.scan($content[0]);
                    }
                    if (opts.source === "ajax") {
                        const $p = $("<progress/>")[0];

                        opts.content = $p;
                        opts.onShow = this._onAjax($trigger);
                        opts.onHidden = (instance) => {
                            timelog("ONAJAXHIDDEN");
                            instance.setContent($p);
                            instance.state.ajax.canFetch = true;
                        };
                    }
                    delete opts.source;
                }
            },

            ajaxDataType() {
                delete opts.ajaxDataType;
            },

            delay() {
                if (opts.hasOwnProperty("delay")) {
                    opts.delay = [utils.parseTime(opts.delay), 0];
                }
            },

            distance() {
                if (opts.hasOwnProperty("distance")) {
                    opts.distance = [parseInt(opts.distance), 20];
                }
            },

            markInactive() {
                if (opts.markInactive) {
                    $trigger.addClass("inactive");
                }
                delete opts.markInactive;
            },

            class: () => {
                if (opts.hasOwnProperty("class")) {
                    const klass = opts.class,
                        handler = this._addClassHandler(klass);

                    $trigger.on("pat-tippy-mount", handler);
                    delete opts.class;
                }
            },

            target: () => {
                if (opts.hasOwnProperty("target")) {
                    if (opts.target === "parent") {
                        opts.appendTo = "parent";
                    } else if (opts.target !== "body") {
                        opts.appendTo = $(opts.target)[0];
                    } else {
                        opts.appendTo = this._returnBody;
                    }

                    delete opts.target;
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
            parsers[arg](arg);
        }

        if ($trigger.attr("title")) {
            $trigger.removeAttr("title");
        }

        return opts;
    },

    setupShowEvents($trigger) {
        $trigger.on("click.pat-tooltip-ng", this.blockDefault);
    },

    removeShowEvents($trigger) {},

    setupHideEvents($trigger) {
        $trigger.on("click.pat-tooltip-ng", this.blockdefault);
    },

    removeHideEvents($trigger) {},

    blockDefault(event) {
        if (event.preventDefault) {
            event.preventDefault();
            event.stopPropagation();
        }
    },

    _addClassHandler(klass) {
        return (event, tooltip) => {
            $(tooltip).addClass(klass);
        };
    },

    _setSource(opts, source) {
        opts.source = source;
    },

    _onDestroy(event) {
        timelog("ONDESTROY");
        this.tippy?.destroy();
    },

    _onClick(instance, event) {
        timelog("ONCLICK");
        if (event.type === "click") {
            timelog(`it's click`);
            event.stopPropagation();
            event.preventDefault();
        }
    },

    _onTrigger(instance, event) {
        timelog("ONTRIGGER");
    },

    _onMount(instance) {
        timelog("ONMOUNT");
        $(instance.reference).trigger(
            "pat-tippy-mount",
            instance.popperChildren.tooltip
        );
    },

    _onShow(instance) {
        timelog("ONSHOW");
    },

    _onShown(instance) {
        timelog("ONSHOWN");
        const $trigger = $(instance.reference);
        const options = $trigger.data("patterns.tooltip-ng");
        this.removeShowEvents($trigger);
        this.setupHideEvents($trigger);
        if (options.markInactive) {
            $trigger.removeClass("inactive").addClass("active");
        }
    },

    _onHide(instance) {
        timelog("ONHIDE");
        const $trigger = $(instance.reference);
        this.removeHideEvents($trigger);
        this.setupShowEvents($trigger);
    },

    _onHidden(instance) {
        timelog("ONHIDDEN");
        const $trigger = $(instance.reference);
        const options = $trigger.data("patterns.tooltip-ng");
        if (options.markInactive) {
            $trigger.removeClass("active").addClass("inactive");
        }
    },

    _onAjax($trigger) {
        timelog("OnAJAX");
        const source = $trigger.attr("href").split("#");
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
        const $trigger = $(instance.reference),
            options = $trigger.data("patterns.tooltip-ng"),
            handler = this._ajaxDataTypeHandlers[options.ajaxDataType];
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
            const $tmp = $("<div/>").append($.parseHTML(text));
            return $tmp.find("#".concat(src[1])).prop("innerHTML");
        },

        markdown(text, src) {
            const [url, source] = src,
                cfg = { url, source: `#${source}` },
                pat = pat_markdown.init($("<div/>"));
            return pat.renderForInjection(cfg, text)[0];
        },
    },
});

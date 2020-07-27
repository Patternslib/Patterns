/**
 * Patterns notification - Display (self-healing) notifications.
 *
 * Copyright 2013 Marko Durkovic
 */
import $ from "jquery";
import Base from "../../core/base";
import inject from "../inject/inject";
import logging from "../../core/logging";
import Parser from "../../core/parser";

var log = logging.getLogger("notification"),
    parser = new Parser("notification");

parser.addArgument("type", "static", ["static", "banner"]);
parser.addArgument("healing", "5s");
parser.addArgument("controls", "icons", ["icons", "buttons", "none"]);
parser.addArgument("class");
parser.addArgument("close-text", "Close");

export default Base.extend({
    name: "notification",
    trigger: ".pat-notification",

    // this is generic functionality and should be moved to lib
    parseUnit(value, unit) {
        var unitRe = new RegExp(unit + "$"),
            numericRe = new RegExp("^[0-9.]+");

        if (!unitRe.test(value)) {
            throw "value " + value + "is not in unit " + unit;
        }

        var mod = value.replace(numericRe, "");
        mod = mod.replace(unitRe, "");

        value = parseFloat(value);
        if (!mod.length) {
            return value;
        }

        var factors = {
            M: 1000000,
            k: 1000,
            m: 0.001,
            u: 0.000001,
        };

        return value * factors[mod];
    },

    parseUnitOrOption(value, unit, options) {
        if (options.indexOf(value) >= 0) {
            return value;
        }

        return this.parseUnit(value, unit);
    },

    count: 0,

    init($el, opts) {
        if ($el.is("a,form")) {
            this._init_inject($el, opts);
        } else {
            this._initNotification($el, opts);
        }
    },

    _initNotification($el, opts) {
        this.count++;

        var options = parser.parse($el, opts);
        var closetext = options.closeText;

        $el = $el
            .wrap("<div/>")
            .parent()
            .attr("id", "pat-notification-" + this.count)
            .addClass("pat-notification-panel")
            .on("mouseenter.pat-notification", this.onMouseEnter.bind(this))
            .on("mouseleave.pat-notification", this.onMouseLeave.bind(this));

        if (options["class"]) {
            $el.addClass(options["class"]);
        }

        if (!Array.isArray(options.controls)) {
            options.controls = [options.controls];
        }

        // add close icon if requested
        if (options.controls.indexOf("icons") >= 0) {
            $el.append(
                "<button type='button' class='close-panel'>" +
                    closetext +
                    "</button>"
            );
        }

        // add close button if requested
        if (options.controls.indexOf("buttons") >= 0) {
            $el.append(
                "<div class='button-bar'><button type='button' class='close-panel'>" +
                    closetext +
                    "</button></div>"
            );
        }

        if ($el.find(".close-panel").length) {
            $el.on(
                "click.pat-notification",
                ".close-panel",
                this.onClick.bind(this)
            );
        } else {
            $el.on("click.pat-notification", this.onClick.bind(this));
        }

        if (options.type === "banner") {
            var $container = $("#pat-notification-banners");
            if (!$container.length) {
                $container = $("<div/>")
                    .attr("id", "pat-notification-banners")
                    .addClass("pat-notification-container")
                    .appendTo("body");
            }
            $container.append($el);
        }

        var healing = this.parseUnitOrOption(options.healing, "s", [
            "persistent",
        ]);

        log.debug("Healing value is", healing);
        $el.data("healing", healing);

        $el.animate({ opacity: 1 }, "fast", () => {
            this.initRemoveTimer($el);
        });
    },

    _init_inject($el) {
        var inject_opts = {
            target: "#pat-notification-temp",
        };
        $el.on("pat-inject-success.pat-notification", (e) => {
            var $trigger = $(e.target),
                cfg = parser.parse($trigger, { type: "banner" });

            var $el = $("#pat-notification-temp")
                .contents()
                .wrapAll("<div/>")
                .parent()
                .addClass("pat-notification");

            if ($trigger.is("a")) {
                $trigger.after($el);
            } else {
                $el.prependTo($trigger);
            }
            this._initNotification($el, cfg);

            // XXX: Do this later as inject tries to access its target afterwards.
            // This should be fixed in injection.
            setTimeout(() => {
                $("#pat-notification-temp").remove();
            }, 0);
        });
        inject.init($el, inject_opts);
    },

    initRemoveTimer($el) {
        var healing = $el.data("healing");
        if (healing !== "persistent") {
            clearTimeout($el.data("timer"));
            $el.data(
                "timer",
                setTimeout(() => {
                    this.remove($el);
                }, healing * 1000)
            );
        }
    },

    onMouseEnter(e) {
        $(e.target).data("persistent", true);
    },

    onMouseLeave(e) {
        var $this = $(e.target);

        $this.data("persistent", false);
        this.initRemoveTimer($this);
    },

    onClick(e) {
        var $this = $(e.delegateTarget);

        $this.data("persistent", false);
        this.remove($this);
    },

    remove($el) {
        if ($el.data("persistent") || $el.data("removing")) {
            return;
        }

        $el.data("removing", true);

        $el.stop(true).animate(
            { opacity: 0 },
            {
                step() {
                    if ($el.data("persistent")) {
                        // remove the timer and show notification
                        clearTimeout($el.data("timer"));
                        $el.stop(true).animate({ opacity: 1 });
                        $el.data("removing", false);
                        return false;
                    }
                },

                complete() {
                    var $this = $(this);
                    $this.off(".pat-notification");
                    $this.slideUp("slow", () => {
                        $this.remove();
                    });
                },
            }
        );
    },
});

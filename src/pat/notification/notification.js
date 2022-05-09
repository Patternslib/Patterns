// Patterns notification - Display (self-healing) notifications.
import $ from "jquery";
import Base from "../../core/base";
import dom from "../../core/dom";
import events from "../../core/events";
import inject from "../inject/inject";
import logging from "../../core/logging";
import Parser from "../../core/parser";
import utils from "../../core/utils";

const log = logging.getLogger("notification");
//log.setLevel(logging.Level.DEBUG);

export const parser = new Parser("notification");
parser.addArgument("type", "static", ["static", "banner"]);
parser.addArgument("healing", "5s");
parser.addArgument("controls", "icons", ["icons", "buttons", "none"]);
parser.addArgument("class");
parser.addArgument("close-text", "Close");

export default Base.extend({
    name: "notification",
    trigger: ".pat-notification",
    count: 0,

    init($el, opts) {
        if (this.el.matches("a, form")) {
            this._init_inject($el, opts);
        } else {
            this._init_notification($el, opts);
        }
    },

    _init_notification($el, opts) {
        this.count++;

        const el = $el[0];
        const options = parser.parse($el, opts);
        const closetext = options.closeText;

        const wrapper = document.createElement("div");
        wrapper.setAttribute("id", `pat-notification-${this.count}`);
        wrapper.setAttribute("class", "pat-notification-panel");
        dom.wrap(el, wrapper);

        events.add_event_listener(
            wrapper,
            "mouseenter",
            "notification__mouseenter",
            this.onMouseEnter.bind(this)
        );
        events.add_event_listener(
            wrapper,
            "mouseleave",
            "notification__mouseleave",
            this.onMouseLeave.bind(this)
        );

        if (options["class"]) {
            wrapper.classList.add(options["class"]);
        }

        if (!Array.isArray(options.controls)) {
            options.controls = [options.controls];
        }

        // add close icon if requested
        if (options.controls.indexOf("icons") >= 0) {
            wrapper.append(
                dom.create_from_string(
                    `<button type="button" class="close-panel">${closetext}</button>`
                )
            );
        }

        // add close button if requested
        if (options.controls.indexOf("buttons") >= 0) {
            wrapper.append(
                dom.create_from_string(
                    `<div class="button-bar">
                    <button type="button" class="close-panel">${closetext}</button>
                </div>`
                )
            );
        }

        if (wrapper.querySelector(".close-panel")) {
            events.add_event_listener(
                wrapper.querySelector(".close-panel"),
                "click",
                "notification__click",
                this.onClick.bind(this)
            );
        } else {
            events.add_event_listener(
                wrapper,
                "click",
                "notification__click",
                this.onClick.bind(this)
            );
        }

        if (options.type === "banner") {
            let container = document.querySelector("#pat-notification-banners");
            if (!container) {
                container = document.createElement("div");
                container.setAttribute("id", "pat-notification-banners");
                container.setAttribute("class", "pat-notification-container");
                document.body.append(container);
            }
            container.append(wrapper);
        }

        let healing = options.healing;
        if (healing !== "persistent") {
            healing = utils.parseTime(healing);
        }

        log.debug(`Healing value is: ${healing}`);
        dom.set_data(wrapper, "healing", healing);

        $el.animate({ opacity: 1 }, "fast", () => {
            this.init_remove_timer(wrapper);
        });
    },

    _init_inject($el) {
        $el[0].addEventListener("pat-inject-success", (e) => {
            const $trigger = $(e.target);
            const cfg = parser.parse($trigger, { type: "banner" });

            const $temp = $("#pat-notification-temp")
                .contents()
                .wrapAll("<div/>")
                .parent()
                .addClass("pat-notification");

            if ($trigger.is("a")) {
                $trigger.after($temp);
            } else {
                $temp.prependTo($trigger);
            }
            this._init_notification($temp, cfg);

            // XXX: Do this later as inject tries to access its target afterwards.
            // This should be fixed in injection.
            setTimeout(() => {
                $("#pat-notification-temp").remove();
            }, 0);
        });
        inject.init($el, {
            target: "#pat-notification-temp",
        });
    },

    init_remove_timer(panel) {
        const healing = dom.get_data(panel, "healing");
        if (healing !== "persistent") {
            clearTimeout(dom.get_data(panel, "timer"));
            dom.set_data(
                panel,
                "timer",
                setTimeout(() => {
                    log.debug("Timeout reached.");
                    this.remove(panel);
                }, healing)
            );
        }
    },

    onMouseEnter(e) {
        dom.set_data(e.target, "persistent", true);
    },

    onMouseLeave(e) {
        const panel = e.target;
        dom.set_data(panel, "persistent", false);
        this.init_remove_timer(panel);
    },

    onClick(e) {
        const panel = e.target.closest(".pat-notification-panel");
        dom.set_data(panel, "persistent", false);
        this.remove(panel);
    },

    remove(panel) {
        if (
            dom.get_data(panel, "persistent") === true ||
            dom.get_data(panel, "removing") === true
        ) {
            return;
        }
        const $panel = $(panel);

        dom.set_data(panel, "removing", true);

        $panel.stop(true).animate(
            { opacity: 0 },
            {
                step() {
                    if (dom.get_data(panel, "persistent") === true) {
                        // remove the timer and show notification
                        clearTimeout(dom.get_data(panel, "timer"));
                        $panel.stop(true).animate({ opacity: 1 });
                        dom.set_data(panel, "removing", false);
                        return false;
                    }
                },

                complete() {
                    $panel.off(".pat-notification");
                    $panel.slideUp("slow", () => {
                        $panel.remove();
                    });
                },
            }
        );
    },
});

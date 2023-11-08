import "../../core/jquery-ext";
import $ from "jquery";
import Base from "../../core/base";
import events from "../../core/events";
import input_change_events from "../../lib/input-change-events";
import logging from "../../core/logging";
import Parser from "../../core/parser";
import utils from "../../core/utils";

const log = logging.getLogger("autosubmit");

export const parser = new Parser("autosubmit");
// - 400ms -> 400
// - 400 -> 400
// - defocus
parser.addArgument("delay", "400ms");

export default Base.extend({
    name: "autosubmit",
    trigger: ".pat-autosubmit, .pat-auto-submit",

    init() {
        this.options = parser.parse(this.el, this.options);
        if (this.options.delay !== "defocus") {
            this.options.delay = parseInt(this.options.delay.replace(/[^\d]*/g, ""), 10);
        }

        input_change_events.setup(this.$el, "autosubmit");
        this.registerListeners();
        this.registerTriggers();
    },

    registerListeners() {
        events.add_event_listener(
            this.el,
            "input-change-delayed",
            "pat-autosubmit--input-change-delayed",
            this.onInputChange.bind(this)
        );
        this.registerSubformListeners();
        this.$el.on("patterns-injected", this.refreshListeners.bind(this));
        this.$el.on("pat-update", (e, data) => {
            // Refresh on some pat-update events.
            if (
                (data?.pattern === "clone" && data?.action === "removed") ||
                data?.pattern === "sortable"
            ) {
                // Directly submit when removing a clone or changing the sorting.
                this.el.dispatchEvent(events.submit_event());
                log.debug(
                    `triggered by pat-update, pattern: ${data.pattern}, action: ${data.action}`
                );
            } else if (data?.pattern === "clone") {
                // Refresh listeners on cloning.
                this.refreshListeners(e, null, null, data.dom);
            }
        });
    },

    registerSubformListeners(ev) {
        /* If there are subforms, we need to listen on them as well, so
         * that only the subform gets submitted if an element inside it
         * changes.
         */
        const el = typeof ev !== "undefined" ? ev.target : this.el;

        // get all subforms whice are not yet auto submit forms.
        const subforms = el.querySelectorAll(
            ".pat-subform:not(.pat-autosubmit):not(.pat-auto-submit)"
        );
        for (const subform of subforms) {
            // register autosubmit on subform
            events.add_event_listener(
                subform,
                "input-change-delayed",
                "pat-autosubmit--input-change-delayed",
                this.onInputChange.bind(this)
            );
        }
    },

    refreshListeners(ev, cfg, el, injected) {
        this.registerSubformListeners();
        // Register change event handlers for new inputs injected into this form
        input_change_events.setup($(injected), "autosubmit");
    },

    registerTriggers() {
        const isText = this.$el.is("input:text, input[type=search], textarea");
        if (this.options.delay === "defocus" && !isText) {
            log.error(
                "The defocus delay value makes only sense on text input elements."
            );
            return this.$el;
        }

        function trigger_event(ev) {
            if (ev.target.closest(".pat-autosubmit") !== this) {
                return;
            }
            ev.target.dispatchEvent(events.generic_event("input-change-delayed"));
        }
        if (this.options.delay === "defocus") {
            this.$el.on("input-defocus.pat-autosubmit", trigger_event);
        } else if (this.options.delay > 0) {
            this.$el.on(
                "input-change.pat-autosubmit",
                utils.debounce(trigger_event, this.options.delay)
            );
        } else {
            this.$el.on("input-change.pat-autosubmit", trigger_event);
        }
    },

    destroy($el) {
        input_change_events.remove($el, "autosubmit");
        if (this.$el.is("form")) {
            this.$el
                .find(".pat-subform")
                .addBack(this.$el)
                .each((idx, el) => {
                    $(el).off(".pat-autosubmit");
                });
        } else {
            $el.off(".pat-autosubmit");
        }
    },

    onInputChange(e) {
        e.stopPropagation();
        this.el.dispatchEvent(events.submit_event({ submitter: e.target }));
        log.debug("triggered by " + e.type);
    },
});

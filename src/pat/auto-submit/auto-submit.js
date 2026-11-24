import "../../core/jquery-ext";
import Base from "../../core/base";
import dom from "../../core/dom";
import events from "../../core/events";
import input_change_events from "../../lib/input-change-events";
import logging from "../../core/logging";
import Parser from "../../core/parser";
import utils from "../../core/utils";

const log = logging.getLogger("autosubmit");
const trigger = ".pat-autosubmit, .pat-auto-submit";

export const parser = new Parser("autosubmit");
// - 400ms -> 400
// - 400 -> 400
// - defocus
parser.addArgument("delay", "400ms");

export default Base.extend({
    name: "autosubmit",
    trigger,

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
        this.$el.on("patterns-injected.pat-autosubmit", () => {
            this.registerSubformListeners();
        });
        this.$el.on("pat-update.pat-autosubmit", (e, data) => {
            if (data?.pattern === "clone") {
                this.refreshListeners();
            }
            if (
                (data?.pattern === "clone" && data?.action === "removed") ||
                data?.pattern === "sortable"
            ) {
                // Directly submit when removing a clone or changing the sorting.
                dom.find_form(this.el).dispatchEvent(events.submit_event());
                log.debug(
                    `triggered by pat-update, pattern: ${data.pattern}, action: ${data.action}`
                );
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

    refreshListeners() {
        this.registerSubformListeners();
        input_change_events.setup(this.$el, "autosubmit");
    },

    registerTriggers() {
        const isText = this.$el.is("input:text, input[type=search], textarea");
        if (this.options.delay === "defocus" && !isText) {
            log.error(
                "The defocus delay value makes only sense on text input elements."
            );
            return this.$el;
        }

        function trigger_event(ev, submitter = ev.target) {
            if ((submitter.closest(trigger) || ev.target.closest(trigger)) !== this) {
                return;
            }
            const delayed_event = new CustomEvent("input-change-delayed", {
                bubbles: true,
                cancelable: true,
                detail: { submitter },
            });
            ev.target.dispatchEvent(delayed_event);
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

    destroy($el = this.$el) {
        input_change_events.remove($el, "autosubmit");
        $el.off(".pat-autosubmit");
        events.remove_event_listener(this.el, "pat-autosubmit--input-change-delayed");
    },

    onInputChange(e) {
        e.stopPropagation();
        const submitter = e.detail?.submitter ?? e.target;
        const form = e.target.matches("form") ? e.target : dom.find_form(e.target);
        form.dispatchEvent(events.submit_event({ submitter }));
        log.debug(
            `submit event triggered by event ${e.type} by submitter (1) on (2)`,
            submitter,
            this.el
        );
    },
});

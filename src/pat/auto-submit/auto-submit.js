import $ from "jquery";
import logging from "../../core/logging";
import Base from "../../core/base";
import Parser from "../../core/parser";
import input_change_events from "../../lib/input-change-events";
import utils from "../../core/utils";

const log = logging.getLogger("autosubmit");

const parser = new Parser("autosubmit");
// - 400ms -> 400
// - 400 -> 400
// - defocus
parser.addArgument("delay", "400ms");

export default Base.extend({
    name: "autosubmit",
    trigger: ".pat-autosubmit, .pat-auto-submit",
    parser: {
        parse($el, opts) {
            const cfg = parser.parse($el, opts);
            if (cfg.delay !== "defocus") {
                cfg.delay = parseInt(cfg.delay.replace(/[^\d]*/g, ""), 10);
            }
            return cfg;
        },
    },

    init() {
        this.options = this.parser.parse(this.$el, this.options);
        input_change_events.setup(this.$el, "autosubmit");
        this.registerListeners();
        this.registerTriggers();
        return this.$el;
    },

    registerListeners() {
        this.$el.on("input-change-delayed.pat-autosubmit", this.onInputChange);
        this.registerSubformListeners();
        this.$el.on("patterns-injected", this.refreshListeners.bind(this));
    },

    registerSubformListeners(ev) {
        /* If there are subforms, we need to listen on them as well, so
         * that only the subform gets submitted if an element inside it
         * changes.
         */
        const $el = typeof ev !== "undefined" ? $(ev.target) : this.$el;
        $el.find(".pat-subform")
            .not(".pat-autosubmit")
            .each((idx, el) => {
                $(el).on(
                    "input-change-delayed.pat-autosubmit",
                    this.onInputChange
                );
            });
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
            if ($(ev.target).closest(".pat-autosubmit")[0] !== this) {
                return;
            }
            $(ev.target).trigger("input-change-delayed");
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

    onInputChange(ev) {
        ev.stopPropagation();
        $(this).submit();
        log.debug("triggered by " + ev.type);
    },
});

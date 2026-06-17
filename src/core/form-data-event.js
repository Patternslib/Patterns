import Base from "./base";
import Parser from "./parser";
import logging from "./logging";

const log = logging.getLogger("form-data-event");

export const parser = new Parser("form-data-event");
parser.attribute = "data-form-data-event"; // do not require ``data-pat-``
parser.addArgument("event-name-submit");
parser.addArgument("event-name-init");
parser.addArgument("prevent-submit", true);

export default Base.extend({
    name: "form-data-event",
    trigger: ".form-data-event", // note: no .pat- trigger!

    init() {
        this.options = parser.parse(this.el, this.options);
        if (this.el.tagName !== "FORM") {
            log.warn("pattern must be initialized on a form element.");
            return;
        }
        if (this.options.event["name-submit"]) {
            this.el.addEventListener("submit", this.handle_submit.bind(this));
        }
        if (this.options.event["name-init"]) {
            document.addEventListener(
                this.options.event["name-init"],
                this.handle_init.bind(this),
                { once: true }
            );
        }
    },

    handle_submit(e) {
        if (this.options.preventSubmit) {
            e.preventDefault();
        }
        // Note: line breaks might change from /n to /r
        const form_data = new FormData(this.el);
        if (e.submitter?.name) {
            form_data.append("action", e.submitter.name);
        }
        const ev = new CustomEvent(this.options.event["name-submit"], {
            detail: { form_data: form_data },
        });
        document.dispatchEvent(ev);
        if (this.options.event["name-init"]) {
            document.removeEventListener(
                this.options.event["name-init"],
                this.handle_init
            );
        }
    },

    handle_init(e) {
        const form_data = e?.detail?.form_data;
        for (const [key, value] of form_data.entries()) {
            const _el = this.el.querySelector(`[name=${key}]`);
            if (_el) {
                if (_el.type === "checkbox") {
                    // TODO:
                    //     should set checked=true if value exists and set the checkbox value to the form_data value?
                    //     then we need some logic to unset the checkbox if value is omitted.
                    _el.checked = value === "true" || value === "on"; // default value for checked checkboxes is "on"
                } else {
                    _el.value = value;
                }
            }
        }
    },
});

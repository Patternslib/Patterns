import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "../../core/base";
import Parser from "../../core/parser";
import logging from "../../core/logging";

// Lazy loading modules.
let Moment;

const log = logging.getLogger("pat-display-time");
const parser = new Parser("display-time");
// input datetime options
parser.add_argument("format", "");
parser.add_argument("locale", null);
parser.add_argument("strict", false);
// output options
parser.add_argument("from-now", false);
parser.add_argument("no-suffix", false);
parser.add_argument("output-format", null);

export default Base.extend({
    name: "display-time",
    trigger: ".pat-display-time",

    async init() {
        Moment = await import("moment");
        Moment = Moment.default;

        this.options = parser.parse(this.el, this.options);

        let lang =
            this.options.locale || document.querySelector("html").lang || "en";
        // we don't support any country-specific language variants, always use first 2 letters
        lang = lang.substr(0, 2).toLowerCase();
        try {
            await import(`moment/locale/${lang}.js`);
            Moment.locale(lang);
        } catch {
            Moment.locale("en");
        }
        log.info("Moment.js language used: " + lang);
        this.format();
    },

    format() {
        let out = this.el.getAttribute("datetime");
        if (out && this.options.outputFormat) {
            const date = Moment(out, this.options.format, this.options.strict);
            if (this.options.fromNow === true) {
                out = date.fromNow(this.options.noSuffix);
            } else {
                out = date.format(this.options.outputFormat || undefined);
            }
        }
        this.el.textContent = out;
    },
});

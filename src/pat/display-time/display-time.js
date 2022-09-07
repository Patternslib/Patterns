import Base from "../../core/base";
import Parser from "../../core/parser";
import dom from "../../core/dom";
import logging from "../../core/logging";
import utils from "../../core/utils";

// Lazy loading modules.
let Moment;

const log = logging.getLogger("pat-display-time");

export const parser = new Parser("display-time");
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
        Moment = (await import("moment")).default;

        this.options = parser.parse(this.el, this.options);

        let lang = this.options.locale || dom.acquire_attribute(this.el, "lang") || "en";
        // we don't support any country-specific language variants, always use first 2 letters
        lang = lang.substr(0, 2).toLowerCase();
        try {
            await import(`moment/locale/${lang}.js`);
            Moment.locale(lang);
            this.lang = lang;
        } catch {
            Moment.locale("en");
            this.lang = "en";
        }
        log.debug(`Moment.js language used: ${lang}.`);
        this.format();
    },

    format() {
        const datetime = this.el.getAttribute("datetime");
        let out = "";
        if (datetime) {
            const date = Moment(datetime, this.options.format, this.options.strict);
            if (this.options.fromNow === true) {
                if (utils.is_iso_date(datetime)) {
                    // date-only case.
                    const rtf = new Intl.RelativeTimeFormat(this.lang, {
                        numeric: "auto",
                    });
                    const date_diff = utils.date_diff(date.toDate(), new Date());
                    out = date.calendar(null, {
                        // when the date is closer, specify custom values
                        lastWeek: `[${rtf.format(date_diff, "day")}]`, // translates to "x days ago"
                        lastDay: `[${rtf.format(-1, "day")}]`, // translates to "yesterday"
                        sameDay: `[${rtf.format(0, "day")}]`, // translates to "today"
                        nextDay: `[${rtf.format(1, "day")}]`, // translates to "tomorrow"
                        nextWeek: "dddd", // translates to week day name
                        // otherwise, just use Intl.RelativeTimeFormat.
                        sameElse: () => {
                            return `[${rtf.format(date_diff, "day")}]`;
                        },
                    });
                } else {
                    // datetime case.
                    out = date.fromNow(this.options.noSuffix);
                }
            } else {
                out = date.format(this.options.outputFormat || undefined);
            }
        }
        this.el.textContent = out;
    },
});

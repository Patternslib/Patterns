/* pat-datetime-picker  - Polyfill for input type=datetime-local */
import Base from "../../core/base";
import Parser from "../../core/parser";
import utils from "../../core/utils";
import dom from "../../core/dom";
import events from "../../core/events";

export const parser = new Parser("datetime-picker");
parser.addArgument("behavior", "native", ["native", "styled", "editable"]);
parser.addAlias("behaviour", "behavior");
parser.addArgument("format", "YYYY-MM-DD");
parser.addArgument("week-numbers", [], ["show", "hide"]);
parser.addArgument("i18n"); // URL pointing to JSON resource with i18n values
parser.addArgument("today", "Today");
parser.addArgument("clear", "Clear");
parser.addArgument("first-day", 0);
parser.addArgument("after");
parser.addArgument("offset-days", 0);
parser.addArgument("output-format", null);
parser.addArgument("locale", null);

export default Base.extend({
    name: "datetime-picker",
    trigger: ".pat-datetime-picker",
    parser: parser,
    el_date: null,
    el_time: null,

    async init() {
        const el = this.el;
        this.options = parser.parse(this.el, this.options);

        if (
            this.options.behavior === "native" &&
            utils.checkInputSupport("datetime-local", "invalid date")
        ) {
            this.bind_after();
            return;
        }

        if (window.__patternslib_import_styles) {
            import("./_datetime-picker.scss");
        }
        const DatePicker = (await import("../date-picker/date-picker")).default;

        const [date_value = "", time_value = ""] = el.value.split(/[T ]/);
        const locked = el.matches(":disabled") || el.readOnly;

        const el_wrapper = document.createElement("div");
        el_wrapper.setAttribute("class", "pat-datetime-picker__wrapper");

        // let the buttons be of type button otherwise they are submit buttons
        const html_btn_now = `
            <button type="button" class="_btn _now" title="${this.options.today}">
                <span class="_icon"/>
                <span class="_text">${this.options.today}</span>
            </button>`;
        const html_btn_clear = `
            <button type="button" class="_btn _clear" title="${this.options.clear}">
                <span class="_icon"/>
                <span class="_text">${this.options.clear}</span>
            </button>`;

        el_wrapper.innerHTML = `
            <input type="date" class="pat-datetime-picker__date" />
            <input type="time" placeholder="hh:mm" />
            ${this.options.today ? html_btn_now : ""}
            ${this.options.clear ? html_btn_clear : ""}
        `;

        this.el_time = el_wrapper.querySelector("input[type=time]");
        this.el_date = el_wrapper.querySelector("input[type=date]");
        this.el_date.defaultValue = date_value;
        this.el_time.defaultValue = time_value;
        this.el_date.placeholder = el.placeholder || "YYYY-MM-DD";
        this.el_date.required = el.required;
        this.el_date.disabled = locked;
        this.el_time.disabled = locked;
        if (el.step) {
            this.el_time.step = el.step;
        }
        for (const name of ["min", "max"]) {
            const bound = el.getAttribute(name)?.split(/[T ]/)[0];
            if (bound) {
                this.el_date.setAttribute(name, bound);
            }
        }
        for (const button of el_wrapper.querySelectorAll("button")) {
            button.disabled = locked;
        }

        el.before(el_wrapper);
        dom.hide(el);

        const date_options = {
            behavior: this.options.behavior,
            format: this.options.format,
            weekNumbers: this.options.weekNumbers,
            firstDay: this.options.firstDay,
            i18n: this.options.i18n,
            outputFormat: this.options.outputFormat,
            locale: this.options.locale,
        };
        this.date_picker = DatePicker.init(this.el_date, date_options);
        await events.await_pattern_init(this.date_picker);
        if (this.el_date.value !== date_value) {
            this.set_fields(date_value, time_value);
        }

        this.el_time.addEventListener("change", () => this.update());
        this.el_date.addEventListener("change", () => {
            if (this.el_date.value && !this.el_time.value) {
                this.el_time.value = this.isotime();
            }
            this.update();
        });
        for (const input of [this.el_date, this.el_time]) {
            input.addEventListener("blur", (event) => {
                if (!el_wrapper.contains(event.relatedTarget)) {
                    el.dispatchEvent(events.blur_event());
                }
            });
        }

        if (this.options.today) {
            const btn_now = el_wrapper.querySelector("._btn._now");
            btn_now.addEventListener("click", (e) => {
                e.preventDefault();
                const now = new Date();
                this.set_fields(this.isodate(now), this.isotime(now));
            });
        }

        if (this.options.clear) {
            const btn_clear = el_wrapper.querySelector("._btn._clear");
            btn_clear.addEventListener("click", (e) => {
                e.preventDefault();
                this.set_fields("", "");
            });
        }

        this.bind_after();
    },

    bind_after() {
        if (!this.options.after || this.el.matches(":disabled") || this.el.readOnly) {
            return;
        }
        for (const before of document.querySelectorAll(this.options.after)) {
            if (before === this.el) {
                continue;
            }
            before.addEventListener("change", () => {
                const [, time] = before.value.split(/[T ]/);
                const reference = Date.parse(`${before.value}Z`);
                const current = Date.parse(`${this.el.value}Z`);
                if (!time || !Number.isFinite(reference) || current >= reference) {
                    return;
                }

                // Use UTC arithmetic to keep the same wall-clock time across DST changes.
                const date = new Date(reference);
                date.setUTCDate(date.getUTCDate() + this.options.offsetDays);
                const value = date.toISOString().slice(0, 10);
                if (this.el_date) {
                    this.set_fields(value, time);
                } else {
                    this.update(`${value}T${time}`);
                }
            });
        }
    },

    set_fields(date, time) {
        this.el_time.value = time;
        const picker = this.date_picker.pikaday;
        const { min, max } = this.el_date;
        const outside_calendar = date && ((min && date < min) || (max && date > max));
        if (picker && !outside_calendar) {
            // Pikaday updates the date field and dispatches its change event.
            const selected = date ? new Date(`${date}T00:00:00`) : null;
            picker.setDate(selected, true);
        } else {
            // Keep out-of-range values so the original input can report them.
            this.el_date.value = date;
            const event = new Event("change");
            event.firedBy = picker;
            this.el_date.dispatchEvent(event);
        }
    },

    update(value) {
        const previous = this.el.value;
        if (value === undefined) {
            const date = this.el_date.value;
            const time = this.el_time.value;
            value = date && time ? `${date}T${time}` : "";
        }
        this.el.value = value;
        if (this.el.value !== previous) {
            this.el.dispatchEvent(
                new Event("change", { bubbles: true, cancelable: true }),
            );
        }
    },

    isodate(now = new Date()) {
        return utils.localized_isodate(now);
    },

    isotime(now = new Date()) {
        return now.toTimeString().slice(0, 5);
    },
});

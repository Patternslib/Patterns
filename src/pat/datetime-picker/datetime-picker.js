/* pat-datetime-picker  - Polyfill for input type=datetime-local */
import Base from "../../core/base";
import Parser from "../../core/parser";
import utils from "../../core/utils";
import dom from "../../core/dom";

export const parser = new Parser("datetime-picker");
parser.addArgument("format", "YYYY-MM-DD");
parser.addArgument("week-numbers", [], ["show", "hide"]);
parser.addArgument("i18n"); // URL pointing to JSON resource with i18n values
parser.addArgument("today", "Today");
parser.addArgument("clear", "Clear");
parser.addArgument("first-day", 0);

export default Base.extend({
    name: "datetime-picker",
    trigger: ".pat-datetime-picker",
    parser: parser,
    el_date: null,
    el_time: null,

    async init() {
        const el = this.el;
        this.options = parser.parse(this.el, this.options);

        if (utils.checkInputSupport("datetime-local", "invalid date")) {
            return;
        }

        if (window.__patternslib_import_styles) {
            import("./_datetime-picker.scss");
        }
        const DatePicker = (await import("../date-picker/date-picker")).default;

        const value = this.el.value.split("T");
        const date_value = value[0] || "";
        const time_value = value[1] || "";

        const el_wrapper = document.createElement("div");
        el_wrapper.setAttribute("class", "pat-datetime-picker__wrapper");

        dom.hide(el);

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
            <input type="date" placeholder="YYYY-MM-DD" value="${date_value}" />
            <input type="time" placeholder="hh:mm" value="${time_value}" />
            ${this.options.today ? html_btn_now : ""}
            ${this.options.clear ? html_btn_clear : ""}
        `;

        this.el_time = el_wrapper.querySelector("input[type=time]");
        this.el_time.addEventListener("change", () => this.update());

        this.el_date = el_wrapper.querySelector("input[type=date]");
        this.el_date.addEventListener("change", () => {
            if (!this.el_time.value) {
                // Set time on date change, if time was empty.
                this.el_time.value = this.isotime();
            }
            this.update();
        });

        const date_options = {
            behavior: "native",
            format: this.options.format,
            weekNumbers: this.options.weekNumbers,
            firstDay: this.options.firstDay,
        };
        await DatePicker.init(this.el_date, date_options);

        if (this.options.today) {
            const btn_now = el_wrapper.querySelector("._btn._now");
            btn_now.addEventListener("click", (e) => {
                e.preventDefault();
                this.el_date.value = this.isodate();
                this.el_time.value = this.isotime();
                this.update();
            });
        }

        if (this.options.clear) {
            const btn_clear = el_wrapper.querySelector("._btn._clear");
            btn_clear.addEventListener("click", (e) => {
                e.preventDefault();
                this.el_date.value = "";
                this.el_time.value = "";
                this.update();
            });
        }

        // TODO: timezone
        el.parentNode.insertBefore(el_wrapper, el);
    },

    update() {
        if (this.el_date.value && this.el_time.value) {
            this.el.value = `${this.el_date.value}T${this.el_time.value}`;
        } else {
            this.el.value = "";
        }
        this.el.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
    },

    isodate() {
        const now = new Date();
        return now.toISOString().substr(0, 10);
    },

    isotime() {
        const now = new Date();
        return now.toTimeString().substr(0, 5);
    },
});

/* pat-datetime-picker  - Polyfill for input type=datetime-local */
import "regenerator-runtime/runtime"; // needed for ``await`` support
import $ from "jquery";
import Base from "../../core/base";
import DatePicker from "../date-picker/date-picker";
import Parser from "../../core/parser";

// Lazy loading modules.
let Moment;

const parser = new Parser("datetime-picker");
parser.addArgument("behavior", "styled", ["native", "styled"]);
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

    async init() {
        const el = this.el;
        this.options = $.extend(parser.parse(el), this.options);

        Moment = await import("moment");
        Moment = Moment.default;

        const value = el.value.split("T");
        const date_value = value[0] || "";
        const time_value = value[1] || "";

        el.style.display = "none";

        const el_wrapper = document.createElement("div");
        el_wrapper.setAttribute("class", "datetime-picker-wrapper");

        const html_date = `<input class="date" type="date" placeholder="YYYY-MM-DD" value="${date_value}" />`;
        const html_time = `<input class="time" type="time" placeholder="hh:mm" value="${time_value}" />`;

        // let the buttons be of type button otherwise they are submit buttons
        const html_btn_now = `
            <button type="button" class="now" title="${this.options.today}">
                <span class="glyphicon glyphicon-time"/>
                ${this.options.today}
            </button>`;
        const html_btn_clear = `
            <button type="button" class="clear ${this.options.classClearName}" title="${this.options.clear}">
                <span class="glyphicon glyphicon-trash"/>
                ${this.options.clear}
            </button>`;

        el_wrapper.innerHTML = `
            ${html_date}
            ${html_time}
            ${this.options.today ? html_btn_now : ""}
            ${this.options.clear ? html_btn_clear : ""}
        `;

        const el_time = el_wrapper.querySelector(".time");
        el_time.addEventListener("change", () => this.update());
        this.el_time = el_time;

        const el_date = el_wrapper.querySelector(".date");
        el_date.addEventListener("change", () => {
            if (!this.el_time.value) {
                // Set time on date change, if time was empty.
                this.el_time.value = this.isotime();
            }
            this.update();
        });
        const date_options = {
            behavior: this.options.behavior,
            format: this.options.format,
            weekNumbers: this.options.weekNumbers,
            firstDay: this.options.firstDay,
        };
        DatePicker.init(el_date, date_options);
        this.el_date = el_date;

        if (this.options.today) {
            const btn_now = el_wrapper.querySelector(".now");
            btn_now.addEventListener("click", (e) => {
                e.preventDefault();
                this.el_date.value = this.isodate();
                this.el_time.value = this.isotime();
                this.update();
            });
        }

        if (this.options.clear) {
            const btn_clear = el_wrapper.querySelector(".clear");
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
            const date = Moment(this.el_date.value).format(this.options.format);
            this.el.value = date + "T" + this.el_time.value;
        } else {
            this.el.value = "";
        }
        this.el.dispatchEvent(
            new Event("change", { bubbles: true, cancelable: true })
        );
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

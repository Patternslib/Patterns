import $ from "jquery";
import events from "../../core/events";
import pattern, { storage } from "./date-picker";
import pattern_auto_submit from "../auto-submit/auto-submit";
import utils from "../../core/utils";
import { jest } from "@jest/globals";

const mock_fetch_i18n = () =>
    Promise.resolve({
        json: () =>
            Promise.resolve({
                previousMonth: "Letzer Monat",
                nextMonth: "Nächster Monat",
                months: [
                    "Januar",
                    "Februar",
                    "März",
                    "April",
                    "Mai",
                    "Juni",
                    "Juli",
                    "August",
                    "September",
                    "Oktober",
                    "November",
                    "Dezember",
                ],
                weekdays: [
                    "Sonntag",
                    "Montag",
                    "Dienstag",
                    "Mittwoch",
                    "Donnerstag",
                    "Freitag",
                    "Samstag",
                ],
                weekdaysShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
            }),
    });

const select_date = (el, date) => {
    // Attention! Just select today.
    // Scrolling calendar pages forward and backwards is not supported yet.
    el.click();

    const day = date.getDate().toString();
    const month = date.getMonth().toString(); // remember, month-count starts from 0
    const year = date.getFullYear().toString();

    const cur_year = document.querySelector('.pika-lendar .pika-select-year option[selected="selected"]'); // prettier-ignore
    expect(cur_year.textContent).toBe(year);

    const cur_month = document.querySelector('.pika-lendar .pika-select-month option[selected="selected"]'); // prettier-ignore
    expect(cur_month.value).toBe(month);

    const cur_day = document.querySelector(".pika-lendar td.is-today button"); // prettier-ignore
    expect(cur_day.getAttribute("data-pika-day")).toBe(day);

    const cur_wkday = document.querySelector(".pika-lendar th:first-child abbr"); // prettier-ignore
    expect(cur_wkday.textContent).toBe("Sun");

    // select current day.
    cur_day.dispatchEvent(new Event("mousedown"));
};

describe("pat-date-picker", function () {
    afterEach(function () {
        document.body.innerHTML = "";
        jest.restoreAllMocks();
    });

    it("1 - Default date picker.", async () => {
        document.body.innerHTML = '<input type="date" class="pat-date-picker"/>';
        const el = document.querySelector("input[type=date]");

        pattern.init(el);
        await utils.timeout(1); // wait a tick for async to settle.

        const display_el = document.querySelector("time");
        expect(display_el).toBeTruthy();
        expect(display_el.textContent).toBeFalsy();

        expect(el.getAttribute("type")).toBe("date");
        expect(el.style.display).toBe("none");

        const date = new Date();
        const isodate = utils.localized_isodate(date);
        select_date(display_el, date);

        // <time> element should contains the current date in iso format
        expect(display_el.textContent).toBe(isodate);
        // input element contains iso date
        expect(el.value).toBe(isodate);
    });

    it("2 - Date picker starts at Monday.", async () => {
        document.body.innerHTML =
            '<input type="date" class="pat-date-picker" data-pat-date-picker="first-day: 1" />';
        const el = document.querySelector("input[type=date]");
        pattern.init(el);
        await utils.timeout(1); // wait a tick for async to settle.
        const display_el = document.querySelector("time");
        display_el.click();

        const first_day = document.querySelector(".pika-lendar th:first-child abbr"); // prettier-ignore
        expect(first_day.textContent).toBe("Mon");
    });

    it("3 - Date picker with pre-set value.", async () => {
        document.body.innerHTML =
            '<input type="date" class="pat-date-picker" value="1900-01-01"/>';
        const el = document.querySelector("input[type=date]");
        pattern.init(el);
        await utils.timeout(1); // wait a tick for async to settle.
        const display_el = document.querySelector("time");
        display_el.click();

        const cur_year = document.querySelector('.pika-lendar .pika-select-year option[selected="selected"]'); // prettier-ignore
        expect(cur_year.textContent).toBe("1900");

        const cur_month = document.querySelector('.pika-lendar .pika-select-month option[selected="selected"]'); // prettier-ignore
        expect(cur_month.value).toBe("0");

        const cur_day = document.querySelector(".pika-lendar td.is-selected button"); // prettier-ignore
        expect(cur_day.getAttribute("data-pika-day")).toBe("1");

        // <time> element should contains the pre-set date in iso format
        expect(display_el.textContent).toBe("1900-01-01");
    });

    it("4 - Date picker with week numbers.", async () => {
        document.body.innerHTML =
            '<input type="date" class="pat-date-picker" data-pat-date-picker="week-numbers: show" value="2017-09-18"/>';
        const el = document.querySelector("input[type=date]");
        pattern.init(el);
        await utils.timeout(1); // wait a tick for async to settle.
        const display_el = document.querySelector("time");
        display_el.click();

        const week_num = document.querySelectorAll(".pika-lendar .pika-week")[0]; // prettier-ignore
        expect(week_num.textContent).toBe("35");
    });

    describe("5 - Date picker with i18n", function () {
        it("with proper json URL properly localizes the months and weekdays", async () => {
            global.fetch = jest.fn().mockImplementation(mock_fetch_i18n);
            document.body.innerHTML =
                '<input type="date" class="pat-date-picker" value="2018-10-21" data-pat-date-picker="i18n:/path/to/i18njson" />';
            const el = document.querySelector("input[type=date]");
            pattern.init(el);
            await utils.timeout(1); // wait a tick for async to settle.
            const display_el = document.querySelector("time");
            display_el.click();

            const month = document.querySelector('.pika-lendar .pika-select-month option[selected="selected"]'); // prettier-ignore
            expect(month.textContent).toBe("Oktober");

            // Clear the storage
            storage.clear();
            // Reset mock
            global.fetch.mockClear();
            delete global.fetch;
        });

        it("stores i18n results", async () => {
            global.fetch = jest.fn().mockImplementation(mock_fetch_i18n);
            document.body.innerHTML = `
                <input
                    type="date"
                    class="pat-date-picker"
                    value="2018-10-21"
                    data-pat-date-picker="i18n:/path/to/i18njson"
                />
                <input
                    type="date"
                    class="pat-date-picker"
                    value="2018-10-22"
                    data-pat-date-picker="i18n:/path/to/i18njson"
                />
            `;
            const els = document.querySelectorAll("input[type=date]");
            pattern.init(els[0]);
            await utils.timeout(1); // wait a tick for async to settle.
            expect(global.fetch).toHaveBeenCalledTimes(1);

            // Initializing the other pattern should not lead to another AJAX call.

            // NOTE: in a real environment where multiple instances are
            // initialized at once on the same page, before the ajax call has
            // been completed, each instance will do an AJAX call. After that,
            // when navigating to other pages with other date picker instance
            // the cached value should be used and no more AJAX calls should be
            // made.

            pattern.init(els[1]);
            await utils.timeout(1); // wait a tick for async to settle.
            expect(global.fetch).toHaveBeenCalledTimes(1);

            // Clear the storage
            storage.clear();
            // Reset mock
            global.fetch.mockClear();
            delete global.fetch;
        });

        it("with bogus json URL falls back to default (english) month and weekday labels ", async () => {
            // Simulate failing getJSON call
            global.fetch = jest.fn().mockImplementation(() => {
                throw "error";
            });

            document.body.innerHTML =
                '<input type="date" class="pat-date-picker" value="2018-10-21" data-pat-date-picker="i18n:/path/to/i18njson" />';
            const el = document.querySelector("input[type=date]");
            console.log(document.body.innerHTML);
            pattern.init(el);
            await utils.timeout(1); // wait a tick for async to settle.
            console.log(document.body.innerHTML);
            const display_el = document.querySelector("time");
            display_el.click();

            const month = document.querySelector('.pika-lendar .pika-select-month option[selected="selected"]'); // prettier-ignore
            expect(month.textContent).toBe("October");

            // Reset mock
            global.fetch.mockClear();
            delete global.fetch;
        });
    });

    describe("6 - Update one input depending on the other.", function () {
        it("Updates with default offset-days", async () => {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = `
                <input name="start" type="date" class="pat-date-picker" />
                <input name="end"   type="date" class="pat-date-picker" data-pat-date-picker="after:input[name=start]" />
            `;
            document.body.appendChild(wrapper);
            const start = wrapper.querySelector("input[name=start]");
            const end = wrapper.querySelector("input[name=end]");

            pattern.init(start);
            pattern.init(end);
            await utils.timeout(1); // wait a tick for async to settle.

            const start_display = document.querySelectorAll("time")[0];
            const end_display = document.querySelectorAll("time")[1];

            const cal1 = document.querySelectorAll(".pika-single")[0];
            const cal2 = document.querySelectorAll(".pika-single")[1];

            // Check initial values
            expect(start.value).toBeFalsy();
            expect(end.value).toBeFalsy();

            // Set start value
            start_display.click();

            let btn = cal1.querySelectorAll(".pika-table button")[0];
            btn.dispatchEvent(new Event("mousedown"));

            let start1 = start.value;
            let end1 = end.value;

            expect(start.value).toBeTruthy();
            expect(end.value).toBeTruthy();
            expect(start.value).toBe(end.value);

            // Setting it again to a date after the end date will change the end
            // date again.
            start_display.click();

            btn = cal1.querySelectorAll(".pika-table button")[10];
            btn.dispatchEvent(new Event("mousedown"));

            let start2 = start.value;
            let end2 = end.value;

            expect(start.value).toBeTruthy();
            expect(start.value).not.toBe(start1);
            expect(end.value).toBeTruthy();
            expect(end.value).not.toBe(end1);
            expect(start.value).toBe(end.value);

            // Setting it to an earlier value will not change the end date again.
            start_display.click();

            btn = cal1.querySelectorAll(".pika-table button")[5];
            btn.dispatchEvent(new Event("mousedown"));

            let start3 = start.value;
            let end3 = end.value;

            expect(start.value).toBeTruthy();
            expect(start.value).not.toBe(start1);
            expect(start.value).not.toBe(start2);
            expect(end.value).toBeTruthy();
            expect(end.value).not.toBe(end1);
            expect(end.value).toBe(end2);
            expect(start.value).not.toBe(end.value);

            // Setting end to an earlier value than start is possible.
            // Use pat-validation to prevent submitting it.
            end_display.click();

            btn = cal2.querySelectorAll(".pika-table button")[0];
            btn.dispatchEvent(new Event("mousedown"));

            expect(start.value).toBeTruthy();
            expect(start.value).not.toBe(start1);
            expect(start.value).not.toBe(start2);
            expect(start.value).toBe(start3);
            expect(end.value).toBeTruthy();
            expect(end.value).toBe(end1);
            expect(end.value).not.toBe(end2);
            expect(end.value).not.toBe(end3);
            expect(start.value).not.toBe(end.value);
        });

        it("Updates with offset-days 2", async () => {
            const diff_days = (val1, val2) => {
                // diff is in milliseconds
                const diff = new Date(val1) - new Date(val2);
                return diff / 1000 / 60 / 60 / 24;
            };

            const wrapper = document.createElement("div");
            wrapper.innerHTML = `
                <input name="start" type="date" class="pat-date-picker" />
                <input name="end"   type="date" class="pat-date-picker" data-pat-date-picker="after:input[name=start]; offset-days: 2" />
            `;
            document.body.appendChild(wrapper);
            const start = wrapper.querySelector("input[name=start]");
            const end = wrapper.querySelector("input[name=end]");

            pattern.init(start);
            pattern.init(end);
            await utils.timeout(1); // wait a tick for async to settle.

            const start_display = document.querySelectorAll("time")[0];

            const cal1 = document.querySelectorAll(".pika-single")[0];

            // Check initial values
            expect(start.value).toBeFalsy();
            expect(end.value).toBeFalsy();

            // Set start value
            start_display.click();
            let btn = cal1.querySelectorAll(".pika-table button")[0];
            btn.dispatchEvent(new Event("mousedown"));
            // end date is set +2 days in advance of start date.
            expect(diff_days(start.value, end.value)).toBe(-2);

            // Change start value +1day
            start_display.click();
            btn = cal1.querySelectorAll(".pika-table button")[1];
            btn.dispatchEvent(new Event("mousedown"));
            // end date doesn't change.
            expect(diff_days(start.value, end.value)).toBe(-1);

            // Change start value +1day = same day
            start_display.click();
            btn = cal1.querySelectorAll(".pika-table button")[2];
            btn.dispatchEvent(new Event("mousedown"));
            // end date doesn't change.
            expect(diff_days(start.value, end.value)).toBe(0);

            // Change start value +1day = 1 day after end date
            start_display.click();
            btn = cal1.querySelectorAll(".pika-table button")[3];
            btn.dispatchEvent(new Event("mousedown"));
            // end is set 2 days after start date
            expect(diff_days(start.value, end.value)).toBe(-2);
        });
    });

    it("7 - Formatted date.", async () => {
        document.body.innerHTML =
            '<input type="date" class="pat-date-picker" value="2021-03-09" data-pat-date-picker="output-format: Do MMMM YYYY; locale: de"/>';
        const el = document.querySelector("input[type=date]");
        pattern.init(el);
        await utils.timeout(1); // wait a tick for async to settle.
        const display_el = document.querySelector("time");

        // <time> element should contain the pre-set date in iso format
        expect(display_el.getAttribute("datetime")).toBe("2021-03-09");
        expect(display_el.textContent).toBe("9. März 2021");

        display_el.click();

        const day = document.querySelector(".pika-lendar td[data-day='12'] button"); // prettier-ignore
        day.dispatchEvent(new Event("mousedown"));

        expect(display_el.textContent).toBe("12. März 2021");
        expect(display_el.getAttribute("datetime")).toBe("2021-03-12");
        expect(el.value).toBe("2021-03-12");
    });

    it("8 - Styled behavior with clear button.", async () => {
        document.body.innerHTML =
            '<input type="date" class="pat-date-picker" value="2021-03-09"/>';
        const el = document.querySelector("input[type=date]");
        pattern.init(el);
        await utils.timeout(1); // wait a tick for async to settle.
        const display_el = document.querySelector("time");

        // Initial values on input field and time element
        expect(display_el.getAttribute("datetime")).toBe("2021-03-09");
        expect(display_el.textContent).toBe("2021-03-09");
        expect(el.value).toBe("2021-03-09");

        // Clear button is available
        let clear_button = display_el.querySelector(".cancel-button");
        expect(clear_button).toBeTruthy();

        clear_button.click();

        // Clear button clears input field value and time element content
        expect(display_el.getAttribute("datetime")).toBe("");
        expect(display_el.textContent).toBe("");
        expect(el.value).toBe("");

        // Clear button is removed when no value is present.
        clear_button = display_el.querySelector(".cancel-button");
        expect(clear_button).toBeFalsy();

        display_el.click();

        const day = document.querySelector(".pika-lendar td[data-day='12'] button"); // prettier-ignore
        day.dispatchEvent(new Event("mousedown"));

        // After selecting in calendar overlay, the values are set
        expect(display_el.getAttribute("datetime")).toBe("2021-03-12");
        expect(display_el.textContent).toBe("2021-03-12");
        expect(el.value).toBe("2021-03-12");

        // ... and clear button available again
        clear_button = display_el.querySelector(".cancel-button");
        expect(clear_button).toBeTruthy();

        clear_button.click();

        // Activating the clear button again clears the values as before
        expect(display_el.getAttribute("datetime")).toBe("");
        expect(display_el.textContent).toBe("");
        expect(el.value).toBe("");

        // ... and the cancel button isn't available anymore.
        clear_button = display_el.querySelector(".cancel-button");
        expect(clear_button).toBeFalsy();
    });

    it("9 - Formatted date with clear button.", async () => {
        document.body.innerHTML =
            '<input type="date" class="pat-date-picker" value="2021-03-09" data-pat-date-picker="output-format: DD.MM.YYYY"/>';
        const el = document.querySelector("input[type=date]");
        pattern.init(el);
        await utils.timeout(1); // wait a tick for async to settle.
        const display_el = document.querySelector("time");

        // Initial values on input field and time element
        expect(display_el.getAttribute("datetime")).toBe("2021-03-09");
        expect(display_el.textContent).toBe("09.03.2021");
        expect(el.value).toBe("2021-03-09");

        // Clear button is available
        let clear_button = display_el.querySelector(".cancel-button");
        expect(clear_button).toBeTruthy();

        clear_button.click();

        // Clear button clears input field value and time element content
        expect(display_el.getAttribute("datetime")).toBe("");
        expect(display_el.textContent).toBe("");
        expect(el.value).toBe("");

        // Clear button is removed when no value is present.
        clear_button = display_el.querySelector(".cancel-button");
        expect(clear_button).toBeFalsy();

        display_el.click();

        const day = document.querySelector(".pika-lendar td[data-day='12'] button"); // prettier-ignore
        day.dispatchEvent(new Event("mousedown"));

        // After selecting in calendar overlay, the values are set
        expect(display_el.getAttribute("datetime")).toBe("2021-03-12");
        expect(display_el.textContent).toBe("12.03.2021");
        expect(el.value).toBe("2021-03-12");

        // ... and clear button available again
        clear_button = display_el.querySelector(".cancel-button");
        expect(clear_button).toBeTruthy();

        clear_button.click();

        // Activating the clear button again clears the values as before
        expect(display_el.getAttribute("datetime")).toBe("");
        expect(display_el.textContent).toBe("");
        expect(el.value).toBe("");

        // ... and the cancel button isn't available anymore.
        clear_button = display_el.querySelector(".cancel-button");
        expect(clear_button).toBeFalsy();
    });

    it("10 - Required formatted date - no clear button available.", async () => {
        document.body.innerHTML =
            '<input type="date" class="pat-date-picker" value="2021-03-01" required/>';
        const el = document.querySelector("input[type=date]");
        pattern.init(el);
        await utils.timeout(1); // wait a tick for async to settle.
        const display_el = document.querySelector("time");

        // Initial values on input field and time element
        expect(display_el.getAttribute("datetime")).toBe("2021-03-01");
        expect(display_el.textContent).toBe("2021-03-01");
        expect(el.value).toBe("2021-03-01");

        // Clear button is not available when field is required
        let clear_button = display_el.querySelector(".cancel-button");
        expect(clear_button).toBeFalsy();

        display_el.click();

        const day = document.querySelector(".pika-lendar td[data-day='12'] button"); // prettier-ignore
        day.dispatchEvent(new Event("mousedown"));

        // After selecting in calendar overlay, the values are set
        expect(display_el.getAttribute("datetime")).toBe("2021-03-12");
        expect(display_el.textContent).toBe("2021-03-12");
        expect(el.value).toBe("2021-03-12");

        // ... and clear button is still not available
        clear_button = display_el.querySelector(".cancel-button");
        expect(clear_button).toBeFalsy();
    });

    it("11 - Native behavior with fallback to pika", async () => {
        // We mocking as if we're not supporting input type date.
        jest.spyOn(utils, "checkInputSupport").mockImplementation(() => false);

        document.body.innerHTML =
            '<input type="date" class="pat-date-picker" data-pat-date-picker="behavior: native"/>';
        const el = document.querySelector("input[type=date]");

        pattern.init(el);
        await utils.timeout(1); // wait a tick for async to settle.

        const display_el = document.querySelector("time");
        // In native move with styled fallback we do not use the <time> element.
        // We display the input and let it be editable.
        expect(display_el).toBeFalsy();

        el.click();

        const date = new Date();
        const day = date.getDate().toString();
        const month = date.getMonth().toString(); // remember, month-count starts from 0
        const year = date.getFullYear().toString();
        const isodate = utils.localized_isodate(date);

        const cur_year = document.querySelector('.pika-lendar .pika-select-year option[selected="selected"]'); // prettier-ignore
        expect(cur_year.textContent).toBe(year);

        const cur_month = document.querySelector('.pika-lendar .pika-select-month option[selected="selected"]'); // prettier-ignore
        expect(cur_month.value).toBe(month);

        const cur_day = document.querySelector(".pika-lendar td.is-today button"); // prettier-ignore
        expect(cur_day.getAttribute("data-pika-day")).toBe(day);

        const cur_wkday = document.querySelector(".pika-lendar th:first-child abbr"); // prettier-ignore
        expect(cur_wkday.textContent).toBe("Sun");

        // select current day.
        cur_day.dispatchEvent(new Event("mousedown"));
        // input element contains iso date
        expect(el.value).toBe(isodate);
    });

    it("12 - does not initialize the date picker in styled behavior when disabled", async () => {
        document.body.innerHTML = `
            <input
                type="date"
                class="pat-date-picker"
                value="2021-03-09"
                data-pat-date-picker="output-format: Do MMMM YYYY; locale: de"
                disabled
            />';
        `;
        const el = document.querySelector("input[type=date]");
        pattern.init(el);
        await utils.timeout(1); // wait a tick for async to settle.

        const display_el = document.querySelector("time");

        // <time> element should contain the pre-set date in iso format
        expect(display_el.getAttribute("datetime")).toBe("2021-03-09");
        expect(display_el.textContent).toBe("9. März 2021");

        // The <time> element should have the "disabled" class be set.
        expect(display_el.classList.contains("disabled")).toBe(true);

        // Clear button is not available in disabled state.
        expect(display_el.querySelector(".cancel-button")).toBeFalsy();

        // date picker is not opened in disabled state.
        display_el.click();
        expect(document.querySelector(".pika-lendar")).toBeFalsy();
    });

    it("13 - works with pat-autosubmit", async () => {
        document.body.innerHTML = `
            <form class="pat-autosubmit" onsubmit="return false;">
                <input name="date" type="date" class="pat-date-picker"/>
            </form>
        `;

        pattern_auto_submit.init(document.querySelector("form"));
        pattern.init(document.querySelector("input"));
        await utils.timeout(1); // wait a tick for async to settle.

        const handle_submit = jest.fn();
        $(document.querySelector("form")).on("submit", handle_submit);

        document.querySelector("time").click();

        let btn = document.querySelector(".pika-single .pika-table button");
        btn.dispatchEvent(new Event("mousedown"));

        await utils.timeout(500); // wait for delay
        expect(handle_submit).toHaveBeenCalled();
    });

    it("14 - Selecting nothing in styled behavior triggers pat-validation.", async () => {
        document.body.innerHTML = `
          <form class="pat-validation" data-pat-validation="delay: 0">
            <input
                type="date"
                name="date"
                class="pat-date-picker"
                required
                />
          </form>
        `;
        const form = document.querySelector("form");
        const el = document.querySelector("input[type=date]");

        const pattern_validation = (await import("../validation/validation")).default;
        const instance_validation = new pattern_validation(form);
        await events.await_pattern_init(instance_validation);

        new pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

        // Open the date picker
        document.querySelector("time").click();
        await utils.timeout(1); // wait a tick for async to settle.

        // Date picker is opened
        expect(document.querySelector(".pika-lendar")).toBeTruthy();

        // Close the date picker without selecting a date.
        document.body.click();

        // Wait for validation to run.
        await utils.timeout(1);

        // There should be a error message from pat-validation.
        expect(form.querySelectorAll("em.warning").length).toBe(1);
    });

    it("15 - Placeholder support.", async () => {
        document.body.innerHTML = `
            <input
                type="date"
                class="pat-date-picker"
                placeholder="Select a date"
                />`;
        const el = document.querySelector("input[type=date]");
        new pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

        const display_el = document.querySelector("time");
        expect(display_el).toBeTruthy();
        expect(display_el.textContent).toBe("Select a date");
        expect(el.value).toBe("");

        const date = new Date();
        const isodate = utils.localized_isodate(date);
        select_date(display_el, date);

        // <time> element should contains the current date in iso format
        expect(display_el.textContent).toBe(isodate);
        // input element contains iso date
        expect(el.value).toBe(isodate);

        // Clear button is availale
        let clear_button = display_el.querySelector(".cancel-button");
        expect(clear_button).toBeTruthy();

        clear_button.click();

        // <time> element should contain the placeholder again
        expect(display_el.textContent).toBe("Select a date");
        // input element should be empty
        expect(el.value).toBe("");
    });
});

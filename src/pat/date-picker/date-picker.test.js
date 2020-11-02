import $ from "jquery";
import i18ndata from "./i18n.json";
import pattern from "./date-picker";
import utils from "../../core/utils";

describe("pat-date-picker", function () {
    beforeEach(function () {
        $(
            '<link href="src/pat/date-picker/date-picker.css" rel="stylesheet"/>'
        ).appendTo(document.head);
    });
    afterEach(function () {
        //$('head link[href$="date-picker.css"').remove();
        $("input.pat-date-picker").remove();
        $(".pika-single, .pika-lendar").remove();
        jest.restoreAllMocks();
    });

    it("Default date picker.", async function () {
        var $pika = $('<input type="date" class="pat-date-picker"/>').appendTo(
            document.body
        );
        pattern.init($pika);
        await utils.timeout(1); // wait a tick for async to settle.
        $pika.click();

        var date = new Date();
        var day = date.getDate().toString();
        var month = date.getMonth().toString(); // remember, month-count starts from 0
        var year = date.getFullYear().toString();

        // TODO: I'd love to set the date via the UI but I  can't get day.click() to have any effect...

        expect(
            document.querySelector(
                '.pika-lendar .pika-select-year option[selected="selected"]'
            ).textContent
        ).toBe(year);

        expect(
            document.querySelector(
                '.pika-lendar .pika-select-month option[selected="selected"]'
            ).value
        ).toBe(month);

        expect(
            document
                .querySelector(".pika-lendar td.is-today button")
                .getAttribute("data-pika-day")
        ).toBe(day);

        expect(
            document.querySelector(".pika-lendar th:first-child abbr")
                .textContent
        ).toBe("Sun");
    });

    it("Date picker starts at Monday.", async function () {
        var $pika = $(
            '<input type="date" class="pat-date-picker" data-pat-date-picker="first-day: 1" />'
        ).appendTo(document.body);
        pattern.init($pika);
        await utils.timeout(1); // wait a tick for async to settle.
        $pika.click();

        expect(
            document.querySelector(".pika-lendar th:first-child abbr")
                .textContent
        ).toBe("Mon");
    });

    it("Date picker with pre-set value.", async function () {
        var $pika = $(
            '<input type="date" class="pat-date-picker" value="1900-01-01"/>'
        ).appendTo(document.body);
        pattern.init($pika);
        await utils.timeout(1); // wait a tick for async to settle.
        $pika.click();

        expect(
            document.querySelector(
                '.pika-lendar .pika-select-year option[selected="selected"]'
            ).textContent
        ).toBe("1900");

        expect(
            document.querySelector(
                '.pika-lendar .pika-select-month option[selected="selected"]'
            ).value
        ).toBe("0");

        expect(
            document
                .querySelector(".pika-lendar td.is-selected button")
                .getAttribute("data-pika-day")
        ).toBe("1");
    });

    it("Date picker with week numbers.", async function () {
        var $pika = $(
            '<input type="date" class="pat-date-picker" data-pat-date-picker="week-numbers: show;" value="2017-09-18"/>'
        ).appendTo(document.body);
        pattern.init($pika);
        await utils.timeout(1); // wait a tick for async to settle.
        $pika.click();

        expect(
            document.querySelectorAll(".pika-lendar .pika-week")[0].textContent
        ).toBe("35");
    });

    describe("Date picker with i18n", function () {
        describe("with proper json URL", function () {
            it("properly localizes the months and weekdays", async function () {
                var $pika = $(
                    '<input type="date" class="pat-date-picker" value="2018-10-21" data-pat-date-picker="i18n:/path/to/i18njson" />'
                ).appendTo(document.body);
                // Simulate successful getJSON call
                jest.spyOn($, "getJSON").mockImplementation(() => {
                    return {
                        done: function (cb) {
                            cb(i18ndata);
                            return this;
                        },
                        fail: function () {
                            return this;
                        },
                        always: function (cb) {
                            cb();
                            return this;
                        },
                    };
                });
                pattern.init($pika);
                await utils.timeout(1); // wait a tick for async to settle.
                $pika.click();

                expect(
                    document.querySelector(
                        '.pika-lendar .pika-select-month option[selected="selected"]'
                    ).textContent
                ).toBe("Oktober");
            });
        });

        describe("with bogus json URL", function () {
            it("falls back to default (english) month and weekday labels ", async function () {
                var $pika = $(
                    '<input type="date" class="pat-date-picker" value="2018-10-21" data-pat-date-picker="i18n:/path/to/i18njson" />'
                ).appendTo(document.body);
                console.error = jest.fn(); // do not output error messages
                // Simulate failing getJSON call
                jest.spyOn($, "getJSON").mockImplementation(() => {
                    return {
                        done: function () {
                            return this;
                        },
                        fail: function (cb) {
                            cb();
                            return this;
                        },
                        always: function (cb) {
                            cb();
                            return this;
                        },
                    };
                });
                pattern.init($pika);
                await utils.timeout(1); // wait a tick for async to settle.
                $pika.click();
                expect(
                    document.querySelector(
                        '.pika-lendar .pika-select-month option[selected="selected"]'
                    ).textContent
                ).toBe("October");
            });
        });
    });

    describe("Update one input depending on the other.", function () {
        it("Updates with default offset-days", async (done) => {
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

            const cal1 = document.querySelectorAll(".pika-single")[0];
            const cal2 = document.querySelectorAll(".pika-single")[1];

            // Check initial values
            expect(start.value).toBeFalsy();
            expect(end.value).toBeFalsy();

            // Set start value
            start.click();

            let btn = cal1.querySelectorAll(".pika-table button")[0];
            btn.dispatchEvent(new Event("mousedown"));

            let start1 = start.value;
            let end1 = end.value;

            expect(start.value).toBeTruthy();
            expect(end.value).toBeTruthy();
            expect(start.value).toBe(end.value);

            // Setting it again to a date after the end date will change the end
            // date again.
            start.click();

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
            start.click();

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
            end.click();

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

            done();
        });

        it("Updates with offset-days 2", async (done) => {
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

            const cal1 = document.querySelectorAll(".pika-single")[0];

            // Check initial values
            expect(start.value).toBeFalsy();
            expect(end.value).toBeFalsy();

            // Set start value
            start.click();
            let btn = cal1.querySelectorAll(".pika-table button")[0];
            btn.dispatchEvent(new Event("mousedown"));
            // end date is set +2 days in advance of start date.
            expect(diff_days(start.value, end.value)).toBe(-2);

            // Change start value +1day
            start.click();
            btn = cal1.querySelectorAll(".pika-table button")[1];
            btn.dispatchEvent(new Event("mousedown"));
            // end date doesn't change.
            expect(diff_days(start.value, end.value)).toBe(-1);

            // Change start value +1day = same day
            start.click();
            btn = cal1.querySelectorAll(".pika-table button")[2];
            btn.dispatchEvent(new Event("mousedown"));
            // end date doesn't change.
            expect(diff_days(start.value, end.value)).toBe(0);

            // Change start value +1day = 1 day after end date
            start.click();
            btn = cal1.querySelectorAll(".pika-table button")[3];
            btn.dispatchEvent(new Event("mousedown"));
            // end is set 2 days after start date
            expect(diff_days(start.value, end.value)).toBe(-2);

            done();
        });
    });
});

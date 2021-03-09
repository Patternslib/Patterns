import $ from "jquery";
import pattern from "./datetime-picker";
import utils from "../../core/utils";

describe("pat-datetime-picker", function () {
    beforeEach(function () {
        $(
            '<link href="src/pat/datetime-picker/datetime-picker.css" rel="stylesheet"/>'
        ).appendTo(document.head);
    });
    afterEach(function () {
        //$('head link[href$="date-picker.css"').remove();
        $("input.pat-datetime-picker").remove();
        $(".datetime-picker-wrapper").remove();
        $(".pika-single, .pika-lendar").remove();
    });

    it("Default datetime picker.", async function () {
        // We mocking as if we're not supporting input type date.
        jest.spyOn(utils, "checkInputSupport").mockImplementation(() => false);

        document.body.innerHTML = `
            <input
                type="datetime-local"
                class="pat-datetime-picker"/>
        `;
        pattern.init(document.querySelector("input"));
        await utils.timeout(1); // wait a tick for async to settle.
        document.querySelector("input[type=text]").click();

        const date = new Date();
        const day = date.getDate().toString();
        const month = date.getMonth().toString(); // remember, month-count starts from 0
        const year = date.getFullYear().toString();

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

    it("Date/Time picker starts at Monday.", async function () {
        // We mocking as if we're not supporting input type date.
        jest.spyOn(utils, "checkInputSupport").mockImplementation(() => false);

        document.body.innerHTML = `
            <input
                type="datetime-local"
                class="pat-datetime-picker"
                data-pat-datetime-picker="first-day: 1" />
        `;
        pattern.init(document.querySelector("input"));
        await utils.timeout(1); // wait a tick for async to settle.
        document.querySelector("input[type=text]").click();

        expect(
            document.querySelector(".pika-lendar th:first-child abbr")
                .textContent
        ).toBe("Mon");
    });

    it("Date/Time picker with pre-set value.", async function () {
        // We mocking as if we're not supporting input type date.
        jest.spyOn(utils, "checkInputSupport").mockImplementation(() => false);

        document.body.innerHTML = `
            <input
                type="datetime-local"
                class="pat-datetime-picker"
                value="1900-01-01T00:00"/>
        `;
        pattern.init(document.querySelector("input"));
        await utils.timeout(1); // wait a tick for async to settle.
        document.querySelector("input[type=text]").click();

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

    it("Date/Time picker with week numbers.", async function () {
        // We mocking as if we're not supporting input type date.
        jest.spyOn(utils, "checkInputSupport").mockImplementation(() => false);

        document.body.innerHTML = `
            <input
                type="datetime-local"
                class="pat-datetime-picker"
                data-pat-datetime-picker="week-numbers: show;" value="2017-09-18T23:42"/>
        `;
        pattern.init(document.querySelector("input"));
        await utils.timeout(1); // wait a tick for async to settle.
        document.querySelector("input[type=text]").click();

        expect(
            document.querySelectorAll(".pika-lendar .pika-week")[0].textContent
        ).toBe("35");
    });

    it("Test today and clear buttons.", async function () {
        // We mocking as if we're not supporting input type date.
        jest.spyOn(utils, "checkInputSupport").mockImplementation(() => false);

        Date.prototype.toISOString = jest.fn(() => "2021-05-01T10:10:10");
        Date.prototype.toTimeString = jest.fn(() => "10:10:10 GMT+0200");

        document.body.innerHTML = `
            <input type="datetime-local"/>
        `;

        pattern.init(document.querySelector("input"));
        await utils.timeout(1); // wait a tick for async to settle.

        expect(document.querySelector("input[type=text]").value).toBe("");
        expect(document.querySelector("input[type=time]").value).toBe("");
        expect(document.querySelector("input[type=datetime-local]").value).toBe(""); // prettier-ignore

        document.querySelector("._btn._now").click();

        expect(document.querySelector("input[type=text]").value).toBe("2021-05-01"); // prettier-ignore
        expect(document.querySelector("input[type=time]").value).toBe("10:10"); // prettier-ignore
        expect(document.querySelector("input[type=datetime-local]").value).toBe("2021-05-01T10:10"); // prettier-ignore

        Date.prototype.toISOString.mockRestore();
        Date.prototype.toTimeString.mockRestore();
    });
});

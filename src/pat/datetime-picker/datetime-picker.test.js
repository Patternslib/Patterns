import pattern from "./datetime-picker";
import { storage } from "../date-picker/date-picker";
import i18n from "../date-picker/i18n.json";
import events from "../../core/events";
import utils from "../../core/utils";
import { jest } from "@jest/globals";

describe("pat-datetime-picker", function () {
    afterEach(function () {
        for (const input of document.querySelectorAll(".pat-datetime-picker__date")) {
            input["pattern-date-picker"]?.pikaday?.destroy();
        }
        document.body.replaceChildren();
        storage.remove("/datetime-i18n.json");
        jest.restoreAllMocks();
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
                '.pika-lendar .pika-select-year option[selected="selected"]',
            ).textContent,
        ).toBe(year);

        expect(
            document.querySelector(
                '.pika-lendar .pika-select-month option[selected="selected"]',
            ).value,
        ).toBe(month);

        expect(
            document
                .querySelector(".pika-lendar td.is-today button")
                .getAttribute("data-pika-day"),
        ).toBe(day);

        expect(
            document.querySelector(".pika-lendar th:first-child abbr").textContent,
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
            document.querySelector(".pika-lendar th:first-child abbr").textContent,
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
                '.pika-lendar .pika-select-year option[selected="selected"]',
            ).textContent,
        ).toBe("1900");

        expect(
            document.querySelector(
                '.pika-lendar .pika-select-month option[selected="selected"]',
            ).value,
        ).toBe("0");

        expect(
            document
                .querySelector(".pika-lendar td.is-selected button")
                .getAttribute("data-pika-day"),
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

        expect(document.querySelectorAll(".pika-lendar .pika-week")[0].textContent).toBe(
            "35",
        );
    });

    it("Test today and clear buttons.", async function () {
        // We mocking as if we're not supporting input type date.
        jest.spyOn(utils, "checkInputSupport").mockImplementation(() => false);

        jest.spyOn(utils, "localized_isodate").mockReturnValue("2021-05-01");
        jest.spyOn(Date.prototype, "toTimeString").mockReturnValue("10:10:10 GMT+0200");

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

        document.querySelector("._btn._clear").click();
        expect(document.querySelector("input[type=text]").value).toBe("");
        expect(document.querySelector("input[type=time]").value).toBe("");
        expect(document.querySelector("input[type=datetime-local]").value).toBe("");
    });

    it("keeps the native date-time control by default when supported", async () => {
        jest.spyOn(utils, "checkInputSupport").mockReturnValue(true);
        document.body.innerHTML =
            '<input type="datetime-local" class="pat-datetime-picker">';
        const input = document.querySelector("input");
        await events.await_pattern_init(pattern.init(input));

        expect(input.style.display).toBe("");
        expect(document.querySelector(".pat-datetime-picker__wrapper")).toBeNull();
    });

    it("opens a localized calendar on an editable date when native controls are supported", async () => {
        jest.spyOn(utils, "checkInputSupport").mockReturnValue(true);
        storage.set("/datetime-i18n.json", i18n);
        document.body.innerHTML = `
            <form>
                <input type="datetime-local" name="event" class="pat-datetime-picker"
                       value="2021-10-21T12:34"
                       data-pat-datetime-picker="behavior: editable; i18n: /datetime-i18n.json">
            </form>
        `;
        const input = document.querySelector("[name=event]");
        await events.await_pattern_init(pattern.init(input));

        const date = document.querySelector(".pat-datetime-picker__date");
        const time = document.querySelector("input[type=time]");
        expect(date.type).toBe("text");
        expect(date.value).toBe("2021-10-21");
        expect(time.value).toBe("12:34");
        expect(document.querySelector(".output-field")).toBeNull();

        date.click();
        const calendar = document.querySelector(".pika-single:not(.is-hidden)");
        const month = calendar.querySelector(".pika-select-month option:checked");
        expect(month.textContent).toBe("Oktober");
        calendar
            .querySelector('[data-pika-day="22"]')
            .dispatchEvent(new Event("mousedown"));
        expect(new FormData(input.form).get("event")).toBe("2021-10-22T12:34");

        date.value = "2021-10-23";
        date.dispatchEvent(new Event("change", { bubbles: true }));
        time.value = "15:45";
        time.dispatchEvent(new Event("change", { bubbles: true }));
        expect(new FormData(input.form).get("event")).toBe("2021-10-23T15:45");
    });

    it("localizes the styled date, constrains selection, and submits the combined value", async () => {
        jest.spyOn(utils, "checkInputSupport").mockReturnValue(true);
        storage.set("/datetime-i18n.json", i18n);
        document.body.innerHTML = `
            <form><label>Date and time
                <input type="datetime-local" name="event" class="pat-datetime-picker"
                       value="2021-10-21T12:34" min="2021-10-20T08:00" max="2021-10-22T18:00"
                       data-pat-datetime-picker="behavior: styled; output-format: Do MMMM YYYY; locale: de; i18n: /datetime-i18n.json">
            </label></form>
        `;
        const input = document.querySelector("[name=event]");
        await events.await_pattern_init(pattern.init(input));

        const display = document.querySelector(".output-field");
        expect(display.textContent).toBe("21. Oktober 2021");
        display.click();

        const calendar = document.querySelector(".pika-single:not(.is-hidden)");
        expect(
            calendar.querySelector(".pika-select-month option:checked").textContent,
        ).toBe("Oktober");
        expect(
            calendar
                .querySelector('[data-pika-day="19"]')
                .parentElement.classList.contains("is-disabled"),
        ).toBe(true);
        expect(
            calendar
                .querySelector('[data-pika-day="23"]')
                .parentElement.classList.contains("is-disabled"),
        ).toBe(true);
        const selected = calendar.querySelector('[data-pika-day="22"]');
        selected.dispatchEvent(new Event("mousedown", { bubbles: true }));

        const time = document.querySelector("input[type=time]");
        expect(
            time.dispatchEvent(
                new MouseEvent("click", { bubbles: true, cancelable: true }),
            ),
        ).toBe(true);
        time.value = "17:30";
        time.dispatchEvent(new Event("change", { bubbles: true }));
        expect(display.getAttribute("datetime")).toBe("2021-10-22");
        expect(new FormData(input.form).get("event")).toBe("2021-10-22T17:30");

        time.value = "19:00";
        time.dispatchEvent(new Event("change", { bubbles: true }));
        expect(input.validity.rangeOverflow).toBe(true);

        display.querySelector(".cancel-button").click();
        expect(input.value).toBe("");
    });

    it.each(["native", "styled"])(
        "updates a dependent date-time in %s mode",
        async (behavior) => {
            jest.spyOn(utils, "checkInputSupport").mockReturnValue(true);
            document.body.innerHTML = `
            <input type="datetime-local" id="event-start">
            <input type="datetime-local" class="pat-datetime-picker"
                   data-pat-datetime-picker="behavior: ${behavior}; after: #event-start; offset-days: 2">
        `;
            const start = document.querySelector("#event-start");
            const end = document.querySelector(".pat-datetime-picker");
            await events.await_pattern_init(pattern.init(end));

            start.value = "2021-03-13T12:34";
            start.dispatchEvent(new Event("change"));
            expect(end.value).toBe("2021-03-15T12:34");
            if (behavior === "styled") {
                expect(document.querySelector(".output-field").textContent).toBe(
                    "2021-03-15",
                );
                expect(document.querySelector("input[type=time]").value).toBe("12:34");
            }

            start.value = "2021-03-15T11:34";
            start.dispatchEvent(new Event("change"));
            expect(end.value).toBe("2021-03-15T12:34");
        },
    );
});

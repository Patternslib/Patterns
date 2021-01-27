import pattern from "./calendar";
import registry from "../../core/registry";
import utils from "../../core/utils";

const mockFetch = () =>
    Promise.resolve({
        json: () =>
            Promise.resolve({
                items: [
                    {
                        title: "Event 1",
                        start: "2020-10-10T10:00:00Z",
                        end: "2020-10-10T12:00:00Z",
                    },
                    {
                        "title": "Event 2",
                        "start": "2020-10-12",
                        "end": "2020-10-12",
                        "@id": "./test_event.html",
                    },
                    {
                        title: "Event 3",
                        start: "2020-10-14",
                        end: "2020-10-16",
                    },
                ],
            }),
    });

describe("Calendar tests", () => {
    beforeEach(() => {
        // create container
        const el = document.createElement("div");
        el.setAttribute("class", "root-element");
        el.innerHTML = `
          <div class="pat-calendar">
            <h1 class="cal-title">title</h1>
            <div class="cal-toolbar">
              <fieldset class="cal-nav">
                <button class="jump-prev" title="Back" type="button">&lt;</button>
                <button class="jump-today" title="Today" type="button">Today</button>
                <button class="jump-next" title="Forward" type="button">&gt;</button>
              </fieldset>
              <fieldset class="cal-views">
                <button class="view-month" type="button">Month</button>
                <button class="view-week" type="button">Week</button>
                <button class="view-day" type="button">Day</button>
              </fieldset>
              <fieldset class="cal-timezone">
                <select name="timezone" class="timezone">
                  <option value="Africa/Dakar">(GMT+00:00) Dakar, Monrovia, Reykjavik</option>
                  <option value="Europe/London">(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London</option>
                  <option value="Europe/Berlin" selected="selected">(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna</option>
                  <option value="Europe/Athens">(GMT+02:00) Athens, Bucharest, Istanbul</option>
                  <option value="Europe/Moscow">(GMT+03:00) Moscow, St. Petersburg, Volgograd</option>
                </select>
              </fieldset>
            </div>
          </div>
        `;
        document.body.appendChild(el);
    });

    afterEach(() => {
        // remove container
        document.body.removeChild(document.querySelector(".root-element"));

        // reset query string
        history.replaceState(null, null, "?"); // empty string doesn't reset, so "?"...
    });

    it("Initializes correctly", async (done) => {
        const el = document.querySelector(".pat-calendar");
        registry.scan(document.body);
        await utils.timeout(1); // wait a tick for async to settle.
        expect(el.querySelector(".pat-calendar__fc")).toBeTruthy();
        expect(el.querySelector(".pat-calendar__fc").innerHTML).toBeTruthy();
        done();
    });

    it("Initializes with the default dayGridMonth view", async (done) => {
        const el = document.querySelector(".pat-calendar");
        registry.scan(document.body);
        await utils.timeout(1); // wait a tick for async to settle.
        expect(el.querySelector(".fc-dayGridMonth-view")).toBeTruthy();
        done();
    });

    it("Initializes with the timeGridWeek view when configured", async (done) => {
        const el = document.querySelector(".pat-calendar");
        el.setAttribute("data-pat-calendar", "initial-view: agendaWeek");
        registry.scan(document.body);
        await utils.timeout(1); // wait a tick for async to settle.
        expect(el.querySelector(".fc-timeGridWeek-view")).toBeTruthy();
        done();
    });

    it("Initializes with the timeGridDay view when configured", async (done) => {
        const el = document.querySelector(".pat-calendar");
        el.setAttribute("data-pat-calendar", "initial-view: agendaDay");
        registry.scan(document.body);
        await utils.timeout(1); // wait a tick for async to settle.
        expect(el.querySelector(".fc-timeGridDay-view")).toBeTruthy();
        done();
    });

    it("Updates title according to display", async (done) => {
        const el = document.querySelector(".pat-calendar");
        el.setAttribute(
            "data-pat-calendar",
            "initial-date: 2000-10-10; initial-view: month"
        );

        const title_el = el.querySelector(".cal-title");
        let title = title_el.innerHTML;

        registry.scan(document.body);
        await utils.timeout(1); // wait a tick for async to settle.

        expect(title_el.innerHTML === title).toBeFalsy();
        title = title_el.innerHTML;

        el.querySelector(".view-week").click();
        expect(title_el.innerHTML === title).toBeFalsy();
        title = title_el.innerHTML;

        el.querySelector(".view-day").click();
        expect(title_el.innerHTML === title).toBeFalsy();
        title = title_el.innerHTML;

        el.querySelector(".view-month").click();
        expect(title_el.innerHTML === title).toBeFalsy();
        title = title_el.innerHTML;

        el.querySelector(".jump-next").click();
        expect(title_el.innerHTML === title).toBeFalsy();
        title = title_el.innerHTML;

        el.querySelector(".jump-prev").click();
        expect(title_el.innerHTML === title).toBeFalsy();
        title = title_el.innerHTML;

        el.querySelector(".jump-today").click();
        expect(title_el.innerHTML === title).toBeFalsy();
        title = title_el.innerHTML;

        done();
    });

    it("Changes views when clicked", async (done) => {
        const el = document.querySelector(".pat-calendar");
        registry.scan(document.body);
        await utils.timeout(1); // wait a tick for async to settle.

        el.querySelector(".view-week").click();
        expect(el.querySelector(".view-week.active")).toBeTruthy();
        expect(el.querySelector(".view-day.active")).toBeFalsy();
        expect(el.querySelector(".view-month.active")).toBeFalsy();
        expect(el.querySelector(".fc-dayGridMonth-view")).toBeFalsy();
        expect(el.querySelector(".fc-timeGridWeek-view")).toBeTruthy();
        expect(el.querySelector(".fc-timeGridDay-view")).toBeFalsy();

        el.querySelector(".view-day").click();
        expect(el.querySelector(".view-week.active")).toBeFalsy();
        expect(el.querySelector(".view-day.active")).toBeTruthy();
        expect(el.querySelector(".view-month.active")).toBeFalsy();
        expect(el.querySelector(".fc-dayGridMonth-view")).toBeFalsy();
        expect(el.querySelector(".fc-timeGridWeek-view")).toBeFalsy();
        expect(el.querySelector(".fc-timeGridDay-view")).toBeTruthy();

        el.querySelector(".view-month").click();
        expect(el.querySelector(".view-week.active")).toBeFalsy();
        expect(el.querySelector(".view-day.active")).toBeFalsy();
        expect(el.querySelector(".view-month.active")).toBeTruthy();
        expect(el.querySelector(".fc-dayGridMonth-view")).toBeTruthy();
        expect(el.querySelector(".fc-timeGridWeek-view")).toBeFalsy();
        expect(el.querySelector(".fc-timeGridDay-view")).toBeFalsy();

        done();
    });

    it("Loads initial date and navigates for/backwards", async (done) => {
        const el = document.querySelector(".pat-calendar");
        el.setAttribute(
            "data-pat-calendar",
            "initial-date: 2000-10-10; initial-view: month"
        );
        registry.scan(document.body);
        await utils.timeout(1); // wait a tick for async to settle.

        expect(el.querySelector("*[data-date='2000-10-10']")).toBeTruthy();

        el.querySelector(".jump-next").click();
        expect(el.querySelector("*[data-date='2000-11-10']")).toBeTruthy();

        el.querySelector(".jump-prev").click();
        expect(el.querySelector("*[data-date='2000-10-10']")).toBeTruthy();

        let date = new Date();
        date = date.toISOString().split("T")[0];
        el.querySelector(".jump-today").click();
        expect(el.querySelector(`*[data-date='${date}']`)).toBeTruthy();

        done();
    });

    it("Loads events from a JSON feed", async (done) => {
        const el = document.querySelector(".pat-calendar");
        el.setAttribute(
            "data-pat-calendar",
            "initial-date: 2020-10-10; url: ./test.json;"
        );

        global.fetch = jest.fn().mockImplementation(mockFetch);

        registry.scan(document.body);
        await utils.timeout(1); // wait a tick for async to settle.

        let titles = [...el.querySelectorAll(".fc-event-title")].map(
            (it) => it.innerHTML
        );

        expect(titles.includes("Event 1")).toBeTruthy();
        expect(titles.includes("Event 2")).toBeTruthy();
        expect(titles.includes("Event 3")).toBeTruthy();

        global.fetch.mockClear();
        delete global.fetch;
        done();
    });

    it("Loads events and does not set the href if not present", async (done) => {
        const el = document.querySelector(".pat-calendar");
        el.setAttribute(
            "data-pat-calendar",
            "initial-date: 2020-10-10; url: ./test.json;"
        );

        global.fetch = jest.fn().mockImplementation(mockFetch);

        registry.scan(document.body);
        await utils.timeout(1); // wait a tick for async to settle.

        const events = [...document.querySelectorAll(".fc-event-title")];

        const event1 = events.filter((it) => it.textContent === "Event 1")[0].closest(".fc-event"); // prettier-ignore
        const event2 = events.filter((it) => it.textContent === "Event 2")[0].closest(".fc-event"); // prettier-ignore
        const event3 = events.filter((it) => it.textContent === "Event 3")[0].closest(".fc-event"); // prettier-ignore

        expect(event1.href).toBeFalsy();
        expect(event2.href).toBe("http://localhost/test_event.html");
        expect(event3.href).toBeFalsy();

        global.fetch.mockClear();
        delete global.fetch;
        done();
    });

    it("Loads correct date if set in query string", async (done) => {
        const el = document.querySelector(".pat-calendar");
        el.setAttribute("data-pat-calendar", "timezone: Europe/Berlin");
        window.history.replaceState(
            null,
            null,
            "?date=2020-02-29T23%3A00%3A00.000Z&view=dayGridMonth"
        );
        pattern.init(el);
        await utils.timeout(1); // wait a tick for async to settle.

        const title_el = el.querySelector(".cal-title");
        expect(title_el.innerHTML).toEqual("March 2020");

        done();
    });
});

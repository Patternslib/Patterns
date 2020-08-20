import registry from "../../core/registry";
import utils from "../../core/utils";

const mockXHR = {
    open: jest.fn(),
    send: function () {
        // need function for pointing to correct ``this``.
        return this.onload();
    },
    status: 200,
    setRequestHeader: jest.fn(),
    responseText: JSON.stringify([
        {
            title: "Event 1",
            start: "2020-10-10T10:00:00Z",
            end: "2020-10-10T12:00:00Z",
        },
        {
            title: "Event 2",
            start: "2020-10-12",
            end: "2020-10-12",
        },
        {
            title: "Event 3",
            start: "2020-10-14",
            end: "2020-10-16",
        },
    ]),
};

describe("Calendar tests", () => {
    beforeEach(() => {
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
        document.body.removeChild(document.querySelector(".root-element"));
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
        expect(el.querySelector(".fc-dayGridMonth-view")).toBeFalsy();
        expect(el.querySelector(".fc-timeGridWeek-view")).toBeTruthy();
        expect(el.querySelector(".fc-timeGridDay-view")).toBeFalsy();

        el.querySelector(".view-day").click();
        expect(el.querySelector(".fc-dayGridMonth-view")).toBeFalsy();
        expect(el.querySelector(".fc-timeGridWeek-view")).toBeFalsy();
        expect(el.querySelector(".fc-timeGridDay-view")).toBeTruthy();

        el.querySelector(".view-month").click();
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

        window.XMLHttpRequest = jest.fn(() => mockXHR);

        registry.scan(document.body);
        await utils.timeout(1); // wait a tick for async to settle.

        let titles = [...el.querySelectorAll(".fc-event-title")].map(
            (it) => it.innerHTML
        );

        expect(titles.includes("Event 1")).toBeTruthy();
        expect(titles.includes("Event 2")).toBeTruthy();
        expect(titles.includes("Event 3")).toBeTruthy();

        done();
    });
});

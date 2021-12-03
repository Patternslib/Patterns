import Pattern from "./display-time";
import utils from "../../core/utils";
import tzmock from "timezone-mock";

describe("pat-display-time tests", () => {
    beforeEach(function () {
        tzmock.register("US/Pacific");
    });

    afterEach(function () {
        tzmock.unregister();
        document.body.innerHTML = "";
    });

    it("default", async () => {
        document.body.innerHTML = `
          <time
              class="pat-display-time"
              datetime="2021-04-22T10:00Z">
          </time>
        `;
        const el = document.querySelector(".pat-display-time");

        Pattern.init(el);
        await utils.timeout(1); // wait a tick for async to settle.

        expect(el.textContent).toBe("2021-04-22T03:00:00-07:00");
    });

    it("Example setting the output format explicitly", async () => {
        document.body.innerHTML = `
          <time
              class="pat-display-time"
              datetime="2021-04-22T10:00Z"
              data-pat-display-time="output-format: MMMM dddd Do YYYY, h:mm:ss a">
          </time>
        `;
        const el = document.querySelector(".pat-display-time");

        Pattern.init(el);
        await utils.timeout(1); // wait a tick for async to settle.

        expect(el.textContent).toBe("April Thursday 22nd 2021, 3:00:00 am");
    });

    it("Example setting the output format explicitly in German", async () => {
        document.body.innerHTML = `
          <time
              class="pat-display-time"
              datetime="2021-04-22T23:00Z"
              data-pat-display-time="output-format: MMMM dddd Do YYYY, h:mm:ss; locale: de">
          </time>
        `;
        const el = document.querySelector(".pat-display-time");

        Pattern.init(el);
        await utils.timeout(1); // wait a tick for async to settle.

        expect(el.textContent).toBe("April Donnerstag 22. 2021, 4:00:00");
    });

    it("Example setting the output format explicitly in German using the lang attribute", async () => {
        document.body.innerHTML = `
          <time
              class="pat-display-time"
              datetime="2021-04-22T23:00Z"
              lang="de"
              data-pat-display-time="output-format: MMMM dddd Do YYYY, h:mm:ss">
          </time>
        `;
        const el = document.querySelector(".pat-display-time");

        Pattern.init(el);
        await utils.timeout(1); // wait a tick for async to settle.

        expect(el.textContent).toBe("April Donnerstag 22. 2021, 4:00:00");
    });

    it("Example setting the output format in German due containment in German container", async () => {
        document.body.innerHTML = `
          <section lang="de">
              <time
                  class="pat-display-time"
                  datetime="2021-04-22T23:00Z"
                  data-pat-display-time="output-format: MMMM dddd Do YYYY, h:mm:ss">
              </time>
          </section>
        `;
        const el = document.querySelector(".pat-display-time");

        Pattern.init(el);
        await utils.timeout(1); // wait a tick for async to settle.

        expect(el.textContent).toBe("April Donnerstag 22. 2021, 4:00:00");
    });

    it("Output formatted as local", async () => {
        document.body.innerHTML = `
          <time
              class="pat-display-time"
              datetime="2021-04-22T10:00Z"
              data-pat-display-time="output-format: L">
          </time>
        `;
        const el = document.querySelector(".pat-display-time");

        Pattern.init(el);
        await utils.timeout(1); // wait a tick for async to settle.

        expect(el.textContent).toBe("04/22/2021");
    });
    it("Output formatted as 'from now'", async () => {
        document.body.innerHTML = `
          <time
              class="pat-display-time"
              datetime="2000-04-22T10:00Z"
              data-pat-display-time="from-now: true">
          </time>
        `;
        const el = document.querySelector(".pat-display-time");

        Pattern.init(el);
        await utils.timeout(1); // wait a tick for async to settle.

        expect(el.textContent.indexOf("years ago") >= 0).toBe(true);
    });
    it("Output formatted as 'from now' with no suffix", async () => {
        document.body.innerHTML = `
          <time
              class="pat-display-time"
              datetime="2000-04-22T10:00Z"
              data-pat-display-time="from-now: true; no-suffix: true">
          </time>
        `;
        const el = document.querySelector(".pat-display-time");

        Pattern.init(el);
        await utils.timeout(1); // wait a tick for async to settle.

        expect(el.textContent.indexOf("years") >= 0).toBe(true);
        expect(el.textContent.indexOf("years ago") === -1).toBe(true);
    });
    it("Output formatted as 'from now' with no suffix in german", async () => {
        document.body.innerHTML = `
          <time
              class="pat-display-time"
              datetime="2000-04-22T10:00Z"
              data-pat-display-time="from-now: true; no-suffix: true; locale: de">
          </time>
        `;
        const el = document.querySelector(".pat-display-time");

        Pattern.init(el);
        await utils.timeout(1); // wait a tick for async to settle.

        expect(el.textContent.indexOf("Jahre") >= 0).toBe(true);
    });

    it("Output formatted as 'from now' with no suffix in german using the lang attribute", async () => {
        document.body.innerHTML = `
          <time
              class="pat-display-time"
              datetime="2000-04-22T10:00Z"
              lang="de"
              data-pat-display-time="from-now: true; no-suffix: true">
          </time>
        `;
        const el = document.querySelector(".pat-display-time");

        Pattern.init(el);
        await utils.timeout(1); // wait a tick for async to settle.

        expect(el.textContent.indexOf("Jahre") >= 0).toBe(true);
    });

    it("Formating empty datetime clears the display.", async () => {
        document.body.innerHTML = `
          <time class="pat-display-time">
          </time>
        `;
        const el = document.querySelector(".pat-display-time");

        Pattern.init(el);
        await utils.timeout(1); // wait a tick for async to settle.

        expect(el.textContent).toBe("");
    });
});

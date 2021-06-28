import pattern from "./tabs";
import utils from "../../core/utils";
import { DEBOUNCE_TIMEOUT } from "./tabs";

describe("pat-tabs", function () {
    afterEach(function () {
        jest.restoreAllMocks();
        document.body.innerHTML = "";
    });

    it("1 - Tabs which do not fit into a single line will be put into .extra-tabs.", async () => {
        document.body.innerHTML = `
            <nav class="pat-tabs">
                <a>1</a>
                <a>2</a>
                <a>3</a>
                <a>4</a>
            </nav>
        `;

        const nav = document.querySelector(".pat-tabs");
        const tabs = document.querySelectorAll(".pat-tabs a");

        // Mock layout.
        jest.spyOn(nav, "getBoundingClientRect").mockImplementation(() => { return { x: 100 }; }); // prettier-ignore
        jest.spyOn(nav, "clientWidth", "get").mockImplementation(() => 340);
        jest.spyOn(tabs[0], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[1], "getBoundingClientRect").mockImplementation(() => { return { x: 200, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[2], "getBoundingClientRect").mockImplementation(() => { return { x: 300, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[3], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore

        expect(nav.classList.contains("tabs-ready")).toBeFalsy();
        pattern.init(nav);
        await utils.timeout(DEBOUNCE_TIMEOUT);

        expect(nav.querySelector(".extra-tabs")).toBeTruthy();
        expect(nav.querySelector(".extra-tabs").children.length).toBe(1);
        expect(nav.classList.contains("tabs-wrapped")).toBeTruthy();
        expect(nav.classList.contains("tabs-ready")).toBeTruthy();
    });

    it("2 - More tabs which do not fit into a single line will be put into .extra-tabs.", async () => {
        document.body.innerHTML = `
            <nav class="pat-tabs">
                <a>1</a>
                <a>2</a>
                <a>3</a>
                <a>4</a>
            </nav>
        `;

        const nav = document.querySelector(".pat-tabs");
        const tabs = document.querySelectorAll(".pat-tabs a");

        // Mock layout.
        jest.spyOn(nav, "getBoundingClientRect").mockImplementation(() => { return { x: 100 }; }); // prettier-ignore
        jest.spyOn(nav, "clientWidth", "get").mockImplementation(() => 200);
        jest.spyOn(tabs[0], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[1], "getBoundingClientRect").mockImplementation(() => { return { x: 200, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[2], "getBoundingClientRect").mockImplementation(() => { return { x: 300, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[3], "getBoundingClientRect").mockImplementation(() => { return { x: 400, width: 40 }; }); // prettier-ignore

        expect(nav.classList.contains("tabs-ready")).toBeFalsy();
        pattern.init(nav);
        await utils.timeout(DEBOUNCE_TIMEOUT);

        expect(nav.querySelector(".extra-tabs")).toBeTruthy();
        expect(nav.querySelector(".extra-tabs").children.length).toBe(2);
        expect(nav.classList.contains("tabs-wrapped")).toBeTruthy();
        expect(nav.classList.contains("tabs-ready")).toBeTruthy();
    });

    it("3 - When all tabs fit into a sinlge line, no extra-tabs will be used.", async () => {
        document.body.innerHTML = `
            <nav class="pat-tabs">
                <a>1</a>
                <a>2</a>
                <a>3</a>
                <a>4</a>
            </nav>
        `;

        const nav = document.querySelector(".pat-tabs");
        const tabs = document.querySelectorAll(".pat-tabs a");

        // Mock layout.
        jest.spyOn(nav, "getBoundingClientRect").mockImplementation(() => { return { x: 100 }; }); // prettier-ignore
        jest.spyOn(nav, "clientWidth", "get").mockImplementation(() => 340);
        jest.spyOn(tabs[0], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[1], "getBoundingClientRect").mockImplementation(() => { return { x: 200, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[2], "getBoundingClientRect").mockImplementation(() => { return { x: 300, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[3], "getBoundingClientRect").mockImplementation(() => { return { x: 400, width: 40 }; }); // prettier-ignore

        expect(nav.classList.contains("tabs-ready")).toBeFalsy();
        pattern.init(nav);
        await utils.timeout(DEBOUNCE_TIMEOUT);

        expect(nav.querySelector(".extra-tabs")).toBeFalsy();
        expect(nav.classList.contains("tabs-wrapped")).toBeFalsy();
        expect(nav.classList.contains("tabs-ready")).toBeTruthy();
    });

    it("4 - The order of items in extra-tabs will be retained.", async () => {
        document.body.innerHTML = `
            <nav class="pat-tabs">
                <a>1</a>
                <a>2</a>
                <a>3</a>
                <a>4</a>
            </nav>
        `;

        const nav = document.querySelector(".pat-tabs");
        const tabs = document.querySelectorAll(".pat-tabs a");

        // Mock layout.
        jest.spyOn(nav, "getBoundingClientRect").mockImplementation(() => { return { x: 100 }; }); // prettier-ignore
        jest.spyOn(nav, "clientWidth", "get").mockImplementation(() => 40);
        jest.spyOn(tabs[0], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[1], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[2], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[3], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore

        expect(nav.classList.contains("tabs-ready")).toBeFalsy();
        pattern.init(nav);
        await utils.timeout(DEBOUNCE_TIMEOUT);

        expect(nav.querySelector(".extra-tabs")).toBeTruthy();
        expect(nav.querySelector(".extra-tabs").children.length).toBe(3);
        expect(nav.querySelector(".extra-tabs").children[0].textContent).toBe("2");
        expect(nav.querySelector(".extra-tabs").children[1].textContent).toBe("3");
        expect(nav.querySelector(".extra-tabs").children[2].textContent).toBe("4");

        expect(nav.classList.contains("tabs-wrapped")).toBeTruthy();
        expect(nav.classList.contains("tabs-ready")).toBeTruthy();
    });

    it("5 - Clicking on extra-tabs toggles the ``open`` and ``closed`` classes.", async () => {
        document.body.innerHTML = `
            <nav class="pat-tabs">
                <a>1</a>
                <a>2</a>
            </nav>
        `;

        const nav = document.querySelector(".pat-tabs");
        const tabs = document.querySelectorAll(".pat-tabs a");

        // Mock layout.
        jest.spyOn(nav, "getBoundingClientRect").mockImplementation(() => { return { x: 100 }; }); // prettier-ignore
        jest.spyOn(nav, "clientWidth", "get").mockImplementation(() => 40);
        jest.spyOn(tabs[0], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[1], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore

        pattern.init(nav);
        await utils.timeout(DEBOUNCE_TIMEOUT);

        const extra_tabs = nav.querySelector(".extra-tabs");

        expect(nav.classList.contains("open")).toBeFalsy();
        expect(nav.classList.contains("closed")).toBeTruthy();

        extra_tabs.click();
        expect(nav.classList.contains("open")).toBeTruthy();
        expect(nav.classList.contains("closed")).toBeFalsy();

        extra_tabs.click();
        expect(nav.classList.contains("open")).toBeFalsy();
        expect(nav.classList.contains("closed")).toBeTruthy();
    });

    it("6 - If there are no extra-tabs, there is no default ``closed`` class.", async () => {
        document.body.innerHTML = `
            <nav class="pat-tabs">
                <a>1</a>
                <a>2</a>
            </nav>
        `;

        const nav = document.querySelector(".pat-tabs");
        const tabs = document.querySelectorAll(".pat-tabs a");

        // Mock layout.
        jest.spyOn(nav, "getBoundingClientRect").mockImplementation(() => { return { x: 100 }; }); // prettier-ignore
        jest.spyOn(nav, "clientWidth", "get").mockImplementation(() => 140);
        jest.spyOn(tabs[0], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[1], "getBoundingClientRect").mockImplementation(() => { return { x: 200, width: 40 }; }); // prettier-ignore

        pattern.init(nav);
        await utils.timeout(DEBOUNCE_TIMEOUT);

        const extra_tabs = nav.querySelector(".extra-tabs");
        expect(extra_tabs).toBeFalsy();

        expect(nav.classList.contains("closed")).toBeFalsy();
    });

    it("7 - The adjust_tabs method is called after 10ms.", async () => {
        document.body.innerHTML = `<nav class="pat-tabs"></nav>`;
        const nav = document.querySelector(".pat-tabs");

        const pat = pattern.init(nav);
        const spy_adjust_tabs = jest
            .spyOn(pat, "adjust_tabs")
            .mockImplementation(() => {});
        expect(spy_adjust_tabs).not.toHaveBeenCalled();
        await utils.timeout(1);
        expect(spy_adjust_tabs).not.toHaveBeenCalled();
        await utils.timeout(5);
        expect(spy_adjust_tabs).not.toHaveBeenCalled();
        await utils.timeout(4);
        expect(spy_adjust_tabs).toHaveBeenCalled();
    });

    it("8 - The available width is calculated once before adjusting tabs and once more after adding the extra tabs span.", async () => {
        // To avoid re-adjusting the available width for each iteration but to
        // take a layout change into account once the extra-tabs element was
        // added, the _get_max_x method is called only twice.
        document.body.innerHTML = `
            <nav class="pat-tabs">
                <a>1</a>
                <a>2</a>
                <a>3</a>
                <a>4</a>
            </nav>
        `;

        const nav = document.querySelector(".pat-tabs");
        const tabs = document.querySelectorAll(".pat-tabs a");

        // Mock layout.
        jest.spyOn(nav, "getBoundingClientRect").mockImplementation(() => { return { x: 100 }; }); // prettier-ignore
        jest.spyOn(nav, "clientWidth", "get").mockImplementation(() => 40);
        jest.spyOn(tabs[0], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[1], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[2], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[3], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore

        expect(nav.classList.contains("tabs-ready")).toBeFalsy();
        const pat = pattern.init(nav);
        const spy_get_max_x = jest.spyOn(pat, "_get_max_x");

        await utils.timeout(DEBOUNCE_TIMEOUT);

        expect(nav.querySelector(".extra-tabs")).toBeTruthy();
        expect(nav.querySelector(".extra-tabs").children.length).toBe(3);

        expect(nav.classList.contains("tabs-wrapped")).toBeTruthy();
        expect(nav.classList.contains("tabs-ready")).toBeTruthy();

        expect(spy_get_max_x).toHaveBeenCalledTimes(2);
    });
});

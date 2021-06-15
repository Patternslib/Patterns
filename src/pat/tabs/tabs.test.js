import pattern from "./tabs";
import utils from "../../core/utils";

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

        // Mock layout.
        const tabs = document.querySelectorAll(".pat-tabs a");
        jest.spyOn(tabs[0], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[1], "getBoundingClientRect").mockImplementation(() => { return { x: 200, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[2], "getBoundingClientRect").mockImplementation(() => { return { x: 300, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[3], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore

        const nav = document.querySelector(".pat-tabs");
        expect(nav.classList.contains("tabs-ready")).toBeFalsy();
        pattern.init(nav);
        await utils.timeout(11);

        expect(nav.querySelector(".extra-tabs")).toBeTruthy();
        expect(nav.querySelector(".extra-tabs").children.length).toBe(1);
        expect(nav.classList.contains("tabs-wrapped")).toBeTruthy();
        expect(nav.classList.contains("tabs-ready")).toBeTruthy();
    });

    it("2 - Mote tabs which do not fit into a single line will be put into .extra-tabs.", async () => {
        document.body.innerHTML = `
            <nav class="pat-tabs">
                <a>1</a>
                <a>2</a>
                <a>3</a>
                <a>4</a>
            </nav>
        `;

        // Mock layout.
        const tabs = document.querySelectorAll(".pat-tabs a");
        jest.spyOn(tabs[0], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[1], "getBoundingClientRect").mockImplementation(() => { return { x: 200, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[2], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[3], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore

        const nav = document.querySelector(".pat-tabs");
        expect(nav.classList.contains("tabs-ready")).toBeFalsy();
        pattern.init(nav);
        await utils.timeout(11);

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

        // Mock layout.
        const tabs = document.querySelectorAll(".pat-tabs a");
        jest.spyOn(tabs[0], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[1], "getBoundingClientRect").mockImplementation(() => { return { x: 200, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[2], "getBoundingClientRect").mockImplementation(() => { return { x: 300, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[3], "getBoundingClientRect").mockImplementation(() => { return { x: 400, width: 40 }; }); // prettier-ignore

        const nav = document.querySelector(".pat-tabs");
        expect(nav.classList.contains("tabs-ready")).toBeFalsy();
        pattern.init(nav);
        await utils.timeout(11);

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

        // Mock layout.
        const tabs = document.querySelectorAll(".pat-tabs a");
        jest.spyOn(tabs[0], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[1], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[2], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[3], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore

        const nav = document.querySelector(".pat-tabs");
        expect(nav.classList.contains("tabs-ready")).toBeFalsy();
        pattern.init(nav);
        await utils.timeout(11);

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

        // Mock layout.
        const tabs = document.querySelectorAll(".pat-tabs a");
        jest.spyOn(tabs[0], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[1], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore

        const nav = document.querySelector(".pat-tabs");
        pattern.init(nav);
        await utils.timeout(11);

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

        // Mock layout.
        const tabs = document.querySelectorAll(".pat-tabs a");
        jest.spyOn(tabs[0], "getBoundingClientRect").mockImplementation(() => { return { x: 100, width: 40 }; }); // prettier-ignore
        jest.spyOn(tabs[1], "getBoundingClientRect").mockImplementation(() => { return { x: 200, width: 40 }; }); // prettier-ignore

        const nav = document.querySelector(".pat-tabs");
        pattern.init(nav);
        await utils.timeout(11);

        const extra_tabs = nav.querySelector(".extra-tabs");
        expect(extra_tabs).toBeFalsy();

        expect(nav.classList.contains("closed")).toBeFalsy();
    });
});

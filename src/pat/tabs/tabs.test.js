import pattern from "./tabs";
import utils from "../../core/utils";

describe("pat-tabs", function () {
    beforeEach(function () {
        const el = document.createElement("div");
        el.setAttribute("id", "lab");
        document.body.append(el);
    });
    afterEach(function () {
        document.body.innerHTML = "";
    });

    it("When the size of all the tabs cannot fit in the pat-tabs div some tabs will be placed in the extra-tabs span, which is a child of the pat-tabs element", async () => {
        const container = document.querySelector("#lab");
        container.innerHTML = `
            <nav class="navigation tabs pat-tabs" style="width:400px;">
                <a href="" style="width:100px; display:block;">General</a>
                <a href="" style="width:100px; display:block;">Members</a>
                <a href="" style="width:100px; display:block;">Security</a>
                <a href="" style="width:100px; display:block;">Advanced</a>
            </nav>
        `;
        const tabs = document.querySelector(".pat-tabs");
        pattern.init(tabs);
        await utils.timeout(100);
        expect(tabs.querySelectorAll(".extra-tabs").length).toBeTruthy();
    });

    it("When the size of all the tabs (padding included) cannot fit in the pat-tabs div some tabs will be placed in the extra-tabs span, which is a child of the pat-tabs element", async () => {
        const container = document.querySelector("#lab");
        container.innerHTML = `
            <nav class="navigation tabs pat-tabs" style="width:440px;">
                <a href="" style="width:100px; padding: 0px 5px 0px 5px; display:block;">General</a>
                <a href="" style="width:100px; padding: 0px 5px 0px 5px; display:block;">Members</a>
                <a href="" style="width:100px; padding: 0px 5px 0px 5px; display:block;">Security</a>
                <a href="" style="width:100px; padding: 0px 5px 0px 5px; display:block;">Advanced</a>
            </nav>
        `;

        const tabs = document.querySelector(".pat-tabs");
        pattern.init(tabs);
        await utils.timeout(100);
        expect(tabs.querySelectorAll(".extra-tabs").length).toBeTruthy();
    });

    it("When the size of all the tabs can fit in the pat-tabs div the extra-tabs span will not exist as a child of the pat-tabs element", async () => {
        // XXX: Somehow the browsers doesn't behave so nicely, elements
        // wrap around even though according to our calculations they
        // don't have to. So we now check for 5% less than the
        // container width. That means, 401px must become 1.05*401 =422
        const container = document.querySelector("#lab");
        container.innerHTML = `
            <nav class="navigation tabs pat-tabs" style="width:422px;">
                <a href="" style="width:100px; display:block;">General</a>
                <a href="" style="width:100px; display:block;">Members</a>
                <a href="" style="width:100px; display:block;">Security</a>
                <a href="" style="width:100px; display:block;">Advanced</a>
            </nav>
        `;

        const tabs = document.querySelector(".pat-tabs");
        pattern.init(tabs);
        await utils.timeout(100);
        expect(tabs.querySelectorAll(".extra-tabs").length).toBeFalsy();
    });

    it("When the size of all the tabs (padding included) can fit in the pat-tabs div the extra-tabs span will not exist as a child of the pat-tabs element", async () => {
        // XXX: Somehow the browsers doesn't behave so nicely, elements
        // wrap around even though according to our calculations they
        // don't have to. So we now check for 5% less than the
        // container width. That means, 441px must become 1.05*441 =422
        const container = document.querySelector("#lab");
        container.innerHTML = `
            <nav class="navigation tabs pat-tabs" style="width:464px;">
                <a href="" style="width:100px; padding: 0px 5px 0px 5px; display:block;">General</a>
                <a href="" style="width:100px; padding: 0px 5px 0px 5px; display:block;">Members</a>
                <a href="" style="width:100px; padding: 0px 5px 0px 5px; display:block;">Security</a>
                <a href="" style="width:100px; padding: 0px 5px 0px 5px; display:block;">Advanced</a>
            </nav>
        `;

        const tabs = document.querySelector(".pat-tabs");
        pattern.init(tabs);
        await utils.timeout(100);
        expect(tabs.querySelectorAll(".extra-tabs").length).toBeFalsy();
    });

    it("Clicking on extra-tabs toggles the ``open`` and ``closed`` classes.", async () => {
        const container = document.querySelector("#lab");
        container.innerHTML = `
            <nav class="navigation tabs pat-tabs" style="width:120px;">
                <a href="" style="width:100px; display:block;">General</a>
                <a href="" style="width:100px; display:block;">Members</a>
            </nav>
        `;
        const tabs = document.querySelector(".pat-tabs");
        pattern.init(tabs);
        await utils.timeout(100);

        const extra_tabs = tabs.querySelector(".extra-tabs");

        expect(tabs.classList.contains("open")).toBeFalsy();
        expect(tabs.classList.contains("closed")).toBeTruthy();

        extra_tabs.click();
        expect(tabs.classList.contains("open")).toBeTruthy();
        expect(tabs.classList.contains("closed")).toBeFalsy();

        extra_tabs.click();
        expect(tabs.classList.contains("open")).toBeFalsy();
        expect(tabs.classList.contains("closed")).toBeTruthy();
    });

    it("If there are no extra-tabs, there is no default ``closed`` class.", async () => {
        const container = document.querySelector("#lab");
        container.innerHTML = `
            <nav class="navigation tabs pat-tabs" style="width:220px;">
                <a href="" style="width:100px; display:block;">General</a>
                <a href="" style="width:100px; display:block;">Members</a>
            </nav>
        `;
        const tabs = document.querySelector(".pat-tabs");
        pattern.init(tabs);
        await utils.timeout(100);

        const extra_tabs = tabs.querySelector(".extra-tabs");
        expect(extra_tabs).toBeFalsy();

        expect(tabs.classList.contains("closed")).toBeFalsy();
    });
});

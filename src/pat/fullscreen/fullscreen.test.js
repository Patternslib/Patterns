import $ from "jquery";
import Pattern from "./fullscreen";
import Pattern2 from "./fullscreen-close";
import utils from "../../core/utils";
import screenfull from "screenfull";
import { jest } from "@jest/globals";

describe("Open in fullscreen", function () {
    beforeEach(function () {
        var el = document.createElement("div");
        el.setAttribute("class", "fs");
        el.setAttribute("id", "fs");
        document.body.appendChild(el);
        jest.spyOn(screenfull, "request").mockImplementation(() => {});
        jest.spyOn(screenfull, "exit");
    });
    afterEach(function () {
        document.body.removeChild(document.querySelector("#fs"));
        var exit = document.querySelector(".pat-fullscreen-close-fullscreen");
        if (exit) {
            document.body.removeChild(exit);
        }
        jest.restoreAllMocks();
    });

    it("Test 1: Define fullscreen element via href-target", async () => {
        var fs_el = document.querySelector("#fs");
        var pat_el = document.createElement("a");
        pat_el.setAttribute("class", "pat-fullscreen");
        pat_el.setAttribute("href", "#fs");
        pat_el.appendChild(document.createTextNode("Open in fullscreen"));
        fs_el.appendChild(pat_el);

        new Pattern($(".pat-fullscreen"));
        await utils.timeout(1); // wait a tick for async to settle.
        $(".pat-fullscreen").click();
        expect(screenfull.request).toHaveBeenCalled();
    });

    it("Test 2: data-attr configuration: selector and close-button", async () => {
        var fs_el = document.querySelector("#fs");
        var pat_el = document.createElement("button");
        pat_el.setAttribute("class", "pat-fullscreen");
        pat_el.setAttribute("data-pat-fullscreen", "selector:.fs;close-button:show");
        pat_el.appendChild(document.createTextNode("Open in fullscreen"));
        fs_el.appendChild(pat_el);

        new Pattern($(".pat-fullscreen"));
        await utils.timeout(1); // wait a tick for async to settle.
        $(".pat-fullscreen").click();
        expect(screenfull.request).toHaveBeenCalled();

        $(".pat-fullscreen-close-fullscreen").click();
        expect(screenfull.exit).toHaveBeenCalled();
    });

    it("Test 3: Existing .close-fullscreen elements.", async () => {
        var fs_el = document.querySelector("#fs");
        var pat_el = document.createElement("button");
        pat_el.setAttribute("class", "pat-fullscreen");
        pat_el.setAttribute("data-pat-fullscreen", "selector:.fs");
        pat_el.appendChild(document.createTextNode("Open in fullscreen"));
        fs_el.appendChild(pat_el);
        var pat_close = document.createElement("button");
        pat_close.setAttribute("class", "close-fullscreen");
        pat_close.appendChild(document.createTextNode("Close fullscreen"));
        fs_el.appendChild(pat_close);

        new Pattern($(".pat-fullscreen"));
        await utils.timeout(1); // wait a tick for async to settle.
        $(".pat-fullscreen").click();
        expect(screenfull.request).toHaveBeenCalled();

        new Pattern2($(".close-fullscreen"));
        await utils.timeout(1); // wait a tick for async to settle.
        $(".close-fullscreen").click();
        expect(screenfull.exit).toHaveBeenCalled();
    });

    it("Test 4: No fullscreen element definition opens fullscreen on body.", async () => {
        var fs_el = document.querySelector("#fs");
        var pat_el = document.createElement("button");
        pat_el.setAttribute("class", "pat-fullscreen");
        pat_el.appendChild(document.createTextNode("Open in fullscreen"));
        fs_el.appendChild(pat_el);

        new Pattern($(".pat-fullscreen"));
        await utils.timeout(1); // wait a tick for async to settle.
        $(".pat-fullscreen").click();
        expect(screenfull.request).toHaveBeenCalled();
    });
});

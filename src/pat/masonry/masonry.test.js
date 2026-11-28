import pattern from "./masonry";
import events from "../../core/events";
import utils from "../../core/utils";
import { jest } from "@jest/globals";

const set_complete = (img) => {
    // jsdom does not load images. Mark them as loaded.
    Object.defineProperty(img, "complete", { value: true });
};

describe("pat-masonry", function () {
    afterEach(function () {
        document.body.innerHTML = "";
        jest.restoreAllMocks();
    });

    it("Sets class masonry-ready on the element after masonry has finished", async function () {
        document.body.innerHTML = `
            <div class="pat-masonry" data-pat-masonry="transition-duration: 0">
                <div class="item"></div>
                <div class="item"></div>
            </div>
        `;
        const el = document.querySelector(".pat-masonry");
        expect(el.classList.contains("masonry-ready")).toBe(false);

        const instance = pattern.init(el);
        await events.await_pattern_init(instance);

        expect(el.classList.contains("masonry-ready")).toBe(true);
    });

    it("Waits for all images to be loaded before setting masonry-ready", async function () {
        document.body.innerHTML = `
            <div class="pat-masonry" data-pat-masonry="transition-duration: 0">
                <div class="item"><img src="a.png" /></div>
                <div class="item"><img src="b.png" /></div>
            </div>
        `;
        const el = document.querySelector(".pat-masonry");
        const [img1, img2] = el.querySelectorAll("img");

        const instance = pattern.init(el);
        await events.await_pattern_init(instance);
        const spy_quicklayout = jest.spyOn(instance, "quicklayout");
        const spy_layout = jest.spyOn(instance, "layout");

        expect(el.classList.contains("masonry-ready")).toBe(false);

        // First image loaded - quick re-layout, but not ready yet.
        set_complete(img1);
        img1.dispatchEvent(new Event("load"));
        await utils.timeout(1); // wait a tick for async to settle.
        expect(spy_quicklayout).toHaveBeenCalled();
        expect(spy_layout).not.toHaveBeenCalled();
        expect(el.classList.contains("masonry-ready")).toBe(false);

        // Second image failed loading - full layout and ready.
        set_complete(img2);
        img2.dispatchEvent(new Event("error"));
        await utils.timeout(1); // wait a tick for async to settle.
        expect(spy_layout).toHaveBeenCalledTimes(1);
        expect(el.classList.contains("masonry-ready")).toBe(true);

        // Images loaded later only lead to a quick re-layout.
        spy_quicklayout.mockClear();
        img1.dispatchEvent(new Event("load"));
        await utils.timeout(1); // wait a tick for async to settle.
        expect(spy_quicklayout).toHaveBeenCalledTimes(1);
        expect(spy_layout).toHaveBeenCalledTimes(1);
    });

    it("Re-layouts when a video has loaded its metadata, but not for other elements", async function () {
        document.body.innerHTML = `
            <div class="pat-masonry" data-pat-masonry="transition-duration: 0">
                <div class="item"><video src="a.mp4"></video></div>
                <div class="item"><iframe src="about:blank"></iframe></div>
            </div>
        `;
        const el = document.querySelector(".pat-masonry");

        const instance = pattern.init(el);
        await events.await_pattern_init(instance);
        await utils.timeout(1); // wait a tick for async to settle.
        const spy_quicklayout = jest.spyOn(instance, "quicklayout");

        el.querySelector("iframe").dispatchEvent(new Event("load"));
        expect(spy_quicklayout).not.toHaveBeenCalled();

        el.querySelector("video").dispatchEvent(new Event("loadedmetadata"));
        expect(spy_quicklayout).toHaveBeenCalledTimes(1);
    });

    it("Does not wait for lazy loading images", async function () {
        document.body.innerHTML = `
            <div class="pat-masonry" data-pat-masonry="transition-duration: 0">
                <div class="item"><img src="a.png" loading="lazy" /></div>
            </div>
        `;
        const el = document.querySelector(".pat-masonry");

        const instance = pattern.init(el);
        await events.await_pattern_init(instance);

        expect(el.classList.contains("masonry-ready")).toBe(true);
    });

    it("Does not accumulate layoutComplete event listeners", async function () {
        document.body.innerHTML = `
            <div class="pat-masonry" data-pat-masonry="transition-duration: 0">
                <div class="item"></div>
            </div>
        `;
        const el = document.querySelector(".pat-masonry");

        const instance = pattern.init(el);
        await events.await_pattern_init(instance);

        instance.layout();
        instance.layout();
        instance.layout();

        expect(instance.msnry._events?.layoutComplete?.length || 0).toBe(0);
    });
});

import pattern from "./gallery";
import { jest } from "@jest/globals";
import utils from "../../core/utils";

describe("pat-gallery", function () {
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    afterEach(function () {
        document.body.innerHTML = "";
    });

    describe("Gallery tests", function () {
        it("Basic initialization", async function () {
            document.body.innerHTML = `
              <section
                  class="pat-gallery"
                  data-pat-gallery="item-selector: a">
                <a class="a1" href="full-1.jpg" title="title a1">
                  <img src="thumb-1.jpg" title="title img1" />
                </a>

                <a class="a2" href="full-2.jpg">
                  <img src="thumb-2.jpg" title="title img2" />
                </a>
              </section>
            `;
            const el = document.querySelector(".pat-gallery");

            const instance = new pattern(el);

            const spy_init_trigger = jest.spyOn(instance, "initialize_trigger");
            const spy_init_gallery = jest.spyOn(instance, "initialize_gallery");

            jest.spyOn(instance, "pswp_options").mockImplementation(function () {
                return { getThumbBoundsFn: () => ({ x:0, y:0, w:100 }) };
            });

            await utils.timeout(1);

            expect(spy_init_trigger).toHaveBeenCalled();

            expect(document.getElementById("photoswipe-template")).toBeTruthy();

            const ev = new Event("click");
            ev.tagName = "A";
            const spy_preventDefault = jest.spyOn(ev, "preventDefault");
            document.querySelector(".a1").dispatchEvent(ev);

            expect(spy_init_gallery).toHaveBeenCalled();
            expect(spy_preventDefault).toHaveBeenCalled();
        });

        it("Reinitializes when new items are added.", async function () {
            document.body.innerHTML = `
              <section
                  class="pat-gallery"
                  data-pat-gallery="item-selector: a">
                <a class="a1" href="full-1.jpg" title="title a1">
                  <img src="thumb-1.jpg" title="title img1" />
                </a>
              </section>
            `;
            const el = document.querySelector(".pat-gallery");

            const instance = new pattern(el);

            const spy_init_trigger = jest.spyOn(instance, "initialize_trigger");
            const spy_init_gallery = jest.spyOn(instance, "initialize_gallery");

            jest.spyOn(instance, "pswp_options").mockImplementation(function () {
                return { getThumbBoundsFn: () => ({ x:0, y:0, w:100 }) };
            });

            await utils.timeout(1);

            expect(spy_init_trigger).toHaveBeenCalledTimes(1);

            const item = document.createElement("div");
            item.innerHTML = `
                <a class="a2" href="full-2.jpg">
                  <img src="thumb-2.jpg" />
                </a>
            `;

            el.appendChild(item.querySelector(".a2"));
            await utils.timeout(1); // wait for MutationObserver

            expect(spy_init_trigger).toHaveBeenCalledTimes(2);

            const ev = new Event("click");
            ev.tagName = "A";
            const spy_preventDefault = jest.spyOn(ev, "preventDefault");
            document.querySelector(".a2").dispatchEvent(ev);

            expect(spy_init_gallery).toHaveBeenCalled();
            expect(spy_preventDefault).toHaveBeenCalled();
        });
    });
});

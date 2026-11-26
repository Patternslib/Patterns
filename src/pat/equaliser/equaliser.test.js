import $ from "jquery";
import pattern from "./equaliser";
import utils from "../../core/utils";
import { jest } from "@jest/globals";

describe("pat-equaliser", function () {
    beforeEach(function () {
        $("<div/>", { id: "lab" }).appendTo(document.body);
    });

    afterEach(function () {
        $("#lab").remove();
    });

    describe("_update", function () {
        beforeEach(function () {
            var style,
                head = document.head || document.getElementsByTagName("head")[0],
                css = ".small { height: 50px; }\n" + ".large { height: 100px; }";

            style = document.createElement("style");
            style.id = "pat-equaliser-style";
            style.type = "text/css";
            if (style.styleSheet) style.styleSheet.cssText = css;
            else style.appendChild(document.createTextNode(css));
            head.appendChild(style);
        });

        afterEach(function () {
            $("#pat-equaliser-style").remove();
        });

        it("Basic setup", function () {
            var $container = $("<div/>");
            $("<div/>", { class: "small" }).appendTo($container);
            $("<div/>", { class: "large" }).appendTo($container);
            $container.appendTo("#lab");
            $container.data("pat-equaliser", { transition: "none" });
            pattern._update($container[0]);
            expect($container.find(".large").height()).toBe(100);
            expect($container.find(".large").hasClass("equalised")).toBeTruthy();
            expect($container.find(".small").height()).toBe(100);
            expect($container.find(".small").hasClass("equalised")).toBeTruthy();
        });

        it("Ignore inline styles", function () {
            // This is necessary so we do not get fooled by the height we
            // set ourselves.
            var $container = $("<div/>");
            $("<div/>", { class: "small" }).css("height", "200px").appendTo($container);
            $("<div/>", { class: "large" }).css("height", "200px").appendTo($container);
            $container.appendTo("#lab");
            $container.data("pat-equaliser", { transition: "none" });
            pattern._update($container[0]);
            expect($container.find(".small").height()).toBe(100);
            expect($container.find(".large").height()).toBe(100);
        });

        it("Triggers pat-update after equalisation.", function () {
            document.body.innerHTML = `
                <div class="pat-equaliser"
                     data-pat-equaliser="transition: none">
                    <div class="small"></div>
                    <div class="large"></div>
                </div>
            `;

            const $container = $(".pat-equaliser");

            let data = null;
            $container.on("pat-update", (e, d) => {
                data = d;
            });

            pattern._update($container[0]);

            expect(data.pattern).toBe("equaliser");
            expect(data.action).toBe("attribute-changed");
            expect(data.dom).toBe($container[0]);
        });
    });
    describe("init", function () {
        afterEach(function () {
            jest.restoreAllMocks();
        });

        it("Equalises on initialization.", function () {
            document.body.innerHTML = `
                <div class="pat-equaliser"
                     data-pat-equaliser="transition: none">
                    <div style="height: 50px"></div>
                    <div style="height: 100px"></div>
                </div>
            `;
            const container = document.querySelector(".pat-equaliser");
            const spy_update = jest.spyOn(pattern, "_update");

            pattern.init($(container));

            expect(spy_update).toHaveBeenCalledTimes(1);
            expect(spy_update).toHaveBeenCalledWith(container);
            for (const child of container.children) {
                expect(child.classList.contains("equalised")).toBe(true);
            }
        });

        it("Re-equalises after an image has been loaded or failed loading.", async function () {
            document.body.innerHTML = `
                <div class="pat-equaliser"
                     data-pat-equaliser="transition: none">
                    <div><img src="a.png" /></div>
                    <div><img src="b.png" /></div>
                </div>
            `;
            const container = document.querySelector(".pat-equaliser");
            pattern.init($(container));
            await utils.timeout(150); // wait for the debounced observer.

            const spy_update = jest.spyOn(pattern, "_update");
            const [img1, img2] = container.querySelectorAll("img");

            img1.dispatchEvent(new Event("load"));
            await utils.timeout(150); // debounce
            expect(spy_update).toHaveBeenCalledTimes(1);
            expect(spy_update).toHaveBeenCalledWith(container);

            img2.dispatchEvent(new Event("error"));
            await utils.timeout(150); // debounce
            expect(spy_update).toHaveBeenCalledTimes(2);
        });

        it("Re-equalises when the DOM changes.", async function () {
            document.body.innerHTML = `
                <div class="pat-equaliser"
                     data-pat-equaliser="transition: none">
                    <div></div>
                    <div></div>
                </div>
            `;
            const container = document.querySelector(".pat-equaliser");
            pattern.init($(container));
            await utils.timeout(150); // wait for the debounced observer.

            const spy_update = jest.spyOn(pattern, "_update");

            container.children[0].innerHTML = "<p>new content</p>";
            await utils.timeout(150); // debounce
            expect(spy_update).toHaveBeenCalledTimes(1);
            expect(spy_update).toHaveBeenCalledWith(container);
        });

        it("Does not re-equalise because of its own changes.", async function () {
            document.body.innerHTML = `
                <div class="pat-equaliser"
                     data-pat-equaliser="transition: none">
                    <div></div>
                    <div></div>
                </div>
                <div class="pat-equaliser"
                     data-pat-equaliser="transition: none">
                    <div></div>
                    <div></div>
                </div>
            `;
            const spy_update = jest.spyOn(pattern, "_update");
            pattern.init($(".pat-equaliser"));
            // Initial update for both.
            expect(spy_update).toHaveBeenCalledTimes(2);

            await utils.timeout(500);
            // No further updates.
            expect(spy_update).toHaveBeenCalledTimes(2);
        });
    });
});

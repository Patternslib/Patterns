import Pattern from "./slides";
import $ from "jquery";
import utils from "../../core/utils";
import { jest } from "@jest/globals";

describe("pat-slides", function () {
    afterEach(function () {
        jest.restoreAllMocks();
    });

    describe("1 - _collapse_ids", function () {
        it("Single id", function () {
            const instance = new Pattern(document.createElement("div"));
            expect(instance._collapse_ids("foo")).toEqual(["foo"]);
        });

        it("Comma-separated list of ids", function () {
            const instance = new Pattern(document.createElement("div"));
            expect(instance._collapse_ids("foo,bar")).toEqual(["foo", "bar"]);
        });

        it("Skip empty ids", function () {
            const instance = new Pattern(document.createElement("div"));
            expect(instance._collapse_ids("foo,,bar")).toEqual(["foo", "bar"]);
        });

        it("Parameter without value", function () {
            const instance = new Pattern(document.createElement("div"));
            expect(instance._collapse_ids(null)).toEqual([]);
        });

        it("Parameter with empty value", function () {
            const instance = new Pattern(document.createElement("div"));
            expect(instance._collapse_ids("")).toEqual([]);
        });
    });

    describe("2 - _remove_slides", function () {
        it("Remove slides from DOM", async function () {
            const $show = $("<div/>", { class: "pat-slides" });
            for (let i = 1; i <= 4; i++)
                $("<div/>", { class: "slide", id: "slide" + i }).appendTo($show);

            const instance = new Pattern($show);
            await utils.timeout(1); // wait a tick for async to settle.

            instance._remove_slides(["slide1", "slide3"]);
            const ids = $.makeArray(
                $show.find(".slide").map(function (idx, el) {
                    return el.id;
                })
            );
            expect(ids).toEqual(["slide1", "slide3"]);
        });

        it.skip("Trigger reset when removing slides", async function () {
            const $show = $("<div/>", { class: "pat-slides" });
            for (let i = 1; i <= 4; i++) {
                $("<div/>", { class: "slide", id: "slide" + i }).appendTo($show);
            }
            jest.spyOn(utils, "debounce").mockImplementation((func) => {
                return func;
            });

            const instance = new Pattern($show);
            await utils.timeout(1); // wait a tick for async to settle.

            const spy_reset = jest.spyOn(instance, "_reset");
            instance._hook();
            instance._remove_slides(["slide1", "slide3"]);
            expect(spy_reset).toHaveBeenCalled();
        });

        it("Do not trigger reset when not doing anything", async function () {
            const $show = $("<div/>", { class: "pat-slides" });
            for (let i = 1; i <= 2; i++)
                $("<div/>", { class: "slide", id: "slide" + i }).appendTo($show);

            const instance = new Pattern($show);
            await utils.timeout(1); // wait a tick for async to settle.

            const spy_reset = jest.spyOn(instance, "_reset");
            instance._remove_slides(["slide1", "slide2"]);
            expect(spy_reset).not.toHaveBeenCalled();
        });
    });
});

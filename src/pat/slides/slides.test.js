import pattern from "./slides";
import $ from "jquery";
import utils from "../../core/utils";

describe("pat-slides", function () {
    afterEach(function () {
        jest.restoreAllMocks();
    });

    describe("_collapse_ids", function () {
        it("Single id", function () {
            expect(pattern._collapse_ids(["foo"])).toEqual(["foo"]);
        });

        it("Comma-separated list of ids", function () {
            expect(pattern._collapse_ids(["foo,bar"])).toEqual(["foo", "bar"]);
        });

        it("Skip empty ids", function () {
            expect(pattern._collapse_ids(["foo,,bar"])).toEqual(["foo", "bar"]);
        });

        it("Parameter without value", function () {
            expect(pattern._collapse_ids([null])).toEqual([]);
        });

        it("Parameter with empty value", function () {
            expect(pattern._collapse_ids([""])).toEqual([]);
        });

        it("Multiple parameters", function () {
            expect(pattern._collapse_ids(["foo", "bar"])).toEqual([
                "foo",
                "bar",
            ]);
        });
    });

    describe("_remove_slides", function () {
        it("Remove slides from DOM", function () {
            var $show = $("<div/>", { class: "pat-slides" });
            for (var i = 1; i <= 4; i++)
                $("<div/>", { class: "slide", id: "slide" + i }).appendTo(
                    $show
                );
            pattern._remove_slides($show, ["slide1", "slide3"]);
            var ids = $.makeArray(
                $show.find(".slide").map(function (idx, el) {
                    return el.id;
                })
            );
            expect(ids).toEqual(["slide1", "slide3"]);
        });

        it.skip("Trigger reset when removing slides", function () {
            var $show = $("<div/>", { class: "pat-slides" });
            for (var i = 1; i <= 4; i++) {
                $("<div/>", { class: "slide", id: "slide" + i }).appendTo(
                    $show
                );
            }
            jest.spyOn(utils, "debounce").mockImplementation((func) => {
                return func;
            });
            var spy_reset = jest.spyOn(pattern, "_reset");
            pattern._hook($show);
            pattern._remove_slides($show, ["slide1", "slide3"]);
            expect(spy_reset).toHaveBeenCalled();
        });

        it("Do not trigger reset when not doing anything", function () {
            var $show = $("<div/>", { class: "pat-slides" });
            for (var i = 1; i <= 2; i++)
                $("<div/>", { class: "slide", id: "slide" + i }).appendTo(
                    $show
                );
            var spy_reset = spyOn(pattern, "_reset");
            pattern._remove_slides($show, ["slide1", "slide2"]);
            expect(spy_reset).not.toHaveBeenCalled();
        });
    });
});

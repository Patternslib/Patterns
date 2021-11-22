import "regenerator-runtime/runtime"; // needed for ``await`` support
import Pattern from "./zoom";
import $ from "jquery";
import utils from "../../core/utils";

describe("pat-zoom", function () {
    beforeEach(function () {
        $("<div/>", { id: "lab" }).appendTo(document.body);
    });

    afterEach(function () {
        $("#lab").remove();
    });

    describe("init", function () {
        it("Create default range input", async function () {
            $("#lab").append("<div id=block/>");
            var $block = $("#lab div");
            new Pattern($block);
            await utils.timeout(1);
            var $range = $block.prev();
            expect($range.length).toBe(1);
            expect($range[0].min).toBe("0");
            expect($range[0].max).toBe("2");
            expect($range[0].value).toBe("1");
        });

        it("Tweak ranges", async function () {
            $("#lab").append("<div id=block/>");
            var $block = $("#lab div");
            new Pattern($block, { min: 0.5, max: 5 });
            await utils.timeout(1);
            var $range = $block.prev();
            expect($range[0].min).toBe("0.5");
            expect($range[0].max).toBe("5");
            expect($range[0].value).toBe("1");
        });
    });

    describe("Integration tests", function () {
        it("Zoom in", async function () {
            $("#lab").append("<div id=block/>");
            var $block = $("#lab div");
            new Pattern($block);
            await utils.timeout(1);
            var $range = $block.prev();
            $range.val("1.5");
            $range[0].dispatchEvent(new Event("input"));
            await utils.timeout(1);
            // Fairly lax test so it passes in different browsers.
            expect($block[0].style.zoom).toBe("1.5");
        });
    });
});

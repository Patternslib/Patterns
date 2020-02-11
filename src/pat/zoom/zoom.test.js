define(["pat-zoom"], function(pattern) {
    describe("pat-zoom", function() {
        beforeEach(function() {
            $("<div/>", { id: "lab" }).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        describe("init", function() {
            it("Create default range input", function() {
                $("#lab").append("<div id=block/>");
                var $block = $("#lab div");
                pattern.init($block);
                var $range = $block.prev();
                expect($range.length).toBe(1);
                expect($range[0].min).toBe("0");
                expect($range[0].max).toBe("2");
                expect($range[0].value).toBe("1");
            });

            it("Tweak ranges", function() {
                $("#lab").append("<div id=block/>");
                var $block = $("#lab div");
                pattern.init($block, { min: 0.5, max: 5 });
                var $range = $block.prev();
                expect($range[0].min).toBe("0.5");
                expect($range[0].max).toBe("5");
                expect($range[0].value).toBe("1");
            });
        });

        describe("Integration tests", function() {
            it("Zoom in", function() {
                $("#lab").append("<div id=block/>");
                var $block = $("#lab div");
                pattern.init($block);
                var $range = $block.prev();
                $range.val("1.5").change();
                // Fairly lax test so it passes in different browsers.
                expect(
                    $block.attr("style").match(/zoom: 1.5(;.*)?/i)
                ).toBeTruthy();
            });
        });
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

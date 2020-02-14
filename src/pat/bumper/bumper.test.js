import $ from "jquery";
import Bumper from "./bumper";
import { utils } from "patternslib-core";

describe("pat-bumper", function() {
    beforeEach(function() {
        $("#lab").remove();
        $("<div/>", { id: "lab" }).appendTo(document.body);
    });

    afterEach(function() {
        $("#lab").remove();
    });

    it("handles an object in an overflow-auto container", function() {
        // Check with vertical scroll
        $("#lab").html(
            [
                '<div class="parent" style="overflow-y: auto; height: 50px">',
                '<p class="pat-bumper">I\'m sticky!</p>',
                "</div>"
            ].join("\n")
        );
        var $el = $(".pat-bumper");
        var pattern = new Bumper($el);
        pattern.init();
        expect(pattern.$container.is($(".parent"))).toBeTruthy();

        // Check with horizontal scroll
        $("#lab").html(
            [
                '<div class="parent" style="overflow-x: auto; height: 50px">',
                '<p class="pat-bumper" data-pat-bumper="side: left">I\'m sticky!</p>',
                "</div>"
            ].join("\n")
        );
        $el = $(".pat-bumper");
        pattern = new Bumper($el);
        pattern.init();
        expect(pattern.$container.is($(".parent"))).toBeTruthy();
    });

    it("handles an object in an overflow-scroll container", function() {
        // Check with vertical scroll
        $("#lab").html(
            [
                '<div class="parent" style="overflow-y: scroll; height: 50px">',
                '<p class="pat-bumper">I\'m sticky!</p>',
                "</div>"
            ].join("\n")
        );
        var $el = $(".pat-bumper");
        var pattern = new Bumper($el);
        pattern.init();
        expect(pattern.$container.is($(".parent"))).toBeTruthy();

        // Check with horizontal scroll
        $("#lab").html(
            [
                '<div class="parent" style="overflow-x: scroll; height: 50px">',
                '<p class="pat-bumper" data-pat-bumper="side: left">I\'m sticky!</p>',
                "</div>"
            ].join("\n")
        );
        $el = $(".pat-bumper");
        pattern = new Bumper($el);
        pattern.init();
        expect(pattern.$container.is($(".parent"))).toBeTruthy();
    });

    it("updates classes for a bumped element", function() {
        $("#lab").html(
            [
                '<div class="parent" style="overflow-y: auto; height: 50px">',
                '<p class="pat-bumper plain" ' +
                    '   data-pat-bumper="bump-add: bumped; unbump-remove: plain"' +
                    "   >I'm sticky!</p>",
                "</div>"
            ].join("\n")
        );
        var $el = $(".pat-bumper");
        var pattern = new Bumper($el);
        pattern.init();
        pattern._markBumped(true);
        if (utils.checkCSSFeature('position', 'sticky')) {
            expect(pattern.$el.attr("class")).toBe(
                "pat-bumper sticky-supported bumped"
            );
        } else {
            expect(pattern.$el.attr("class")).toBe("pat-bumper bumped");
        }
    });

    it("updates classes for an unbumped element", function() {
        $("#lab").html(
            [
                '<div class="parent" style="overflow-y: auto; height: 50px">',
                '<p class="pat-bumper bumped" ' +
                    '   data-pat-bumper="unbump-remove: bumped; unbump-add: plain"' +
                    "   >I'm sticky!</p>",
                "</div>"
            ].join("\n")
        );
        var $el = $(".pat-bumper");
        var pattern = new Bumper($el);
        pattern.init();
        pattern._markBumped(false);
        if (utils.checkCSSFeature('position', 'sticky')) {
            expect(pattern.$el.attr("class")).toBe(
                "pat-bumper sticky-supported plain"
            );
        } else {
            expect(pattern.$el.attr("class")).toBe("pat-bumper plain");
        }
    });

    it("listens on window scroll if no scrollable container is present", function() {
        $("#lab").html(
            [
                '<p class="pat-bumper bumped" ' +
                    '   style="margin: 0; height: 5px; position: relative"' +
                    "   >I'm sticky!</p>"
            ].join("\n")
        );
        var $el = $(".pat-bumper");
        var pattern = new Bumper($el);
        var spy_update = spyOn(pattern, "_updateStatus");
        pattern.init();
        window.scrollTo(0, 0);
        expect(spy_update).toHaveBeenCalled();
    });

    it("correctly transitions an element to bumped at the top", function() {
        $("#lab").html(
            [
                '<div class="parent" style="overflow-y: scroll; height: 15px">',
                '<div style="clear: both; height: 30px">',
                '<p class="pat-bumper bumped" ' +
                    '   style="margin: 0; height: 5px; position: relative"' +
                    "   >I'm sticky!</p>",
                "</div>",
                "</div>"
            ].join("\n")
        );
        var $el = $(".pat-bumper");
        var pattern = new Bumper($el);
        var spy_mark = spyOn(pattern, "_markBumped");
        pattern.init();
        $(".parent")[0].scrollTop = 5;
        pattern._updateStatus();
        expect(spy_mark).toHaveBeenCalled();
        expect(pattern._markBumped.calls.mostRecent().args[0]).toBeTruthy();
        expect(pattern.$el[0].style.top).toBe("5px");

        $(".parent")[0].scrollTop = 13;
        pattern._updateStatus();
        expect(spy_mark).toHaveBeenCalled();
        expect(pattern._markBumped.calls.mostRecent().args[0]).toBeTruthy();
        expect(pattern.$el[0].style.top).toBe("13px");
    });

    it("correctly transitions an element to bumped at the leftside", function() {
        $("#lab").html(
            [
                '<div class="parent" style="overflow-x: scroll; width: 15px">',
                '<p class="pat-bumper bumped" ' +
                    '   data-pat-bumper="side: left"' +
                    '   style="margin: 0; width: 5px; position: relative"' +
                    "   >I'm sticky!</p>",
                "</div>"
            ].join("\n")
        );
        var $el = $(".pat-bumper");
        var pattern = new Bumper($el);
        spyOn(pattern, "_markBumped");
        pattern.init();
        $(".parent")[0].scrollLeft = 5;
        pattern._updateStatus();
        expect(pattern._markBumped).toHaveBeenCalled();
        expect(pattern._markBumped.calls.mostRecent().args[0]).toBeTruthy();
        expect(pattern.$el[0].style.left).toBe("5px");
        $(".parent")[0].scrollLeft = 12;
        pattern._updateStatus();
        expect(pattern._markBumped).toHaveBeenCalled();
        expect(pattern._markBumped.calls.mostRecent().args[0]).toBeTruthy();
        expect(pattern.$el[0].style.left).toBe("12px");
    });

    describe("The init method", function() {
        it("Returns the jQuery-wrapped DOM node", function() {
            var $el = $('<div class="pat-scroll"></div>');
            var pattern = new Bumper($el);
            expect(pattern.init($el)).toBe($el);
        });
    });
});

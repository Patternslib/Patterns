define(["pat-auto-scale", "jquery"], function(Pattern, jQuery) {

    describe("pat-auto-scale", function() {

        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
            $(window).off(".autoscale");
        });

        afterEach(function() {
            $("#lab").remove();
        });

        describe("The pattern", function () {

            it("honours the min-width property", function() {
                $("<div/>", {id: "parent"}).css({width: "100px"})
                  .append($("<div/>", {id: "child"}).css({width: "400px"}))
                  .appendTo("#lab");
                var $child = $('#child').attr("data-pat-auto-scale", "method: zoom; min-width: 200; max-width: 1000");
                new Pattern($child);
                expect($child[0].style.zoom).toBe("0.5");
            });

            it("honours the max-width property", function() {
                $("<div/>", {id: "parent"}).css({width: "200px"})
                  .append($("<div/>", {id: "child"}).css({width: "50px"}))
                  .appendTo("#lab");
                var $child = $('#child').attr("data-pat-auto-scale", "method: zoom; min-width: 0; max-width: 100");
                new Pattern($child);
                expect($child[0].style.zoom).toBe("2");
            });
        });

        describe("The scale method", function() {
            var mozilla, msie, version;
            beforeEach(function() {
                mozilla = jQuery.browser.mozilla;
                msie = jQuery.browser.msie;
                version = jQuery.browser.version;
                jQuery.browser.mozilla = false;
                jQuery.browser.msie = false;
            });

            afterEach(function() {
                jQuery.browser.mozilla = mozilla;
                jQuery.browser.msie = msie;
                jQuery.browser.version = version;
            });

            it("is forced to zoom on old IE versions", function() {
                jQuery.browser.msie = true;
                jQuery.browser.version = "8.192.921";
                $("#lab").html('<img class="pat-auto-scale" src="http://placehold.it/250x250">');
                var pattern = new Pattern($(".pat-auto-scale"));
                pattern._setup();
                expect(pattern.force_method).toBe("zoom");
            });

            it("is not forced to anything on recent IE versions", function() {
                jQuery.browser.msie = true;
                jQuery.browser.version="9.0.19A";
                $("#lab").html('<img class="pat-auto-scale" src="http://placehold.it/250x250">');
                var pattern = new Pattern($(".pat-auto-scale"));
                pattern._setup();
                expect(pattern.force_method).toBe(null);
            });

            it("is forced to scale on gecko", function() {
                // See https://bugzilla.mozilla.org/show_bug.cgi?id=390936
                jQuery.browser.mozilla = true;
                $("#lab").html('<img class="pat-auto-scale" src="http://placehold.it/250x250">');
                var pattern = new Pattern($(".pat-auto-scale"));
                pattern._setup();
                expect(pattern.force_method).toBe("scale");
            });

            it("is not forced to anything on other browsers", function() {
                $("#lab").html('<img class="pat-auto-scale" src="http://placehold.it/250x250">');
                var pattern = new Pattern($(".pat-auto-scale"));
                pattern._setup();
                expect(pattern.force_method).toBe(null);
            });
        });

        describe("When the pattern is initialized", function() {

            it("returns the jQuery-wrapped DOM node", function() {
                var $el = $('<div class="pat-auto-scale"></div');
                var pattern = new Pattern($el);
                expect(pattern.init($el)).toBe($el);
            });

            it("performs initial scaling", function() {
                $("<div/>", {id: "parent"}).css({width: "200px"})
                  .append($("<div/>",
                            {id: "child", "data-pat-auto-scale": "scale"})
                      .css({width: "50px"}))
                  .appendTo("#lab");
                var $child = $("#child").addClass("pat-auto-scale");
                var pattern = new Pattern($child);
                pattern.init($child);
                expect($child.hasClass("scaled")).toBeTruthy();
            });

            it("adds .scaled class", function() {
                $("<div/>", {id: "parent"}).css({width: "200px"})
                  .append($("<div/>", {id: "child"}).css({width: "50px"}))
                  .appendTo("#lab");
                var $child = $('#child').attr("data-pat-auto-scale", "method: zoom; min-width: 0; max-width: 1000");
                new Pattern($child);
                expect($child.hasClass("scaled")).toBeTruthy();
            });
        });

        describe("scale", function() {

            it("Scale element", function() {
                $("<div/>", {id: "parent"}).css({width: "200px"})
                  .append($("<div/>", {id: "child"}).css({width: "50px"}))
                  .appendTo("#lab");
                var $child = $('#child');
                $child.data("patterns.auto-scale", {method: "scale", minWidth: 0, maxWidth: 1000});
                new Pattern($child);
                expect($child[0].getAttribute("style")).toMatch(/transform: scale\(4\);/);
            });

            it("Zoom element", function() {
                $("<div/>", {id: "parent"}).css({width: "200px"})
                  .append($("<div/>", {id: "child"}).css({width: "50px"}))
                  .appendTo("#lab");
                var $child = $('#child').attr("data-pat-auto-scale", "method: zoom; min-width: 0; max-width: 1000");
                new Pattern($child);
                expect($child[0].style.zoom).toBe("4");
            });

        });
    });
});

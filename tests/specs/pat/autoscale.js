define(["pat-autoscale", "jquery"], function(pattern, jQuery) {

    describe("pat-autoscale", function() {

        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
            $(window).off(".autoscale");
        });

        afterEach(function() {
            $("#lab").remove();
        });

        describe("setup", function() {
            var force_method, mozilla, msie, version;

            beforeEach(function() {
                force_method=pattern.force_method;
                mozilla=jQuery.browser.mozilla;
                msie=jQuery.browser.msie;
                version=jQuery.browser.version;
                pattern.force_method=null;
                jQuery.browser.mozilla=false;
                jQuery.browser.msie=false;
            });

            afterEach(function() {
                pattern.force_method=force_method;
                jQuery.browser.mozilla=mozilla;
                jQuery.browser.msie=msie;
                jQuery.browser.version=version;
            });

            it("Force zoom on old IE versions", function() {
                jQuery.browser.msie=true;
                jQuery.browser.version="8.192.921";
                pattern._setup();
                expect(pattern.force_method).toBe("zoom");
            });

            it("Force nothing on recent IE versions", function() {
                jQuery.browser.msie=true;
                jQuery.browser.version="9.0.19A";
                pattern._setup();
                expect(pattern.force_method).toBe(null);
            });

            it("Force scale on gecko", function() {
                // See https://bugzilla.mozilla.org/show_bug.cgi?id=390936
                jQuery.browser.mozilla=true;
                pattern._setup();
                expect(pattern.force_method).toBe("scale");
            });

            it("Force nothing on other browsers", function() {
                pattern._setup();
                expect(pattern.force_method).toBe(null);
            });
        });

        describe("init", function() {
            var force_method;

            beforeEach(function() {
                force_method=pattern.force_method;
            });

            afterEach(function() {
                pattern.force_method=force_method;
            });

            it("Return jQuery object", function() {
                var jq = jasmine.createSpyObj("jQuery", ["each"]);
                jq.each.andReturn(jq);
                expect(pattern.init(jq)).toBe(jq);
            });

            it("Perform initial scaling", function() {
                $("<div/>", {id: "parent"}).css({width: "200px"})
                  .append($("<div/>", {id: "child", "data-pat-auto-scale": "scale"})
                      .css({width: "50px"}))
                  .appendTo("#lab");
                var $child = $("#child");
                spyOn(pattern, "scale");
                pattern.init($child);
                expect(pattern.scale).toHaveBeenCalled();
            });

            it("Honour method override", function() {
                $("<div/>", {id: "parent"}).css({width: "200px"})
                  .append($("<div/>", {id: "child", "data-pat-auto-scale": "scale"})
                      .css({width: "50px"}))
                  .appendTo("#lab");
                var $child = $("#child");
                pattern.force_method = "forced";
                pattern.init($child);
                expect($child.data("patterns.auto-scale").method).toBe("forced");
            });
        });

        describe("scale", function() {
            it("Scale element", function() {
                $("<div/>", {id: "parent"}).css({width: "200px"})
                  .append($("<div/>", {id: "child"}).css({width: "50px"}))
                  .appendTo("#lab");
                var child = document.getElementById("child");
                $(child).data("patterns.auto-scale", {method: "scale", minWidth: 0, maxWidth: 1000});
                pattern.scale.apply(child, []);
                expect(child.getAttribute("style")).toMatch(/transform: scale\(4\);/);
            });

            it("Zoom element", function() {
                $("<div/>", {id: "parent"}).css({width: "200px"})
                  .append($("<div/>", {id: "child"}).css({width: "50px"}))
                  .appendTo("#lab");
                var child = document.getElementById("child");
                $(child).data("patterns.auto-scale", {method: "zoom", minWidth: 0, maxWidth: 1000});
                pattern.scale.apply(child, []);
                expect(child.style.zoom).toBe("4");
            });

            it("Honour minimum width", function() {
                $("<div/>", {id: "parent"}).css({width: "100px"})
                  .append($("<div/>", {id: "child"}).css({width: "400px"}))
                  .appendTo("#lab");
                var child = document.getElementById("child");
                $(child).data("patterns.auto-scale", {method: "zoom", minWidth: 200, maxWidth: 1000});
                pattern.scale.apply(child, []);
                expect(child.style.zoom).toBe("0.5");
            });

            it("Honour maximum width", function() {
                $("<div/>", {id: "parent"}).css({width: "200px"})
                  .append($("<div/>", {id: "child"}).css({width: "50px"}))
                  .appendTo("#lab");
                var child = document.getElementById("child");
                $(child).data("patterns.auto-scale", {method: "zoom", minWidth: 0, maxWidth: 100});
                pattern.scale.apply(child, []);
                expect(child.style.zoom).toBe("2");
            });

            it("Add scaled class", function() {
                $("<div/>", {id: "parent"}).css({width: "200px"})
                  .append($("<div/>", {id: "child"}).css({width: "50px"}))
                  .appendTo("#lab");
                var child = document.getElementById("child");
                $(child).data("patterns.auto-scale", {method: "zoom", minWidth: 0, maxWidth: 1000});
                pattern.scale.apply(child, []);
                expect($(child).hasClass("scaled")).toBeTruthy();
            });
        });
    });

});

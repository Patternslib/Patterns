describe("bumper-pattern", function() {
    var pattern;

    requireDependencies(["patterns/autoscale"], function(cls) {
        pattern = cls;
    });

    // Reset the lab before each test
    beforeEach(function() {
        $("#lab *").remove();
        $(window).off(".autoscale");
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
            jQuery.browser.version="9.192.921";
            pattern._setup();
            expect(pattern.force_method).toBe("zoom");
        });

        it("Force nothing on recent IE versions", function() {
            jQuery.browser.msie=true;
            jQuery.browser.version="10.0.19A";
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
        it("Return jQuery object", function() {
            var jq = jasmine.createSpyObj("jQuery", ["each"]);
            jq.each.andReturn(jq);
            expect(pattern.init(jq)).toBe(jq);
        });
    });

    describe("scale", function() {
        var original_method;

        it("Scale element", function() {
            $("<div/>", {id: "parent"}).css({width: "200px"})
              .append($("<div/>", {id: "child"}).css({width: "50px"}))
              .appendTo("#lab");
            var child = document.getElementById("child");
            $(child).data("patterns.auto-scale", "scale");
            pattern.scale.apply(child, []);
            expect(child.getAttribute("style")).toMatch(/transform: scale\(4\);/);
        });

        it("Zoom element", function() {
            $("<div/>", {id: "parent"}).css({width: "200px"})
              .append($("<div/>", {id: "child"}).css({width: "50px"}))
              .appendTo("#lab");
            var child = document.getElementById("child");
            $(child).data("patterns.auto-scale", "zoom");
            pattern.scale.apply(child, []);
            expect(child.style.zoom).toBe("4");
        });

        it("Add scaled class", function() {
            $("<div/>", {id: "parent"}).css({width: "200px"})
              .append($("<div/>", {id: "child"}).css({width: "50px"}))
              .appendTo("#lab");
            var child = document.getElementById("child");
            $(child).data("patterns.auto-scale", "zoom");
            pattern.scale.apply(child, []);
            expect($(child).hasClass("scaled")).toBeTruthy();
        });
    });
});

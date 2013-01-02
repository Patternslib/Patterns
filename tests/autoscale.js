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
        var original_method, msie, version;

        beforeEach(function() {
            original_method=pattern.method;
            pattern.method="scale";
            msie=jQuery.browser.msie;
            version=jQuery.browser.version;
        });

        afterEach(function() {
            pattern.method=original_method;
            jQuery.browser.msie=msie;
            jQuery.browser.version=version;
        });

        it("Use zoom on old IE versions", function() {
            jQuery.browser.msie=true;
            jQuery.browser.version="9.192.921";
            pattern._setup();
            expect(pattern.method).toBe("zoom");
        });

        it("Use scale on recent IE versions", function() {
            jQuery.browser.msie=true;
            jQuery.browser.version="10.0.19A";
            pattern._setup();
            expect(pattern.method).toBe("scale");
        });

        it("Use scale on non-IE browsers", function() {
            jQuery.browser.msie=false;
            pattern._setup();
            expect(pattern.method).toBe("scale");
        });
    });

    describe("init", function() {
        it("Return jQuery object", function() {
            var jq = jasmine.createSpyObj("jQuery", ["each"]);
            jq.each.andReturn(jq);
            expect(pattern.init(jq)).toBe(jq);
        });
    });

    describe("resizeElement", function() {
        var original_method;

        beforeEach(function() {
            original_method=pattern.method;
        });

        afterEach(function() {
            pattern.method=original_method;
        });

        it("Scale element", function() {
            $("<div/>", {id: "parent"}).css({width: "200px"})
              .append($("<div/>", {id: "child"}).css({width: "50px"}))
              .appendTo("#lab");
            var child = document.getElementById("child");
            pattern.method="scale";
            pattern.resizeElement.apply(child, []);
            expect(child.getAttribute("style")).toMatch(/transform: scale\(4\);/);
        });

        it("Zoom element", function() {
            $("<div/>", {id: "parent"}).css({width: "200px"})
              .append($("<div/>", {id: "child"}).css({width: "50px"}))
              .appendTo("#lab");
            var child = document.getElementById("child");
            pattern.method="zoom";
            pattern.resizeElement.apply(child, []);
            expect(child.style.zoom).toBe("4");
        });

        it("Add scaled class", function() {
            $("<div/>", {id: "parent"}).css({width: "200px"})
              .append($("<div/>", {id: "child"}).css({width: "50px"}))
              .appendTo("#lab");
            var child = document.getElementById("child");
            pattern.resizeElement.apply(child, []);
            expect($(child).hasClass("scaled")).toBeTruthy();
        });
    });
});

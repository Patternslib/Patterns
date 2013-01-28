describe("markdown-pattern", function() {
    var pattern;

    requireDependencies(["pat/markdown"], function(cls) {
        pattern = cls;
    });

    beforeEach(function() {
        $("<div/>", {id: "lab"}).appendTo(document.body);
    });

    afterEach(function() {
        $("#lab").remove();
    });

    describe("init", function(){
        it("Return jQuery object", function() {
            var jq = jasmine.createSpyObj("jQuery", ["each"]);
            jq.each.andReturn(jq);
            expect(pattern.init(jq)).toBe(jq);
        });

        it("Replace markdown container with converted content.", function() {
            var $el = $("<p/>");
            $el.appendTo("#lab");
            spyOn(pattern, "_render").andReturn($("<p>Rendering</p>"));
            pattern.init($el);
            expect($("#lab").html()).toBe("<p>Rendering</p>");
        });

	it("Use content for non-input elements", function() {
            var $el = $("<p/>").text("This is markdown");
            $el.appendTo("#lab");
            spyOn(pattern, "_render").andReturn($("<p/>"));
            pattern.init($el);
            expect(pattern._render).toHaveBeenCalledWith("This is markdown");
	});

	it("Use value for input elements", function() {
            var $el = $("<textarea/>").val("This is markdown");
            $el.appendTo("#lab");
            spyOn(pattern, "_render").andReturn($("<p/>"));
            pattern.init($el);
            expect(pattern._render).toHaveBeenCalledWith("This is markdown");
	});
    });

    describe("_render", function(){
        it("Wrap rendering in a div", function() {
            var $rendering = pattern._render("*This is markdown*");
            expect($rendering[0].tagName).toBe("DIV");
        });

        it("Basic markdown rendering", function() {
            var $rendering = pattern._render("*This is markdown*");
            expect($rendering.html()).toBe("<p><em>This is markdown</em></p>");
        });

    });
});

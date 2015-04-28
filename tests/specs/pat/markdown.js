define(["pat-markdown"], function(pattern) {

    describe("pat-markdown", function() {

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

        describe("_extractSection", function() {
            it("Unknown section", function() {
                expect(pattern._extractSection("## My title\n\nContent", "Other title")).toBe(null);
            });

            it("Last hash-section", function() {
                expect(pattern._extractSection("## My title\n\nContent", "My title"))
                    .toBe("## My title\n\nContent");
            });

            it("Hash-section with following section at same level ", function() {
                expect(pattern._extractSection("## My title\n\nContent\n## Next section\n", "My title"))
                    .toBe("## My title\n\nContent\n");
            });

            it("Hash-section with following section at lower level ", function() {
                expect(pattern._extractSection("## My title\n\nContent\n### Next section\n", "My title"))
                    .toBe("## My title\n\nContent\n### Next section\n");
            });

            it("Double underscore section", function() {
                expect(pattern._extractSection("My title\n=======\nContent", "My title"))
                    .toBe("My title\n=======\nContent");
            });

            it("Double underscore section with following section at same level", function() {
                expect(pattern._extractSection("My title\n=======\nContent\n\nNext\n====\n", "My title"))
                    .toBe("My title\n=======\nContent\n\n");
            });

            it("Double underscore section with following section at lower level", function() {
                expect(pattern._extractSection("My title\n=======\nContent\n\nNext\n----\n", "My title"))
                    .toBe("My title\n=======\nContent\n\nNext\n----\n");
            });

            it("Single underscore section", function() {
                expect(pattern._extractSection("My title\n-------\nContent", "My title"))
                    .toBe("My title\n-------\nContent");
            });

            it("Single underscore section with following section at same level", function() {
                expect(pattern._extractSection("My title\n-------\nContent\n\nNext\n----\n", "My title"))
                    .toBe("My title\n-------\nContent\n\n");
            });

            it("Single underscore section with following section at higher level", function() {
                expect(pattern._extractSection("My title\n-------\nContent\n\nNext\n====\n", "My title"))
                    .toBe("My title\n-------\nContent\n\n");
            });
        });
    });
});

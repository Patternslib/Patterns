define(["pat-markdown", "Markdown.Converter"], function(pattern, Markdown) {

    describe("Markdown pattern", function() {

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

	describe("_renderHeader", function() {
            var span_converter = Markdown.getSanitizingConverter();

            it("Plain text only", function() {
                expect(pattern._renderHeader(span_converter, "Plain text")).toBe("Plain text");
            });

            it("Render markdown", function() {
                expect(pattern._renderHeader(span_converter, "*Rendered* text")).toBe("<em>Rendered</em> text");
            });

            it("Strip bad markup", function() {
                expect(pattern._renderHeader(span_converter, "Plain <iframe>text</iframe>")).toBe("Plain text");
            });
	});

        describe("_stash/_unstash", function() {
            it("Unstash multiple", function() {
                var cache = ["one", "two"];
                expect(pattern._unstash("<p>~PM0PM</p><p>~PM1PM</p>", cache)).toBe("onetwo");
            });

            it("Roundtrip", function() {
                var cache = [];
                expect(pattern._unstash(pattern._stash("<p>Foo</p>", cache), cache)).toBe("\n<p>Foo</p>\n");
            });
        });

        describe("_rewrapSection", function() {
            it("Content without section", function() {
                expect(pattern._rewrapSection("<p>~PM0PM</p>")).toBe("<p>~PM0PM</p>");
            });

            it("Content with section", function() {
                var cache = ["content"],
                    rewrapped;
                rewrapped=pattern._rewrapSection("<section><h1>Title</h1>\n<p>~PM0PM</p></section>", cache);
                expect(rewrapped).toBe("\n<p>~PM1PM</p>\n");
                expect(cache[1]).toBe("<section><h1>Title</h1>\ncontent</section>");
            });
        });

	describe("_renderHtml5Headers", function() {
            it("Block without headers", function() {
                expect(pattern._renderHtml5Headers("Foo bar buz")).toBe("Foo bar buz");
            });

            it("Block with double underlined header", function() {
                var input = "Header 1\n========\n\nSection content\n",
                    runBlockGamut = jasmine.createSpy("runBlockGamut").andReturn("BLOCK"),
                    cache = [],
                    output = pattern._renderHtml5Headers(input, runBlockGamut, cache);
                expect(output).toBe("\n<p>~PM0PM</p>\n");
                expect(cache[0]).toBe("<section>\n  <h1>Header 1</h1>\nBLOCK\n</section>");
                expect(runBlockGamut).toHaveBeenCalledWith("Section content\n");
            });

            it("Two blocks with double underline headers", function() {
                var input = "Header 1\n========\n\nSection content\nNext\n====\n",
                    runBlockGamut = jasmine.createSpy("runBlockGamut").andReturn("BLOCK"),
                    cache = [],
                    output = pattern._renderHtml5Headers(input, runBlockGamut, cache);
                expect(output).toBe("\n<p>~PM0PM</p>\n");
                expect(cache[0]).toBe("<section>\n  <h1>Header 1</h1>\nBLOCK\n</section>" +
                                      "<section>\n  <h1>Next</h1>\nBLOCK\n</section>");
            });

            it("Double header underline header includes single underline in section", function() {
                var input = "Header 1\n========\n\nSection content\nSubsection\n----\nContent\n",
                    runBlockGamut = jasmine.createSpy("runBlockGamut").andReturn("BLOCK"),
                    cache = [],
                    output = pattern._renderHtml5Headers(input, runBlockGamut, cache);
                expect(output).toBe("\n<p>~PM0PM</p>\n");
                expect(cache[0]).toBe("<section>\n  <h1>Header 1</h1>\nBLOCK\n</section>");
                expect(runBlockGamut).toHaveBeenCalledWith("Section content\nSubsection\n----\nContent\n");
            });

            xit("Block with single underline headers", function() {
                var input = "Header 1\n--------\n\nSection content\n",
                    runBlockGamut = jasmine.createSpy("runBlockGamut").andReturn("BLOCK"),
                    cache = [],
                    output = pattern._renderHtml5Headers(input, runBlockGamut, cache);
                expect(output).toBe("\n<p>~PM0PM</p>\n");
                expect(cache[0]).toBe("<section>\n  <h1>Header 1</h1>\nBLOCK\n</section>");
            });

            xit("Block with single underline headers followed by same level header", function() {
                var input = "Header 1\n--------\n\nSection content\nNext\n----\n",
                    runBlockGamut = jasmine.createSpy("runBlockGamut").andReturn("BLOCK"),
                    cache = [],
                    output = pattern._renderHtml5Headers(input, runBlockGamut, cache);
                expect(output).toBe("\n<p>~PM0PM</p>\n");
                expect(cache[0]).toBe("<section>\n  <h1>Header 1</h1>\nBLOCK\n</section>\n" +
                                      "<section>\n  <h1>Next</h1>\nBLOCK\n</section>");
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

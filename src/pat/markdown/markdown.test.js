import $ from "jquery";
import pattern from "./markdown";
import utils from "../../core/utils";

describe("pat-markdown", function () {
    beforeEach(function () {
        $("<div/>", { id: "lab" }).appendTo(document.body);
    });

    afterEach(function () {
        $("#lab").remove();
    });

    describe("when initialized", function () {
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it("replaces the DOM element with the rendered Markdown content.", async function () {
            var $el = $('<p class="pat-markdown"></p>');
            $el.appendTo("#lab");
            jest.spyOn(pattern.prototype, "render").mockImplementation(() => {
                return $("<p>Rendering</p>");
            });
            pattern.init($el);
            await utils.timeout(1); // wait a tick for async to settle.
            expect($("#lab").html()).toBe("<p>Rendering</p>");
        });

        it("does not replace the DOM element if it doesn't have the pattern trigger", function () {
            var $el = $("<p></p>");
            $el.appendTo("#lab");
            jest.spyOn(pattern.prototype, "render").mockImplementation(() => {
                return $("<p>Rendering</p>");
            });
            pattern.init($el);
            expect($("#lab").html()).toBe("<p></p>");
        });

        it("uses content for non-input elements", function () {
            var $el = $('<p class="pat-markdown"/>').text("This is markdown");
            $el.appendTo("#lab");
            const spy_render = jest
                .spyOn(pattern.prototype, "render")
                .mockImplementation(() => {
                    return $("<p/>");
                });
            pattern.init($el);
            expect(spy_render).toHaveBeenCalledWith("This is markdown");
        });

        it("uses value for input elements", function () {
            var $el = $('<textarea class="pat-markdown"/>').val(
                "This is markdown"
            );
            $el.appendTo("#lab");
            const spy_render = jest
                .spyOn(pattern.prototype, "render")
                .mockImplementation(() => {
                    return $("<p/>");
                });
            pattern.init($el);
            expect(spy_render).toHaveBeenCalledWith("This is markdown");
        });
    });

    describe("when rendering", function () {
        it("wraps rendering in a div", async function () {
            const $rendering = await pattern.prototype.render(
                "*This is markdown*"
            );
            expect($rendering[0].tagName).toBe("DIV");
        });

        it("converts markdown into HTML", async function () {
            const $rendering = await pattern.prototype.render(
                "*This is markdown*"
            );
            expect($rendering.html()).toBe("<p><em>This is markdown</em></p>");
        });
    });

    describe("Session extraction", function () {
        it("Unknown section", function () {
            expect(
                pattern.prototype.extractSection(
                    "## My title\n\nContent",
                    "Other title"
                )
            ).toBe(null);
        });

        it("Last hash-section", function () {
            expect(
                pattern.prototype.extractSection(
                    "## My title\n\nContent",
                    "My title"
                )
            ).toBe("## My title\n\nContent");
        });

        it("Hash-section with following section at same level ", function () {
            expect(
                pattern.prototype.extractSection(
                    "## My title\n\nContent\n## Next section\n",
                    "My title"
                )
            ).toBe("## My title\n\nContent\n");
        });

        it("Hash-section with following section at lower level ", function () {
            expect(
                pattern.prototype.extractSection(
                    "## My title\n\nContent\n### Next section\n",
                    "My title"
                )
            ).toBe("## My title\n\nContent\n### Next section\n");
        });

        it("Double underscore section", function () {
            expect(
                pattern.prototype.extractSection(
                    "My title\n=======\nContent",
                    "My title"
                )
            ).toBe("My title\n=======\nContent");
        });

        it("Double underscore section with following section at same level", function () {
            expect(
                pattern.prototype.extractSection(
                    "My title\n=======\nContent\n\nNext\n====\n",
                    "My title"
                )
            ).toBe("My title\n=======\nContent\n\n");
        });

        it("Double underscore section with following section at lower level", function () {
            expect(
                pattern.prototype.extractSection(
                    "My title\n=======\nContent\n\nNext\n----\n",
                    "My title"
                )
            ).toBe("My title\n=======\nContent\n\nNext\n----\n");
        });

        it("Single underscore section", function () {
            expect(
                pattern.prototype.extractSection(
                    "My title\n-------\nContent",
                    "My title"
                )
            ).toBe("My title\n-------\nContent");
        });

        it("Single underscore section with following section at same level", function () {
            expect(
                pattern.prototype.extractSection(
                    "My title\n-------\nContent\n\nNext\n----\n",
                    "My title"
                )
            ).toBe("My title\n-------\nContent\n\n");
        });

        it("Single underscore section with following section at higher level", function () {
            expect(
                pattern.prototype.extractSection(
                    "My title\n-------\nContent\n\nNext\n====\n",
                    "My title"
                )
            ).toBe("My title\n-------\nContent\n\n");
        });
    });
});

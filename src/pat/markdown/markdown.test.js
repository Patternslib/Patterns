import $ from "jquery";
import events from "../../core/events";
import Pattern from "./markdown";
import { jest } from "@jest/globals";

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
        it("Replaces the DOM element with the rendered Markdown content.", async function () {
            var $el = $('<p class="pat-markdown"></p>');
            $el.appendTo("#lab");
            jest.spyOn(Pattern.prototype, "render").mockImplementation(() => {
                return $("<p>Rendering</p>");
            });

            const instance = new Pattern($el);
            await events.await_pattern_init(instance);

            expect($("#lab").html()).toBe("<p>Rendering</p>");
        });

        it("It does not render when the DOM element doesn't have the pattern trigger", async function () {
            var $el = $("<p></p>");
            $el.appendTo("#lab");
            jest.spyOn(Pattern.prototype, "render").mockImplementation(() => {
                return $("<p>Rendering</p>");
            });
            const instance = new Pattern($el);
            await events.await_pattern_init(instance);

            expect($("#lab").html()).toBe("<p></p>");
        });

        it("uses content for non-input elements", async function () {
            var $el = $('<p class="pat-markdown"/>').text("This is markdown");
            $el.appendTo("#lab");
            const spy_render = jest
                .spyOn(Pattern.prototype, "render")
                .mockImplementation(() => {
                    return $("<p/>");
                });
            const instance = new Pattern($el);
            await events.await_pattern_init(instance);

            expect(spy_render).toHaveBeenCalledWith("This is markdown");
        });

        it("uses value for input elements", async function () {
            var $el = $('<textarea class="pat-markdown"/>').val("This is markdown");
            $el.appendTo("#lab");
            const spy_render = jest
                .spyOn(Pattern.prototype, "render")
                .mockImplementation(() => {
                    return $("<p/>");
                });
            const instance = new Pattern($el);
            await events.await_pattern_init(instance);

            expect(spy_render).toHaveBeenCalledWith("This is markdown");
        });
    });

    describe("when rendering", function () {
        it("wraps rendering in a div", async function () {
            const $rendering = await Pattern.prototype.render("*This is markdown*");
            expect($rendering[0].tagName).toBe("DIV");
        });

        it("converts markdown into HTML", async function () {
            const $rendering = await Pattern.prototype.render("*This is markdown*");
            expect($rendering.html()).toBe(`<p><em>This is markdown</em></p>\n`);
        });
    });

    describe("Session extraction", function () {
        it("Unknown section", function () {
            expect(
                Pattern.prototype.extractSection("## My title\n\nContent", "Other title")
            ).toBe(null);
        });

        it("Last hash-section", function () {
            expect(
                Pattern.prototype.extractSection("## My title\n\nContent", "My title")
            ).toBe("## My title\n\nContent");
        });

        it("Hash-section with following section at same level ", function () {
            expect(
                Pattern.prototype.extractSection(
                    "## My title\n\nContent\n## Next section\n",
                    "My title"
                )
            ).toBe("## My title\n\nContent\n");
        });

        it("Hash-section with following section at lower level ", function () {
            expect(
                Pattern.prototype.extractSection(
                    "## My title\n\nContent\n### Next section\n",
                    "My title"
                )
            ).toBe("## My title\n\nContent\n### Next section\n");
        });

        it("Double underscore section", function () {
            expect(
                Pattern.prototype.extractSection(
                    "My title\n=======\nContent",
                    "My title"
                )
            ).toBe("My title\n=======\nContent");
        });

        it("Double underscore section with following section at same level", function () {
            expect(
                Pattern.prototype.extractSection(
                    "My title\n=======\nContent\n\nNext\n====\n",
                    "My title"
                )
            ).toBe("My title\n=======\nContent\n\n");
        });

        it("Double underscore section with following section at lower level", function () {
            expect(
                Pattern.prototype.extractSection(
                    "My title\n=======\nContent\n\nNext\n----\n",
                    "My title"
                )
            ).toBe("My title\n=======\nContent\n\nNext\n----\n");
        });

        it("Single underscore section", function () {
            expect(
                Pattern.prototype.extractSection(
                    "My title\n-------\nContent",
                    "My title"
                )
            ).toBe("My title\n-------\nContent");
        });

        it("Single underscore section with following section at same level", function () {
            expect(
                Pattern.prototype.extractSection(
                    "My title\n-------\nContent\n\nNext\n----\n",
                    "My title"
                )
            ).toBe("My title\n-------\nContent\n\n");
        });

        it("Single underscore section with following section at higher level", function () {
            expect(
                Pattern.prototype.extractSection(
                    "My title\n-------\nContent\n\nNext\n====\n",
                    "My title"
                )
            ).toBe("My title\n-------\nContent\n\n");
        });
    });

    describe("Code blocks", function () {
        it("It correctly renders code blocks", async function () {
            document.body.innerHTML = `
                <main>
                    <div class="pat-markdown">
# Title

some content

\`\`\`javascript
    const foo = "bar";
\`\`\`

                    </div>
                </main>
                `;

            const instance = new Pattern(document.querySelector(".pat-markdown"));
            await events.await_pattern_init(instance);
            await utils.timeout(1); // wait a tick for async to settle.

            expect(document.body.querySelector("main > div > h1").textContent).toBe("Title"); // prettier-ignore
            expect(document.body.querySelector("main > div > p").textContent).toBe("some content"); // prettier-ignore
            expect(document.body.querySelector("main > div > pre code")).toBeTruthy(); // prettier-ignore
            expect(document.body.querySelector("main > div > pre.language-javascript code.language-javascript")).toBeTruthy(); // prettier-ignore
            expect(document.body.querySelector("main > div > pre code .hljs-keyword")).toBeTruthy(); // prettier-ignore
        });
    });
});

import pattern from "./syntax-highlight";
import utils from "../../core/utils";

describe("pat-markdown", function () {
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    afterEach(function () {
        document.body.innerHTML = "";
    });

    describe("when initialized", function () {
        it("it does syntax highlighting.", async function () {
            document.body.innerHTML = `<pre class="pat-syntax-highlight"><code class="language-python">def foo():\n    pass</code></pre>`;
            new pattern(document.querySelector(".pat-syntax-highlight"));
            await utils.timeout(1);
            expect(
                document.querySelector(".pat-syntax-highlight code .hljs-keyword")
            ).toBeTruthy();
            // Also adds the .hljs class to the wrapper
            expect(
                document.querySelector(".pat-syntax-highlight code.hljs")
            ).toBeTruthy();
        });

        it("it does syntax highlighting on any element.", async function () {
            document.body.innerHTML = `<div class="pat-syntax-highlight language-python">def foo():\n    pass</pre>`;
            new pattern(document.querySelector(".pat-syntax-highlight"));
            await utils.timeout(1);
            expect(
                document.querySelector(".pat-syntax-highlight .hljs-keyword")
            ).toBeTruthy();
            // Also adds the .hljs class to the wrapper
            expect(document.querySelector(".pat-syntax-highlight.hljs")).toBeTruthy();
        });

        it("it does syntax highlighting for html.", async function () {
            // html code should be escaped for `<`,`>` and `&`.
            document.body.innerHTML = `<pre class="pat-syntax-highlight">
                <code class="language-html">
                    &lt;h1&gt;foo&lt;/h1&gt;
                </code>
            </pre>`;
            new pattern(document.querySelector(".pat-syntax-highlight"));
            await utils.timeout(1);
            expect(
                document.querySelector(".pat-syntax-highlight code .hljs-tag")
            ).toBeTruthy();
            // Also adds the .hljs class to the wrapper
            expect(
                document.querySelector(".pat-syntax-highlight code.hljs")
            ).toBeTruthy();
        });
    });
});

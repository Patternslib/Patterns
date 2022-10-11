import Pattern from "./clone-code";
import utils from "@patternslib/patternslib/src/core/utils";

describe("pat-clone-code", () => {
    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("is initialized correctly", async () => {
        document.body.innerHTML = `
            <div class="pat-clone-code">
                <p>hello world</p>
            </div>
        `;
        const el = document.querySelector(".pat-clone-code");

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

        const _el = document.body.querySelector(
            ".pat-clone-code pre code.language-html"
        );
        expect(_el).toBeTruthy();
        expect(_el.innerHTML.trim()).toBe("&lt;p&gt;hello world&lt;/p&gt;");
        expect(_el.textContent.trim()).toBe("<p>hello world</p>");
    });

    it("clones another source", async () => {
        document.body.innerHTML = `
            <div class="pat-clone-code"
                data-pat-clone-code="source: html">
                <p>hello world</p>
            </div>
        `;
        const el = document.querySelector(".pat-clone-code");

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

        console.log(document.body.innerHTML);
        const _el = document.body.querySelector(
            ".pat-clone-code pre code.language-html"
        );
        expect(_el).toBeTruthy();

        expect(_el.innerHTML.trim().indexOf("&lt;html&gt;")).toBe(0);
        expect(_el.innerHTML.trim().indexOf("&lt;body") > 0).toBe(true);
    });

    it("ignores .clone-ignore", async () => {
        document.body.innerHTML = `
<div class="pat-clone-code">
<div>
<div>1</div>
<div class="clone-ignore">2</div>
<div>3</div>
</div>
</div>
        `;
        const el = document.querySelector(".pat-clone-code");

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

        const _el = document.body.querySelector(
            ".pat-clone-code pre code.language-html"
        );
        expect(_el).toBeTruthy();
        console.log(document.body.innerHTML);
        expect(_el.textContent.trim()).toBe(`<div>
<div>1</div>

<div>3</div>
</div>`);
    });

    it("pretty prints output", async () => {
        document.body.innerHTML = `
<div class="pat-clone-code" data-pat-clone-code="features: format">
                                        <div>
        <div>1</div>
<div


>2</div>

<div>3</div>
 </div>
</div>
        `;
        const el = document.querySelector(".pat-clone-code");

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

        const _el = document.body.querySelector(
            ".pat-clone-code pre code.language-html"
        );
        expect(_el).toBeTruthy();
        expect(_el.textContent.trim()).toBe(`<div>
  <div>1</div>
  <div>2</div>

  <div>3</div>
</div>`);
    });
});

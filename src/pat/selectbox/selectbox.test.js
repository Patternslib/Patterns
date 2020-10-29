import Pattern from "./selectbox"; // eslint-disable-line no-unused-vars
import registry from "../../core/registry";
import utils from "../../core/utils";

describe("pat selectbox tests", () => {
    // Tests from the core.dom module

    it("works as indented.", async (done) => {
        const el = document.createElement("div");
        el.innerHTML = `
          <form>
            <select class="pat-select sel1">
              <option value="a" selected>A</option>
              <option value="b">B</option>
            </select>

            <label>
            <select class="pat-select sel2">
              <option value="c" selected>C</option>
              <option value="d">D</option>
            </select>
            </label>

            <label class="pat-select">
              <select class="sel3">
                <option value="e" selected>E</option>
                <option value="f">F</option>
              </select>
            </label>

            <input type="reset"/>
          </form>
        `;

        registry.scan(el);

        const sel1 = el.querySelector(".sel1");
        const sel2 = el.querySelector(".sel2");
        const sel3 = el.querySelector(".sel3");

        expect(sel1.parentNode.tagName).toBe("SPAN");
        expect(sel2.parentNode.tagName).toBe("LABEL");
        expect(sel3.parentNode.tagName).toBe("LABEL");

        expect(sel1.parentNode.getAttribute("data-option")).toBe("A");
        expect(sel1.parentNode.getAttribute("data-option-value")).toBe("a");

        expect(sel2.parentNode.getAttribute("data-option")).toBe("C");
        expect(sel2.parentNode.getAttribute("data-option-value")).toBe("c");

        expect(sel3.parentNode.getAttribute("data-option")).toBe("E");
        expect(sel3.parentNode.getAttribute("data-option-value")).toBe("e");

        sel1.options["1"].selected = true;
        sel1.dispatchEvent(new Event("change"));
        sel2.options["1"].selected = true;
        sel2.dispatchEvent(new Event("change"));
        sel3.options["1"].selected = true;
        sel3.dispatchEvent(new Event("change"));

        expect(sel1.parentNode.getAttribute("data-option")).toBe("B");
        expect(sel1.parentNode.getAttribute("data-option-value")).toBe("b");

        expect(sel2.parentNode.getAttribute("data-option")).toBe("D");
        expect(sel2.parentNode.getAttribute("data-option-value")).toBe("d");

        expect(sel3.parentNode.getAttribute("data-option")).toBe("F");
        expect(sel3.parentNode.getAttribute("data-option-value")).toBe("f");

        const form = el.querySelector("form");
        form.reset();
        await utils.timeout(200); // wait for (timeout in pattern)*3 + a bit

        expect(sel1.parentNode.getAttribute("data-option")).toBe("A");
        expect(sel1.parentNode.getAttribute("data-option-value")).toBe("a");

        expect(sel2.parentNode.getAttribute("data-option")).toBe("C");
        expect(sel2.parentNode.getAttribute("data-option-value")).toBe("c");

        expect(sel3.parentNode.getAttribute("data-option")).toBe("E");
        expect(sel3.parentNode.getAttribute("data-option-value")).toBe("e");

        done();
    });
});

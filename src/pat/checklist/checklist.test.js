import Pattern from "./checklist";
import registry from "../../core/registry";
import utils from "../../core/utils";

describe("pat-checklist", () => {
    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("Initializes on checkboxes with default options", async (done) => {
        document.body.innerHTML = `
            <fieldset class="pat-checklist">
                <button id="b1" class="select-all">Select all</button>
                <button id="b2" class="deselect-all">Deselect all</button>

                <label><input type="checkbox" checked>Option 1</label>
                <label><input type="checkbox">Option 2</label>
                <label><input type="checkbox">Option 3</label>
            </fieldset>
        `;
        Pattern.init(document.querySelector(".pat-checklist"));

        const [f1] = document.querySelectorAll("fieldset");
        const [b1, b2] = document.querySelectorAll("button");
        const [l1, l2, l3] = document.querySelectorAll("label");

        expect(f1.classList.contains("checked")).toEqual(true);
        expect(l1.classList.contains("checked")).toEqual(true);
        expect(l2.classList.contains("unchecked")).toEqual(true);
        expect(l3.classList.contains("unchecked")).toEqual(true);
        expect(b1.hasAttribute("disabled")).toEqual(false);
        expect(b2.hasAttribute("disabled")).toEqual(false);

        b1.click();
        await utils.timeout(100);

        expect(f1.classList.contains("checked")).toEqual(true);
        expect(l1.classList.contains("checked")).toEqual(true);
        expect(l2.classList.contains("checked")).toEqual(true);
        expect(l3.classList.contains("checked")).toEqual(true);
        expect(b1.hasAttribute("disabled")).toEqual(true);
        expect(b2.hasAttribute("disabled")).toEqual(false);

        b2.click();
        await utils.timeout(100);

        expect(f1.classList.contains("unchecked")).toEqual(true);
        expect(l1.classList.contains("unchecked")).toEqual(true);
        expect(l2.classList.contains("unchecked")).toEqual(true);
        expect(l3.classList.contains("unchecked")).toEqual(true);
        expect(b1.hasAttribute("disabled")).toEqual(false);
        expect(b2.hasAttribute("disabled")).toEqual(true);

        l2.click();
        await utils.timeout(100);

        expect(f1.classList.contains("checked")).toEqual(true);
        expect(l1.classList.contains("unchecked")).toEqual(true);
        expect(l2.classList.contains("checked")).toEqual(true);
        expect(l3.classList.contains("unchecked")).toEqual(true);
        expect(b1.hasAttribute("disabled")).toEqual(false);
        expect(b2.hasAttribute("disabled")).toEqual(false);

        done();
    });

    it("Global de/select buttons only change the associated pat-checklist instance.", async (done) => {
        document.body.innerHTML = `
            <button id="b1">Select all</button>
            <button id="b2">Deselect all</button>

            <fieldset class="pat-checklist f1" data-pat-checklist="select: #b1; deselect: #b2">
                <label><input type="checkbox" checked>Option 1</label>
                <label><input type="checkbox">Option 2</label>
                <label><input type="checkbox">Option 3</label>
            </fieldset>

            <fieldset class="pat-checklist f2">
                <label><input type="checkbox">Option 1</label>
                <label><input type="checkbox">Option 2</label>
                <label><input type="checkbox">Option 3</label>
            </fieldset>
        `;
        registry.scan(document.body);

        const [f1, f2] = document.querySelectorAll("fieldset");
        const [b1, b2] = document.querySelectorAll("button");
        const [l1, l2, l3] = document.querySelectorAll(".f1 label");
        const [l4, l5, l6] = document.querySelectorAll(".f2 label");

        expect(f1.classList.contains("checked")).toEqual(true);
        expect(l1.classList.contains("checked")).toEqual(true);
        expect(l2.classList.contains("unchecked")).toEqual(true);
        expect(l3.classList.contains("unchecked")).toEqual(true);
        expect(b1.hasAttribute("disabled")).toEqual(false);
        expect(b2.hasAttribute("disabled")).toEqual(false);

        expect(f2.classList.contains("unchecked")).toEqual(true);
        expect(l4.classList.contains("unchecked")).toEqual(true);
        expect(l5.classList.contains("unchecked")).toEqual(true);
        expect(l6.classList.contains("unchecked")).toEqual(true);

        b1.click();
        await utils.timeout(100);

        expect(f1.classList.contains("checked")).toEqual(true);
        expect(l1.classList.contains("checked")).toEqual(true);
        expect(l2.classList.contains("checked")).toEqual(true);
        expect(l3.classList.contains("checked")).toEqual(true);
        expect(b1.hasAttribute("disabled")).toEqual(true);
        expect(b2.hasAttribute("disabled")).toEqual(false);

        expect(f2.classList.contains("unchecked")).toEqual(true);
        expect(l4.classList.contains("unchecked")).toEqual(true);
        expect(l5.classList.contains("unchecked")).toEqual(true);
        expect(l6.classList.contains("unchecked")).toEqual(true);

        b2.click();
        await utils.timeout(100);

        expect(f1.classList.contains("unchecked")).toEqual(true);
        expect(l1.classList.contains("unchecked")).toEqual(true);
        expect(l2.classList.contains("unchecked")).toEqual(true);
        expect(l3.classList.contains("unchecked")).toEqual(true);
        expect(b1.hasAttribute("disabled")).toEqual(false);
        expect(b2.hasAttribute("disabled")).toEqual(true);

        expect(f2.classList.contains("unchecked")).toEqual(true);
        expect(l4.classList.contains("unchecked")).toEqual(true);
        expect(l5.classList.contains("unchecked")).toEqual(true);
        expect(l6.classList.contains("unchecked")).toEqual(true);

        l2.click();
        await utils.timeout(100);

        expect(f1.classList.contains("checked")).toEqual(true);
        expect(l1.classList.contains("unchecked")).toEqual(true);
        expect(l2.classList.contains("checked")).toEqual(true);
        expect(l3.classList.contains("unchecked")).toEqual(true);
        expect(b1.hasAttribute("disabled")).toEqual(false);
        expect(b2.hasAttribute("disabled")).toEqual(false);

        expect(f2.classList.contains("unchecked")).toEqual(true);
        expect(l4.classList.contains("unchecked")).toEqual(true);
        expect(l5.classList.contains("unchecked")).toEqual(true);
        expect(l6.classList.contains("unchecked")).toEqual(true);

        done();
    });

    it("Nested checklist.", async (done) => {
        document.body.innerHTML = `
            <fieldset class="pat-checklist f1">
                <button type="button" class="select-all">b1</button>
                <button type="button" class="deselect-all">b2</button>
                <fieldset class="f2">
                    <button type="button" class="select-all">b3</button>
                    <button type="button" class="deselect-all">b4</button>
                    <fieldset class="f3">
                        <button type="button" class="select-all">b5</button>
                        <button type="button" class="deselect-all">b6</button>
                        <label class="l1"><input type="checkbox">1</label>
                        <label class="l2"><input type="checkbox">2</label>
                    </fieldset>
                    <fieldset class="f4">
                        <button type="button" class="select-all">b7</button>
                        <button type="button" class="deselect-all">b8</button>
                        <label class="l3"><input type="checkbox">3</label>
                        <label class="l4"><input type="checkbox">4</label>
                    </fieldset>
                </fieldset>
                <fieldset class="f5">
                    <fieldset class="f6">
                        <button type="button" class="select-all">b9</button>
                        <button type="button" class="deselect-all">b10</button>
                        <label class="l5"><input type="checkbox">5</label>
                        <label class="l6"><input type="checkbox">6</label>
                    </fieldset>
                </fieldset>
            </fieldset>
        `;
        registry.scan(document.body);

        const [f1, f2, f3, f4, f5, f6] = document.querySelectorAll("fieldset");
        const [b1, b2, b3, b4, b5, b6, b7, b8, b9, b10] = document.querySelectorAll("button"); // prettier-ignore
        const [l1, l2, l3, l4, l5, l6] = document.querySelectorAll("label");

        //
        expect(f1.classList.contains("unchecked")).toEqual(true);
        expect(f2.classList.contains("unchecked")).toEqual(true);
        expect(f3.classList.contains("unchecked")).toEqual(true);
        expect(f4.classList.contains("unchecked")).toEqual(true);
        expect(f5.classList.contains("unchecked")).toEqual(true);
        expect(f6.classList.contains("unchecked")).toEqual(true);

        expect(l1.classList.contains("unchecked")).toEqual(true);
        expect(l2.classList.contains("unchecked")).toEqual(true);
        expect(l3.classList.contains("unchecked")).toEqual(true);
        expect(l4.classList.contains("unchecked")).toEqual(true);
        expect(l5.classList.contains("unchecked")).toEqual(true);
        expect(l6.classList.contains("unchecked")).toEqual(true);

        expect(b1.hasAttribute("disabled")).toEqual(false);
        expect(b2.hasAttribute("disabled")).toEqual(true);
        expect(b3.hasAttribute("disabled")).toEqual(false);
        expect(b4.hasAttribute("disabled")).toEqual(true);
        expect(b5.hasAttribute("disabled")).toEqual(false);
        expect(b6.hasAttribute("disabled")).toEqual(true);
        expect(b7.hasAttribute("disabled")).toEqual(false);
        expect(b8.hasAttribute("disabled")).toEqual(true);
        expect(b9.hasAttribute("disabled")).toEqual(false);
        expect(b10.hasAttribute("disabled")).toEqual(true);

        //
        b1.click();
        await utils.timeout(100);

        expect(f1.classList.contains("checked")).toEqual(true);
        expect(f2.classList.contains("checked")).toEqual(true);
        expect(f3.classList.contains("checked")).toEqual(true);
        expect(f4.classList.contains("checked")).toEqual(true);
        expect(f5.classList.contains("checked")).toEqual(true);
        expect(f6.classList.contains("checked")).toEqual(true);

        expect(l1.classList.contains("checked")).toEqual(true);
        expect(l2.classList.contains("checked")).toEqual(true);
        expect(l3.classList.contains("checked")).toEqual(true);
        expect(l4.classList.contains("checked")).toEqual(true);
        expect(l5.classList.contains("checked")).toEqual(true);
        expect(l6.classList.contains("checked")).toEqual(true);

        expect(b1.hasAttribute("disabled")).toEqual(true);
        expect(b2.hasAttribute("disabled")).toEqual(false);
        expect(b3.hasAttribute("disabled")).toEqual(true);
        expect(b4.hasAttribute("disabled")).toEqual(false);
        expect(b5.hasAttribute("disabled")).toEqual(true);
        expect(b6.hasAttribute("disabled")).toEqual(false);
        expect(b7.hasAttribute("disabled")).toEqual(true);
        expect(b8.hasAttribute("disabled")).toEqual(false);
        expect(b9.hasAttribute("disabled")).toEqual(true);
        expect(b10.hasAttribute("disabled")).toEqual(false);

        //
        b2.click();
        await utils.timeout(100);

        expect(f1.classList.contains("unchecked")).toEqual(true);
        expect(f2.classList.contains("unchecked")).toEqual(true);
        expect(f3.classList.contains("unchecked")).toEqual(true);
        expect(f4.classList.contains("unchecked")).toEqual(true);
        expect(f5.classList.contains("unchecked")).toEqual(true);
        expect(f6.classList.contains("unchecked")).toEqual(true);

        expect(l1.classList.contains("unchecked")).toEqual(true);
        expect(l2.classList.contains("unchecked")).toEqual(true);
        expect(l3.classList.contains("unchecked")).toEqual(true);
        expect(l4.classList.contains("unchecked")).toEqual(true);
        expect(l5.classList.contains("unchecked")).toEqual(true);
        expect(l6.classList.contains("unchecked")).toEqual(true);

        expect(b1.hasAttribute("disabled")).toEqual(false);
        expect(b2.hasAttribute("disabled")).toEqual(true);
        expect(b3.hasAttribute("disabled")).toEqual(false);
        expect(b4.hasAttribute("disabled")).toEqual(true);
        expect(b5.hasAttribute("disabled")).toEqual(false);
        expect(b6.hasAttribute("disabled")).toEqual(true);
        expect(b7.hasAttribute("disabled")).toEqual(false);
        expect(b8.hasAttribute("disabled")).toEqual(true);
        expect(b9.hasAttribute("disabled")).toEqual(false);
        expect(b10.hasAttribute("disabled")).toEqual(true);

        //
        b3.click();
        await utils.timeout(100);

        expect(f1.classList.contains("checked")).toEqual(true);
        expect(f2.classList.contains("checked")).toEqual(true);
        expect(f3.classList.contains("checked")).toEqual(true);
        expect(f4.classList.contains("checked")).toEqual(true);
        expect(f5.classList.contains("unchecked")).toEqual(true);
        expect(f6.classList.contains("unchecked")).toEqual(true);

        expect(l1.classList.contains("checked")).toEqual(true);
        expect(l2.classList.contains("checked")).toEqual(true);
        expect(l3.classList.contains("checked")).toEqual(true);
        expect(l4.classList.contains("checked")).toEqual(true);
        expect(l5.classList.contains("unchecked")).toEqual(true);
        expect(l6.classList.contains("unchecked")).toEqual(true);

        expect(b1.hasAttribute("disabled")).toEqual(false);
        expect(b2.hasAttribute("disabled")).toEqual(false);
        expect(b3.hasAttribute("disabled")).toEqual(true);
        expect(b4.hasAttribute("disabled")).toEqual(false);
        expect(b5.hasAttribute("disabled")).toEqual(true);
        expect(b6.hasAttribute("disabled")).toEqual(false);
        expect(b7.hasAttribute("disabled")).toEqual(true);
        expect(b8.hasAttribute("disabled")).toEqual(false);
        expect(b9.hasAttribute("disabled")).toEqual(false);
        expect(b10.hasAttribute("disabled")).toEqual(true);

        //
        b4.click();
        await utils.timeout(100);

        expect(f1.classList.contains("unchecked")).toEqual(true);
        expect(f2.classList.contains("unchecked")).toEqual(true);
        expect(f3.classList.contains("unchecked")).toEqual(true);
        expect(f4.classList.contains("unchecked")).toEqual(true);
        expect(f5.classList.contains("unchecked")).toEqual(true);
        expect(f6.classList.contains("unchecked")).toEqual(true);

        expect(l1.classList.contains("unchecked")).toEqual(true);
        expect(l2.classList.contains("unchecked")).toEqual(true);
        expect(l3.classList.contains("unchecked")).toEqual(true);
        expect(l4.classList.contains("unchecked")).toEqual(true);
        expect(l5.classList.contains("unchecked")).toEqual(true);
        expect(l6.classList.contains("unchecked")).toEqual(true);

        expect(b1.hasAttribute("disabled")).toEqual(false);
        expect(b2.hasAttribute("disabled")).toEqual(true);
        expect(b3.hasAttribute("disabled")).toEqual(false);
        expect(b4.hasAttribute("disabled")).toEqual(true);
        expect(b5.hasAttribute("disabled")).toEqual(false);
        expect(b6.hasAttribute("disabled")).toEqual(true);
        expect(b7.hasAttribute("disabled")).toEqual(false);
        expect(b8.hasAttribute("disabled")).toEqual(true);
        expect(b9.hasAttribute("disabled")).toEqual(false);
        expect(b10.hasAttribute("disabled")).toEqual(true);

        //
        b5.click();
        await utils.timeout(100);

        expect(f1.classList.contains("checked")).toEqual(true);
        expect(f2.classList.contains("checked")).toEqual(true);
        expect(f3.classList.contains("checked")).toEqual(true);
        expect(f4.classList.contains("unchecked")).toEqual(true);
        expect(f5.classList.contains("unchecked")).toEqual(true);
        expect(f6.classList.contains("unchecked")).toEqual(true);

        expect(l1.classList.contains("checked")).toEqual(true);
        expect(l2.classList.contains("checked")).toEqual(true);
        expect(l3.classList.contains("unchecked")).toEqual(true);
        expect(l4.classList.contains("unchecked")).toEqual(true);
        expect(l5.classList.contains("unchecked")).toEqual(true);
        expect(l6.classList.contains("unchecked")).toEqual(true);

        expect(b1.hasAttribute("disabled")).toEqual(false);
        expect(b2.hasAttribute("disabled")).toEqual(false);
        expect(b3.hasAttribute("disabled")).toEqual(false);
        expect(b4.hasAttribute("disabled")).toEqual(false);
        expect(b5.hasAttribute("disabled")).toEqual(true);
        expect(b6.hasAttribute("disabled")).toEqual(false);
        expect(b7.hasAttribute("disabled")).toEqual(false);
        expect(b8.hasAttribute("disabled")).toEqual(true);
        expect(b9.hasAttribute("disabled")).toEqual(false);
        expect(b10.hasAttribute("disabled")).toEqual(true);

        //
        b6.click();
        await utils.timeout(100);

        expect(f1.classList.contains("unchecked")).toEqual(true);
        expect(f2.classList.contains("unchecked")).toEqual(true);
        expect(f3.classList.contains("unchecked")).toEqual(true);
        expect(f4.classList.contains("unchecked")).toEqual(true);
        expect(f5.classList.contains("unchecked")).toEqual(true);
        expect(f6.classList.contains("unchecked")).toEqual(true);

        expect(l1.classList.contains("unchecked")).toEqual(true);
        expect(l2.classList.contains("unchecked")).toEqual(true);
        expect(l3.classList.contains("unchecked")).toEqual(true);
        expect(l4.classList.contains("unchecked")).toEqual(true);
        expect(l5.classList.contains("unchecked")).toEqual(true);
        expect(l6.classList.contains("unchecked")).toEqual(true);

        expect(b1.hasAttribute("disabled")).toEqual(false);
        expect(b2.hasAttribute("disabled")).toEqual(true);
        expect(b3.hasAttribute("disabled")).toEqual(false);
        expect(b4.hasAttribute("disabled")).toEqual(true);
        expect(b5.hasAttribute("disabled")).toEqual(false);
        expect(b6.hasAttribute("disabled")).toEqual(true);
        expect(b7.hasAttribute("disabled")).toEqual(false);
        expect(b8.hasAttribute("disabled")).toEqual(true);
        expect(b9.hasAttribute("disabled")).toEqual(false);
        expect(b10.hasAttribute("disabled")).toEqual(true);

        //
        b7.click();
        await utils.timeout(100);

        expect(f1.classList.contains("checked")).toEqual(true);
        expect(f2.classList.contains("checked")).toEqual(true);
        expect(f3.classList.contains("unchecked")).toEqual(true);
        expect(f4.classList.contains("checked")).toEqual(true);
        expect(f5.classList.contains("unchecked")).toEqual(true);
        expect(f6.classList.contains("unchecked")).toEqual(true);

        expect(l1.classList.contains("unchecked")).toEqual(true);
        expect(l2.classList.contains("unchecked")).toEqual(true);
        expect(l3.classList.contains("checked")).toEqual(true);
        expect(l4.classList.contains("checked")).toEqual(true);
        expect(l5.classList.contains("unchecked")).toEqual(true);
        expect(l6.classList.contains("unchecked")).toEqual(true);

        expect(b1.hasAttribute("disabled")).toEqual(false);
        expect(b2.hasAttribute("disabled")).toEqual(false);
        expect(b3.hasAttribute("disabled")).toEqual(false);
        expect(b4.hasAttribute("disabled")).toEqual(false);
        expect(b5.hasAttribute("disabled")).toEqual(false);
        expect(b6.hasAttribute("disabled")).toEqual(true);
        expect(b7.hasAttribute("disabled")).toEqual(true);
        expect(b8.hasAttribute("disabled")).toEqual(false);
        expect(b9.hasAttribute("disabled")).toEqual(false);
        expect(b10.hasAttribute("disabled")).toEqual(true);

        //
        b8.click();
        await utils.timeout(100);

        expect(f1.classList.contains("unchecked")).toEqual(true);
        expect(f2.classList.contains("unchecked")).toEqual(true);
        expect(f3.classList.contains("unchecked")).toEqual(true);
        expect(f4.classList.contains("unchecked")).toEqual(true);
        expect(f5.classList.contains("unchecked")).toEqual(true);
        expect(f6.classList.contains("unchecked")).toEqual(true);

        expect(l1.classList.contains("unchecked")).toEqual(true);
        expect(l2.classList.contains("unchecked")).toEqual(true);
        expect(l3.classList.contains("unchecked")).toEqual(true);
        expect(l4.classList.contains("unchecked")).toEqual(true);
        expect(l5.classList.contains("unchecked")).toEqual(true);
        expect(l6.classList.contains("unchecked")).toEqual(true);

        expect(b1.hasAttribute("disabled")).toEqual(false);
        expect(b2.hasAttribute("disabled")).toEqual(true);
        expect(b3.hasAttribute("disabled")).toEqual(false);
        expect(b4.hasAttribute("disabled")).toEqual(true);
        expect(b5.hasAttribute("disabled")).toEqual(false);
        expect(b6.hasAttribute("disabled")).toEqual(true);
        expect(b7.hasAttribute("disabled")).toEqual(false);
        expect(b8.hasAttribute("disabled")).toEqual(true);
        expect(b9.hasAttribute("disabled")).toEqual(false);
        expect(b10.hasAttribute("disabled")).toEqual(true);

        //
        b9.click();
        await utils.timeout(100);

        expect(f1.classList.contains("checked")).toEqual(true);
        expect(f2.classList.contains("unchecked")).toEqual(true);
        expect(f3.classList.contains("unchecked")).toEqual(true);
        expect(f4.classList.contains("unchecked")).toEqual(true);
        expect(f5.classList.contains("checked")).toEqual(true);
        expect(f6.classList.contains("checked")).toEqual(true);

        expect(l1.classList.contains("unchecked")).toEqual(true);
        expect(l2.classList.contains("unchecked")).toEqual(true);
        expect(l3.classList.contains("unchecked")).toEqual(true);
        expect(l4.classList.contains("unchecked")).toEqual(true);
        expect(l5.classList.contains("checked")).toEqual(true);
        expect(l6.classList.contains("checked")).toEqual(true);

        expect(b1.hasAttribute("disabled")).toEqual(false);
        expect(b2.hasAttribute("disabled")).toEqual(false);
        expect(b3.hasAttribute("disabled")).toEqual(false);
        expect(b4.hasAttribute("disabled")).toEqual(true);
        expect(b5.hasAttribute("disabled")).toEqual(false);
        expect(b6.hasAttribute("disabled")).toEqual(true);
        expect(b7.hasAttribute("disabled")).toEqual(false);
        expect(b8.hasAttribute("disabled")).toEqual(true);
        expect(b9.hasAttribute("disabled")).toEqual(true);
        expect(b10.hasAttribute("disabled")).toEqual(false);

        //
        b10.click();
        await utils.timeout(100);

        expect(f1.classList.contains("unchecked")).toEqual(true);
        expect(f2.classList.contains("unchecked")).toEqual(true);
        expect(f3.classList.contains("unchecked")).toEqual(true);
        expect(f4.classList.contains("unchecked")).toEqual(true);
        expect(f5.classList.contains("unchecked")).toEqual(true);
        expect(f6.classList.contains("unchecked")).toEqual(true);

        expect(l1.classList.contains("unchecked")).toEqual(true);
        expect(l2.classList.contains("unchecked")).toEqual(true);
        expect(l3.classList.contains("unchecked")).toEqual(true);
        expect(l4.classList.contains("unchecked")).toEqual(true);
        expect(l5.classList.contains("unchecked")).toEqual(true);
        expect(l6.classList.contains("unchecked")).toEqual(true);

        expect(b1.hasAttribute("disabled")).toEqual(false);
        expect(b2.hasAttribute("disabled")).toEqual(true);
        expect(b3.hasAttribute("disabled")).toEqual(false);
        expect(b4.hasAttribute("disabled")).toEqual(true);
        expect(b5.hasAttribute("disabled")).toEqual(false);
        expect(b6.hasAttribute("disabled")).toEqual(true);
        expect(b7.hasAttribute("disabled")).toEqual(false);
        expect(b8.hasAttribute("disabled")).toEqual(true);
        expect(b9.hasAttribute("disabled")).toEqual(false);
        expect(b10.hasAttribute("disabled")).toEqual(true);

        //
        l4.click();
        await utils.timeout(100);

        expect(f1.classList.contains("checked")).toEqual(true);
        expect(f2.classList.contains("checked")).toEqual(true);
        expect(f3.classList.contains("unchecked")).toEqual(true);
        expect(f4.classList.contains("checked")).toEqual(true);
        expect(f5.classList.contains("unchecked")).toEqual(true);
        expect(f6.classList.contains("unchecked")).toEqual(true);

        expect(l1.classList.contains("unchecked")).toEqual(true);
        expect(l2.classList.contains("unchecked")).toEqual(true);
        expect(l3.classList.contains("unchecked")).toEqual(true);
        expect(l4.classList.contains("checked")).toEqual(true);
        expect(l5.classList.contains("unchecked")).toEqual(true);
        expect(l6.classList.contains("unchecked")).toEqual(true);

        expect(b1.hasAttribute("disabled")).toEqual(false);
        expect(b2.hasAttribute("disabled")).toEqual(false);
        expect(b3.hasAttribute("disabled")).toEqual(false);
        expect(b4.hasAttribute("disabled")).toEqual(false);
        expect(b5.hasAttribute("disabled")).toEqual(false);
        expect(b6.hasAttribute("disabled")).toEqual(true);
        expect(b7.hasAttribute("disabled")).toEqual(false);
        expect(b8.hasAttribute("disabled")).toEqual(false);
        expect(b9.hasAttribute("disabled")).toEqual(false);
        expect(b10.hasAttribute("disabled")).toEqual(true);

        done();
    });

    it("Initializes on radio buttons", async (done) => {
        document.body.innerHTML = `
            <fieldset class="pat-checklist">
                <label><input type="radio" name="radio" />1</label>
                <label><input type="radio" name="radio" checked />2</label>
                <label><input type="radio" name="radio" />3</label>
            </fieldset>
        `;
        Pattern.init(document.querySelector(".pat-checklist"));

        const [f1] = document.querySelectorAll("fieldset");
        const [l1, l2, l3] = document.querySelectorAll("label");

        expect(f1.classList.contains("checked")).toEqual(true);
        expect(l1.classList.contains("unchecked")).toEqual(true);
        expect(l2.classList.contains("checked")).toEqual(true);
        expect(l3.classList.contains("unchecked")).toEqual(true);

        l3.click();
        await utils.timeout(100);

        expect(f1.classList.contains("checked")).toEqual(true);
        expect(l1.classList.contains("unchecked")).toEqual(true);
        expect(l2.classList.contains("unchecked")).toEqual(true);
        expect(l3.classList.contains("checked")).toEqual(true);

        done();
    });
});

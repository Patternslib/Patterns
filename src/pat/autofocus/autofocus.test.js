import pattern from "./autofocus";
import utils from "../../core/utils";

describe("pat-autofocus", function () {
    beforeEach(function () {
        const el = document.createElement("div");
        el.setAttribute("id", "lab");
        document.body.append(el);
    });

    afterEach(function () {
        document.body.innerHTML = "";
    });

    it("Focus the first element.", async (done) => {
        const container = document.querySelector("#lab");
        container.innerHTML = `
            <input name="i1" type="text" class="pat-autofocus"/>
            <input name="i2" type="text" class="pat-autofocus"/>
            <input name="i3" type="text" class="pat-autofocus"/>
        `;
        pattern.init(container);
        await utils.timeout(20);

        const should_be_active = document.querySelector("input[name=i1]");
        expect(document.activeElement).toBe(should_be_active);

        done();
    });

    it("Focus the non-empty element, if available.", async (done) => {
        const container = document.querySelector("#lab");
        container.innerHTML = `
            <input name="i1" type="text" class="pat-autofocus" value="okay"/>
            <input name="i2" type="text" class="pat-autofocus"/>
            <input name="i3" type="text" class="pat-autofocus"/>
        `;
        pattern.init(container);
        await utils.timeout(20);

        const should_be_active = document.querySelector("input[name=i2]");
        expect(document.activeElement).toBe(should_be_active);

        done();
    });
});

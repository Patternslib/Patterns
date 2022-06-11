import "./autofocus";
import registry from "../../core/registry";
import utils from "../../core/utils";

describe("pat-autofocus", function () {
    it("Focus the first element.", async () => {
        document.body.innerHTML = `
            <input name="i1" type="text" class="pat-autofocus"/>
            <input name="i2" type="text" class="pat-autofocus"/>
            <input name="i3" type="text" class="pat-autofocus"/>
        `;
        registry.scan(document.body);
        await utils.timeout(100);

        const should_be_active = document.querySelector("input[name=i1]");
        expect(document.activeElement).toBe(should_be_active);
    });

    it("Focus the first empty element, if available.", async () => {
        document.body.innerHTML = `
            <input name="i1" type="text" class="pat-autofocus" value="okay"/>
            <input name="i2" type="text" class="pat-autofocus"/>
            <input name="i3" type="text" class="pat-autofocus"/>
        `;
        registry.scan(document.body);
        await utils.timeout(100);

        const should_be_active = document.querySelector("input[name=i2]");
        expect(document.activeElement).toBe(should_be_active);
    });

    it("Don't focus hidden elements.", async () => {
        document.body.innerHTML = `
            <input name="i1" type="text" class="pat-autofocus" value="okay"/>
            <input name="i2" type="text" class="pat-autofocus" hidden/>
            <input name="i3" type="text" class="pat-autofocus"/>
        `;
        registry.scan(document.body);
        await utils.timeout(100);

        const should_be_active = document.querySelector("input[name=i3]");
        expect(document.activeElement).toBe(should_be_active);
    });
});

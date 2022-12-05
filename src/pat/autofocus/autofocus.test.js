import $ from "jquery";
import "./autofocus";
import registry from "../../core/registry";
import utils from "../../core/utils";

describe("pat-autofocus", function () {
    it("1 - Focus the first element.", async () => {
        document.body.innerHTML = `
            <input name="i1" type="text" class="pat-autofocus"/>
            <input name="i2" type="text" class="pat-autofocus"/>
            <input name="i3" type="text" class="pat-autofocus"/>
        `;
        registry.scan(document.body);
        await utils.timeout(1); // Wait for async pattern initialization.
        await utils.timeout(100); // Wait for autofocus timeout.

        const should_be_active = document.querySelector("input[name=i1]");
        expect(document.activeElement).toBe(should_be_active);
    });

    it("2 - Focus the first empty element, if available.", async () => {
        document.body.innerHTML = `
            <input name="i1" type="text" class="pat-autofocus" value="okay"/>
            <input name="i2" type="text" class="pat-autofocus"/>
            <input name="i3" type="text" class="pat-autofocus"/>
        `;
        registry.scan(document.body);
        await utils.timeout(1); // Wait for async pattern initialization.
        await utils.timeout(100); // Wait for autofocus timeout.

        const should_be_active = document.querySelector("input[name=i2]");
        expect(document.activeElement).toBe(should_be_active);
    });

    it("3 - Don't focus hidden elements.", async () => {
        document.body.innerHTML = `
            <input name="i1" type="text" class="pat-autofocus" value="okay"/>
            <input name="i2" type="text" class="pat-autofocus" hidden/>
            <input name="i3" type="text" class="pat-autofocus"/>
        `;
        registry.scan(document.body);
        await utils.timeout(1); // Wait for async pattern initialization.
        await utils.timeout(100); // Wait for autofocus timeout.

        const should_be_active = document.querySelector("input[name=i3]");
        expect(document.activeElement).toBe(should_be_active);
    });

    describe("pat-update and pat-inject support", function () {
        it("4.1 - Re-focus on pat-update.", async () => {
            document.body.innerHTML = `
                <div id="c1">
                    <input name="i1" type="text" class="pat-autofocus"/>
                </div>
                <div id="c2">
                    <input name="i2" type="text" class="pat-autofocus" hidden/>
                </div>
            `;
            registry.scan(document.body);
            await utils.timeout(1); // Wait for async pattern initialization.
            await utils.timeout(100); // Wait for autofocus timeout.

            expect(document.activeElement).toBe(
                document.querySelector("input[name=i1]")
            );

            document.querySelector("input[name=i2]").removeAttribute("hidden");
            $(document).trigger("pat-update", { dom: document.querySelector("#c2") });
            await utils.timeout(100); // Wait for autofocus timeout.

            expect(document.activeElement).toBe(
                document.querySelector("input[name=i2]")
            );
        });

        it("4.2 - Re-focus on pat-update / collapsible.", async () => {
            await import("../collapsible/collapsible");

            document.body.innerHTML = `
                <input name="i1" type="text" class="pat-autofocus"/>
                <div class="pat-collapsible closed"
                     data-pat-collapsible="transition: none">
                    <h4>Open collapsible.</h4>
                    <input name="i2" class="pat-autofocus" />
                </div>
            `;
            registry.scan(document.body);
            await utils.timeout(1); // Wait for async pattern initialization.
            await utils.timeout(100); // Wait for autofocus timeout.

            expect(document.activeElement).toBe(
                document.querySelector("input[name=i1]")
            );

            document.querySelector(".pat-collapsible h4").click();
            await utils.timeout(100); // Wait for autofocus timeout.

            expect(document.activeElement).toBe(
                document.querySelector("input[name=i2]")
            );
        });

        it("4.3 - Re-focus on pat-inject.", async () => {
            await import("../inject/inject");

            document.body.innerHTML = `
                <input name="i1" type="text" class="pat-autofocus"/>
                <a href="#autofocus-demo-input"
                   class="pat-inject"
                   data-pat-inject="target: self::after">inject</a>
                <template id="autofocus-demo-input">
                    <input name="i2" class="pat-autofocus" />
                </template>
            `;
            registry.scan(document.body);
            await utils.timeout(1); // Wait for async pattern initialization.
            await utils.timeout(100); // Wait for autofocus timeout.

            expect(document.activeElement).toBe(
                document.querySelector("input[name=i1]")
            );

            document.querySelector("a.pat-inject").click();
            await utils.timeout(2); // Wait for inject.
            await utils.timeout(100); // Wait for autofocus timeout.

            expect(document.activeElement).toBe(
                document.querySelector("input[name=i2]")
            );
        });
    });
});

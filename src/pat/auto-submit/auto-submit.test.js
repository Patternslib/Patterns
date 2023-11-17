import $ from "jquery";
import Pattern from "./auto-submit";
import events from "../../core/events";
import registry from "../../core/registry";
import utils from "../../core/utils";
import { jest } from "@jest/globals";

describe("pat-autosubmit", function () {
    afterEach(function () {
        document.body.innerHTML = "";
    });

    describe("1 - Triggering of the pattern", function () {
        it("1.1 - happens when a form has the pat-autosubmit class", function () {
            document.body.innerHTML = `
              <form class="pat-autosubmit">
                <fieldset>
                  <input type="text" name="q" placeholder="Search query"/>
                  <label><input type="checkbox" name="local"/> Only search in this section</label>
                </fieldset>
              </form>
            `;
            var spy_init = jest.spyOn(Pattern, "init");
            registry.scan(document.body);
            expect(spy_init).toHaveBeenCalled();
        });

        it("1.2 - when a grouping of inputs has the pat-autosubmit class", function () {
            document.body.innerHTML = `
              <form>
                <fieldset class="pat-autosubmit">
                  <input type="text" name="q" placeholder="Search query"/>
                  <label><input type="checkbox" name="local"/> Only search in this section</label>
                </fieldset>
              </form>
            `;
            var spy_init = jest.spyOn(Pattern, "init");
            registry.scan(document.body);
            expect(spy_init).toHaveBeenCalled();
        });

        it("1.3 - when a single input has the pat-autosubmit class", function () {
            document.body.innerHTML = `
              <form>
                <input
                    class="pat-autosubmit"
                    type="text"
                    name="q"
                    placeholder="Search query"
                />
              </form>
            `;
            var spy_init = jest.spyOn(Pattern, "init");
            registry.scan(document.body);
            expect(spy_init).toHaveBeenCalled();
        });

        it("1.4 - calls refreshListeners when pat-clone adds an element", function () {
            document.body.innerHTML = `
              <form class="pat-autosubmit">
              </form>
            `;
            const el = document.querySelector(".pat-autosubmit");
            const instance = new Pattern(el);
            const spy = jest.spyOn(instance, "refreshListeners");
            $(el).trigger("pat-update", { pattern: "clone" });
            expect(spy).toHaveBeenCalled();
        });
    });

    describe("2 - Trigger a submit", function () {
        it("2.1 - when a change on a single input happens", async function () {
            document.body.innerHTML = `
              <form>
                <input
                    class="pat-autosubmit"
                    type="text"
                    name="q"
                    data-pat-autosubmit="delay: 0"
                />
              </form>
            `;
            const input = document.querySelector(".pat-autosubmit");
            new Pattern(input);
            let submit_form_dispatched = false;
            document.querySelector("form").addEventListener("submit", () => {
                submit_form_dispatched = true;
            });
            input.dispatchEvent(events.input_event());
            await utils.timeout(1);
            expect(submit_form_dispatched).toBe(true);
        });

        it("2.2 - when pat-clone'd input is changed", async function () {
            const pattern_clone = (await import("../clone/clone")).default;
            document.body.innerHTML = `
              <form class="pat-autosubmit pat-clone"
                    data-pat-autosubmit="delay: 0"
                    data-pat-clone="template: #template">
                  <button type="button" class="add-clone">clone</button>
              </form>
              <template id="template">
                  <input name="test-input"></div>
              </template>
            `;
            const el = document.querySelector(".pat-autosubmit");
            const el_clone = document.querySelector(".pat-clone");
            const button_clone = document.querySelector(".add-clone");

            let submit_dispatched = false;
            el.addEventListener("submit", () => {
                submit_dispatched = true;
            });

            new Pattern(el);
            new pattern_clone(el_clone);

            button_clone.click();

            document.querySelector("form input").dispatchEvent(events.input_event());

            await utils.timeout(1);
            expect(submit_dispatched).toBe(true);
        });

        it("2.3 - when pat-clone removes an element", function () {
            document.body.innerHTML = `
              <form class="pat-autosubmit">
              </form>
            `;
            const el = document.querySelector(".pat-autosubmit");

            let submit_dispatched = false;
            el.addEventListener("submit", () => {
                submit_dispatched = true;
            });

            new Pattern(el);

            $(el).trigger("pat-update", { pattern: "clone", action: "removed" });

            expect(submit_dispatched).toBe(true);
        });

        it("2.4 - when pat-sortable changes the sorting", function () {
            document.body.innerHTML = `
              <form class="pat-autosubmit">
              </form>
            `;
            const el = document.querySelector(".pat-autosubmit");

            let submit_dispatched = false;
            el.addEventListener("submit", () => {
                submit_dispatched = true;
            });

            new Pattern(el);

            $(el).trigger("pat-update", { pattern: "sortable" });

            expect(submit_dispatched).toBe(true);
        });

        it("2.5 - when a change on a single input happens with delay option", async function () {
            document.body.innerHTML = `
              <form>
                <input
                    class="pat-autosubmit"
                    type="text"
                    name="q"
                    data-pat-autosubmit="delay: 20"
                />
              </form>
            `;
            const input = document.querySelector(".pat-autosubmit");
            new Pattern(input);
            let submit_form_dispatched = false;
            document.querySelector("form").addEventListener("submit", () => {
                submit_form_dispatched = true;
            });
            input.dispatchEvent(events.input_event());
            await utils.timeout(1);
            expect(submit_form_dispatched).toBe(false);
            await utils.timeout(9);
            expect(submit_form_dispatched).toBe(false);
            await utils.timeout(10);
            expect(submit_form_dispatched).toBe(true);
        });

        it("2.6 - when pat-autosubmit is defined not on a form element", async function () {
            document.body.innerHTML = `
              <form>
                <div
                    class="pat-autosubmit"
                    data-pat-autosubmit="delay: 0"
                >
                    <input name="q">
                </div>
              </form>
            `;
            const input = document.querySelector("input");
            const autosubmit = document.querySelector(".pat-autosubmit");
            new Pattern(autosubmit);

            let submit_form_dispatched = false;
            document.querySelector("form").addEventListener("submit", () => {
                submit_form_dispatched = true;
            });

            input.dispatchEvent(events.input_event());
            await utils.timeout(1);
            expect(submit_form_dispatched).toBe(true);
        });

        it("2.7 - directly on a pat-subform", async function () {
            document.body.innerHTML = `
              <form>
                <div class="pat-subform">
                    <input
                        class="pat-autosubmit"
                        data-pat-autosubmit="delay: 0"
                        name="q">
                </div>
              </form>
            `;
            const input = document.querySelector("input");
            const subform = document.querySelector(".pat-subform");
            const autosubmit = document.querySelector(".pat-autosubmit");
            new Pattern(autosubmit);

            // The submit event should be invoked on the subform.
            let submit_subform_dispatched = false;
            subform.addEventListener("submit", () => {
                submit_subform_dispatched = true;
            });

            // The submit event should also bubble up to the form.
            let submit_form_dispatched = false;
            document.querySelector("form").addEventListener("submit", () => {
                submit_form_dispatched = true;
            });

            input.dispatchEvent(events.input_event());
            await utils.timeout(1);
            expect(submit_subform_dispatched).toBe(true);
            expect(submit_form_dispatched).toBe(true);
        });
    });

    describe("3 - Parsing of the delay option", function () {
        it("3.1 - can be done in shorthand notation", function () {
            let pat = new Pattern(`<input data-pat-autosubmit="500ms"/>`);
            expect(pat.options.delay).toBe(500);
            pat = new Pattern(`<input data-pat-autosubmit="500"/>`);
            expect(pat.options.delay).toBe(500);
            pat = new Pattern(`<input data-pat-autosubmit="defocus"/>`);
            expect(pat.options.delay).toBe("defocus");
        });

        it("3.2 - can be done in longhand notation", function () {
            let pat = new Pattern(`<input data-pat-autosubmit="delay: 500ms"/>`);
            expect(pat.options.delay).toBe(500);
            pat = new Pattern(`<input data-pat-autosubmit="delay: 500"/>`);
            expect(pat.options.delay).toBe(500);
            pat = new Pattern(`<input data-pat-autosubmit="delay: defocus"/>`);
            expect(pat.options.delay).toBe("defocus");
        });
    });
});

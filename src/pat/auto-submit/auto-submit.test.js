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
        it("happens when a form has the pat-autosubmit class", function () {
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

        it("when a grouping of inputs has the pat-autosubmit class", function () {
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

        it("when a single input has the pat-autosubmit class", function () {
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

        it("calls refreshListeners when pat-clone adds an element", function () {
            document.body.innerHTML = `
              <form class="pat-autosubmit">
              </form>
            `;
            const el = document.querySelector(".pat-autosubmit");
            const instance = new Pattern(el);
            const spy = jest
                .spyOn(instance, "refreshListeners")
                .mockImplementation(() => {});
            $(el).trigger("pat-update", { pattern: "clone" });
            expect(spy).toHaveBeenCalled();
        });
    });

    describe("2 - Trigger a submit", function () {
        it("when a change on a single input happens", async function () {
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
            const instance = new Pattern(input);
            const spy = jest.spyOn(instance.$el, "submit");
            input.dispatchEvent(events.input_event());
            await utils.timeout(1);
            expect(spy).toHaveBeenCalled();
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

            const instance = new Pattern(el);
            new pattern_clone(el_clone);

            const spy = jest.spyOn(instance.$el, "submit");

            button_clone.click();

            document.querySelector("form input").dispatchEvent(events.input_event());

            expect(spy).toHaveBeenCalled();
        });

        it("when pat-clone removes an element", function () {
            document.body.innerHTML = `
              <form class="pat-autosubmit">
              </form>
            `;
            const el = document.querySelector(".pat-autosubmit");
            const instance = new Pattern(el);
            const spy = jest.spyOn(instance.$el, "submit");
            $(el).trigger("pat-update", { pattern: "clone", action: "removed" });
            expect(spy).toHaveBeenCalled();
        });

        it("when pat-sortable changes the sorting", function () {
            document.body.innerHTML = `
              <form class="pat-autosubmit">
              </form>
            `;
            const el = document.querySelector(".pat-autosubmit");
            const instance = new Pattern(el);
            const spy = jest.spyOn(instance.$el, "submit");
            $(el).trigger("pat-update", { pattern: "sortable" });
            expect(spy).toHaveBeenCalled();
        });
    });

    describe("3 - Parsing of the delay option", function () {
        it("can be done in shorthand notation", function () {
            let pat = new Pattern(`<input data-pat-autosubmit="500ms"/>`);
            expect(pat.options.delay).toBe(500);
            pat = new Pattern(`<input data-pat-autosubmit="500"/>`);
            expect(pat.options.delay).toBe(500);
            pat = new Pattern(`<input data-pat-autosubmit="defocus"/>`);
            expect(pat.options.delay).toBe("defocus");
        });

        it("can be done in longhand notation", function () {
            let pat = new Pattern(`<input data-pat-autosubmit="delay: 500ms"/>`);
            expect(pat.options.delay).toBe(500);
            pat = new Pattern(`<input data-pat-autosubmit="delay: 500"/>`);
            expect(pat.options.delay).toBe(500);
            pat = new Pattern(`<input data-pat-autosubmit="delay: defocus"/>`);
            expect(pat.options.delay).toBe("defocus");
        });
    });
});

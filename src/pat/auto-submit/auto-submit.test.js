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
            const spy = jest.spyOn(instance, "refreshListeners");
            $(el).trigger("pat-update", { pattern: "clone" });
            expect(spy).toHaveBeenCalled();
        });
    });

    describe("2 - Trigger a submit", function () {
        it("when a change on a single input happens", function () {
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
            let called = false;
            instance.el.addEventListener("submit", (e) => {
                e.preventDefault();
                called = true;
            });
            input.dispatchEvent(events.input_event());
            expect(called).toBe(true);
        });

        it("when pat-clone removes an element", function () {
            document.body.innerHTML = `
              <form class="pat-autosubmit">
              </form>
            `;
            const el = document.querySelector(".pat-autosubmit");
            const instance = new Pattern(el);
            let called = false;
            instance.el.addEventListener("submit", (e) => {
                e.preventDefault();
                called = true;
            });
            $(el).trigger("pat-update", { pattern: "clone", action: "remove" });
            expect(called).toBe(true);
        });

        it("when pat-sortable changes the sorting", function () {
            document.body.innerHTML = `
              <form class="pat-autosubmit">
              </form>
            `;
            const el = document.querySelector(".pat-autosubmit");
            const instance = new Pattern(el);
            let called = false;
            instance.el.addEventListener("submit", (e) => {
                e.preventDefault();
                called = true;
            });
            $(el).trigger("pat-update", { pattern: "sortable" });
            expect(called).toBe(true);
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

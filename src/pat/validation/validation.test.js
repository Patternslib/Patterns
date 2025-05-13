import Pattern, { parser } from "./validation";
import events from "../../core/events";
import utils from "../../core/utils";
import { jest } from "@jest/globals";

describe("pat-validation", function () {
    let orig_delay;

    beforeEach(function () {
        document.body.innerHTML = "";
        // Change default value for pat-tooltip trigger
        orig_delay = parser.parameters.delay.value;
        parser.parameters.delay.value = 0;
    });

    afterEach(function () {
        document.body.innerHTML = "";
        parser.parameters.delay.value = orig_delay;
    });

    describe("1 - general tests", function () {
        it("1.1 - validates with no constraints", async function () {
            document.body.innerHTML = `
              <form class="pat-validation">
                <input type="text" name="name">
              </form>
            `;
            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=name]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(0);
        });

        it("1.2 - adds an error when validation fails", async function () {
            document.body.innerHTML = `
              <form class="pat-validation">
                <input type="text" name="name" required>
              </form>
            `;
            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=name]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            inp.value = "";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(1);
        });

        it("1.3 - removes the error when the field becomes valid.", async function () {
            document.body.innerHTML = `
              <form class="pat-validation">
                <input type="text" name="name" required>
              </form>
            `;
            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=name]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            inp.value = "";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(1);

            inp.value = "abc";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(0);
        });

        it("1.4 - multiple error messages on multiple errors.", async function () {
            document.body.innerHTML = `
              <form class="pat-validation">
                <input type="text" name="name1" required>
                <input type="text" name="name2" required>
              </form>
            `;
            const el = document.querySelector(".pat-validation");
            const inp1 = el.querySelector("[name=name1]");
            const inp2 = el.querySelector("[name=name2]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            inp1.value = "";
            inp1.dispatchEvent(events.change_event());
            inp2.value = "";
            inp2.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(2);
        });

        it("1.5 - removes one error message but keeps the other", async function () {
            document.body.innerHTML = `
              <form class="pat-validation">
                <input type="text" name="name1" required>
                <input type="text" name="name2" required>
              </form>
            `;
            const el = document.querySelector(".pat-validation");
            const inp1 = el.querySelector("[name=name1]");
            const inp2 = el.querySelector("[name=name2]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            inp1.value = "";
            inp1.dispatchEvent(events.change_event());
            inp2.value = "";
            inp2.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(2);

            inp2.value = "abc";
            inp2.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(1);

            inp1.value = "abc";
            inp1.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(0);
        });

        it("1.6 - can use a globally configured error message and overwrite on a per field basis.", async function () {
            document.body.innerHTML = `
              <form class="pat-validation"
                data-pat-validation="message-required: need this 1">
                <input type="text" name="name1" required>
                <input type="text" name="name2" required data-pat-validation="message-required: need this 2">
              </form>
            `;
            const el = document.querySelector(".pat-validation");
            const inp1 = el.querySelector("[name=name1]");
            const inp2 = el.querySelector("[name=name2]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            inp1.value = "";
            inp1.dispatchEvent(events.change_event());
            inp2.value = "";
            inp2.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(2);
            expect(el.querySelectorAll("em.warning")[0].textContent).toBe("need this 1");
            expect(el.querySelectorAll("em.warning")[1].textContent).toBe("need this 2");
        });

        it("1.7 - doesn't validate disabled elements", async function () {
            document.body.innerHTML = `
              <form class="pat-validation">
                <input type="text" name="input" disabled required>
              </form>
            `;

            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=input]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            inp.value = "";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(0);
        });

        it("1.8 - can disable certain form elements when validation fails", async function () {
            // Tests the disable-selector argument
            document.body.innerHTML = `
              <form class="pat-validation"
                    data-pat-validation="
                        disable-selector:#form-buttons-create;
                        message-number: This value must be an integer.
                    ">
                <input type="number" name="input">
                <button id="form-buttons-create" type="submit">Submit</button>
              </form>
            `;

            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=input]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            inp.value = 4.5;
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(1);
            expect(el.querySelectorAll("em.warning")[0].textContent).toBe(
                "This value must be an integer."
            );
            expect(el.querySelector("#form-buttons-create").disabled).toBe(true);

            inp.value = 5;
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(0);
            expect(el.querySelector("#form-buttons-create").disabled).toBe(false);
        });

        it("1.9 - can define a custom error message template by subclassing.", async function () {
            class CustomValidation extends Pattern {
                error_template(message) {
                    return `<div class="validation-error">${message}</div>`;
                }
            }

            document.body.innerHTML = `
              <form class="pat-validation"
                data-pat-validation="message-required: need this;">
                <input type="text" name="name" required>
              </form>
            `;
            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=name]");

            const instance = new CustomValidation(el);
            await events.await_pattern_init(instance);

            inp.value = "";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("div.validation-error").length).toBe(1);
            expect(el.querySelectorAll("div.validation-error")[0].textContent).toBe(
                "need this"
            );
        });

        it("1.10 - Adds a novalidate attribute to not show the browsers validation bubbles.", async function () {
            // See: https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation#a_more_detailed_example
            // The ``novalidate`` attribute does not deactivate the validation API
            // but prevents the browser from showing validation messages by itself.
            document.body.innerHTML = `
              <form class="pat-validation">
              </form>
            `;
            const el = document.querySelector(".pat-validation");
            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            expect(el.hasAttribute("novalidate")).toBe(true);
        });

        it("1.11 - Prevents submit when invalid.", async function () {
            document.body.innerHTML = `
              <form class="pat-validation">
                <input name="ok" required />
                <button>submit</button>
              </form>
            `;
            const el = document.querySelector(".pat-validation");
            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            el.querySelector("button").click();
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(1);
        });

        it("1.12 - Allows submit with ``formnovalidate``.", async function () {
            // Buttons with ``formnovalidate`` should prevent validation.

            document.body.innerHTML = `
              <form class="pat-validation" onsubmit="return false;">
                <input name="ok" required />
                <button formnovalidate>submit</button>
              </form>
            `;
            const el = document.querySelector(".pat-validation");
            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            el.querySelector("button").click();
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(0);
        });

        it("1.13 - Prevents other event handlers when invalid.", async function () {
            document.body.innerHTML = `
              <form class="pat-validation">
                <input name="ok" required />
                <button>submit</button>
              </form>
            `;
            const el = document.querySelector(".pat-validation");
            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            let submit_called = false;
            let click_called = false;

            // Note: the handlers must be registered after Pattern initialization.
            // Otherwise the pattern will not be able to prevent the event.
            // In case of other patterns, the validation pattern will be reordered
            // first and submit prevention does work.
            el.addEventListener("submit", () => (submit_called = true));
            el.addEventListener("click", () => (click_called = true));

            el.querySelector("button").click();
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(1);
            expect(submit_called).toBe(false);
            expect(click_called).toBe(true);
        });

        it("1.14 - Prevents pat-inject form submission when invalid.", async function () {
            const pat_inject = (await import("../inject/inject")).default;
            const registry = (await import("../../core/registry")).default;

            document.body.innerHTML = `
              <form action="." class="pat-inject pat-validation">
                <input name="ok" required />
                <button>submit</button>
              </form>
            `;
            const el = document.querySelector(".pat-validation");

            const spy_inject_submit = jest.spyOn(pat_inject, "onTrigger");

            registry.scan(document.body);
            await utils.timeout(1); // wait a tick for async to settle.

            el.querySelector("button").click();
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(1);
            expect(spy_inject_submit).not.toHaveBeenCalled();
        });

        it("1.15 - Prevents pat-modal closing with a pat-inject when invalid.", async function () {
            await import("../close-panel/close-panel");
            const pat_inject = (await import("../inject/inject")).default;
            const pat_modal = (await import("../modal/modal")).default;
            const registry = (await import("../../core/registry")).default;

            document.body.innerHTML = `
              <div class="pat-modal">
                <form action="." class="pat-inject pat-validation">
                  <input name="ok" required />
                  <button class="close-panel">submit</button>
                </form>
              </div>
            `;
            const el = document.querySelector("form");

            const spy_inject_submit = jest.spyOn(pat_inject, "onTrigger");
            const spy_destroy_modal = jest.spyOn(pat_modal.prototype, "destroy");

            registry.scan(document.body);
            await utils.timeout(1); // wait a tick for async to settle.

            el.querySelector("button").click();
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(1);
            expect(spy_inject_submit).not.toHaveBeenCalled();
            expect(spy_destroy_modal).not.toHaveBeenCalled();
        });

        it("1.16 - Prevents pat-modal closing when invalid.", async function () {
            await import("../close-panel/close-panel");
            const pat_modal = (await import("../modal/modal")).default;
            const registry = (await import("../../core/registry")).default;

            document.body.innerHTML = `
              <div class="pat-modal">
                <form action="." class="pat-validation">
                  <input name="ok" required />
                  <button class="close-panel">submit</button>
                </form>
              </div>
            `;
            const el = document.querySelector("form");

            const spy_destroy_modal = jest.spyOn(pat_modal.prototype, "destroy");

            registry.scan(document.body);
            await utils.timeout(1); // wait a tick for async to settle.
            await utils.timeout(1); // wait another tick

            el.querySelector("button").click();
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(1);
            expect(spy_destroy_modal).not.toHaveBeenCalled();
        });

        it("1.17 - Prevents pat-modal closing when invalid with custom validation rule.", async function () {
            await import("../close-panel/close-panel");
            const pat_modal = (await import("../modal/modal")).default;
            const registry = (await import("../../core/registry")).default;

            const spy_destroy_modal = jest.spyOn(pat_modal.prototype, "destroy");

            document.body.innerHTML = `
              <div class="pat-modal">
                <form action="." class="pat-validation">
                  <input name="ok" />
                  <input name="nok" data-pat-validation="equality: ok" />
                  <button class="close-panel submit">submit</button>
                  <button class="close-panel cancel" type="button">cancel</button>
                </form>
              </div>
            `;
            const el = document.querySelector("form");
            const inp_ok = document.querySelector("input[name=ok]");
            inp_ok.value = "foo";

            registry.scan(document.body);
            await utils.timeout(1); // wait a tick for async to settle.
            await utils.timeout(1); // wait another tick

            el.querySelector("button.submit").click();
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(1);
            expect(spy_destroy_modal).not.toHaveBeenCalled();

            // A non-submit close-panel button does not check for validity.
            el.querySelector("button.cancel").click();
            await utils.timeout(1); // wait a tick for async to settle.

            expect(spy_destroy_modal).toHaveBeenCalled();
        });

        it("1.18 - validates all inputs after submit", async function () {
            document.body.innerHTML = `
              <form class="pat-validation">
                <input name="i1" required>
                <input name="i2" required>
                <button>submit</button>
              </form>
            `;
            const el = document.querySelector(".pat-validation");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            document.querySelector("button").click();

            expect(el.querySelectorAll("em.warning").length).toBe(2);
        });

        it("1.19 - validates all inputs after one failed check and disabled button", async function () {
            document.body.innerHTML = `
              <form class="pat-validation">
                <input name="i1" required>
                <input name="i2" required>
                <button name="b1">submit</button> <!-- button will be disabled -->
                <button name="b2" formnovalidate>more submit</button> <!-- button will NOT be disabled -->
                <button name="b3">even more submit</button> <!-- button will be disabled -->
              </form>
            `;
            const el = document.querySelector(".pat-validation");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            document.querySelector("[name=i1]").dispatchEvent(events.blur_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(2);
            expect(el.querySelector("[name=b1]").disabled).toBe(true);
            expect(el.querySelector("[name=b2]").disabled).toBe(false);
            expect(el.querySelector("[name=b3]").disabled).toBe(true);
        });

        it("1.20 - does not validate all inputs after one failed check and no disabled button", async function () {
            document.body.innerHTML = `
              <form class="pat-validation">
                <input name="i1" required>
                <input name="i2" required>
              </form>
            `;
            const el = document.querySelector(".pat-validation");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            document.querySelector("[name=i1]").dispatchEvent(events.blur_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(1);
        });

        it("1.21 - Emits an update event when the validation state changes", async function () {
            document.body.innerHTML = `
                <form class="pat-validation">
                    <input name="name" required>
                </form>
            `;
            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=name]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            let event;
            el.addEventListener("pat-update", (e) => {
                event = e;
            });

            inp.value = "";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(1);
            expect(event.detail.pattern).toBe("validation");
            expect(event.detail.dom).toBe(el);
            expect(event.detail.action).toBe("invalid");

            inp.value = "okay";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(event.detail.pattern).toBe("validation");
            expect(event.detail.dom).toBe(el);
            expect(event.detail.action).toBe("valid");
        });

        it("1.22 - Supports validation of inputs outside forms.", async function () {
            document.body.innerHTML = `
                <input name="outside" form="form" required/>
                <form class="pat-validation" id="form">
                </form>
                <button form="form">submit</button>
            `;
            const form = document.querySelector(".pat-validation");
            const input = document.querySelector("[name=outside]");
            const button = document.querySelector("button");

            const instance = new Pattern(form);
            await events.await_pattern_init(instance);

            input.value = "";
            input.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(document.querySelectorAll("em.warning").length).toBe(1);
            // Skip, as jsDOM does not support the `:invalid` or `:valid`
            // pseudo selectors on forms.
            //expect(form.matches(":invalid")).toBe(true);
            expect(input.matches(":invalid")).toBe(true);
            expect(button.matches(":disabled")).toBe(true);
        });
    });

    describe("2 - required inputs", function () {
        it("2.1 - validates required inputs", async function () {
            document.body.innerHTML = `
              <form class="pat-validation">
                <input type="text" name="name" required="required">
              </form>
            `;
            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=name]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(1);

            // Check validation passes with some input.
            inp.value = "123";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(0);
        });

        it("2.2 - validates required pat-autosuggest inputs on form submit", async function () {
            document.body.innerHTML = `
              <form class="pat-validation">
                <input
                    type="text"
                    name="name"
                    required="required"
                    class="pat-autosuggest"
                    data-pat-autosuggest="words: one, two"
                    hidden
                    />
              </form>
            `;
            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=name]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            el.dispatchEvent(events.submit_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(1);

            // Check validation passes with some input.
            inp.value = "one";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(0);
        });

        it("2.3 - validates required inputs with HTML5 required attribute style", async function () {
            document.body.innerHTML = `
              <form class="pat-validation">
                <input type="text" name="name" required>
              </form>
            `;
            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=name]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(1);
        });

        it("2.4 - can show custom validation messages", async function () {
            document.body.innerHTML = `
              <form class="pat-validation"
                    data-pat-validation="message-required: I'm sorry Dave, I can't let you do that."
              >
                <input type="text" name="name" required>
              </form>
            `;
            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=name]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(1);
            expect(el.querySelector("em.warning").textContent).toBe(
                "I'm sorry Dave, I can't let you do that."
            );
        });

        it("2.5 - can show custom per-field validation messages", async function () {
            document.body.innerHTML = `
              <form class="pat-validation"
                    data-pat-validation="message-required: I'm sorry Dave, I can't let you do that."
              >
                <input type="text" name="name" required data-pat-validation="message-required: Computer says no.">
              </form>
            `;
            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=name]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(1);
            expect(el.querySelector("em.warning").textContent).toBe("Computer says no.");
        });
    });

    describe("3 - email inputs", function () {
        it("3.1 - validates email inputs", async function () {
            document.body.innerHTML = `
              <form class="pat-validation"
                    data-pat-validation="message-email: This value must be a valid email address."
              >
                <input type="email" name="email">
              </form>
            `;
            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=email]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            inp.value = "invalid email";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(1);
            expect(el.querySelector("em.warning").textContent).toBe(
                "This value must be a valid email address."
            );

            inp.value = "person@mail.com";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(0);
        });
    });

    describe("4 - number inputs", function () {
        it("4.1 - validates number limits", async function () {
            document.body.innerHTML = `
              <form class="pat-validation"
                    data-pat-validation="
                        message-max: This value must be less than or equal to %{count};
                        message-min: This value must be greater than or equal to %{count}
                    "
              >
                <input type="number" min="5" name="min">
                <input type="number" max="5" name="max">
              </form>
            `;
            const el = document.querySelector(".pat-validation");
            const inp_min = el.querySelector("[name=min]");
            const inp_max = el.querySelector("[name=max]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            // min

            inp_min.value = 4;
            inp_min.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(1);
            expect(el.querySelector("em.warning").textContent).toBe(
                "This value must be greater than or equal to 5"
            );

            inp_min.value = 6;
            inp_min.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(0);

            // max

            inp_max.value = 6;
            inp_max.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(1);
            expect(el.querySelector("em.warning").textContent).toBe(
                "This value must be less than or equal to 5"
            );

            inp_max.value = 5;
            inp_max.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(0);
        });

        it("4.2 - validates integers", async function () {
            document.body.innerHTML = `
              <form class="pat-validation">
                <input type="number" name="testing" />
              </form>
            `;

            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=testing]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            inp.value = 4.5;
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(1);

            inp.value = 4;
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(0);
        });

        it("4.3 - validates real numbers within steps", async function () {
            document.body.innerHTML = `
              <form class="pat-validation">
                <input type="number" name="testing" step="0.1" />
              </form>
            `;

            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=testing]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            inp.value = 4.55;
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(1);

            inp.value = 4.5;
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(0);

            inp.value = 4;
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(0);
        });

        it("4.4 - validates real number with any number of decimal places.", async function () {
            document.body.innerHTML = `
              <form class="pat-validation">
                <input type="number" name="testing" step="any" required />
              </form>
            `;

            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=testing]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            // Let's provoke an error first.
            inp.value = "";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(1);

            inp.value = 3.14159265359;
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(0);

            inp.value = 3.14;
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(0);

            inp.value = 3;
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(0);
        });

        it("4.5 - Number: Checks for correct usage of error messages.", async function () {
            document.body.innerHTML = `
              <form class="pat-validation"
                    data-pat-validation="message-number: The value must be an integer.">
                <input type="number" name="testing" />
              </form>
            `;

            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=testing]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            inp.value = 4.5;
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(1);
            expect(el.querySelectorAll("em.warning")[0].textContent).toBe(
                "The value must be an integer."
            );

            inp.value = 5;
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(0);
        });

        it("4.6 - Number: Checks for the message-integer message alias for message-number.", async function () {
            document.body.innerHTML = `
              <form class="pat-validation"
                    data-pat-validation="message-integer: The value must be an integer.">
                <input type="number" name="testing" />
              </form>
            `;

            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=testing]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            inp.value = 4.5;
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(1);
            expect(el.querySelectorAll("em.warning")[0].textContent).toBe(
                "The value must be an integer."
            );

            inp.value = 5;
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(0);
        });
    });

    describe("5 - date inputs", function () {
        // Using ``type="text"`` for date validation as Constraints API
        // ``ValidityState`` information is not updated after programmatically
        // setting values.
        // See: https://twitter.com/thetetet/status/1285239806205755393
        it.skip("5.1 - validates dates with before/after constraints", async function () {
            document.body.innerHTML = `
                <form class="pat-validation">
                  <input
                        type="date"
                        name="date">
                </form>
            `;

            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=date]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            inp.value = "2020-02-30";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(1);
            expect(el.querySelectorAll("em.warning")[0].textContent).toBe("Wong date!");
        });

        it("5.2 - validates dates with before/after as min/max attributes with default error message.", async function () {
            document.body.innerHTML = `
              <form class="pat-validation">
                <input
                    type="date"
                    name="date"
                    min="2011-11-11"
                    max="2022-02-22"
                    />
              </form>
            `;

            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=date]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            // No error when left empty and not required.
            inp.value = "";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(0);

            // No error when left empty and not required.
            inp.value = "2010-10-10";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(1);
        });

        it("5.3 - validates dates with before/after as min/max attributes with custom error message.", async function () {
            document.body.innerHTML = `
              <form class="pat-validation">
                <input
                    type="date"
                    name="date"
                    min="2011-11-11"
                    max="2022-02-22"
                    data-pat-validation="message-date: Wong date!"
                    />
              </form>
            `;

            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=date]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            // No error when left empty and not required.
            inp.value = "";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(0);

            inp.value = "2010-10-10";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(1);
            expect(el.querySelectorAll("em.warning")[0].textContent).toBe("Wong date!");

            inp.value = "2023-02-23";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(1);
            expect(el.querySelectorAll("em.warning")[0].textContent).toBe("Wong date!");

            inp.value = "2022-01-01";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(0);
        });

        it("5.4.1 - validates dates with before/after as pattern config attributes with custom error message.", async function () {
            document.body.innerHTML = `
              <form class="pat-validation">
                <input
                    type="date"
                    name="date"
                    data-pat-validation="message-date: Wong date!; not-before: 2011-11-11; not-after: 2022-02-22"
                    />
              </form>
            `;

            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=date]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            // No error when left empty and not required.
            inp.value = "";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(0);

            inp.value = "2010-10-10";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(1);
            expect(el.querySelectorAll("em.warning")[0].textContent).toBe("Wong date!");

            inp.value = "2023-02-23";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(1);
            expect(el.querySelectorAll("em.warning")[0].textContent).toBe("Wong date!");

            inp.value = "2022-01-01";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(0);
        });

        it("5.4.2 - validates dates with before/after as pattern config attributes with NO custom error message, using fixed dates.", async function () {
            document.body.innerHTML = `
              <form class="pat-validation">
                <input
                    type="date"
                    name="date"
                    data-pat-validation="
                        not-before: 2011-11-11;
                        not-after: 2022-02-22;
                    " />
              </form>
            `;

            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=date]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            // No error when left empty and not required.
            inp.value = "";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(0);

            inp.value = "2010-10-10";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(1);
            expect(el.querySelectorAll("em.warning")[0].textContent).toBe(
                "The date must be after 2011-11-11"
            );

            inp.value = "2023-02-23";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(1);
            expect(el.querySelectorAll("em.warning")[0].textContent).toBe(
                "The date must be before 2022-02-22"
            );

            inp.value = "2022-01-01";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(0);
        });

        it("5.4.3 - validates dates with before/after as pattern config attributes with NO custom error message, using labels.", async function () {
            document.body.innerHTML = `
              <form class="pat-validation">
                <label>ye date
                    <input
                        type="date"
                        name="date1"
                        data-pat-validation="
                            not-after: [name=date2];
                        " />
                </label>
                <label>woo date
                    <input
                        type="date"
                        name="date2"
                        data-pat-validation="
                            not-before: [name=date1];
                        " />
                </label>
              </form>
            `;

            const el = document.querySelector(".pat-validation");
            const inp1 = el.querySelector("[name=date1]");
            const inp2 = el.querySelector("[name=date2]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            inp1.value = "2010-10-10";
            inp2.value = "2001-01-01";

            inp1.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(2);

            expect(el.querySelectorAll("em.warning")[0].textContent).toBe(
                "The date must be before woo date"
            );

            expect(el.querySelectorAll("em.warning")[1].textContent).toBe(
                "The date must be after ye date"
            );
        });

        it("5.4.4 - validates dates with before/after as pattern config attributes with NO custom error message, using input names.", async function () {
            document.body.innerHTML = `
              <form class="pat-validation">
                <input
                    type="date"
                    name="date1"
                    data-pat-validation="
                        not-after: [name=date2];
                    " />
                <input
                    type="date"
                    name="date2"
                    data-pat-validation="
                        not-before: [name=date1];
                    " />
              </form>
            `;

            const el = document.querySelector(".pat-validation");
            const inp1 = el.querySelector("[name=date1]");
            const inp2 = el.querySelector("[name=date2]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            inp1.value = "2010-10-10";
            inp2.value = "2001-01-01";

            inp1.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(2);

            expect(el.querySelectorAll("em.warning")[0].textContent).toBe(
                "The date must be before date2"
            );

            expect(el.querySelectorAll("em.warning")[1].textContent).toBe(
                "The date must be after date1"
            );
        });

        it("5.5 - validates dates with before/after constraints", async function () {
            document.body.innerHTML = `
                <form class="pat-validation">
                  <input
                        type="date"
                        id="start"
                        name="start"
                        data-pat-validation="
                            not-after: #end;
                            message-date: The start date must on or before the end date.
                        ">
                  <input
                        type="date"
                        id="end"
                        name="end"
                        data-pat-validation="
                            not-before: #start;
                            message-date: The end date must on or before the start date.
                        ">
                </form>
            `;

            const el = document.querySelector(".pat-validation");
            const inp_start = el.querySelector("[name=start]");
            const inp_end = el.querySelector("[name=end]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            // Before/after without required allows for empty dates of the
            // relation.
            inp_start.value = "2020-10-10";
            inp_start.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(0);

            // Violate the before/after constraint
            inp_end.value = "2020-10-05";
            inp_end.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(2);
            expect(el.querySelectorAll("em.warning")[0].textContent).toBe(
                "The start date must on or before the end date."
            );
            expect(el.querySelectorAll("em.warning")[1].textContent).toBe(
                "The end date must on or before the start date."
            );

            // Fulfill the before/after constraint - same date
            inp_start.value = "2020-10-10";
            inp_start.dispatchEvent(events.change_event());
            inp_end.value = "2020-10-10";
            inp_end.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(0);

            // Violate the before/after constraint
            inp_start.value = "2020-10-11";
            inp_start.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(2);
            expect(el.querySelectorAll("em.warning")[0].textContent).toBe(
                "The start date must on or before the end date."
            );
            expect(el.querySelectorAll("em.warning")[1].textContent).toBe(
                "The end date must on or before the start date."
            );

            // Fulfill the before/after constraint - start before end
            inp_start.value = "2020-10-01";
            inp_start.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(0);

            // Before/after without required allows for empty dates of the
            // relation.
            inp_start.value = "";
            inp_start.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(0);

            // Violate the constraint again...
            inp_start.value = "2020-10-11";
            inp_start.dispatchEvent(events.change_event());
            inp_end.value = "2020-10-10";
            inp_end.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(2);

            // Clearing one of the optional values should clear all errors.
            inp_start.value = "";
            inp_start.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(0);
        });

        it("5.6 - doesn't validate empty optional dates", async function () {
            document.body.innerHTML = `
              <form class="pat-validation">
                <input type="text" name="date">
              </form>
            `;

            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=date]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            inp.value = "";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(0);
        });

        it("5.7 - do require-validate non-empty required dates", async function () {
            document.body.innerHTML = `
              <form class="pat-validation"
                    data-pat-validation="message-required: This field is required">
                <input type="text" name="input" required>
              </form>
            `;

            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=input]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            inp.value = "";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(1);
            expect(el.querySelectorAll("em.warning")[0].textContent).toBe(
                "This field is required"
            );
        });

        it("5.8 - validates datetime-local with before/after constraints", async function () {
            document.body.innerHTML = `
                <form class="pat-validation">
                  <input
                        type="datetime-local"
                        id="start"
                        name="start"
                        data-pat-validation="
                            not-after: #end;
                            message-date: The start date/time must on or before the end date/time.
                        ">
                  <input
                        type="datetime-local"
                        id="end"
                        name="end"
                        data-pat-validation="
                            not-before: #start;
                            message-date: The end date/time must on or before the start date/time.
                        ">
                </form>
            `;

            const el = document.querySelector(".pat-validation");
            const inp_start = el.querySelector("[name=start]");
            const inp_end = el.querySelector("[name=end]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            // Before/after without required allows for empty dates of the
            // relation.
            inp_start.value = "2022-01-05T10:00";
            inp_start.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(0);

            // Violate the before/after constraint
            inp_end.value = "2022-01-05T09:00";
            inp_end.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(2);
            expect(el.querySelectorAll("em.warning")[0].textContent).toBe(
                "The start date/time must on or before the end date/time."
            );
            expect(el.querySelectorAll("em.warning")[1].textContent).toBe(
                "The end date/time must on or before the start date/time."
            );

            // Fulfill the before/after constraint - same date
            inp_start.value = "2022-01-05T10:00";
            inp_start.dispatchEvent(events.change_event());
            inp_end.value = "2022-01-05T10:00";
            inp_end.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(0);

            // Violate the before/after constraint
            inp_start.value = "2022-01-05T11:00";
            inp_start.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(2);
            expect(el.querySelectorAll("em.warning")[0].textContent).toBe(
                "The start date/time must on or before the end date/time."
            );
            expect(el.querySelectorAll("em.warning")[1].textContent).toBe(
                "The end date/time must on or before the start date/time."
            );

            // Fulfill the before/after constraint - start before end
            inp_start.value = "2022-01-04T10:00";
            inp_start.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(0);

            // Before/after without required allows for empty dates of the
            // relation.
            inp_start.value = "";
            inp_start.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(0);
        });

        it("5.9 - Do not interpret ``ok-1`` as a valid date.", async function () {
            // This issue popped up in Chrome but not in Firefox.
            // A date like ``ok-1`` was interpreted as ``2000-12-31T23:00:00.000Z``.
            // Explicitly checking for a valid ISO 8601 date fixes this.

            document.body.innerHTML = `
              <form class="pat-validation">
                <input
                    type="date"
                    name="date"
                    data-pat-validation="message-date: Wong date!; not-after: ok-1"
                    />
              </form>
            `;

            const el = document.querySelector(".pat-validation");
            const inp = el.querySelector("[name=date]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            inp.value = "2022-01-01";
            inp.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(0);
        });
    });

    describe("6 - radio inputs", function () {
        it("6.1 - validates radio buttons", async function () {
            document.body.innerHTML = `
              <form class="pat-validation"
                    data-pat-validation="message-required: This field is required">
                <label><input name="colour" required type="radio" value="blue"/> Blue</label>
                <label><input name="colour" required type="radio" value="pink"/> Pink</label>
                <label><input name="colour" required type="radio" value="red"/> Red</label>
                <label><input name="colour" required type="radio" value="yellow"/> yellow</label>
              </form>
            `;

            const el = document.querySelector(".pat-validation");
            const inps = el.querySelectorAll("[name=colour]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            el.dispatchEvent(events.submit_event());
            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(1);
            expect(el.querySelectorAll("em.warning")[0].textContent).toBe(
                "This field is required"
            );

            inps[0].checked = true;
            el.addEventListener("submit", (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
            el.dispatchEvent(events.submit_event());

            await utils.timeout(1); // wait a tick for async to settle.

            expect(el.querySelectorAll("em.warning").length).toBe(0);
        });
    });

    describe("7 - password inputs", function () {
        it("7.1 - can check for password confirmation", async function () {
            document.body.innerHTML = `
              <form class="pat-validation"
                    data-pat-validation="disable-selector:#form-buttons-create">
                <input type="password"
                       name="password">
                <input type="password"
                       name="password-confirmation"
                       data-pat-validation="
                            equality: password;
                            message-equality: I would like this to be equal to %{attribute}
                       ">
                <button id="form-buttons-create" type="submit">Submit</button>
              </form>
            `;

            const el = document.querySelector(".pat-validation");
            const inp_p = el.querySelector("[name=password]");
            const inp_c = el.querySelector("[name=password-confirmation]");

            const instance = new Pattern(el);
            await events.await_pattern_init(instance);

            inp_p.value = "foo";
            inp_c.value = "bar";
            inp_c.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(1);
            expect(el.querySelectorAll("em.warning")[0].textContent).toBe(
                "I would like this to be equal to password"
            );
            expect(el.querySelector("#form-buttons-create").disabled).toBe(true);

            inp_c.value = "foo";
            inp_c.dispatchEvent(events.change_event());
            await utils.timeout(1); // wait a tick for async to settle.
            expect(el.querySelectorAll("em.warning").length).toBe(0);
            expect(el.querySelector("#form-buttons-create").disabled).toBe(false);
        });
    });
});

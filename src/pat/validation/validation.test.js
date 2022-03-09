import Pattern, { parser } from "./validation";
import utils from "../../core/utils";
import events from "../../core/events";

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

    it("1.1 - validates with no constraints", async function () {
        document.body.innerHTML = `
          <form class="pat-validation">
            <input type="text" name="name">
          </form>
        `;
        const el = document.querySelector(".pat-validation");
        const inp = el.querySelector("[name=name]");

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

    it("1.9 - can define a custom error message template.", async function () {
        const _msg = "${this.message}"; // need to define the template in normal quotes here to not make the parser expand the missing variable.
        document.body.innerHTML = `
          <form class="pat-validation"
            data-pat-validation='
                message-required: need this;
                error-template: &lt;div class="validation-error"&gt;${_msg}&lt;/div&gt;'>
            <input type="text" name="name" required>
          </form>
        `;
        const el = document.querySelector(".pat-validation");
        const inp = el.querySelector("[name=name]");

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

        inp.value = "";
        inp.dispatchEvent(events.change_event());
        await utils.timeout(1); // wait a tick for async to settle.
        expect(el.querySelectorAll("div.validation-error").length).toBe(1);
        expect(el.querySelectorAll("div.validation-error")[0].textContent).toBe(
            "need this"
        );
    });

    it("1.10 - Adds a novalidate attribute to not show the browsers validation bubbles.", function () {
        // See: https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation#a_more_detailed_example
        // The ``novalidate`` attribute does not deactivate the validation API
        // but prevents the browser from showing validation messages by itself.
        document.body.innerHTML = `
          <form class="pat-validation">
          </form>
        `;
        const el = document.querySelector(".pat-validation");
        new Pattern(el);

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
        new Pattern(el);

        el.querySelector("button").click();
        await utils.timeout(1); // wait a tick for async to settle.

        expect(el.querySelectorAll("em.warning").length).toBe(1);
    });

    it("1.12 - Allows submit with ``formnovalidate``.", async function () {
        // Buttons with ``formnovalidate`` should prevent validation.

        document.body.innerHTML = `
          <form class="pat-validation">
            <input name="ok" required />
            <button formnovalidate>submit</button>
          </form>
        `;
        const el = document.querySelector(".pat-validation");
        new Pattern(el);

        el.querySelector("button").click();
        await utils.timeout(1); // wait a tick for async to settle.

        expect(el.querySelectorAll("em.warning").length).toBe(0);
    });

    it("2.1 - validates required inputs", async function () {
        document.body.innerHTML = `
          <form class="pat-validation">
            <input type="text" name="name" required="required">
          </form>
        `;
        const el = document.querySelector(".pat-validation");
        const inp = el.querySelector("[name=name]");

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

        inp.dispatchEvent(events.change_event());
        await utils.timeout(1); // wait a tick for async to settle.

        expect(el.querySelectorAll("em.warning").length).toBe(1);
        expect(el.querySelector("em.warning").textContent).toBe("Computer says no.");
    });

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

    it("5.4 - validates dates with before/after as pattern config attributes with custom error message.", async function () {
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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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
    });

    it("5.6 - doesn't validate empty optional dates", async function () {
        document.body.innerHTML = `
          <form class="pat-validation">
            <input type="text" name="date">
          </form>
        `;

        const el = document.querySelector(".pat-validation");
        const inp = el.querySelector("[name=date]");

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

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

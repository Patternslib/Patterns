import $ from "jquery";
import pattern from "./validation";
import utils from "../../core/utils";

describe("pat-validation", function () {
    beforeEach(function () {
        $("<div/>", { id: "lab" }).appendTo(document.body);
    });

    afterEach(function () {
        $("#lab").remove();
    });

    it("validates required inputs", async function () {
        var $el = $(
            '<form class="pat-validation">' +
                '<input type="text" name="name" required="required">' +
                "</form>"
        );
        pattern.init($el);
        await utils.timeout(1); // wait a tick for async to settle.
        $el.find(":input").trigger("change");
        expect($el.find("em.warning").length).toBe(1);

        // Check that validation passes when required is not here.
        $el = $(
            '<form class="pat-validation">' +
                '<input type="text" name="name">' +
                "</form>"
        );
        pattern.init($el);
        await utils.timeout(1); // wait a tick for async to settle.
        $el.find(":input").trigger("change");
        expect($el.find("em.warning").length).toBe(0);
    });

    it("validates required pat-autosuggest inputs on form submit", async function () {
        var $el = $(
            '<form class="pat-validation">' +
                '<input type="hidden" name="name" required="required" class="pat-autosuggest" data-pat-autosuggest="words: one, two">' +
                "</form>"
        );
        pattern.init($el);
        await utils.timeout(1); // wait a tick for async to settle.
        $el.submit();
        expect($el.find("em.warning").length).toBe(1);

        // Check that validation passes when required is not here.
        $el = $(
            '<form class="pat-validation">' +
                '<input type="hidden" name="name" class="pat-autosuggest" data-pat-autosuggest="words: one, two">' +
                "</form>"
        );
        pattern.init($el);
        await utils.timeout(1); // wait a tick for async to settle.
        $el.submit();
        expect($el.find("em.warning").length).toBe(0);
    });

    it("validates required inputs with HTML5 required attribute style", async function () {
        var $el = $(
            '<form class="pat-validation">' +
                '<input type="text" name="name" required>' +
                "</form>"
        );
        pattern.init($el);
        await utils.timeout(1); // wait a tick for async to settle.
        $el.find(":input").trigger("change");
        expect($el.find("em.warning").length).toBe(1);
    });

    it("can show custom validation messages", async function () {
        var $el = $(
            '<form class="pat-validation" data-pat-validation="message-required: I\'m sorry Dave, I can\'t let you do that.">' +
                '<input type="text" name="name" required="required">' +
                "</form>"
        );
        var $input = $el.find(":input");
        pattern.init($el);
        await utils.timeout(1); // wait a tick for async to settle.
        $input.trigger("change");
        expect($el.find("em.warning").length).toBe(1);
        expect($el.find("em.warning").text()).toBe(
            "I'm sorry Dave, I can't let you do that."
        );
    });

    it("can show custom per-field validation messages", async function () {
        var $el = $(
            '<form class="pat-validation" data-pat-validation="message-required: I\'m sorry Dave, I can\'t let you do that.">' +
                '<input type="text" name="name" required="required" data-pat-validation="message-required: Computer says no">' +
                "</form>"
        );
        var $input = $el.find(":input");
        pattern.init($el);
        await utils.timeout(1); // wait a tick for async to settle.
        $input.trigger("change");
        expect($el.find("em.warning").length).toBe(1);
        expect($el.find("em.warning").text()).toBe("Computer says no");
    });

    it("validates email inputs", async function () {
        var $el = $(
            '<form class="pat-validation">' +
                '<input type="email" name="email">' +
                "</form>"
        );
        var $input = $el.find(":input");
        $input.val("invalid email");
        pattern.init($el);
        await utils.timeout(1); // wait a tick for async to settle.
        $input.trigger("change");
        expect($el.find("em.warning").length).toBe(1);
        expect($el.find("em.warning").text()).toBe(
            "This value must be a valid email address"
        );
        $el = $(
            '<form class="pat-validation">' +
                '<input type="email" name="email">' +
                "</form>"
        );
        $input = $el.find(":input");
        $input.val("person@mail.com");
        pattern.init($el);
        await utils.timeout(1); // wait a tick for async to settle.
        $input.trigger("change");
        expect($el.find("em.warning").length).toBe(0);
    });

    it("validates number limits", async function () {
        var $el = $(
            '<form class="pat-validation">' +
                '<input type="number" min="5" name="number">' +
                "</form>"
        );
        var $input = $el.find(":input");
        $input.val(4);
        pattern.init($el);
        await utils.timeout(1); // wait a tick for async to settle.
        $input.trigger("change");
        expect($el.find("em.warning").length).toBe(1);
        expect($el.find("em.warning").text()).toBe(
            "This value must be greater than or equal to 5"
        );

        $input.val(6);
        pattern.init($el);
        await utils.timeout(1); // wait a tick for async to settle.
        $input.trigger("change");
        expect($el.find("em.warning").length).toBe(0);

        $el = $(
            '<form class="pat-validation">' +
                '<input type="number" max="5" name="number">' +
                "</form>"
        );
        $input = $el.find(":input");
        $input.val(6);
        pattern.init($el);
        await utils.timeout(1); // wait a tick for async to settle.
        $input.trigger("change");
        expect($el.find("em.warning").length).toBe(1);
        expect($el.find("em.warning").text()).toBe(
            "This value must be less than or equal to 5"
        );
    });

    it("validates integers", async function () {
        var $el = $(
            '<form class="pat-validation">' +
                '<input type="number" name="integer" data-pat-validation="type: integer;">' +
                "</form>"
        );
        var $input = $el.find(":input");
        $input.val(4.5);
        pattern.init($el);
        await utils.timeout(1); // wait a tick for async to settle.
        $input.trigger("change");
        expect($el.find("em.warning").length).toBe(1);
        expect($el.find("em.warning").text()).toBe(
            "This value must be an integer"
        );

        $el = $(
            '<form class="pat-validation">' +
                '<input type="number" name="integer"' +
                'data-pat-validation="type: integer; message-integer: Slegs heelgetalle">' +
                "</form>"
        );
        $input = $el.find(":input");
        $input.val(4.5);
        pattern.init($el);
        await utils.timeout(1); // wait a tick for async to settle.
        $input.trigger("change");
        expect($el.find("em.warning").length).toBe(1);
        expect($el.find("em.warning").text()).toBe("Slegs heelgetalle");
    });

    // Using ``type="text"`` for date validation as Constraints API
    // ``ValidityState`` information is not updated after programmatically
    // setting values.
    // See: https://twitter.com/thetetet/status/1285239806205755393

    it("validates dates", async function () {
        var $el = $(
            '<form class="pat-validation">' +
                '<input type="text" name="date" data-pat-validation="type: date">' +
                "</form>"
        );

        var $input = $el.find(":input");
        $input.val("2000-02-30");
        pattern.init($el);
        await utils.timeout(1); // wait a tick for async to settle.
        $input.trigger("change");
        expect($el.find("em.warning").length).toBe(1);
        expect($el.find("em.warning").text()).toBe(
            "This value must be a valid date"
        );

        $input.val("2000-02-28");
        $input.trigger("change");
        expect($el.find("em.warning").length).toBe(0);
    });

    it("validates dates with before/after constraints", async function () {
        var $el = $(
            '<form class="pat-validation">' +
                '<input type="text" id="start" name="start" data-pat-validation="type: date; not-after: #end; message-date: The start date must on or before the end date.">' +
                '<input type="text" id="end" name="end" data-pat-validation="type: date; not-before: #start; message-date: The end date must on or before the start date.">' +
                "</form>"
        );
        $("#lab").append($el);

        pattern.init($el);
        await utils.timeout(1); // wait a tick for async to settle.

        var $start = $el.find("#start");
        var $end = $el.find("#end");

        // Before/after constraints still allow for normal date validation
        // (wasn't before this commit)
        $start.val("2020-02-30");
        $start.trigger("change");
        expect($el.find("em.warning").length).toBe(1);
        expect($el.find("em.warning").text()).toBe(
            "The start date must on or before the end date."
        );

        // Before/after without required allows for empty dates of the
        // relation.
        $start.val("2020-10-10");
        $start.trigger("change");
        expect($el.find("em.warning").length).toBe(0);

        // Violate the before/after constraint
        $end.val("2020-10-05");
        $end.trigger("change");
        expect($el.find("em.warning").length).toBe(2);
        expect(
            $el
                .find("em.warning")
                .text()
                .indexOf("The start date must on or before the end date.") !==
                -1
        ).toBe(true);
        expect(
            $el
                .find("em.warning")
                .text()
                .indexOf("The end date must on or before the start date.") !==
                -1
        ).toBe(true);

        // Fulfill the before/after constraint - same date
        $end.val("2020-10-10");
        $end.trigger("change");
        expect($el.find("em.warning").length).toBe(0);

        // Fulfill the before/after constraint - start before end
        $start.val("2020-10-01");
        $start.trigger("change");
        expect($el.find("em.warning").length).toBe(0);

        // Before/after without required allows for empty dates of the
        // relation.
        $start.val("");
        $start.trigger("change");
        expect($el.find("em.warning").length).toBe(0);
    });

    it("doesn't validate empty optional dates", async function () {
        var $el = $(
            '<form class="pat-validation">' +
                '<input type="text" name="date" data-pat-validation="type: date">' +
                "</form>"
        );

        var $input = $el.find(":input");
        $input.val("");
        pattern.init($el);
        await utils.timeout(1); // wait a tick for async to settle.
        $input.trigger("change");
        expect($el.find("em.warning").length).toBe(0);
    });

    it("do require-validate non-empty required dates", async function () {
        var $el = $(
            '<form class="pat-validation">' +
                '<input type="text" name="date" required="required" data-pat-validation="type: date">' +
                "</form>"
        );

        var $input = $el.find(":input");
        $input.val("");
        pattern.init($el);
        await utils.timeout(1); // wait a tick for async to settle.
        $input.trigger("change");

        expect($el.find("em.warning").length).toBe(1);
        expect($el.find("em.warning").text()).toBe("This field is required");
    });

    it("doesn't validate disabled elements", async function () {
        var $el = $(
            '<form class="pat-validation">' +
                '<input type="text" name="disabled" required="required" disabled="disabled">' +
                "</form>"
        );
        pattern.init($el);
        await utils.timeout(1); // wait a tick for async to settle.
        $el.find(":input").trigger("change");
        expect($el.find("em.warning").length).toBe(0);
    });

    it("validates radio buttons", async function () {
        var $el = $(
            '<form class="pat-validation">' +
                '<label><input name="colour" required="required" type="radio" value="blue"/> Blue</label>' +
                '<label><input name="colour" required="required" type="radio" value="pink"/> Pink</label>' +
                '<label><input name="colour" required="required" type="radio" value="red"/> Red</label>' +
                '<label><input name="colour" required="required" type="radio" value="yellow"/> yellow</label>' +
                "</form>"
        );
        pattern.init($el);
        await utils.timeout(1); // wait a tick for async to settle.
        $el.submit();
        expect($el.find("em.warning").length).toBe(1);
        expect($el.find("em.warning").text()).toBe("This field is required");

        $el.find("input")[0].checked = true;
        $el.on("submit", function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
        });
        $el.submit();
        expect($el.find("em.warning").length).toBe(0);
    });

    it("removes a field's error message if it becomes valid", async function () {
        /* Check that an error message appears after the field with invalid data.
         * Also check that the message gets removed if the field's data
         * becomes valid, but that other messages are *not* removed.
         */
        var $el = $(
            '<form class="pat-validation">' +
                '<input type="number" name="integer1" data-pat-validation="type: integer;">' +
                '<input type="number" name="integer2" data-pat-validation="type: integer;">' +
                "</form>"
        );
        var $input1 = $el.find(':input[name="integer1"]');
        $input1.val(4.5);
        pattern.init($el);
        await utils.timeout(1); // wait a tick for async to settle.
        $input1.trigger("change");
        expect($el.find("em.warning").length).toBe(1);
        expect($el.find("em.warning").text()).toBe(
            "This value must be an integer"
        );

        var $input2 = $el.find(':input[name="integer2"]');
        $input2.val(5.1);
        $input2.trigger("change");
        expect($el.find("em.warning").length).toBe(2);
        expect($input2.next("em.warning").length).toBe(1);
        expect($input2.next("em.warning").text()).toBe(
            "This value must be an integer"
        );

        $input2.val(5);
        $input2.trigger("change");
        expect($input2.next("em.warning").length).toBe(0);
        expect($input1.next("em.warning").length).toBe(1);
        expect($el.find("em.warning").length).toBe(1);
    });

    it("can disable certain form elements when validation fails", async function () {
        /* Tests the disable-selector argument */
        var $el = $(
            '<form class="pat-validation" data-pat-validation="disable-selector:#form-buttons-create">' +
                '<input type="number" name="integer" data-pat-validation="type: integer;">' +
                '<button id="form-buttons-create" type="submit">Submit</button>' +
                "</form>"
        );
        $("#lab").append($el);
        var $input = $el.find(":input");
        $input.val(4.5);
        pattern.init($el);
        await utils.timeout(1); // wait a tick for async to settle.
        $input.trigger("change");
        expect($el.find("em.warning").length).toBe(1);
        expect($el.find("em.warning").text()).toBe(
            "This value must be an integer"
        );
        expect($el.find("#form-buttons-create")[0].disabled).toBe(true);

        $input.val(5);
        $input.trigger("change");
        expect($el.find("em.warning").length).toBe(0);
        expect($el.find("#form-buttons-create")[0].disabled).toBe(false);
    });

    it("can check for password confirmation", async function () {
        var $el = $(
            '<form class="pat-validation" data-pat-validation="disable-selector:#form-buttons-create">' +
                '  <input type="password" name="password">' +
                '  <input type="password" name="password-confirmation"' +
                '         data-pat-validation="equality: password; message-equality: I would like this to be equal to %{attribute}"' +
                "  > " +
                '  <button id="form-buttons-create" type="submit">Submit</button>' +
                "</form>"
        );
        $("#lab").append($el);
        var $password = $el.find("[name=password]");
        var $password_confirmation = $el.find("[name=password-confirmation]");
        $password.val("foo");
        $password_confirmation.val("bar");
        pattern.init($el);
        await utils.timeout(1); // wait a tick for async to settle.
        $password_confirmation.trigger("change");
        expect($el.find("em.warning").length).toBe(1);
        expect($el.find("em.warning").text()).toBe(
            "I would like this to be equal to password"
        );
        expect($el.find("#form-buttons-create")[0].disabled).toBe(true);

        $password_confirmation.val("foo");
        $password_confirmation.trigger("change");
        expect($el.find("em.warning").length).toBe(0);
        expect($el.find("#form-buttons-create")[0].disabled).toBe(false);
    });
});

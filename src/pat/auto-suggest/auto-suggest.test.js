import $ from "jquery";
import events from "../../core/events";
import pattern from "./auto-suggest";
import utils from "../../core/utils";
import registry from "../../core/registry";
import { jest } from "@jest/globals";

// Need to import for the ajax mock to work.
import "select2";

const mock_fetch_ajax = (...data) => {
    // Data format: [{id: str, text: str}, ... ], ...
    //              first batch ^                  ^ second batch

    // NOTE: You need to add a trailing comma if you add only one argument to
    // make the multi-argument dereferencing work.

    // Mock Select2
    $.fn.select2.ajaxDefaults.transport = jest.fn().mockImplementation((opts) => {
        // Get the batch page
        const page = opts.data.page - 1;

        // Return the data for the batch
        return opts.success(data[page]);
    });
};

var testutils = {
    createInputElement: function (c) {
        var cfg = c || {};
        return $("<input/>", {
            "id": cfg.id || "select2",
            "data-pat-autosuggest": "" || cfg.data,
            "class": "pat-autosuggest",
            "type": "text",
        }).appendTo($("div#lab"));
    },

    createSelectElement: function (c) {
        var cfg = c || {};
        return $("<select/>", {
            id: cfg.id || "select2",
            class: "pat-autosuggest",
        }).appendTo($("div#lab"));
    },

    removeSelect2: function removeSelect2() {
        $("#select2").remove();
        $("#select2-drop").remove();
        $("#select2-drop-mask").remove();
        $(".select2-container").remove();
        $(".select2-sizer").remove();
    },

    click: {
        type: "click",
        preventDefault: function () {},
    },
};

describe("pat-autosuggest", function () {
    beforeEach(function () {
        $("div#lab").remove(); // Looks likes some specs don't clean up after themselves.
        $("<div/>", { id: "lab" }).appendTo(document.body);
    });

    afterEach(function () {
        document.body.innerHTML = "";
        jest.restoreAllMocks();
    });

    describe("1 - Basic tests", function () {
        it("1.1 - An ordinary <input> element gets converted into a select2 widget", async function () {
            testutils.createInputElement();
            var $el = $("input.pat-autosuggest");

            expect($(".select2-container").length).toBe(0);
            expect($el.hasClass("select2-offscreen")).toBeFalsy();

            registry.scan(document.body);
            await utils.timeout(1); // wait a tick for async to settle.

            $el = $("input.pat-autosuggest"); // element was replaced - re-get it.
            expect($el.hasClass("select2-offscreen")).toBeTruthy();
            expect($(".select2-container").length).toBe(1);
            testutils.removeSelect2();

            expect($el[0].getAttribute("type")).toBe("text");
            expect($el[0].style.display).toBe("none");
        });

        it("1.1 - An <input> element with an ajax option keeps the ajax option when turning into a select2 widget", async function () {
            testutils.createInputElement({
                data: "ajax-url: http://test.org/test",
            });
            var $el = $("input.pat-autosuggest");
            jest.spyOn($el, "select2");

            pattern.init($el);
            await utils.timeout(1); // wait a tick for async to settle.
            expect($el.select2.mock.calls.pop()[0].ajax).toBeDefined();
            testutils.removeSelect2();
        });

        it("1.3 - A <select> element gets converted into a select2 widget", async function () {
            testutils.createSelectElement();
            var $el = $("select.pat-autosuggest");
            expect($(".select2-container").length).toBe(0);
            expect($el.hasClass("select2-offscreen")).toBeFalsy();
            pattern.init($el);
            await utils.timeout(1); // wait a tick for async to settle.
            expect($el.hasClass("select2-offscreen")).toBeTruthy();
            expect($(".select2-container").length).toBe(1);
            testutils.removeSelect2();
        });
    });

    describe("2 - Selected items", function () {
        it("2.1 - can be given custom CSS classes", async function () {
            testutils.createInputElement({
                data: 'words: apple,orange,pear; pre-fill: orange; selection-classes: {"orange": ["fruit", "orange"]}',
            });
            var $el = $("input.pat-autosuggest");
            expect($(".select2-search-choice").length).toBe(0);
            pattern.init($el);
            await utils.timeout(1); // wait a tick for async to settle.
            expect($(".select2-search-choice").length).toBe(1);
            expect($(".select2-search-choice").hasClass("fruit")).toBeTruthy();
            expect($(".select2-search-choice").hasClass("orange")).toBeTruthy();
            testutils.removeSelect2();
        });

        it("2.2 - can be restricted to a certain amount", async function () {
            // First check without limit
            testutils.createInputElement({
                data: "words: apple,orange,pear; pre-fill: orange",
            });
            expect($(".select2-input").length).toBe(0);
            pattern.init($("input.pat-autosuggest"));
            await utils.timeout(1); // wait a tick for async to settle.
            expect($(".select2-input").length).toBe(1);
            expect($(".select2-selection-limit").length).toBe(0);
            $(".select2-input").val("apple").click();
            expect($(".select2-selection-limit").length).toBe(0);
            testutils.removeSelect2();

            // Then with limit
            testutils.createInputElement({
                data: "maximum-selection-size: 1; words: apple,orange,pear; pre-fill: orange",
            });
            expect($(".select2-input").length).toBe(0);
            pattern.init($("input.pat-autosuggest"));
            await utils.timeout(1); // wait a tick for async to settle.
            expect($(".select2-input").length).toBe(1);
            expect($(".select2-selection-limit").length).toBe(0);
            $(".select2-input").val("apple").click();
            // Now we have a select style control. It has a close button
            expect($(".select2-search-choice-close").length).toBe(1);
            testutils.removeSelect2();
        });

        it("2.3 - select an item from a word list.", async function () {
            document.body.innerHTML = `
                <input
                    type="text"
                    class="pat-autosuggest"
                    data-pat-autosuggest="words: apple, orange, pear" />
            `;

            const input = document.querySelector("input");
            new pattern(input);
            await utils.timeout(1); // wait a tick for async to settle.
            $(".select2-input").click();
            $(document.querySelector(".select2-result")).mouseup();

            const selected = document.querySelectorAll(".select2-search-choice");
            expect(selected.length).toBe(1);
            expect(selected[0].textContent.trim()).toBe("apple");
            expect(input.value).toBe("apple");
        });

        it("2.4 - select multiple items from a word list.", async function () {
            document.body.innerHTML = `
                <input
                    type="text"
                    class="pat-autosuggest"
                    data-pat-autosuggest="words: apple, orange, pear" />
            `;

            const input = document.querySelector("input");
            new pattern(input);
            await utils.timeout(1); // wait a tick for async to settle.
            $(".select2-input").click();
            $(document.querySelector(".select2-result")).mouseup();
            $(".select2-input").click();
            $(document.querySelector(".select2-result")).mouseup();

            const selected = document.querySelectorAll(".select2-search-choice");
            expect(selected.length).toBe(2);
            expect(selected[0].textContent.trim()).toBe("apple");
            expect(selected[1].textContent.trim()).toBe("orange");
            expect(input.value).toBe("apple,orange");
        });

        it("2.5 - items can be pre-filled with json.", async function () {
            // Check if json pre-filled fields do work as expected.
            // Version 7.0 introduced a problem where at json pre-filled fields
            // no items could be deleted or added.
            // Version 7.11 fixes that problem.

            document.body.innerHTML = `
                <input
                    type="text"
                    class="pat-autosuggest"
                    data-pat-autosuggest='
                        words-json: [
                            {"id": "id-apple", "text":"Apple"},
                            {"id": "id-orange", "text": "Orange"},
                            {"id": "id-lemon", "text":"Lemon"}
                        ];
                        prefill-json: {
                            "id-orange": "Orange",
                            "id-lemon": "Lemon"
                        };
                    ' />
            `;

            const input = document.querySelector("input");
            new pattern(input);
            await utils.timeout(1); // wait a tick for async to settle.

            let selected = document.querySelectorAll(".select2-search-choice");
            expect(selected.length).toBe(2);
            expect(selected[0].textContent.trim()).toBe("Orange");
            expect(selected[1].textContent.trim()).toBe("Lemon");
            expect(input.value).toBe("id-orange,id-lemon");

            // NOTE: the keyboard event init key ``which`` is deprecated,
            //       but that's what select2 3.5.1 is expecting.
            document
                .querySelector(".select2-input")
                .dispatchEvent(new KeyboardEvent("keydown", { which: 8 }));
            // Need to send two times.
            document
                .querySelector(".select2-input")
                .dispatchEvent(new KeyboardEvent("keydown", { which: 8 }));

            selected = document.querySelectorAll(".select2-search-choice");
            expect(selected.length).toBe(1);
            expect(selected[0].textContent.trim()).toBe("Orange");

            document.querySelector(".select2-input").click();
            document.querySelector(".select2-result").dispatchEvent(events.mouseup_event()); // prettier-ignore
            document.querySelector(".select2-input").click();
            document.querySelector(".select2-result").dispatchEvent(events.mouseup_event()); // prettier-ignore

            selected = document.querySelectorAll(".select2-search-choice");
            expect(selected.length).toBe(3);
            expect(selected[0].textContent.trim()).toBe("Orange");
            expect(selected[1].textContent.trim()).toBe("Apple");
            expect(selected[2].textContent.trim()).toBe("Lemon");
            expect(input.value).toBe("id-orange,id-apple,id-lemon");
        });

        it("2.6 - items can be pre-filled without json.", async function () {
            document.body.innerHTML = `
                <input
                    type="text"
                    class="pat-autosuggest"
                    data-pat-autosuggest="
                        prefill: id-orange, id-lemon;
                    " />
            `;

            const input = document.querySelector("input");
            new pattern(input);
            await utils.timeout(1); // wait a tick for async to settle.

            let selected = document.querySelectorAll(".select2-search-choice");
            expect(selected.length).toBe(2);
            expect(selected[0].textContent.trim()).toBe("id-orange");
            expect(selected[1].textContent.trim()).toBe("id-lemon");
            expect(input.value).toBe("id-orange,id-lemon");
        });

        it("2.7.1 - use a custom separator for multiple items.", async function () {
            document.body.innerHTML = `
                <input
                    type="text"
                    class="pat-autosuggest"
                    data-pat-autosuggest="
                        words: apple, orange, pear;
                        value-separator: |" />
                    " />
            `;

            const input = document.querySelector("input");
            new pattern(input);
            await utils.timeout(1); // wait a tick for async to settle.
            $(".select2-input").click();
            $(document.querySelector(".select2-result")).mouseup();
            $(".select2-input").click();
            $(document.querySelector(".select2-result")).mouseup();

            const selected = document.querySelectorAll(".select2-search-choice");
            expect(selected.length).toBe(2);
            expect(selected[0].textContent.trim()).toBe("apple");
            expect(selected[1].textContent.trim()).toBe("orange");
            expect(input.value).toBe("apple|orange");
        });

        it("2.7.2 - use another custom separator for multiple items.", async function () {
            document.body.innerHTML = `
                <input
                    type="text"
                    class="pat-autosuggest"
                    data-pat-autosuggest="
                        words: apple, orange, pear;
                        value-separator: ;;" />
                    " />
            `;

            const input = document.querySelector("input");
            new pattern(input);
            await utils.timeout(1); // wait a tick for async to settle.
            $(".select2-input").click();
            $(document.querySelector(".select2-result")).mouseup();
            $(".select2-input").click();
            $(document.querySelector(".select2-result")).mouseup();

            const selected = document.querySelectorAll(".select2-search-choice");
            expect(selected.length).toBe(2);
            expect(selected[0].textContent.trim()).toBe("apple");
            expect(selected[1].textContent.trim()).toBe("orange");
            expect(input.value).toBe("apple;orange");
        });

        it("2.7.3 - use a custom separator and pre-fill with json.", async function () {
            document.body.innerHTML = `
                <input
                    type="text"
                    class="pat-autosuggest"
                    data-pat-autosuggest='
                        prefill-json: {
                            "id-orange": "Orange",
                            "id-lemon": "Lemon"
                        };
                        value-separator: ;;
                    ' />
            `;

            const input = document.querySelector("input");
            new pattern(input);
            await utils.timeout(1); // wait a tick for async to settle.

            let selected = document.querySelectorAll(".select2-search-choice");
            expect(selected.length).toBe(2);
            expect(selected[0].textContent.trim()).toBe("Orange");
            expect(selected[1].textContent.trim()).toBe("Lemon");
            expect(input.value).toBe("id-orange;id-lemon");
        });

        it("2.7.4 - use a custom separator and pre-fill.", async function () {
            document.body.innerHTML = `
                <input
                    type="text"
                    class="pat-autosuggest"
                    data-pat-autosuggest="
                        prefill: id-orange, id-lemon;
                        value-separator: ;;
                    " />
            `;

            const input = document.querySelector("input");
            new pattern(input);
            await utils.timeout(1); // wait a tick for async to settle.

            let selected = document.querySelectorAll(".select2-search-choice");
            expect(selected.length).toBe(2);
            expect(selected[0].textContent.trim()).toBe("id-orange");
            expect(selected[1].textContent.trim()).toBe("id-lemon");
            expect(input.value).toBe("id-orange;id-lemon");
        });

        it("2.7.5 - use a custom separator and pre-fill with the value attribute.", async function () {
            document.body.innerHTML = `
                <input
                    type="text"
                    class="pat-autosuggest"
                    data-pat-autosuggest="
                        value-separator: ;;
                    "
                    value="id-orange;id-lemon"
                    />
            `;

            const input = document.querySelector("input");
            new pattern(input);
            await utils.timeout(1); // wait a tick for async to settle.

            let selected = document.querySelectorAll(".select2-search-choice");
            expect(selected.length).toBe(2);
            expect(selected[0].textContent.trim()).toBe("id-orange");
            expect(selected[1].textContent.trim()).toBe("id-lemon");
            expect(input.value).toBe("id-orange;id-lemon");
        });
    });

    describe("3 - Placeholder tests", function () {
        it("3.1 - A placeholder on the original element is reused on the auto-suggest element", async function () {
            var placeholder = "Test placeholder";

            $("<input/>", {
                id: "select2",
                class: "pat-autosuggest",
                placeholder: "Test placeholder",
            }).appendTo($("div#lab"));

            var $el = $("input.pat-autosuggest");

            expect($el.prop("placeholder")).toBe(placeholder);
            pattern.init($el);
            await utils.timeout(1); // wait a tick for async to settle.
            // XXX Placeholder is used as value of the input field.
            // Change this as soon Select2 changes this odd behavior.
            expect($(".select2-input").val()).toBe(placeholder);
            testutils.removeSelect2();
        });

        it("3.2 - No placeholder doesn't create an automatic one.", async function () {
            $("<input/>", {
                id: "select2",
                class: "pat-autosuggest",
            }).appendTo($("div#lab"));

            var $el = $("input.pat-autosuggest");

            expect($el.prop("placeholder")).toBe("");
            pattern.init($el);
            await utils.timeout(1); // wait a tick for async to settle.
            // XXX Placeholder is used as value of the input field.
            // Change this as soon Select2 changes this odd behavior.
            expect($(".select2-input").val()).toBe("");
            testutils.removeSelect2();
        });
    });

    describe("4 - Integration...", function () {
        it("4.1 - Works with pat-auto-submit", async function () {
            document.body.innerHTML = `
                <form>
                    <input
                        type="text"
                        class="pat-autosuggest pat-autosubmit"
                        data-pat-autosuggest="words: apple, orange, pear"
                        data-pat-autosubmit="delay:0" />
                </form>
            `;

            const pattern_autosubmit = (await import("../auto-submit/auto-submit")).default; // prettier-ignore
            const input = document.querySelector("input");

            let submit_dispatched = false;
            document.querySelector("form").addEventListener("submit", () => {
                submit_dispatched = true;
            });

            new pattern(input);
            new pattern_autosubmit(input);

            await utils.timeout(1); // wait a tick for async to settle.

            $(".select2-input").click();
            $(document.querySelector(".select2-result")).mouseup();

            expect(submit_dispatched).toBe(true);
        });

        it("4.2 - Works with pat-validate on an empty selection.", async function () {
            const pattern_validation = (await import("../validation/validation")).default; // prettier-ignore

            document.body.innerHTML = `
                <form class="pat-validation" data-pat-validation="delay: 0">
                  <input
                      name="words"
                      class="pat-autosuggest"
                      required
                      data-pat-autosuggest="words: apple, orange, pear" />
                </form>
            `;

            const form = document.querySelector("form");
            const input = document.querySelector("input");

            const instance_validation = new pattern_validation(form);
            await events.await_pattern_init(instance_validation);
            new pattern(input);
            await utils.timeout(1); // wait a tick for async to settle.

            // Open the select2 dropdown
            $(".select2-input").click();
            await utils.timeout(1); // wait a tick for async to settle.

            // Close it without selecting something.
            $(input).select2("close");

            await utils.timeout(1); // wait a tick for async to settle.

            // There should be a error message from pat-validation.
            expect(form.querySelectorAll("em.warning").length).toBe(1);
        });

        it("4.3 - Works with pat-validate when empty and focus moves away.", async function () {
            const pattern_validation = (await import("../validation/validation")).default; // prettier-ignore

            document.body.innerHTML = `
                <form class="pat-validation" data-pat-validation="delay: 0">
                  <input
                      name="words"
                      class="pat-autosuggest"
                      required
                      data-pat-autosuggest="words: apple, orange, pear" />
                </form>
            `;

            const form = document.querySelector("form");
            const input = document.querySelector("input");

            const instance_validation = new pattern_validation(form);
            await events.await_pattern_init(instance_validation);
            new pattern(input);
            await utils.timeout(1); // wait a tick for async to settle.

            // Move focus away from select2
            $(".select2-input")[0].dispatchEvent(events.blur_event());
            await utils.timeout(1); // wait a tick for async to settle.

            // There should be a error message from pat-validation.
            expect(form.querySelectorAll("em.warning").length).toBe(1);
        });
    });

    describe("5 - Pittfalls...", function () {
        it("5.1 - BEWARE! JSON structures must be valid JSON!", async function () {
            // The following contains invalid JSON. Note the comma after the last prefill item.
            document.body.innerHTML = `
                <input
                    type="text"
                    class="pat-autosuggest"
                    data-pat-autosuggest='
                        prefill-json: {
                            "id-orange": "Orange",
                            "id-lemon": "Lemon",
                        };
                    ' />
            `;

            const input = document.querySelector("input");
            new pattern(input);
            await utils.timeout(1); // wait a tick for async to settle.

            let selected = document.querySelectorAll(".select2-search-choice");

            // INVALID JSON! No prefilling should happen.
            expect(selected.length).toBe(0);
        });
    });

    describe("6 - AJAX tests", function () {
        it("6.1 - AJAX works with a simple data structure.", async function () {
            mock_fetch_ajax(
                [
                    { id: "1", text: "apple" },
                    { id: "2", text: "orange" },
                ] // Note the trailing comma to make the multi-argument dereferencing work.
            );

            document.body.innerHTML = `
                <input
                    type="text"
                    class="pat-autosuggest"
                    data-pat-autosuggest="
                        ajax-url: http://test.org/test;
                        ajax-timeout: 1;
                    " />
            `;

            const input = document.querySelector("input");
            new pattern(input);
            await utils.timeout(1); // wait a tick for async to settle.

            $(".select2-input").click();
            await utils.timeout(1); // wait for ajax to finish.

            const results = $(document.querySelectorAll(".select2-results li"));
            expect(results.length).toBe(2);

            $(results[0]).mouseup();

            const selected = document.querySelectorAll(".select2-search-choice");
            expect(selected.length).toBe(1);
            expect(selected[0].textContent.trim()).toBe("apple");
            expect(input.value).toBe("1");
        });

        // This test is so flaky, just skip it if it fails.
        it.skip.failing("6.2 - AJAX works with batches.", async function () {
            mock_fetch_ajax(
                [
                    { id: "1", text: "one" },
                    { id: "2", text: "two" },
                    { id: "3", text: "three" },
                    { id: "4", text: "four" },
                ],
                [
                    { id: "5", text: "five" },
                    { id: "6", text: "six" },
                ],
                [{ id: "7", text: "seven" }]
            );

            document.body.innerHTML = `
                <input
                    type="text"
                    class="pat-autosuggest"
                    data-pat-autosuggest="
                        ajax-url: http://test.org/test;
                        ajax-timeout: 1;
                        max-initial-size: 4;
                        ajax-batch-size: 2;
                    " />
            `;

            const input = document.querySelector("input");
            new pattern(input);
            await utils.timeout(1); // wait a tick for async to settle.

            // Load batch 1 with batch size 4
            $(".select2-input").click();
            await utils.timeout(1); // wait for ajax to finish.

            const results_1 = $(
                document.querySelectorAll(".select2-results .select2-result")
            );
            expect(results_1.length).toBe(4);

            const load_more_1 = $(
                document.querySelectorAll(".select2-results .select2-more-results")
            );
            expect(load_more_1.length).toBe(1);

            // Load batch 2 with batch size 2
            $(load_more_1[0]).mouseup();
            // NOTE: Flaky behavior needs multiple timeouts 👌
            await utils.timeout(1); // wait for ajax to finish.
            await utils.timeout(1); // wait for ajax to finish.
            await utils.timeout(1); // wait for ajax to finish.
            await utils.timeout(1); // wait for ajax to finish.

            const results_2 = $(
                document.querySelectorAll(".select2-results .select2-result")
            );
            console.log(document.body.innerHTML);
            expect(results_2.length).toBe(6);

            const load_more_2 = $(
                document.querySelectorAll(".select2-results .select2-more-results")
            );
            expect(load_more_2.length).toBe(1);

            // Load final batch 2
            $(load_more_2[0]).mouseup();
            // NOTE: Flaky behavior needs multiple timeouts 🤘
            await utils.timeout(1); // wait for ajax to finish.
            await utils.timeout(1); // wait for ajax to finish.
            await utils.timeout(1); // wait for ajax to finish.
            await utils.timeout(1); // wait for ajax to finish.

            const results_3 = $(
                document.querySelectorAll(".select2-results .select2-result")
            );
            expect(results_3.length).toBe(7);

            const load_more_3 = $(
                document.querySelectorAll(".select2-results .select2-more-results")
            );
            expect(load_more_3.length).toBe(0);
        });

        describe("6.3 - Test the page_limit logic.", function () {

            it("6.3.1 - page_limit set only by ajax-batch-size.", async function () {
                document.body.innerHTML = `
                    <input
                        type="text"
                        class="pat-autosuggest"
                        data-pat-autosuggest="
                            ajax-url: http://test.org/test;
                            ajax-batch-size: 2;
                        " />
                `;

                const input = document.querySelector("input");
                const instance = new pattern(input);
                await utils.timeout(1); // wait a tick for async to settle.

                expect(instance.page_limit(1)).toBe(10);
                expect(instance.page_limit(2)).toBe(2);
            });

            it("6.3.2 - page_limit set by ajax-batch-size and max-initial-size.", async function () {
                document.body.innerHTML = `
                    <input
                        type="text"
                        class="pat-autosuggest"
                        data-pat-autosuggest="
                            ajax-url: http://test.org/test;
                            ajax-batch-size: 2;
                            max-initial-size: 4;
                        " />
                `;

                const input = document.querySelector("input");
                const instance = new pattern(input);
                await utils.timeout(1); // wait a tick for async to settle.

                expect(instance.page_limit(1)).toBe(4);
                expect(instance.page_limit(2)).toBe(2);
            });

            it("6.3.3 - page_limit set only by max-initial-size and batching not activated.", async function () {
                document.body.innerHTML = `
                    <input
                        type="text"
                        class="pat-autosuggest"
                        data-pat-autosuggest="
                            ajax-url: http://test.org/test;
                            max-initial-size: 4;
                        " />
                `;

                const input = document.querySelector("input");
                const instance = new pattern(input);
                await utils.timeout(1); // wait a tick for async to settle.

                expect(instance.page_limit(1)).toBe(4);
                expect(instance.page_limit(2)).toBe(0);
            });

        });
    });
});

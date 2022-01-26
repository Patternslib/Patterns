import $ from "jquery";
import pattern from "./auto-suggest";
import utils from "../../core/utils";
import registry from "../../core/registry";
import { jest } from "@jest/globals";

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
            expect($el[0].hasAttribute("hidden")).toBe(true);
        });

        it("1.1 - An <input> element with an ajax option keeps the ajax option when turning into a select2 widget", async function () {
            testutils.createInputElement({
                data: "ajax-url: http://test.org/test",
            });
            var $el = $("input.pat-autosuggest");
            jest.spyOn($el, "select2");

            new pattern($el);
            await utils.timeout(1); // wait a tick for async to settle.
            expect($el.select2.mock.calls.pop()[0].ajax).toBeDefined();
            testutils.removeSelect2();
        });

        it("1.3 - A <select> element gets converted into a select2 widget", async function () {
            testutils.createSelectElement();
            var $el = $("select.pat-autosuggest");
            expect($(".select2-container").length).toBe(0);
            expect($el.hasClass("select2-offscreen")).toBeFalsy();
            new pattern($el);
            await utils.timeout(1); // wait a tick for async to settle.
            expect($el.hasClass("select2-offscreen")).toBeTruthy();
            expect($(".select2-container").length).toBe(1);
            testutils.removeSelect2();
        });
    });

    describe("2.1 - Selected items", function () {
        it("4.1 - can be given custom CSS classes", async function () {
            testutils.createInputElement({
                data: 'words: apple,orange,pear; pre-fill: orange; selection-classes: {"orange": ["fruit", "orange"]}',
            });
            var $el = $("input.pat-autosuggest");
            expect($(".select2-search-choice").length).toBe(0);
            new pattern($el);
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
            new pattern($("input.pat-autosuggest"));
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
            new pattern($("input.pat-autosuggest"));
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
            new pattern($el);
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
            new pattern($el);
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
                <input
                    type="text"
                    class="pat-autosuggest pat-autosubmit"
                    data-pat-autosuggest="words: apple, orange, pear"
                    data-pat-autosubmit="delay:0" />
            `;

            const pattern_autosubmit = (await import("../auto-submit/auto-submit")).default; // prettier-ignore
            const input = document.querySelector("input");
            new pattern(input);
            const instance_autosubmit = new pattern_autosubmit(input);
            const spy = jest.spyOn(instance_autosubmit.$el, "submit");
            await utils.timeout(1); // wait a tick for async to settle.

            $(".select2-input").click();
            $(document.querySelector(".select2-result")).mouseup();

            expect(spy).toHaveBeenCalled();
        });
    });
});

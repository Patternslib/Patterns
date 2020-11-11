import $ from "jquery";
import pattern from "./auto-suggest";
import utils from "../../core/utils";
import registry from "../../core/registry";

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
        $("#lab").remove();
        jest.restoreAllMocks();
    });

    describe("An ordinary <input> element", function () {
        it("gets converted into a select2 widget", async function () {
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

            expect($el[0].getAttribute("type")).toBe("hidden");
        });
    });

    describe("An <input> element with an ajax option", function () {
        it("keeps the ajax option when turning into a select2 widget", async function () {
            testutils.createInputElement({
                data: "ajax-url: http://test.org/test",
            });
            var $el = $("input.pat-autosuggest");
            spyOn($el, "select2");

            pattern.init($el);
            await utils.timeout(1); // wait a tick for async to settle.
            expect($el.select2.calls.mostRecent().args[0].ajax).toBeDefined();
            testutils.removeSelect2();
        });
    });

    describe("A <select> element", function () {
        it("gets converted into a select2 widget", async function () {
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

    describe("Selected items", function () {
        it("can be given custom CSS classes", async function () {
            testutils.createInputElement({
                data:
                    'words: apple,orange,pear; pre-fill: orange; selection-classes: {"orange": ["fruit", "orange"]}',
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

        it("can be restricted to a certain amount", async function () {
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
                data:
                    "maximum-selection-size: 1; words: apple,orange,pear; pre-fill: orange",
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
    });

    describe("Placeholder tests", function () {
        it("A placeholder on the original element is reused on the auto-suggest element", async function () {
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

        it("No placeholder doesn't create an automatic one.", async function () {
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
});

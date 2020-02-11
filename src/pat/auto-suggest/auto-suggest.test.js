define(["pat-autosuggest"], function(pattern) {
    var utils = {
        createInputElement: function(c) {
            var cfg = c || {};
            return $("<input/>", {
                id: cfg.id || "select2",
                "data-pat-autosuggest": "" || cfg.data,
                class: "pat-autosuggest"
            }).appendTo($("div#lab"));
        },

        createSelectElement: function(c) {
            var cfg = c || {};
            return $("<select/>", {
                id: cfg.id || "select2",
                class: "pat-autosuggest"
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
            preventDefault: function() {}
        }
    };

    describe("pat-autosuggest", function() {
        describe("An ordinary <input> element", function() {
            beforeEach(function() {
                $("div#lab").remove(); // Looks likes some specs don't clean up after themselves.
                $("<div/>", { id: "lab" }).appendTo(document.body);
            });

            afterEach(function() {
                $("#lab").remove();
            });

            it("gets converted into a select2 widget", function() {
                utils.createInputElement();
                var $el = $("input.pat-autosuggest");

                expect($(".select2-container").length).toBe(0);
                expect($el.hasClass("select2-offscreen")).toBeFalsy();
                pattern.init($el);
                expect($el.hasClass("select2-offscreen")).toBeTruthy();
                expect($(".select2-container").length).toBe(1);
                utils.removeSelect2();
            });
        });

        describe("An <input> element with an ajax option", function() {
            beforeEach(function() {
                $("div#lab").remove(); // Looks likes some specs don't clean up after themselves.
                $("<div/>", { id: "lab" }).appendTo(document.body);
            });

            afterEach(function() {
                $("#lab").remove();
            });

            it("keeps the ajax option when turning into a select2 widget", function() {
                utils.createInputElement({
                    data: "ajax-url: http://test.org/test"
                });
                var $el = $("input.pat-autosuggest");
                spyOn($el, "select2");

                pattern.init($el);
                expect(
                    $el.select2.calls.mostRecent().args[0].ajax
                ).toBeDefined();
                utils.removeSelect2();
            });
        });

        describe("A <select> element", function() {
            beforeEach(function() {
                $("div#lab").remove(); // Looks likes some specs don't clean up after themselves.
                $("<div/>", { id: "lab" }).appendTo(document.body);
            });

            afterEach(function() {
                $("#lab").remove();
            });

            it("gets converted into a select2 widget", function() {
                utils.createSelectElement();
                var $el = $("select.pat-autosuggest");
                expect($(".select2-container").length).toBe(0);
                expect($el.hasClass("select2-offscreen")).toBeFalsy();
                pattern.init($el);
                expect($el.hasClass("select2-offscreen")).toBeTruthy();
                expect($(".select2-container").length).toBe(1);
                utils.removeSelect2();
            });
        });

        describe("Selected items", function() {
            beforeEach(function() {
                $("div#lab").remove(); // Looks likes some specs don't clean up after themselves.
                $("<div/>", { id: "lab" }).appendTo(document.body);
            });

            afterEach(function() {
                $("#lab").remove();
            });

            it("can be given custom CSS classes", function() {
                utils.createInputElement({
                    data:
                        'words: apple,orange,pear; pre-fill: orange; selection-classes: {"orange": ["fruit", "orange"]}'
                });
                var $el = $("input.pat-autosuggest");
                expect($(".select2-search-choice").length).toBe(0);
                pattern.init($el);
                expect($(".select2-search-choice").length).toBe(1);
                expect(
                    $(".select2-search-choice").hasClass("fruit")
                ).toBeTruthy();
                expect(
                    $(".select2-search-choice").hasClass("orange")
                ).toBeTruthy();
                utils.removeSelect2();
            });

            it("can be restricted to a certain amount", function() {
                // First check without limit
                utils.createInputElement({
                    data: "words: apple,orange,pear; pre-fill: orange"
                });
                expect($(".select2-input").length).toBe(0);
                pattern.init($("input.pat-autosuggest"));
                expect($(".select2-input").length).toBe(1);
                expect($(".select2-selection-limit").length).toBe(0);
                $(".select2-input")
                    .val("apple")
                    .click();
                expect($(".select2-selection-limit").length).toBe(0);
                utils.removeSelect2();

                // Then with limit
                utils.createInputElement({
                    data:
                        "maximum-selection-size: 1; words: apple,orange,pear; pre-fill: orange"
                });
                expect($(".select2-input").length).toBe(0);
                pattern.init($("input.pat-autosuggest"));
                expect($(".select2-input").length).toBe(1);
                expect($(".select2-selection-limit").length).toBe(0);
                $(".select2-input")
                    .val("apple")
                    .click();
                // Now we have a select style control. It has a close button
                expect($(".select2-search-choice-close").length).toBe(1);
                utils.removeSelect2();
            });
        });

        describe("Placeholder tests", function() {
            beforeEach(function() {
                $("div#lab").remove(); // Looks likes some specs don't clean up after themselves.
                $("<div/>", { id: "lab" }).appendTo(document.body);
            });

            afterEach(function() {
                $("#lab").remove();
            });

            it("A placeholder on the original element is reused on the auto-suggest element", function() {
                var placeholder = "Test placeholder";

                $("<input/>", {
                    id: "select2",
                    class: "pat-autosuggest",
                    placeholder: "Test placeholder"
                }).appendTo($("div#lab"));

                var $el = $("input.pat-autosuggest");

                expect($el.prop("placeholder")).toBe(placeholder);
                pattern.init($el);
                // XXX Placeholder is used as value of the input field.
                // Change this as soon Select2 changes this odd behavior.
                expect($(".select2-input").val()).toBe(placeholder);
                utils.removeSelect2();
            });

            it("No placeholder doesn't create an automatic one.", function() {
                $("<input/>", {
                    id: "select2",
                    class: "pat-autosuggest"
                }).appendTo($("div#lab"));

                var $el = $("input.pat-autosuggest");

                expect($el.prop("placeholder")).toBe("");
                pattern.init($el);
                // XXX Placeholder is used as value of the input field.
                // Change this as soon Select2 changes this odd behavior.
                expect($(".select2-input").val()).toBe("");
                utils.removeSelect2();
            });
        });
    });
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

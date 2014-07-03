define(["pat-autosuggest"], function(pattern) {

    var utils = {
        createElement: function(c) {
            var cfg = c || {};
            return $("<input/>", {
                "id":   cfg.id || "select2",
                "data-pat-autosuggest": "" || cfg.data,
                "class": "pat-autosuggest"
            }).appendTo($("div#lab"));
        },

        removeElement: function removeElement(c) {
            var cfg = c || {};
            $('#'+cfg.id||"select2").remove()
        },

        click: {
            type: "click",
            preventDefault: function () {}
        }
    };

    describe("pat-autosuggest", function() {

        describe("An ordinary <input> element", function () {
            beforeEach(function() {
                $("div#lab").remove(); // Looks likes some specs don't clean up after themselves.
                $("<div/>", {id: "lab"}).appendTo(document.body);
            });

            afterEach(function() {
                $("#lab").remove();
            });

            it("gets converted into a select2 widget", function() {
                utils.createElement();
                var $el = $("input.pat-autosuggest");

                expect($(".select2-container").length).toBe(0);
                expect($el.hasClass("select2-offscreen")).toBeFalsy();
                pattern.init($el);
                expect($el.hasClass("select2-offscreen")).toBeTruthy();
                expect($(".select2-container").length).toBe(1);
                utils.removeElement();
            });
        });

        describe("Selected items", function () {
            beforeEach(function() {
                $("div#lab").remove(); // Looks likes some specs don't clean up after themselves.
                $("<div/>", {id: "lab"}).appendTo(document.body);
            });

            afterEach(function() {
                $("#lab").remove();
            });

            it("can be given custom CSS classes", function() {
                utils.createElement({
                    data: 'words: apple,orange,pear; pre-fill: orange; selection-classes: {"orange": ["fruit", "orange"]}'
                });
                var $el = $("input.pat-autosuggest");
                expect($(".select2-search-choice").length).toBe(0);
                pattern.init($el);
                expect($(".select2-search-choice").length).toBe(1);
                expect($(".select2-search-choice").hasClass("fruit")).toBeTruthy();
                expect($(".select2-search-choice").hasClass("orange")).toBeTruthy();
                utils.removeElement();
            });
        });
    });

});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

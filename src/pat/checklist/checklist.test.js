import "./checklist";
import $ from "jquery";

describe("pat-checklist", function() {
    beforeEach(function() {
        $("<div/>", { id: "lab" }).appendTo(document.body);
    });
    afterEach(function() {
        $("#lab").remove();
    });

    var utils = {
        createCheckList: function() {
            $("#lab").html("<fieldset class='pat-checklist'>");
            var $fieldset = $("fieldset.pat-checklist");
            // The ordering of elements here is important (due to :nth-child selector criteria being used).
            $fieldset.append(
                $(
                    "<input type='checkbox' name='monkeys' checked='checked' />"
                )
            );
            $fieldset.append(
                $("<input type='checkbox' name='apes' checked='checked' />")
            );
            $fieldset.append(
                $(
                    "<input type='checkbox' name='humans' checked='checked' />"
                )
            );
            $fieldset.append(
                $("<button class='select-all'>Select all</button>")
            );
            $fieldset.append(
                $("<button class='deselect-all'>Deselect all</button>")
            );
            $("#lab fieldset.pat-checklist").patternChecklist();
        },
        fakeInjectCheckBox: function() {
            var $fieldset = $("fieldset.pat-checklist");
            $fieldset.append(
                $("<input type='checkbox' name='primates' />")
            );
            $fieldset.trigger("patterns-injected");
        },
        removeCheckList: function() {
            $("#lab")
                .children("fieldset.pat-checklist")
                .remove();
        },
        checkAllBoxes: function() {
            $("fieldset.pat-checklist input[type=checkbox]").each(
                function() {
                    $(this)
                        .prop("checked", true)
                        .trigger("change");
                }
            );
        },
        uncheckAllBoxes: function() {
            $("fieldset.pat-checklist input[type=checkbox]").each(
                function() {
                    $(this)
                        .prop("checked", false)
                        .trigger("change");
                }
            );
        },
        checkBox: function(idx) {
            $(
                "fieldset.pat-checklist input[type=checkbox]:nth-child(" +
                    (idx || 1) +
                    ")"
            )
                .prop("checked", true)
                .trigger("change");
        },
        uncheckBox: function(idx) {
            $(
                "fieldset.pat-checklist input[type=checkbox]:nth-child(" +
                    (idx || 1) +
                    ")"
            )
                .prop("checked", false)
                .trigger("change");
        }
    };

    describe("Initialization via jQuery", function() {
        it("can be configured by passing in arguments to the jQuery plugin method", function() {
            $("#lab").html("<div></div>");
            $("#lab div").patternChecklist({
                select: ".one",
                deselect: ".two"
            });
            var $trigger = $("#lab div");
            expect($trigger.data("patternChecklist")).toEqual({
                select: ".one",
                deselect: ".two"
            });
        });
        it("can be configured via DOM element data- attributes", function() {
            $("#lab").html("<div data-pat-checklist='.one .two'></div>");
            $("#lab div").patternChecklist();
            var $trigger = $("#lab div");
            expect($trigger.data("patternChecklist")).toEqual({
                select: ".one",
                deselect: ".two"
            });
        });
    });

    describe("Deselect All Button", function() {
        beforeEach(function() {
            utils.createCheckList();
        });
        afterEach(function() {
            utils.removeCheckList();
        });

        it("is disabled when all checkboxes are unchecked", function() {
            utils.uncheckAllBoxes();
            expect($(".deselect-all").prop("disabled")).toBe(true);
        });

        it("is enabled when all checkboxes are checked", function() {
            utils.checkAllBoxes();
            expect($(".deselect-all").prop("disabled")).toBe(false);
        });

        it("is enabled when at least one checkbox is checked", function() {
            utils.uncheckAllBoxes();
            expect($(".deselect-all").prop("disabled")).toBe(true);
            utils.checkBox();
            expect($(".deselect-all").prop("disabled")).toBe(false);
        });

        it("unchecks all checkboxes if it is clicked", function() {
            // Test with all boxes ticked
            utils.checkAllBoxes();
            expect(
                $("fieldset.pat-checklist input[type=checkbox]:checked")
                    .length
            ).toBe(3);
            $(".deselect-all").click();
            expect(
                $("fieldset.pat-checklist input[type=checkbox]:checked")
                    .length
            ).toBe(0);
            // Test with one box ticked
            utils.checkBox();
            expect(
                $("fieldset.pat-checklist input[type=checkbox]:checked")
                    .length
            ).toBe(1);
            $(".deselect-all").click();
            expect(
                $("fieldset.pat-checklist input[type=checkbox]:checked")
                    .length
            ).toBe(0);
        });

        it("becomes disabled when the last checked checkbox is unchecked", function() {
            utils.checkAllBoxes();
            expect($(".deselect-all").prop("disabled")).toBe(false);
            utils.uncheckBox();
            expect($(".deselect-all").prop("disabled")).toBe(false);
            utils.uncheckBox(2);
            expect($(".deselect-all").prop("disabled")).toBe(false);
            utils.uncheckBox(3);
            expect($(".deselect-all").prop("disabled")).toBe(true);
        });
    });

    describe("Select All Button", function() {
        beforeEach(function() {
            utils.createCheckList();
        });
        afterEach(function() {
            utils.removeCheckList();
        });

        it("is disabled when all boxes are checked", function() {
            utils.checkAllBoxes();
            expect($(".select-all").prop("disabled")).toBe(true);
        });

        it("is enabled when at least one box is unchecked", function() {
            utils.checkAllBoxes();
            expect($(".select-all").prop("disabled")).toBe(true);
            utils.uncheckBox();
            expect($(".select-all").prop("disabled")).toBe(false);
        });

        it("checks all boxes if it is clicked", function() {
            // Test with zero boxes ticked
            utils.uncheckAllBoxes();
            expect(
                $("fieldset.pat-checklist input[type=checkbox]:checked")
                    .length
            ).toBe(0);
            $(".select-all").click();
            expect(
                $("fieldset.pat-checklist input[type=checkbox]:checked")
                    .length
            ).toBe(3);
            // Test with one box ticked
            utils.uncheckAllBoxes();
            utils.checkBox();
            expect(
                $("fieldset.pat-checklist input[type=checkbox]:checked")
                    .length
            ).toBe(1);
            $(".select-all").click();
            expect(
                $("fieldset.pat-checklist input[type=checkbox]:checked")
                    .length
            ).toBe(3);
        });

        it("becomes enabled when the first checked box is unchecked", function() {
            utils.checkAllBoxes();
            expect($(".select-all").prop("disabled")).toBe(true);
            utils.uncheckBox();
            expect($(".select-all").prop("disabled")).toBe(false);
        });
        it("understands injection", function() {
            expect($(".select-all").prop("disabled")).toBe(true);
            utils.fakeInjectCheckBox();
            expect($(".select-all").prop("disabled")).toBe(false);
            $("[name=primates]")
                .prop("checked", true)
                .change();
            expect($(".select-all").prop("disabled")).toBe(true);
        });
    });

    describe("The function _findSiblings", function() {
        it("has a scope limited to the current form", function() {
            utils.createCheckList();
            // Duplicate the check list with all the items checked
            $("#lab").append(
                $("#lab")
                    .find(".pat-checklist")
                    .clone()
            );
            $(".pat-checklist")
                .last()
                .patternChecklist();
            expect(
                $(".pat-checklist")
                    .first()
                    .find(":checked").length
            ).toBe(3);
            expect(
                $(".pat-checklist")
                    .last()
                    .find(":checked").length
            ).toBe(3);

            // Click the last form deselect all button
            $(".pat-checklist")
                .last()
                .find(".deselect-all")
                .click();
            expect(
                $(".pat-checklist")
                    .first()
                    .find(":checked").length
            ).toBe(3);
            expect(
                $(".pat-checklist")
                    .last()
                    .find(":checked").length
            ).toBe(0);
            // Clicking again does not touch the selected checkboxes in the other fieldset
            $(".pat-checklist")
                .last()
                .find(".deselect-all")
                .click();
            expect(
                $(".pat-checklist")
                    .first()
                    .find(":checked").length
            ).toBe(3);
            expect(
                $(".pat-checklist")
                    .last()
                    .find(":checked").length
            ).toBe(0);
        });
    });
});

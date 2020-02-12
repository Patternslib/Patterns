import $ from "jquery";
import DependsHandler from "./dependshandler";


describe("pat-dependshandler", function() {

    beforeEach(function() {
        $("<div/>", {id: "lab"}).appendTo(document.body);
    });

    afterEach(function() {
        $("#lab").remove();
    });

    describe("_findInputs", function() {
        it("Reference to unknown input", function() {
            var handler = new DependsHandler($("#lab"), "foo");
            expect(handler._findInputs("foo").length).toBe(0);
        });

        it("Reference to input name", function() {
            var $lab = $("#lab"),
                handler = new DependsHandler($("#lab"), "foo");
            $lab.append("<input type=\"text\" name=\"foo\"/>");
            expect(handler._findInputs("foo").length).toBe(1);
        });

        it("Reference to input id", function() {
            var $lab = $("#lab"),
                handler = new DependsHandler($("#lab"), "foo");
            $lab.append("<input type=\"text\" id=\"bar\" name=\"foo\"/>");
            expect(handler._findInputs("bar").length).toBe(1);
        });

        it("Restrict searches to current form", function() {
            $("#lab").html([
                "<input type=\"text\" name=\"foo\"/>",
                "<form>",
                "  <div id=\"context\"/>",
                "  <input type=\"radio\" name=\"foo\" value=\"1\"/>",
                "</form>"
                ].join("\n"));
            var handler = new DependsHandler($("#context"), "foo"),
                $inputs = handler._findInputs("foo");
            expect($inputs.length).toBe(1);
            expect($inputs[0].type).toBe("radio");
        });
    });

    describe("_getValue", function() {
        it("Unchecked checkbox", function() {
            $("#lab").append("<input type=\"checkbox\" name=\"foo\" value=\"bar\"/>");
            var handler = new DependsHandler($("#lab"), "foo");
            expect(handler._getValue("foo")).toBeNull();
        });

        it("Checked checkbox", function() {
            $("#lab").append("<input type=\"checkbox\" name=\"foo\" value=\"bar\" checked=\"checked\"/>");
            var handler = new DependsHandler($("#lab"), "foo");
            expect(handler._getValue("foo")).toBe("bar");
        });

        it("Unchecked radio button", function() {
            $("#lab").append("<input type=\"radio\" name=\"foo\" value=\"bar\"/>");
            var handler = new DependsHandler($("#lab"), "foo");
            expect(handler._getValue("foo")).toBeNull();
        });

        it("Unchecked radio button", function() {
            $("#lab").append("<input type=\"radio\" name=\"foo\" value=\"bar\"/>");
            var handler = new DependsHandler($("#lab"), "foo");
            expect(handler._getValue("foo")).toBeNull();
        });

        it("Checked radio button", function() {
            $("#lab").append("<input type=\"radio\" name=\"foo\" value=\"bar\" checked=\"checked\"/>");
            var handler = new DependsHandler($("#lab"), "foo");
            expect(handler._getValue("foo")).toBe("bar");
        });
    });

    describe("getAllInputs", function() {
        it("Simple expression", function() {
            $("#lab").append("<input type=\"radio\" name=\"foo\" value=\"bar\"/>");
            var handler = new DependsHandler($("#lab"), "foo"),
                inputs = handler.getAllInputs();
            expect(inputs.length).toBe(1);
            expect(inputs[0].type).toBe("radio");
        });

        it("Nested expression", function() {
            $("#lab").html([
                "<input type=\"text\" name=\"foo\"/>",
                "<input type=\"text\" name=\"buz\"/>"
                ].join("\n"));
            var handler = new DependsHandler($("#lab"), "foo or (foo and buz)"),
                inputs = handler.getAllInputs();
            expect(inputs.length).toBe(2);
            expect(inputs[0].name).toBe("foo");
            expect(inputs[1].name).toBe("buz");
        });
    });

    describe("evaluate", function() {
        describe("truthy", function() {
            it("Text input with value", function() {
                $("#lab").append("<input type=\"text\" name=\"foo\" value=\"xxx\"/>");
                var handler = new DependsHandler($("#lab"), "foo");
                expect(handler.evaluate()).toBe(true);
            });

            it("Text input without value", function() {
                $("#lab").append("<input type=\"text\" name=\"foo\"/>");
                var handler = new DependsHandler($("#lab"), "foo");
                expect(handler.evaluate()).toBe(false);
            });
        });

        describe("Comparison", function() {
            it("Positive number input below value", function() {
                $("#lab").append("<input type=\"number\" name=\"foo\" value=\"10\"/>");
                var handler = new DependsHandler($("#lab"), "foo<15");
                expect(handler.evaluate()).toBe(true);
            });

            it("Negative number input below value", function() {
                $("#lab").append("<input type=\"number\" name=\"foo\" value=\"20\"/>");
                var handler = new DependsHandler($("#lab"), "foo<15");
                expect(handler.evaluate()).toBe(false);
            });

            it("Positive equal to value", function() {
                $("#lab").append("<input type=\"text\" name=\"foo\" value=\"bar\"/>");
                var handler = new DependsHandler($("#lab"), "foo=bar");
                expect(handler.evaluate()).toBe(true);
            });

            it("Negative equal to value", function() {
                $("#lab").append("<input type=\"text\" name=\"foo\" value=\"buz\"/>");
                var handler = new DependsHandler($("#lab"), "foo=bar");
                expect(handler.evaluate()).toBe(false);
            });
        });

        describe("Negate test", function() {
            it("Text input with value", function() {
                $("#lab").append("<input type=\"text\" name=\"foo\" value=\"xxx\"/>");
                var handler = new DependsHandler($("#lab"), "not foo");
                expect(handler.evaluate()).toBe(false);
            });

            it("Text input without value", function() {
                $("#lab").append("<input type=\"text\" name=\"foo\" value=\"\"/>");
                var handler = new DependsHandler($("#lab"), "not foo");
                expect(handler.evaluate()).toBe(true);
            });
        });

        describe("AND multiple expressions", function() {
            it("All options true", function() {
                $("#lab").html([
                    "<input type=\"text\" name=\"one\" value=\"1\"/>",
                    "<input type=\"text\" name=\"two\" value=\"2\"/>"
                    ].join("\n"));
                var handler = new DependsHandler($("#lab"), "one and two");
                expect(handler.evaluate()).toBe(true);
            });

            it("Not all options true", function() {
                $("#lab").html([
                    "<input type=\"text\" name=\"one\" value=\"1\"/>",
                    "<input type=\"text\" name=\"two\" value=\"\"/>"
                    ].join("\n"));
                var handler = new DependsHandler($("#lab"), "one and two");
                expect(handler.evaluate()).toBe(false);
            });
        });

        describe("OR multiple expressions", function() {
            it("No options true", function() {
                $("#lab").html([
                    "<input type=\"text\" name=\"one\" value=\"\"/>",
                    "<input type=\"text\" name=\"two\" value=\"\"/>"
                    ].join("\n"));
                var handler = new DependsHandler($("#lab"), "one or two");
                expect(handler.evaluate()).toBe(false);
            });

            it("One option true", function() {
                $("#lab").html([
                    "<input type=\"text\" name=\"one\" value=\"1\"/>",
                    "<input type=\"text\" name=\"two\" value=\"\"/>"
                    ].join("\n"));
                var handler = new DependsHandler($("#lab"), "one or two");
                expect(handler.evaluate()).toBe(true);
            });
        });
    });
});

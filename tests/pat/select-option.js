define(["pat/select-option"], function(pattern) {

    describe("Select-option pattern", function() {

        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        describe("init", function() {
            it("Trigger onChange on initial load", function() {
                $("#lab").html("<label><select><option selected=\"selected\">Foo</option></select></label>");
                spyOn(pattern, "_onChange");
                pattern.init($("#lab select"));
                expect(pattern._onChange).toHaveBeenCalled();
            });

        });

        describe("_onChange", function() {
            it("Select without label", function() {
                // Just in case the label was removed later
                $("#lab").html("<select><option selected=\"selected\">Foo</option></select>");
                var select = $("#lab select")[0];
                pattern._onChange.apply(document.getElementById("select"), []);
            });

            it("Select with label", function() {
                $("#lab").html("<label><select><option selected=\"selected\" value=\"value\">Foo</option></select>");
                var select = $("#lab select")[0];
                pattern._onChange.apply(select, []);
                expect($("#lab label").attr("data-option")).toBe("Foo");
            });
        });
    });
});

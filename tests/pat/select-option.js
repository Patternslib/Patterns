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
                spyOn(pattern, "onChange");
                pattern.init($("#lab select"));
                expect(pattern.onChange).toHaveBeenCalled();
            });

            it("Adds span if label is absent", function() {
                $("#lab").html(
                    "<select><option selected=\"selected\">Foo</option></select>");
                var $select = $("#lab select");
                pattern.init($select, []);
                expect($select.parent()[0].tagName).toBe('SPAN');
                expect($select.parent().attr('data-option')).toBe('Foo');
            });
        });

        describe("onChange", function() {
            it("Select with label", function() {
                $("#lab").html(
                    '<label>' +
                    '<select>' +
                    '<option selected="selected" value="value">Foo</option>' +
                    '</select>' +
                    '</label>');
                var select = $("#lab select")[0];
                pattern.onChange.apply(select, []);
                expect($("#lab label").attr("data-option")).toBe("Foo");
            });
        });
    });
});

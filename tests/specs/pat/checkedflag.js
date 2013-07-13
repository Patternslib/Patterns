define(["pat/checkedflag"], function(pattern) {

    describe("checkedflag-pattern", function() {

        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        describe("init", function() {
            it("Set initial state for radio button", function() {
                $("#lab").html([
                    "<fieldset>",
                    "  <label><input type=\"radio\" name=\"foo\"/></label>",
                    "</fieldset>"].join("\n"));
                spyOn(pattern, "onChangeCheckbox");
                spyOn(pattern, "onChangeRadio");
                pattern.init($("#lab input"));
                expect(pattern.onChangeCheckbox).not.toHaveBeenCalled();
                expect(pattern.onChangeRadio).toHaveBeenCalled();

            });

            it("Set initial state for checkbox", function() {
                $("#lab").html([
                    "<fieldset>",
                    "  <label><input type=\"checkbox\" name=\"foo\"/></label>",
                    "</fieldset>"].join("\n"));
                spyOn(pattern, "onChangeCheckbox");
                spyOn(pattern, "onChangeRadio");
                pattern.init($("#lab input"));
                expect(pattern.onChangeCheckbox).toHaveBeenCalled();
                expect(pattern.onChangeRadio).not.toHaveBeenCalled();
            });

        });

        describe("init select", function() {
            it("Trigger onChange on initial load", function() {
                $("#lab").html("<label><select><option selected=\"selected\">Foo</option></select></label>");
                spyOn(pattern, "onChangeSelect");
                pattern.init($("#lab select"));
                expect(pattern.onChangeSelect).toHaveBeenCalled();
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

        describe("onChangeCheckbox", function() {
            it("Change to checked state", function() {
                $("#lab").html([
                    "<fieldset class=\"unchecked\">",
                    "  <label class=\"unchecked\"><input type=\"checkbox\" name=\"foo\" checked=\"checked\"/></label>",
                    "</fieldset>"].join("\n"));
                var input = $("#lab input")[0];
                pattern.onChangeCheckbox.apply(input, []);
                expect($("#lab label").hasClass("checked")).toBe(true);
                expect($("#lab fieldset").hasClass("checked")).toBe(true);
                expect($("#lab .unchecked").length).toBe(0);
            });

            it("Change to unchecked state", function() {
                $("#lab").html([
                    "<fieldset class=\"checked\">",
                    "  <label class=\"checked\"><input type=\"checkbox\" name=\"foo\"/></label>",
                    "</fieldset>"].join("\n"));
                var input = $("#lab input")[0];
                pattern.onChangeCheckbox.apply(input, []);
                expect($("#lab label").hasClass("unchecked")).toBe(true);
                expect($("#lab fieldset").hasClass("unchecked")).toBe(true);
                expect($("#lab .checked").length).toBe(0);
            });

            it("Fieldset with both checked and unchecked items", function() {
                $("#lab").html([
                    "<fieldset>",
                    "  <label><input type=\"checkbox\" name=\"foo\"/></label>",
                    "  <label><input type=\"checkbox\" name=\"bar\" checked=\"checked\"/></label>",
                    "</fieldset>"].join("\n"));
                var input = $("#lab input:checked")[0];
                pattern.onChangeCheckbox.apply(input, []);
                expect($("#lab fieldset").attr("class")).toBe("checked");
                expect($("#lab label").eq(1).attr("class")).toBe("checked");
            });
        });

        describe("onChangeRadio", function() {
            it("Change to checked state", function() {
                $("#lab").html([
                    "<fieldset class=\"unchecked\">",
                    "  <label class=\"unchecked\"><input type=\"radio\" name=\"foo\" checked=\"checked\"/></label>",
                    "</fieldset>"].join("\n"));
                var input = $("#lab input")[0];
                pattern.onChangeCheckbox.apply(input, []);
                expect($("#lab label").hasClass("checked")).toBe(true);
                expect($("#lab fieldset").hasClass("checked")).toBe(true);
                expect($("#lab .unchecked").length).toBe(0);
            });

            it("Change to unchecked state", function() {
                $("#lab").html([
                    "<fieldset class=\"checked\">",
                    "  <label class=\"checked\"><input type=\"radio\" name=\"foo\"/></label>",
                    "</fieldset>"].join("\n"));
                var input = $("#lab input")[0];
                pattern.onChangeCheckbox.apply(input, []);
                expect($("#lab label").hasClass("unchecked")).toBe(true);
                expect($("#lab fieldset").hasClass("unchecked")).toBe(true);
                expect($("#lab .checked").length).toBe(0);
            });

            it("Fieldset with both checked and unchecked items", function() {
                $("#lab").html([
                    "<fieldset>",
                    "  <label><input type=\"radio\" name=\"foo\"/></label>",
                    "  <label><input type=\"radio\" name=\"bar\" checked=\"checked\"/></label>",
                    "</fieldset>"].join("\n"));
                var input = $("#lab input:checked")[0];
                pattern.onChangeCheckbox.apply(input, []);
                expect($("#lab fieldset").attr("class")).toBe("checked");
                expect($("#lab label").eq(1).attr("class")).toBe("checked");
            });
        });

        describe("onChange select", function() {
            it("Select with label", function() {
                $("#lab").html(
                    '<label>' +
                        '<select>' +
                        '<option selected="selected" value="value">Foo</option>' +
                        '</select>' +
                        '</label>');
                var select = $("#lab select")[0];
                pattern.onChangeSelect.apply(select, []);
                expect($("#lab label").attr("data-option")).toBe("Foo");
            });
        });

        it("Handle form reset", function() {
            $("#lab").html([
                '<form>',
                '  <fieldset class="checked">',
                '    <label class="checked">',
                '      <input type="radio" id="foo" checked="checked"/>',
                '    </label>',
                '    <label class="unchecked">',
                '      <input type="radio" id="bar"/>',
                '    </label>',
                '    <label data-option="two">',
                '      <select>',
                '        <option selected="selected" value="1">one<option>',
                '        <option value="2">two<option>',
                '      </select>',
                '    </label>',
                '  </fieldset>',
                '</form>'].join("\n"));
            var $input = $("#lab input");
            pattern.init($input);
            $("#foo").prop("checked", false).change();
            $("#bar").prop("checked", "checked").change();
            jasmine.Clock.useMock();
            $input[0].form.reset();
            jasmine.Clock.tick(100);
            expect($("label:has(#foo)").hasClass("checked")).toBe(true);
            expect($("label:has(#bar)").hasClass("unchecked")).toBe(true);
            expect($("#lab fieldset").hasClass("checked")).toBe(true);
            expect($("label:has(select)").attr('data-option')).toBe("one");
        });

        describe("setting value", function() {
            it("handles checkboxes", function() {
                $("#lab").html([
                    '<form>',
                    '  <fieldset class="checked">',
                    '    <label class="checked">',
                    '      <input type="checkbox" id="foo" checked="checked"/>',
                    '    </label>',
                    '  </fieldset>',
                    '</form>'
                ].join("\n"));

                $('input').patCheckedflag('set', false);
                expect($("label").hasClass("checked")).toBe(false);
                expect($("fieldset").hasClass("checked")).toBe(false);
                expect($("label").hasClass("unchecked")).toBe(true);
                expect($("fieldset").hasClass("unchecked")).toBe(true);
                expect($("input").prop("checked")).toBe(false);

                $('input').patCheckedflag('set', true);
                expect($("label").hasClass("checked")).toBe(true);
                expect($("fieldset").hasClass("checked")).toBe(true);
                expect($("label").hasClass("unchecked")).toBe(false);
                expect($("fieldset").hasClass("unchecked")).toBe(false);
                expect($("input").prop("checked")).toBe(true);

            });
            it("handles selects", function() {
                $("#lab").html([
                    '<form>',
                    '  <label>',
                    '    <select>',
                    '      <option value="1">one<option>',
                    '      <option value="2">two<option>',
                    '    </select>',
                    '  </label>',
                    '</form>'
                ].join("\n"));

                var $label = $('label'),
                    $select = $('select'),
                    $option1 = $('option[value="1"]'),
                    $option2 = $('option[value="2"]');

                $select.patCheckedflag('set', 1);
                expect($option1.prop('selected')).toBe(true);
                expect($option2.prop('selected')).toBe(false);
                expect($label.attr("data-option")).toBe("one");

                $select.patCheckedflag('set', 2);
                expect($option1.prop('selected')).toBe(false);
                expect($option2.prop('selected')).toBe(true);
                expect($label.attr("data-option")).toBe("two");

                $select.patCheckedflag('set', "1");
                expect($option1.prop('selected')).toBe(true);
                expect($option2.prop('selected')).toBe(false);
                expect($label.attr("data-option")).toBe("one");

                $select.patCheckedflag('set', "2");
                expect($option1.prop('selected')).toBe(false);
                expect($option2.prop('selected')).toBe(true);
                expect($label.attr("data-option")).toBe("two");
            });
       });
    });

});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

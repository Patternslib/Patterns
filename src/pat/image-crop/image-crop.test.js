import pattern from "./image-crop";
import $ from "jquery";

describe("pat-image-crop", function() {
    beforeEach(function() {
        $("<div/>", { id: "lab" }).appendTo(document.body);
    });

    afterEach(function() {
        $("#lab").remove();
    });

    describe("setup", function() {
        it("Option parsing", function() {
            var opts = pattern._parseOpt(" 20  300     10  15 ");

            expect(opts.length).toBe(4);
            expect(opts).toEqual([20, 300, 10, 15]);
        });

        it("Input setup - input already exists", function() {
            $("#lab").html('<form><input type="text" name="x1" /></form>');

            var form = $("#lab form");
            pattern._setupInput(form, "", "x1");

            var input = form.find("input");
            expect(input.length).toBe(1);
        });

        it("Input setup - input doesn't exist", function() {
            $("#lab").html('<form><input type="text" name="x1" /></form>');

            var form = $("#lab form");
            pattern._setupInput(form, "p_", "x1");

            var input = form.find('input[name="p_x1"]');
            expect(input.length).toBe(1);
        });
    });

    describe("Position Update", function() {
        var data = {
            preview: {
                width: 50,
                height: 50
            },
            inputs: {},
            api: {
                getBounds: function() {
                    return [500, 600];
                }
            }
        };

        var c = {
            w: 200,
            h: 300,
            x: 100,
            y: 300,
            x2: 300,
            y2: 600
        };

        beforeEach(function() {
            data.preview.element = $("<div>");
            data.inputs.x1 = $('<input type="hidden" name="p_x1" />');
            data.inputs.x2 = $('<input type="hidden" name="p_x2" />');
            data.inputs.y1 = $('<input type="hidden" name="p_y1" />');
            data.inputs.y2 = $('<input type="hidden" name="p_y2" />');
            data.inputs.w = $('<input type="hidden" name="p_w" />');
            data.inputs.h = $('<input type="hidden" name="p_h" />');
        });

        it("Update preview", function() {
            pattern.updatePreview(c, data);

            expect(data.preview.element.width()).toBe(125);
            expect(data.preview.element.height()).toBe(100);
            expect(data.preview.element.css("marginLeft")).toBe("-25px");
            expect(data.preview.element.css("marginTop")).toBe("-50px");
        });

        it("Update inputs", function() {
            pattern.updateInputs(c, data);

            expect(data.inputs.x1.val()).toBe("100");
            expect(data.inputs.x2.val()).toBe("300");
            expect(data.inputs.y1.val()).toBe("300");
            expect(data.inputs.y2.val()).toBe("600");
            expect(data.inputs.w.val()).toBe("200");
            expect(data.inputs.h.val()).toBe("300");
        });

        it("Update from user interaction", function() {
            var spy_updatePreview = spyOn(pattern, "updatePreview");
            var spy_updateInputs = spyOn(pattern, "updateInputs");

            pattern.onSelect(c, data);

            expect(spy_updatePreview).toHaveBeenCalledWith(c, data);
            expect(spy_updateInputs).toHaveBeenCalledWith(c, data);
        });
    });
});

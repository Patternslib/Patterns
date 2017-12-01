define(["pat-slideshow-builder"], function(pattern) {

    describe("Slideshow builder pattern", function() {

        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        describe("init", function() {
            it("Return jQuery wrapper", function() {
                var jq = jasmine.createSpyObj("jQuery", ["each"]);
                jq.each.and.returnValue(jq);
                expect(pattern.init(jq)).toBe(jq);
            });

            it("Invoke AJAX for all slideshow", function() {
                var spy_ajax = spyOn($, "ajax");
                var form = document.createElement("form");
                form.action="slideshow.html";
                pattern.init($(form));
                expect(spy_ajax).toHaveBeenCalled();
                var options = $.ajax.calls.argsFor(0)[0];
                expect(options.url.endsWith("slideshow.html")).toBeTruthy();
                expect(options.context).toBe(form);
            });

            it("Trigger inside form", function() {
                var spy_ajax = spyOn($, "ajax");
                var form = document.createElement("form");
                form.action="slideshow.html";
                var container = document.createElement("div");
                form.appendChild(container);
                pattern.init($(container));
                expect(spy_ajax).toHaveBeenCalled();
                var options = $.ajax.calls.argsFor(0)[0];
                expect(options.url.endsWith("slideshow.html")).toBeTruthy();
                expect(options.context).toBe(container);
            });

            it("Trigger not in a form", function() {
                var spy_ajax = spyOn($, "ajax");
                var container = document.createElement("div");
                pattern.init($(container));
                expect(spy_ajax).not.toHaveBeenCalled();
            });
        });

        describe("onLoad", function() {
            var form;

            beforeEach(function() {
                $("<form id=\"buildform\"><button/></form>").appendTo("#lab");
                form=document.getElementById("buildform");
            });

            it("No slides present", function() {
                pattern.onLoad("<html><body></body></html>");
                expect($("#lab fieldset").length).toBe(0);
            });

            it("Skip slides without id", function() {
                pattern.onLoad("<html><body><div class=\"slide\"><header><h2>Title</h2></header></div></body></html>");
                expect($("#lab fieldset").length).toBe(0);
            });

            it("Skip slides without header", function() {
                pattern.onLoad("<html><body><div class=\"slide\" id=\"slide1\"></div></body></html>");
                expect($("#lab fieldset").length).toBe(0);
            });

            it("Add found slides", function() {
                pattern.onLoad.apply(form, ["<html><body><div class=\"slide\" id=\"slide1\"><header><h2>Title</h2></header></div></body></html>"]);
                expect($("#lab fieldset").length).toBe(1);
                var $labels = $("#lab fieldset label");
                expect($labels.length).toBe(1);
                for (var i=0; i<$labels.length; i++) {
                    expect($labels.eq(i).text()).toEqual("Title");
                    expect($labels[0].firstChild.name).toBe("slides");
                    expect($labels[0].firstChild.value).toBe("slide1");
                    expect($labels[0].firstChild.checked).toBe(false);
                }
            });

            it("Preserve slide order", function() {
                var i, html = "<html><body>";
                for (i=0; i<5; i++)
                    html+="<div class=\"slide\" id=\"slide"+(i+1)+"\"><header><h2>Title</h2></header></div>";
                html+="</div></body></html>";
                pattern.onLoad.apply(form, [html]);
                var found_order = $.makeArray($("#lab input").map(function(idx, el) { return el.value; }));
                expect(found_order).toEqual(["slide1", "slide2", "slide3", "slide4", "slide5"]);
            });
        });
    });
});

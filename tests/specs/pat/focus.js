define(["pat-focus"], function(pattern) {

    describe("pat-focus", function() {

        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        describe("_findRelatives", function() {
            it("Element without relations", function() {
                $("#lab").append("<input type='text' name='title'/>");
                var $input = $("#lab input"),
                    $relatives = pattern._findRelatives($input[0]);
                expect($relatives.length).toBe(1);
                expect($relatives[0].tagName).toBe("INPUT");
            });

            it("Element with parent label", function() {
                $("#lab").append("<label><input type='text' name='title'/></label>");
                var $input = $("#lab input"),
                    $relatives;
                $relatives=pattern._findRelatives($input[0]);
                expect($relatives.length).toBe(2);
                expect($relatives.filter("input").length).toBe(1);
                expect($relatives.filter("label").length).toBe(1);
            });

            it("Element with parent fieldset", function() {
                $("#lab").append("<fieldset><input type='text' name='title'/></fieldset>");
                var $input = $("#lab input"),
                    $relatives;
                $relatives=pattern._findRelatives($input[0]);
                expect($relatives.length).toBe(2);
                expect($relatives.filter("input").length).toBe(1);
                expect($relatives.filter("fieldset").length).toBe(1);
            });

            it("Element with non-parent label referenced by id", function() {
                $("#lab").append("<label for='title'>Title</label><input id='title' title='text' name='ttl'/>");
                var $input = $("#lab input"),
                    $relatives;
                $relatives=pattern._findRelatives($input[0]);
                expect($relatives.length).toBe(2);
                expect($relatives.filter("input").length).toBe(1);
                expect($relatives.filter("label").length).toBe(1);
            });

            it("Element with non-parent label references by name", function() {
                $("#lab").append("<label for='title'>Title</label><input title='text' name='title'/>");
                var $input = $("#lab input"),
                    $relatives;
                $relatives=pattern._findRelatives($input[0]);
                expect($relatives.length).toBe(2);
                expect($relatives.filter("input").length).toBe(1);
                expect($relatives.filter("label").length).toBe(1);
            });

            it("Ignore label outside of form", function() {
                $("#lab").append("<label for='title'>Title</label><form><input title='text' name='title'/></form>");
                var $input = $("#lab input"),
                    $relatives;
                $relatives=pattern._findRelatives($input[0]);
                expect($relatives.length).toBe(1);
                expect($relatives.filter("input").length).toBe(1);
            });
        });
    });

});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

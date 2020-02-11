define(["pat-legend"], function(transforms) {

    describe("legend transform", function() {

        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        describe("transform", function() {
            it("Convert legend to p.legend", function() {
                var $lab = $("#lab");
                $lab.append("<fieldset><legend>Fieldset title</legend></fieldset>");
                transforms.transform($lab);
                expect($lab.html()).toBe("<fieldset><p class=\"legend\">Fieldset title</p></fieldset>");
            });
        });
    });

});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

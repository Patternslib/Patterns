define(["pat/slides"], function(pattern) {

    describe("Slides pattern", function() {

        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        describe("init", function() {
            it("Return jQuery object", function() {
                var jq = jasmine.createSpyObj("jQuery", ["each"]);
                jq.each.andReturn(jq);
                expect(pattern.init(jq)).toBe(jq);
            });
        });
    });

});

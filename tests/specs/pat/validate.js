define(["pat-validate"], function(pattern) {
    describe("Validate pattern", function() {
        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        describe("init", function() {
            it("Return jQuery wrapper", function() {
                var jq = jasmine.createSpyObj("jQuery", ["each"]);
                jq.each.andReturn(jq);
                expect(pattern.init(jq)).toBe(jq);
            });
        });
    });
});

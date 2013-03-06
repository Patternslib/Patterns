define(["pat/slides"], function(pattern) {

    describe("Slides pattern", function() {

        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        describe("init", function() {
            it("Return result from _hook", function() {
                spyOn(pattern, "_hook").andCallFake(function() {
                    return "jq";
                });
                expect(pattern.init("jq")).toBe("jq");
                expect(pattern._hook).toHaveBeenCalledWith("jq");
            });
        });

        describe("_hook", function() {
            it("Return jQuery object", function() {
                var jq = jasmine.createSpyObj("jQuery", ["off", "on"]);
                jq.off.andReturn(jq);
                jq.on.andReturn(jq);
                expect(pattern._hook(jq)).toBe(jq);
            });
        });
    });

});

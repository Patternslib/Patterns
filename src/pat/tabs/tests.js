define(["pat-tabs"], function(Pattern) {

    describe("pat-tabs", function() {

        describe("TODO once this test is written", function() {
            beforeEach(function() {
                $("<div/>", {id: "lab"}).appendTo(document.body);
            });
            afterEach(function() {
                $("#lab").remove();
            });

            it("will test something", function() {
                Pattern.init($(".pat-tabs"));
            });
        });
    });
});

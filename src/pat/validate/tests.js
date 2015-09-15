define(["pat-registry", "pat-validate"], function(registry, pattern) {

    describe("pat-validate", function() {
        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        describe("init", function() {

            it("enables parsley on the pattern element", function() {
                var $el = $("<form class=\"pat-validate\"></form>");
                expect($el.parsley).toBeDefined();
                pattern.init($el);
                expect($el.parsley).toBeDefined();
            });
        });
    });
});

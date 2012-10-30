describe("depends-pattern", function() {
    var pattern;

    requireDependencies(["patterns/depends"], function(cls) {
        pattern = cls;
    });

    // Reset the lab before each test
    beforeEach(function() {
        $("#lab *").remove();
    });

    describe("init", function() {
        it("Hide if condition is not met initially", function() {
            $("#lab").html([
                '<input type="checkbox" id="control" value="yes"/>',
                '<div id="slave" class="pat-depends"/>'
                ].join("\n"));
            var $slave = $("#slave");
            pattern.init($slave, {condition: "control"});
            expect($slave.css("display")).toBe("none");
        });

        it("Show if condition is not met initially", function() {
            $("#lab").html([
                '<input type="checkbox" id="control" value="yes" checked="checked"/>',
                '<div id="slave" class="pat-depends" style="display: none"/>'
                ].join("\n"));
            var $slave = $("#slave");
            pattern.init($slave, {condition: "control"});
            expect($slave.css("display")).not.toBe("none");
        });
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

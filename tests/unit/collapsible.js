describe("collapsible-pattern", function() {
    var pattern;

    requireDependencies(["patterns/collapsible"], function(cls) {
        pattern = cls;
    });

    // Reset the lab before each test
    beforeEach(function() {
        $("#lab *").remove();
    });

    function addContent() {
            
    }

    describe("init", function() {
        it("Create panel-content", function() {
            var $lab = $("#lab")
            $lab.html([
                '<div class="collapsible">',
                '<h3>Trigger header</h3>',
                '<p>Collapsible content</p>',
                '</div>'
                ].join('\n'));
            var $collapsible = $("#lab .collapsible");
            pattern.init($collapsible);
            expect($collapsible.find(".panel-content").length).toBe(1);
        });

        it("Panels are open by default", function() {
            var $lab = $("#lab")
            $lab.html([
                '<div class="collapsible">',
                '<h3>Trigger header</h3>',
                '<p>Collapsible content</p>',
                '</div>'
                ].join('\n'));
            var $collapsible = $("#lab .collapsible");
            pattern.init($collapsible);
            expect($collapsible.hasClass("open")).toBeTruthy();
        });

        it("Explicitly closed panel is not open", function() {
            var $lab = $("#lab")
            $lab.html([
                '<div class="collapsible closed">',
                '<h3>Trigger header</h3>',
                '<p>Collapsible content</p>',
                '</div>'
                ].join('\n'));
            var $collapsible = $("#lab .collapsible");
            pattern.init($collapsible);
            expect($collapsible.hasClass("open")).toBeFalsy();
        });
    });

    describe("toggle", function() {
        it("Toggle an open panel", function() {
            var $lab = $("#lab")
            $lab.html([
                '<div class="collapsible">',
                '<h3>Trigger header</h3>',
                '<p>Collapsible content</p>',
                '</div>'
                ].join('\n'));
            var $collapsible = $("#lab .collapsible");
            pattern.init($collapsible);
            pattern.toggle($collapsible);
            expect($collapsible.hasClass("open")).toBeFalsy();
        });

        it("Toggle a closed panel", function() {
            var $lab = $("#lab")
            $lab.html([
                '<div class="collapsible closed">',
                '<h3>Trigger header</h3>',
                '<p>Collapsible content</p>',
                '</div>'
                ].join('\n'));
            var $collapsible = $("#lab .collapsible");
            pattern.init($collapsible);
            pattern.toggle($collapsible);
            expect($collapsible.hasClass("open")).toBeTruthy();
        });
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

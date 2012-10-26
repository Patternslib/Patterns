describe("modal-pattern", function() {
    var pattern;

    requireDependencies(["patterns/modal"], function(cls) {
        pattern = cls;
    });

    // Reset the lab before each test
    beforeEach(function() {
        $("#lab *").remove();
    });

    describe("init", function() {
        it("Modal with single element", function() {
            $("#lab").html([
                '<div class="pat-modal" id="modal">',
                '  <p>Modal content</p>',
                '</div>'
                ].join('\n'));
            var $modal = $("#modal");
            pattern.init($modal);
            expect($modal.find(".header").length).toBeTruthy();
            expect($modal.find(".header").text()).toBe("Close");
            expect($modal.find(".header .close-panel").length).toBeTruthy();
            expect($modal.find(".panel-content").length).toBeTruthy();
            expect($modal.find(".panel-content").text()).toBe("Modal content");
        });

        it("Modal with header ", function() {
            $("#lab").html([
                '<div class="pat-modal" id="modal">',
                '  <h3>Modal header</h3>',
                '  <p>Modal content</p>',
                '</div>'
                ].join('\n'));
            var $modal = $("#modal");
            pattern.init($modal);
            expect($modal.find(".header").text()).toBe("Modal headerClose");
            expect($modal.find(".header .close-panel").length).toBeTruthy();
            expect($modal.find(".panel-content").text()).toBe("Modal content");
        });

        it("Modal with multiple content items ", function() {
            $("#lab").html([
                '<div class="pat-modal" id="modal">',
                '  <h3>Modal header</h3>',
                '  <p>Modal content</p>',
                '  <h4>Subheader</h4>',
                '  <p>More content</p>',
                '</div>'
                ].join('\n'));
            var $modal = $("#modal");
            pattern.init($modal);
            expect($modal.find(".header").text()).toBe("Modal headerClose");
            expect($modal.find(".header .close-panel").length).toBeTruthy();
            expect($modal.find(".panel-content p").length).toBe(2);
            expect($modal.find(".panel-content h4").length).toBe(1);
        });

    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

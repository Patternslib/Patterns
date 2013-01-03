describe("transforms", function() {
    var mapal;

    requireDependencies(["transforms"], function(cls) {
        mapal = cls;
    });

    // Reset the lab before each test
    beforeEach(function() {
        $("#lab *").remove();
    });

    describe("_convertToIframes", function() {
        it("Keep non-html objects", function() {
            var $lab = $("#lab");
            $lab.append('<object type="text/plain">Plain content</object>');
            mapal._convertToIframes($lab);
            expect($lab.find("object").length).toBe(1);
        });

        it("Transform text/html objects", function() {
            var $lab = $("#lab");
            $lab.append('<object type="text/html" data="about:blank">Plain content</object>');
            mapal._convertToIframes($lab);
            expect($lab.find("object").length).toBe(0);
            var $iframe = $lab.find("iframe");
            expect($iframe.length).toBe(1);
            expect($iframe[0].src).toBe("about:blank");
        });
    });

    describe("transformContent", function() {
        it("Convert legend to p.legend", function() {
            var $lab = $("#lab");
            $lab.append("<fieldset><legend>Fieldset title</legend></fieldset>");
            mapal.transformContent($lab);
            expect($lab.html()).toBe('<fieldset><p class="legend">Fieldset title</p></fieldset>');
        });

        it("Keep text/html objects on non-IE", function() {
            var $lab = $("#lab"),
                old_msie = $.browser.msie;
            spyOn(mapal, "_convertToIframes");
            try {
                old_msie=false;
                mapal.transformContent($lab[0]);
                expect(mapal._convertToIframes).not.toHaveBeenCaled();
            } catch (e) {
                $.browser.msie = old_msie;
            }
        });

        it("Convert text/html objects to iframes on IE", function() {
            var $lab = $("#lab"),
                old_msie = $.browser.msie,
                old_version = $.browser.version;
            spyOn(mapal, "_convertToIframes");
            try {
                $.browser.msie=true;
                $.browser.version="7.0";
                mapal.transformContent($lab[0]);
                expect(mapal._convertToIframes).toHaveBeenCaled();
            } catch (e) {
                $.browser.msie = old_msie;
                $.browser.version = old_version;
            }
        });

        it("Keep text/html objects IE > 8", function() {
            var $lab = $("#lab"),
                old_msie = $.browser.msie,
                old_version = $.browser.version;
            spyOn(mapal, "_convertToIframes");
            try {
                $.browser.msie=true;
                $.browser.version="9.0";
                mapal.transformContent($lab[0]);
                expect(mapal._convertToIframes).not.toHaveBeenCaled();
            } catch (e) {
                $.browser.msie = old_msie;
                $.browser.version = old_version;
            }
        });
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

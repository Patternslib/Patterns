define(["pat-forward"], function(pattern) {

    describe("pat-forward", function() {

        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        describe("Clicking on a button sends the click to another element", function() {
            it("allows you to forward the click from an element to another one", function () {
                var $lab = $("#lab");
                $lab.append($(
                    "<form>" +
                    '    <input id="checkbox" type="checkbox" />' +
                    '    <button class="pat-forward" data-pat-forward="#checkbox">Button</button>' +
                    "</form>"
                ));

                pattern.init($(pattern.trigger));
                expect($lab.find("#checkbox").is(":checked")).toBeFalsy();
                $lab.find(".pat-forward").click();
                expect($lab.find("#checkbox").is(":checked")).toBeTruthy();
            });
        });

        describe("Setting the trigger auto option triggers the click on init", function() {
            it("allows you to forward the click authomatically when the pattern is initialized", function () {
                var $lab = $("#lab");
                $lab.append($(
                    "<form>" +
                    '    <input id="checkbox" type="checkbox" />' +
                    '    <button class="pat-forward" data-pat-forward="#checkbox; trigger: auto">Button</button>' +
                    "</form>"
                ));

                pattern.init($(pattern.trigger));
                expect($lab.find("#checkbox").is(":checked")).toBeTruthy();
                $lab.find(".pat-forward").click();
                expect($lab.find("#checkbox").is(":checked")).toBeFalsy();
            });
        });

    });

});

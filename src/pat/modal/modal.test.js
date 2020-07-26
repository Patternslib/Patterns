import pattern from "./modal";
import $ from "jquery";

describe("pat-modal", function() {
    beforeEach(function() {
        $("<div/>", { id: "lab" }).appendTo(document.body);
    });

    afterEach(function() {
        $("#lab").remove();
        $("body").removeClass("modal-active");
    });

    describe("init", function() {
        it("Modal with single element", function() {
            $("#lab").html(
                [
                    '<div class="pat-modal" id="modal">',
                    "  <p>Modal content</p>",
                    "</div>"
                ].join("\n")
            );
            expect($("body").hasClass("modal-active")).toBeFalsy();
            var $modal = $("#modal");
            pattern.init($modal);
            expect($modal.find(".header").length).toBeTruthy();
            expect($modal.find(".header").text()).toBe("Close");
            expect($modal.find(".header .close-panel").length).toBeTruthy();
            expect($modal.find(".panel-content").length).toBeTruthy();
            expect($modal.find(".panel-content").text()).toBe(
                "Modal content"
            );
            expect($("body").hasClass("modal-active")).toBeTruthy();
        });

        it("Modal with header ", function() {
            $("#lab").html(
                [
                    '<div class="pat-modal" id="modal">',
                    "  <h3>Modal header</h3>",
                    "  <p>Modal content</p>",
                    "</div>"
                ].join("\n")
            );
            expect($("body").hasClass("modal-active")).toBeFalsy();
            var $modal = $("#modal");
            pattern.init($modal);
            expect($modal.find(".header").text()).toBe("Modal headerClose");
            expect($modal.find(".header .close-panel").length).toBeTruthy();
            expect($modal.find(".panel-content").text()).toBe(
                "Modal content"
            );
            expect($("body").hasClass("modal-active")).toBeTruthy();
        });

        it("Modal with multiple content items ", function() {
            $("#lab").html(
                [
                    '<div class="pat-modal" id="modal">',
                    "  <h3>Modal header</h3>",
                    "  <p>Modal content</p>",
                    "  <h4>Subheader</h4>",
                    "  <p>More content</p>",
                    "</div>"
                ].join("\n")
            );
            expect($("body").hasClass("modal-active")).toBeFalsy();
            var $modal = $("#modal");
            pattern.init($modal);
            expect($modal.find(".header").text()).toBe("Modal headerClose");
            expect($modal.find(".header .close-panel").length).toBeTruthy();
            expect($modal.find(".panel-content p").length).toBe(2);
            expect($modal.find(".panel-content h4").length).toBe(1);
            expect($("body").hasClass("modal-active")).toBeTruthy();
        });

        it("Modal with a form that has the pat-modal CSS class", function() {
            var $modal, // main modal container
                $modalLink; // link that triggers the modal

            $("#lab").html(
                [
                    '<a id="modalLink" class="pat-modal"',
                    '   href="../demo/bug_modal/modal-sources.html">Open a modal',
                    "   containing a form with pat-modal CSS class.</a>"
                ].join("/n")
            );

            $modalLink = $("#modalLink");
            pattern.init($modalLink);

            // najprej #modalLink ne obstaja
            $modal = $("div#pat-modal");
            expect($modal.length).toBe(0);

            $modalLink.click(); // trigger panel loading

            // TODO: we need to insert a delay here so that the asynchronous
            // AJAX injection of the potentially problematic HTML finishes ...
            // and only AFTER THAT we test that everything is still OK
            // (read: that the modal still exists in DOM)
            // NOTE: If AJAX request in inject.execute() is performed in a
            // synchronous way, a delay is not need and this test detects a
            // bug in modal._init_inject1()

            // div#pat-modal should still exist even after the click has
            // loaded and injected problematic HTML
            $modal = $("div#pat-modal");
            expect($modal.length).toBeGreaterThan(0);
        });

        it("Modal with single element that specifies a custom close button string", function() {
            $("#lab").html(
                [
                    '<div class="pat-modal" id="modal" data-pat-modal="close-text: Shutdown">',
                    "  <p>Modal content</p>",
                    "</div>"
                ].join("\n")
            );
            expect($("body").hasClass("modal-active")).toBeFalsy();
            var $modal = $("#modal");
            pattern.init($modal);
            expect($modal.find(".header").length).toBeTruthy();
            expect($modal.find(".header").text()).toBe("Shutdown");
            expect($modal.find(".header .close-panel").length).toBeTruthy();
            expect($("body").hasClass("modal-active")).toBeTruthy();
        });
    });
});

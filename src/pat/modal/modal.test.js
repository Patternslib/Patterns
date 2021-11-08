import $ from "jquery";
import pattern from "./modal";
import utils from "../../core/utils";
import { jest } from "@jest/globals";

describe("pat-modal", function () {
    let deferred;

    const answer = function (html) {
        deferred.resolve(html, "ok", { responseText: html });
    };

    beforeEach(function () {
        deferred = new $.Deferred();
        document.body.innerHTML = `<div id="lab"></div>`;
    });

    afterEach(function () {
        document.body.innerHTML = "";
        document.body.classList.remove("modal-active");
        jest.restoreAllMocks();
    });

    describe("init", function () {
        it("Modal with single element", function () {
            $("#lab").html(
                [
                    '<div class="pat-modal" id="modal">',
                    "  <p>Modal content</p>",
                    "</div>",
                ].join("\n")
            );
            expect($("body").hasClass("modal-active")).toBeFalsy();
            var $modal = $("#modal");
            pattern.init($modal);
            expect($modal.find(".header").length).toBeTruthy();
            expect($modal.find(".header").text()).toBe("Close");
            expect($modal.find(".header .close-panel").length).toBeTruthy();
            expect($modal.find(".panel-content").length).toBeTruthy();
            expect($modal.find(".panel-content").text()).toBe("Modal content");
            expect($("body").hasClass("modal-active")).toBeTruthy();
        });

        it("Modal with header ", function () {
            $("#lab").html(
                [
                    '<div class="pat-modal" id="modal">',
                    "  <h3>Modal header</h3>",
                    "  <p>Modal content</p>",
                    "</div>",
                ].join("\n")
            );
            expect($("body").hasClass("modal-active")).toBeFalsy();
            var $modal = $("#modal");
            pattern.init($modal);
            expect($modal.find(".header").text()).toBe("Modal headerClose");
            expect($modal.find(".header .close-panel").length).toBeTruthy();
            expect($modal.find(".panel-content").text()).toBe("Modal content");
            expect($("body").hasClass("modal-active")).toBeTruthy();
        });

        it("Modal with multiple content items ", function () {
            $("#lab").html(
                [
                    '<div class="pat-modal" id="modal">',
                    "  <h3>Modal header</h3>",
                    "  <p>Modal content</p>",
                    "  <h4>Subheader</h4>",
                    "  <p>More content</p>",
                    "</div>",
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

        it("Modal with a form that has the pat-modal CSS class", function () {
            var $modal, // main modal container
                $modalLink; // link that triggers the modal

            $("#lab").html(
                [
                    '<a id="modalLink" class="pat-modal"',
                    '   href="some-page-with-modal.html">Open a modal',
                    "   containing a form with pat-modal CSS class.</a>",
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

        it("Modal with single element that specifies a custom close button string", function () {
            $("#lab").html(
                [
                    '<div class="pat-modal" id="modal" data-pat-modal="close-text: Shutdown">',
                    "  <p>Modal content</p>",
                    "</div>",
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

        it("Dispatch pat-modal-ready with a div-modal.", async function () {
            document.body.innerHTML = `
                <div class="pat-modal" id="modal">
                  <p>Modal content</p>
                </div>
            `;

            const callback = jest.fn();
            const modal_el = document.querySelector(".pat-modal");
            modal_el.addEventListener("pat-modal-ready", callback);
            pattern.init(modal_el);
            await utils.timeout(1); // wait a tick for async to settle.

            // Opened immediately
            expect(callback).toHaveBeenCalled();
        });

        it("Dispatch pat-modal-ready with a inject-modal.", async function () {
            jest.spyOn($, "ajax").mockImplementation(() => deferred);
            document.body.innerHTML = `
                <a
                    class="pat-modal"
                    href="test.html">Open modal</a>
            `;

            const callback = jest.fn();
            const modal_el = document.querySelector(".pat-modal");
            modal_el.addEventListener("pat-modal-ready", callback);
            pattern.init(modal_el);
            await utils.timeout(1); // wait a tick for async to settle.

            expect(callback).not.toHaveBeenCalled();

            answer("<html><body><div></div></body></html>");
            modal_el.click();
            await utils.timeout(1); // wait a tick for async to settle.
            expect(callback).toHaveBeenCalled();
        });

        it("Submit form, do injection and close overlay.", async function () {
            await import("../inject/inject");
            const registry = (await import("../../core/registry")).default;

            jest.spyOn($, "ajax").mockImplementation(() => deferred);
            answer(
                `<html><body><div id="source">hello.</div><div id="source2">there</div></body></html>`
            );

            document.body.innerHTML = `
              <div class="pat-modal">
                <form
                    class="pat-inject"
                    action="test.html"
                    data-pat-inject="source: #source; target: #target && source: #source2; target: #target2">
                  <button type="submit" class="close-panel">submit</button>
                </form>
              </div>
              <div id="target">
              </div>
              <div id="target2">
              </div>
            `;
            registry.scan(document.body);
            await utils.timeout(1); // wait a tick for async to settle.

            document.querySelector("button.close-panel[type=submit]").click();
            await utils.timeout(1); // wait a tick for pat-inject to settle.
            await utils.timeout(1); // wait a tick for pat-modal destroy to settle.

            expect(document.querySelector(".pat-modal")).toBe(null);
            expect(document.querySelector("#target").textContent).toBe("hello.");
            expect(document.querySelector("#target2").textContent).toBe("there");
        });

        it("Ensure destroy callback isn't called multiple times.", async function () {
            document.body.innerHTML = `
              <div id="pat-modal" class="pat-modal">
                <button id="close-modal" class="close-panel">close</button>
              </div>
            `;

            const instance = new pattern(document.querySelector(".pat-modal"));
            await utils.timeout(1); // wait a tick for async to settle.

            const spy_destroy = jest.spyOn(instance, "destroy");

            // ``destroy`` was already initialized with instantiating the pattern above.
            // Call init again for new instantiation.
            instance.init($(".pat-modal"));

            document.querySelector("#close-modal").click();
            await utils.timeout(1); // wait a tick for pat-modal destroy to settle.

            expect(spy_destroy).toHaveBeenCalledTimes(1);
        });

        it("Ensure destroy callback isn't called multiple times with forms and injection.", async function () {
            const markup = `
              <div id="pat-modal" class="pat-modal">
                <form action="." class="pat-inject" data-pat-inject="source: body; target: body">
                  <button id="close-modal" class="close-panel" type="submit">close</button>
                </form>
              </div>
            `;

            // Set up inject mocks
            const pattern_inject = (await import("../inject/inject")).default;
            jest.spyOn($, "ajax").mockImplementation(() => deferred);
            answer("<html><body><p>OK</p></body></html>"); // empties body

            document.body.innerHTML = markup;

            pattern_inject.init($(".pat-inject"));
            const instance = new pattern(document.querySelector(".pat-modal"));
            await utils.timeout(1); // wait a tick for async to settle.

            const spy_destroy = jest.spyOn(instance, "destroy");
            const spy_destroy_inject = jest.spyOn(instance, "destroy_inject");

            // ``destroy`` was already initialized with instantiating the pattern above.
            // Call init again for new instantiation.
            instance.init($(".pat-modal"));

            document.querySelector("#close-modal").click();
            await utils.timeout(1); // wait a tick for pat-inject to settle.

            expect(spy_destroy_inject).toHaveBeenCalledTimes(1);
            expect(spy_destroy).toHaveBeenCalledTimes(1);

            // re-attach and re-initialize. Event handler should only be active once.
            document.body.innerHTML = markup;
            pattern_inject.init($(".pat-inject"));
            new pattern(document.querySelector(".pat-modal"));
            await utils.timeout(1); // wait a tick for async to settle.
            document.querySelector("#close-modal").click();
            await utils.timeout(1); // wait a tick for pat-inject to settle.
            // Previous mocks still active.
            // Handlers executed exactly once.
            expect(spy_destroy_inject).toHaveBeenCalledTimes(1);
            expect(spy_destroy).toHaveBeenCalledTimes(1);
        });
    });
});

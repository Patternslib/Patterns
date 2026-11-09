import $ from "jquery";
import events from "../../core/events";
import inject from "../inject/inject";
import Pattern from "./reload";
import utils from "../../core/utils";
import { jest } from "@jest/globals";

describe("pat-reload", () => {
    let initial_url;
    let spy_ajax;
    let ajax_urls;

    beforeEach(() => {
        initial_url = window.location.href;
        ajax_urls = [];
        spy_ajax = jest.spyOn($, "ajax").mockImplementation((args) => {
            ajax_urls.push(args.url);
            const deferred = $.Deferred();
            const html = `<html><body><div id="toolbar">reloaded ${ajax_urls.length}</div></body></html>`;
            deferred.resolve(html, "ok", { responseText: html });
            return deferred;
        });
    });

    afterEach(() => {
        spy_ajax.mockRestore();
        events.remove_event_listener(undefined, "pat-reload--*");
        history.replaceState(null, "", initial_url);
        document.body.innerHTML = "";
    });

    const setup = async (reload_config, inject_config = "") => {
        history.replaceState(null, "", "/folder/page");
        document.body.innerHTML = `
            <div
                class="pat-reload"
                data-pat-reload="${reload_config}"
                data-pat-inject="${inject_config}"
            >initial</div>
        `;
        const el = document.querySelector(".pat-reload");
        const instance = new Pattern(el);
        await events.await_pattern_init(instance);
        return { el, instance };
    };

    describe("1 - Initialization", () => {
        it("1.1 - does not reload on initialization", async () => {
            await setup("url: @@render-toolbar#toolbar");
            await utils.timeout(1);
            expect(spy_ajax).not.toHaveBeenCalled();
        });

        it("1.2 - does not initialize without url", async () => {
            const { instance } = await setup("");
            expect(instance.event_id).toBeUndefined();

            history.pushState(null, "", "/folder/other");
            await utils.timeout(1);
            expect(spy_ajax).not.toHaveBeenCalled();
        });

        it("1.3 - destroy does not remove other event listeners", async () => {
            const cb = jest.fn();
            events.add_event_listener(document, "test", "pat-reload-test", cb);

            const { instance } = await setup("");
            instance.destroy();

            document.dispatchEvent(new Event("test"));
            expect(cb).toHaveBeenCalled();
            events.remove_event_listener(document, "pat-reload-test");
        });
    });

    describe("2 - Reload on navigation", () => {
        it("2.1 - reloads into itself on URL changes", async () => {
            const { el } = await setup("url: @@render-toolbar#toolbar");

            history.pushState(null, "", "/folder/other");
            await utils.timeout(1);

            expect(ajax_urls).toEqual([
                `${window.location.origin}/folder/other/@@render-toolbar`,
            ]);
            expect(el.textContent).toBe("reloaded 1");

            history.pushState(null, "", "/another/page?x=1#y");
            await utils.timeout(1);

            expect(ajax_urls[1]).toBe(
                `${window.location.origin}/another/page/@@render-toolbar`
            );
            expect(el.textContent).toBe("reloaded 2");
        });

        it("2.2 - ignores hash changes and same-URL replaceState", async () => {
            await setup("url: @@render-toolbar#toolbar");

            history.pushState(null, "", "#anchor");
            history.replaceState("anchor", "", window.location.href);
            await utils.timeout(1);
            expect(spy_ajax).not.toHaveBeenCalled();
        });

        it("2.3 - uses absolute URLs as-is", async () => {
            await setup("url: /@@render-toolbar#toolbar");

            history.pushState(null, "", "/folder/other");
            await utils.timeout(1);
            expect(ajax_urls).toEqual([`${window.location.origin}/@@render-toolbar`]);
        });

        it("2.4 - uses the pat-inject configuration", async () => {
            document.body.innerHTML = `<div id="other">other</div>`;
            const { el } = await setup(
                "url: @@render-toolbar",
                "source: #toolbar; target: #other"
            );
            // setup replaces the body - re-add the target.
            el.insertAdjacentHTML("afterend", `<div id="other">other</div>`);

            history.pushState(null, "", "/folder/other");
            await utils.timeout(1);

            expect(el.textContent).toBe("initial");
            expect(document.querySelector("#other").textContent).toBe("reloaded 1");
        });

        it("2.5 - debounces rapid navigations with delay", async () => {
            await setup("url: @@render-toolbar#toolbar; delay: 20ms");

            history.pushState(null, "", "/page-1");
            history.pushState(null, "", "/page-2");
            history.pushState(null, "", "/page-3");
            await utils.timeout(1);
            expect(spy_ajax).not.toHaveBeenCalled();

            await utils.timeout(30);
            expect(ajax_urls).toEqual([
                `${window.location.origin}/page-3/@@render-toolbar`,
            ]);
        });

        it("2.6 - re-triggers once after an in-progress injection", async () => {
            const { el } = await setup("url: @@render-toolbar#toolbar");
            $(el).data("pat-inject-triggered", true); // Injection in progress.

            history.pushState(null, "", "/page-1");
            await utils.timeout(1);
            history.pushState(null, "", "/page-2");
            await utils.timeout(1);
            expect(spy_ajax).not.toHaveBeenCalled();

            $(el).removeData("pat-inject-triggered");
            $(el).trigger("pat-ajax-success");
            await utils.timeout(5);
            expect(ajax_urls).toEqual([
                `${window.location.origin}/page-2/@@render-toolbar`,
            ]);
        });

        it("2.7 - unregisters when the element is removed", async () => {
            const { el, instance } = await setup("url: @@render-toolbar#toolbar");
            const spy_destroy = jest.spyOn(instance, "destroy");
            el.remove();

            history.pushState(null, "", "/page-1");
            await utils.timeout(1);
            expect(spy_ajax).not.toHaveBeenCalled();
            expect(spy_destroy).toHaveBeenCalledTimes(1);

            history.pushState(null, "", "/page-2");
            await utils.timeout(1);
            expect(spy_destroy).toHaveBeenCalledTimes(1);
        });
    });

    describe("3 - Reload on custom events", () => {
        it("3.1 - reloads on any event bubbling up to the document", async () => {
            const { el } = await setup(
                "url: @@render-toolbar#toolbar; trigger-event: my-reload"
            );

            // A navigation does not trigger the reload.
            history.pushState(null, "", "/folder/other");
            await utils.timeout(1);
            expect(spy_ajax).not.toHaveBeenCalled();

            document.body.dispatchEvent(new Event("my-reload", { bubbles: true }));
            await utils.timeout(1);
            expect(el.textContent).toBe("reloaded 1");

            // Custom events also reload without URL changes.
            document.dispatchEvent(new Event("my-reload"));
            await utils.timeout(1);
            expect(el.textContent).toBe("reloaded 2");
        });
    });

    it("4 - uses pat-inject for the injection", async () => {
        const spy_execute = jest.spyOn(inject, "execute");
        await setup("url: @@render-toolbar#toolbar");

        history.pushState(null, "", "/folder/other");
        await utils.timeout(1);
        expect(spy_execute).toHaveBeenCalledTimes(1);
        spy_execute.mockRestore();
    });
});

import pattern from "./inject";
import $ from "jquery";
import events from "../../core/events";
import registry from "../../core/registry";
import utils from "../../core/utils";
import { jest } from "@jest/globals";

const mockFetch =
    (text = "") =>
    () =>
        Promise.resolve({
            text: () => Promise.resolve(text),
        });

describe("pat-inject", function () {
    var deferred;

    var answer = function (html) {
        deferred.resolve(html, "ok", { responseText: html });
    };

    beforeEach(function () {
        deferred = new $.Deferred();
        document.body.innerHTML = `<div id="lab"></div>`;
    });

    afterEach(function () {
        document.body.innerHTML = "";
        jest.restoreAllMocks();
    });

    describe("1 - The next-href argument", function () {
        it("1.1 - allows you to specify the href to be applied to the clicked element after injection", async function () {
            var $a = $(
                '<a class="pat-inject" data-pat-inject="next-href: http://patternslib.com" href="/src/pat/inject/inject-sources.html#pos-1">link</a>'
            );
            var $div = $('<div id="pos-1" />');
            $("#lab").append($a).append($div);
            var dummy_event = {
                jqxhr: { responseText: "foo" },
                isPropagationStopped: function () {
                    return true;
                },
            };
            var cfgs = pattern.extractConfig($a, {});
            pattern.verifyConfig(cfgs);
            pattern._onInjectSuccess($a, cfgs, dummy_event);
            await utils.timeout(1); // wait a tick for async to settle.

            expect(cfgs[0].nextHref).toBe("http://patternslib.com");
            expect($a.attr("href")).toBe("http://patternslib.com");
        });
    });

    describe("2 - The loading-class argument", function () {
        it("2.1 - has a default value of 'injecting' and gets added to the target while content is still loading", async function () {
            const spy_ajax = jest.spyOn($, "ajax").mockImplementation(() => deferred);
            var $a = $('<a class="pat-inject" href="test.html#someid">link</a>');
            var $div = $('<div id="someid" />');
            $("#lab").empty().append($a).append($div);

            var callback = jest.fn();
            $(document).on("patterns-injected", callback);

            pattern.init($a);
            await utils.timeout(1); // wait a tick for async to settle.

            $a.trigger("click");

            var cfgs = pattern.extractConfig($a, {});
            expect(cfgs[0].loadingClass).toBe("injecting");

            expect($div.hasClass("injecting")).toBeTruthy();

            answer(`<html><body><div id="someid">repl</div></body></html>`);
            await utils.timeout(1); // wait a tick for async to settle.
            expect($div.hasClass("injecting")).toBeFalsy();
            expect(callback).toHaveBeenCalled();

            spy_ajax.mockRestore();
        });

        it("2.2 - can be set to another string value which then gets added to the target while content is still loading'", async function () {
            const spy_ajax = jest.spyOn($, "ajax").mockImplementation(() => deferred);
            var $a = $(
                '<a class="pat-inject" data-pat-inject="loading-class: other-class;" href="test.html#someid">link</a>'
            );
            var $div = $('<div id="someid" />');
            $("#lab").empty().append($a).append($div);

            pattern.init($a);
            await utils.timeout(1); // wait a tick for async to settle.

            $a.trigger("click");

            var cfgs = pattern.extractConfig($a, {});
            expect(cfgs[0].loadingClass).toBe("other-class");

            expect($div.hasClass("other-class")).toBeTruthy();

            answer("<html><body>" + '<div id="someid">repl</div>' + "</body></html>");
            await utils.timeout(1); // wait a tick for async to settle.
            expect($div.hasClass("other-class")).toBeFalsy();

            spy_ajax.mockRestore();
        });

        it("2.3 - can be set to an empty string value so that nothing gets added to the target while content is still loading'", async function () {
            const spy_ajax = jest.spyOn($, "ajax");
            var $a = $(
                '<a class="pat-inject" data-pat-inject="loading-class: ;" href="test.html#someid">link</a>'
            );
            var $div = $('<div id="someid" />');
            $("#lab").empty().append($a).append($div);

            pattern.init($a);
            await utils.timeout(1); // wait a tick for async to settle.

            $a.trigger("click");
            var cfgs = pattern.extractConfig($a, {});
            expect(cfgs[0].loadingClass).toBe("");
            expect($div[0].className).toBe("");

            spy_ajax.mockRestore();
        });
    });

    describe("3 - The confirm argument", function () {
        it("3.1 - is by default set to 'class', which means it asks for confirmation based on a class on the target", async function () {
            var $a = $('<a class="pat-inject" href="test.html#someid">link</a>');
            var $div = $('<div id="someid" />');
            $("#lab").empty().append($a).append($div);
            const spy_onTrigger = jest.spyOn(pattern, "onTrigger");
            var spy_confirm = jest
                .spyOn(window, "confirm")
                .mockImplementation(() => false);

            // Test default value for parser argument
            var cfgs = pattern.extractConfig($a, {});
            expect(cfgs[0].confirm).toBe("class");

            // Test that confirm doesn't get called
            pattern.init($a);
            await utils.timeout(1); // wait a tick for async to settle.

            $a.trigger("click");
            expect(spy_onTrigger).toHaveBeenCalled();
            expect(spy_confirm).not.toHaveBeenCalled();

            $div.addClass("is-dirty");
            $a.trigger("click");
            expect(spy_onTrigger).toHaveBeenCalledTimes(2);
            expect(spy_confirm).toHaveBeenCalled();

            spy_onTrigger.mockRestore();
            spy_confirm.mockRestore();
        });

        it("3.2 - can be set to 'never' to never ask for confirmation", async function () {
            var $a = $(
                '<a class="pat-inject" href="test.html#someid" data-pat-inject="confirm: never">link</a>'
            );
            var $div = $('<div id="someid" />');
            $("#lab").empty().append($a).append($div);
            var spy_onTrigger = jest.spyOn(pattern, "onTrigger");
            var spy_confirm = jest
                .spyOn(window, "confirm")
                .mockImplementation(() => false);

            // Test default value for parser argument
            var cfgs = pattern.extractConfig($a, {});
            expect(cfgs[0].confirm).toBe("never");

            // Test that confirm doesn't get called
            pattern.init($a);
            await utils.timeout(1); // wait a tick for async to settle.

            $a.trigger("click");
            expect(spy_onTrigger).toHaveBeenCalled();
            expect(spy_confirm).not.toHaveBeenCalled();

            spy_onTrigger.mockRestore();
            spy_confirm.mockRestore();
        });

        it("3.3 - can be set to 'always' to always ask for confirmation before injecting", async function () {
            var $a = $(
                '<a class="pat-inject" href="test.html#someid" data-pat-inject="confirm: always">link</a>'
            );
            var $div = $('<div id="someid" />');
            $("#lab").empty().append($a).append($div);
            var spy_onTrigger = jest.spyOn(pattern, "onTrigger");
            var spy_confirm = jest
                .spyOn(window, "confirm")
                .mockImplementation(() => true);

            // Test default value for parser argument
            var cfgs = pattern.extractConfig($a, {});
            expect(cfgs[0].confirm).toBe("always");

            // Test that confirm does get called
            pattern.init($a);
            await utils.timeout(1); // wait a tick for async to settle.

            $a.trigger("click");
            expect(spy_onTrigger).toHaveBeenCalled();
            expect(spy_confirm).toHaveBeenCalled();

            spy_onTrigger.mockRestore();
            spy_confirm.mockRestore();
        });

        it("3.4 - can be set to 'form-data' to ask for confirmation before injecting over form fields changed by the user", async function () {
            var $a = $(
                '<a class="pat-inject" href="test.html#someid" data-pat-inject="confirm: form-data">link</a>'
            );
            var $div = $('<form id="someid"><input type="text" name="name"/></form>');
            $("#lab").empty().append($a).append($div);
            var spy_onTrigger = jest.spyOn(pattern, "onTrigger");
            var spy_confirm = jest
                .spyOn(window, "confirm")
                .mockImplementation(() => true);

            // Test default value for parser argument
            var cfgs = pattern.extractConfig($a, {});
            expect(cfgs[0].confirm).toBe("form-data");

            $('[name="name"]').val("hello world");

            // Test that confirm does get called
            pattern.init($a);
            await utils.timeout(1); // wait a tick for async to settle.

            $a.trigger("click");
            expect(spy_confirm).toHaveBeenCalled();

            $('[name="name"]').val("");
            $a.trigger("click");
            expect(window.confirm.mock.calls.length).toBe(1);
            expect(spy_onTrigger).toHaveBeenCalled();

            spy_onTrigger.mockRestore();
            spy_confirm.mockRestore();
        });

        describe("3.5 - The confirm-message argument", function () {
            it("3.5.1 - can be used to provide a custom confirmation prompt message", async function () {
                var $a = $(
                    '<a class="pat-inject" href="test.html#someid" data-pat-inject="confirm: always; confirm-message: Hello world">link</a>'
                );
                var $div = $('<div id="someid" />');
                $("#lab").empty().append($a).append($div);
                const spy_onTrigger = jest.spyOn(pattern, "onTrigger");
                const spy_confirm = jest
                    .spyOn(window, "confirm")
                    .mockImplementation(() => false);

                // Test default value for parser argument
                var cfgs = pattern.extractConfig($a, {});
                expect(cfgs[0].confirm).toBe("always");

                // Test that confirm doesn't get called
                pattern.init($a);
                await utils.timeout(1); // wait a tick for async to settle.

                $a.trigger("click");
                expect(spy_confirm).toHaveBeenCalled();
                expect(spy_confirm).toHaveBeenCalledWith("Hello world");

                spy_onTrigger.mockRestore();
                spy_confirm.mockRestore();
            });
        });
    });

    describe("4 - rebaseURL", function () {
        it("4.1 - Keep URL with scheme", function () {
            expect(
                pattern._rebaseURL("http://example.com/foo/", "http://other.com/me")
            ).toBe("http://other.com/me");
        });

        it("4.2 - Keep URL with absolute path", function () {
            expect(pattern._rebaseURL("http://example.com/foo/", "/me")).toBe("/me");
        });

        it("4.3 - Rebase to base with filename", function () {
            expect(
                pattern._rebaseURL("http://example.com/foo/index.html", "me/page.html")
            ).toBe("http://example.com/foo/me/page.html");
        });

        it("4.4 - Rebase to base with directory path", function () {
            expect(pattern._rebaseURL("http://example.com/foo/", "me/page.html")).toBe(
                "http://example.com/foo/me/page.html"
            );
        });

        it("4.5 - Rebase with absolute base url", function () {
            expect(
                pattern
                    ._rebaseURL("/foo/", "me/page.html")
                    .indexOf("/foo/me/page.html") > 0
            ).toBe(true);
        });

        it("4.6 - Rebase with relative base url", function () {
            expect(
                pattern
                    ._rebaseURL("example.com/foo/", "me/page.html")
                    .indexOf("example.com/foo/me/page.html") > 0
            ).toBe(true);
        });

        it("4.7 - Doesn't rebase data: urls", function () {
            expect(
                pattern._rebaseURL(
                    "http://example.com/foo/",
                    "data:image-base64gibberish"
                )
            ).toBe("data:image-base64gibberish");
        });
    });

    describe("5 - rebaseHTML", function () {
        it("5.1 - Basic markup with DOCTYPE", function () {
            expect(
                pattern._rebaseHTML(
                    "base",
                    "<!DOCTYPE html>\n<p>This is a simple <em>test</em></p>"
                )
            ).toBe("<p>This is a simple <em>test</em></p>");
        });

        it("5.2 - Basic markup", function () {
            expect(
                pattern._rebaseHTML("base", "<p>This is a simple <em>test</em></p>")
            ).toBe("<p>This is a simple <em>test</em></p>");
        });

        it("5.3 - Recover from unclosed tags", function () {
            expect(pattern._rebaseHTML("base", "<p>This is a simple <em>test</p>")).toBe(
                "<p>This is a simple <em>test</em></p>"
            );
        });

        it("5.4 - Anchor element without href attribute", function () {
            var spy_rebaseURL = jest.spyOn(pattern, "_rebaseURL");
            expect(pattern._rebaseHTML("base", "<a>This is a test</a>")).toBe(
                "<a>This is a test</a>"
            );
            expect(spy_rebaseURL).not.toHaveBeenCalled();

            spy_rebaseURL.mockRestore();
        });

        it("5.5 - Anchor element with href attribute", function () {
            expect(
                pattern._rebaseHTML(
                    "http://example.com/test/",
                    '<a href="subsite/page.html">This is a test</a>'
                )
            ).toBe(
                '<a href="http://example.com/test/subsite/page.html">This is a test</a>'
            );
        });

        it("5.6 - Automatically fix casing of attribute", function () {
            expect(
                pattern._rebaseHTML(
                    "http://example.com/test/",
                    '<a HrEF="subsite/page.html">This is a test</a>'
                )
            ).toBe(
                '<a href="http://example.com/test/subsite/page.html">This is a test</a>'
            );
        });

        it("5.7 - Check if image is rebased correctly", function () {
            expect(
                pattern._rebaseHTML("http://example.com/test/", '<img src="image.png">')
            ).toBe('<img src="http://example.com/test/image.png">');
        });

        it("5.8 - Leave non attribute occurences of src intact", function () {
            expect(
                pattern._rebaseHTML(
                    "base",
                    "<p>This string has    src = \"foo\" , src= bar , and SrC='foo'</p>"
                )
            ).toBe("<p>This string has    src = \"foo\" , src= bar , and SrC='foo'</p>");
        });

        it("5.9 - rebase pattern configuration", async () => {
            await import("../calendar/calendar");
            await import("../collapsible/collapsible");
            await import("../date-picker/date-picker");
            await import("../datetime-picker/datetime-picker");

            const res = pattern._rebaseHTML(
                "https://example.com/test/",
                `<div class="test1" data-pat-inject="loading-class:yeah;url:./index.html;class:hoy"/>
                 <div class="test2" data-pat-calendar="url: ./calendar.html; event-sources: ../calendar2.json, ./test/calendar3.json"/>
                 <div class="test3"
                     data-pat-date-picker="i18n:./i18n"
                     data-pat-datetime-picker="i18n:./path/to/i18n"
                     data-pat-collapsible="load-content:../load/content/from/here"
                 />`
            );

            const el = document.createElement("div");
            el.innerHTML = res;

            const test1_config_text = el
                .querySelector(".test1")
                .getAttribute("data-pat-inject");
            const test1_config = JSON.parse(test1_config_text);
            expect(test1_config.url).toEqual("https://example.com/test/./index.html"); // prettier-ignore

            const test2_config = JSON.parse(el.querySelector(".test2").getAttribute("data-pat-calendar")); // prettier-ignore
            expect(test2_config.url).toEqual("https://example.com/test/./calendar.html"); // prettier-ignore
            expect(test2_config["event-sources"][0]).toEqual("https://example.com/test/../calendar2.json"); // prettier-ignore
            expect(test2_config["event-sources"][1]).toEqual("https://example.com/test/./test/calendar3.json"); // prettier-ignore

            const test3a_config = JSON.parse(el.querySelector(".test3").getAttribute("data-pat-date-picker")); // prettier-ignore
            expect(test3a_config.i18n).toEqual("https://example.com/test/./i18n"); // prettier-ignore
            const test3b_config = JSON.parse(el.querySelector(".test3").getAttribute("data-pat-datetime-picker")); // prettier-ignore
            expect(test3b_config.i18n).toEqual("https://example.com/test/./path/to/i18n"); // prettier-ignore
            const test3c_config = JSON.parse(el.querySelector(".test3").getAttribute("data-pat-collapsible")); // prettier-ignore
            expect(test3c_config["load-content"]).toEqual("https://example.com/test/../load/content/from/here"); // prettier-ignore
        });

        it("5.10 - rebase pattern configuration creatively styled.", async () => {
            // tests for an error where a semicolon at the end of a pattern
            // config as well as multiple configs were not correctly parsed.

            const res = pattern._rebaseHTML(
                "https://example.com/test/",
                `<div
                    class="test1"
                    data-pat-inject="
                        url:./index.html; source: #one; target: .two;

                        &&

                        url:./index2.html; source: #okay

                        &&

                        loading-class:some;


                        "/>
                `
            );

            const el = document.createElement("div");
            el.innerHTML = res;

            const test1_config_text = el
                .querySelector(".test1")
                .getAttribute("data-pat-inject");
            const test1_config = JSON.parse(test1_config_text);

            expect(test1_config.length).toBe(3);
            expect(test1_config[0].url).toEqual("https://example.com/test/./index.html");
            expect(test1_config[0].source).toEqual("#one");
            expect(test1_config[0].target).toEqual(".two");
            expect(test1_config[1].url).toEqual(
                "https://example.com/test/./index2.html"
            );
            expect(test1_config[1].source).toEqual("#okay");
            expect(test1_config[2]["loading-class"]).toEqual("some");
        });

        it("5.11 - doesn't rebase invalid pattern configuration options", async () => {
            await import("../calendar/calendar");

            const res = pattern._rebaseHTML(
                "https://example.com/test/",
                '<div id="test" data-pat-calendar="url: ; event-sources: ../calendar2.json"/>'
            );

            const el = document.createElement("div");
            el.innerHTML = res;

            const test_config_text = el
                .querySelector("#test")
                .getAttribute("data-pat-calendar");
            const test_config = JSON.parse(test_config_text);
            expect(test_config.url).toEqual("");
            expect(test_config["event-sources"]).toEqual([
                "https://example.com/test/../calendar2.json",
            ]);
        });
    });

    describe("6 - parseRawHtml", function () {
        it("6.1 - Roundtrip attributes with double quotes", function () {
            var value =
                    '{"plugins": "paste", "content_css": "/_themes/Style/tiny-body.css"}',
                input = "<a data-tinymce-json='" + value + "'>Test</a>",
                $output = pattern._parseRawHtml(input, null);
            expect($output.find("a").attr("data-tinymce-json")).toBe(value);
        });

        it("6.2 - Roundtrip attributes with single quotes", function () {
            var value =
                    "{'plugins': 'paste', 'content_css': '/_themes/Style/tiny-body.css'}",
                input = '<a data-tinymce-json="' + value + '">Test</a>',
                $output = pattern._parseRawHtml(input, null);
            expect($output.find("a").attr("data-tinymce-json")).toBe(value);
        });
    });

    describe("7 - Functional tests", function () {
        describe("7.1 - extract/verifyConfig", function () {
            var $a, $target;

            beforeEach(function () {
                $a = $('<a class="pat-inject" href="test.html#someid">link</a>');
                $target = $('<div id="someid">');

                $("#lab").append($a).append($target);
            });
            afterEach(function () {
                $target.remove();
            });

            it("fall back to href id", function () {
                var cfgs = pattern.extractConfig($a);
                expect(pattern.verifyConfig(cfgs)).toBeTruthy();

                expect(cfgs.length).toBe(1);
                expect(cfgs[0].source).toBe("#someid");
                expect(cfgs[0].target).toBe("#someid");
            });

            it("take first positional option as source and target", function () {
                var cfgs;
                $a.attr("data-pat-inject", "#otherid");
                $target.attr("id", "otherid");
                cfgs = pattern.extractConfig($a);
                expect(pattern.verifyConfig(cfgs)).toBeTruthy();

                expect(cfgs[0].source).toBe("#otherid");
                expect(cfgs[0].target).toBe("#otherid");
            });

            it("take two positional options as source and target resp.", function () {
                var cfgs;

                $a.attr("data-pat-inject", "#otherid #yetanotherid");
                $target.attr("id", "yetanotherid");
                cfgs = pattern.extractConfig($a);
                expect(pattern.verifyConfig(cfgs)).toBeTruthy();

                expect(cfgs[0].source).toBe("#otherid");
                expect(cfgs[0].target).toBe("#yetanotherid");
            });

            it("Use trigger as target", function () {
                $a.attr("data-pat-inject", "target: self::after");
                var cfgs = pattern.extractConfig($a);
                expect(pattern.verifyConfig(cfgs)).toBeTruthy();
                expect(cfgs[0].target).toBe("self");
                expect(cfgs[0].$target[0]).toBe($a[0]);
            });

            it("create target if it doesn't exist", function () {
                var cfgs = pattern.extractConfig($a);

                $target.remove();
                expect(pattern.verifyConfig(cfgs)).toBeTruthy();

                $target = $("#someid");
                expect($target.length).toBeGreaterThan(0);
                expect($target.parent().prop("tagName")).toBe("BODY");
            });

            it("parse autload delay argument", function () {
                $a.attr("data-pat-inject", "trigger: autoload; delay: 1000;");
                var cfgs = pattern.extractConfig($a);
                expect(pattern.verifyConfig(cfgs)).toBeTruthy();
                expect(cfgs[0].trigger).toBe("autoload");
                expect(cfgs[0].delay).toBe(1000);
            });
        });
    });

    describe("8 - Injection events tests", function () {
        it("8.1 - triggers the pat-inject-success event after successful injection", async function () {
            const spy_ajax = jest.spyOn($, "ajax").mockImplementation(() => deferred);
            document.body.innerHTML = `
               <a class="pat-inject" href="test.html">link</a>
            `;
            const callback = jest.fn();
            const inject_el = document.querySelector(".pat-inject");
            inject_el.addEventListener("pat-inject-success", callback);

            registry.scan(document.body);
            await utils.timeout(1); // wait a tick for async to settle.

            inject_el.click();
            answer("<html><body><div></div></body></html>");
            await utils.timeout(1); // wait a tick for async to settle.
            expect(callback).toHaveBeenCalled();

            spy_ajax.mockRestore();
        });

        it("8.2 - triggers the patterns-injected event after injection has finished'", async function () {
            const spy_ajax = jest.spyOn($, "ajax").mockImplementation(() => deferred);
            var $a = $('<a class="pat-inject" href="test.html#someid">link</a>');
            var $div = $('<div id="someid" />');
            $("#lab").empty().append($a).append($div);
            var callback = jest.fn();
            $(document).on("patterns-injected", callback);

            pattern.init($a);
            await utils.timeout(1); // wait a tick for async to settle.

            $a.trigger("click");
            answer("<html><body>" + '<div id="someid">repl</div>' + "</body></html>");
            await utils.timeout(1); // wait a tick for async to settle.
            expect(callback).toHaveBeenCalled();

            spy_ajax.mockRestore();
        });

        it("8.3 - triggers the patterns-injected-scanned event after the injected content has been scanned", async function () {
            const spy_ajax = jest.spyOn($, "ajax").mockImplementation(() => deferred);
            var $a = $('<a class="pat-inject" href="test.html#someid">link</a>');
            var $div = $('<div id="someid" />');
            $("#lab").empty().append($a).append($div);
            var callback = jest.fn();
            $(document).on("patterns-injected-scanned", callback);

            pattern.init($a);
            await utils.timeout(1); // wait a tick for async to settle.

            $a.trigger("click");
            answer(`
              <html>
                <body>
                  <div id="someid">
                    <div>repl</div>
                  </div>
                </body>
              </html>
            `);
            await utils.timeout(1); // wait a tick for async to settle.
            expect(callback).toHaveBeenCalled();

            spy_ajax.mockRestore();
        });

        it("8.4 - triggers the patterns-injected-delayed event 10ms after the injected content has been scanned", async function () {
            const spy_ajax = jest.spyOn($, "ajax").mockImplementation(() => deferred);
            var $a = $('<a class="pat-inject" href="test.html#someid">link</a>');
            var $div = $('<div id="someid" />');
            $("#lab").empty().append($a).append($div);
            var callback = jest.fn();
            $(document.body).on("patterns-injected-delayed", callback);

            pattern.init($a);
            await utils.timeout(1); // wait a tick for async to settle.

            $a.trigger("click");
            answer(`
              <html>
                <body>
                  <div id="someid">
                    <div>repl</div>
                  </div>
                </body>
              </html>
            `);
            await utils.timeout(1); // wait a tick for async to settle.
            expect(callback).not.toHaveBeenCalled();
            await utils.timeout(10); // wait a tick for async to settle.
            expect(callback).toHaveBeenCalled();

            spy_ajax.mockRestore();
        });

        it("8.5 - does not trigger the patterns-injected-scanned event for text nodes", async function () {
            const spy_ajax = jest.spyOn($, "ajax").mockImplementation(() => deferred);
            var $a = $('<a class="pat-inject" href="test.html#someid">link</a>');
            var $div = $('<div id="someid" />');
            $("#lab").empty().append($a).append($div);
            var callback = jest.fn();
            $(document).on("patterns-injected-scanned", callback);

            pattern.init($a);
            await utils.timeout(1); // wait a tick for async to settle.

            $a.trigger("click");
            answer(`
              <html>
                <body>
                  <div id="someid">
                    repl
                  </div>
                </body>
              </html>
            `);
            await utils.timeout(1); // wait a tick for async to settle.
            expect(callback).not.toHaveBeenCalled();

            spy_ajax.mockRestore();
        });

        it("8.6 - does not trigger the patterns-injected-scanned event for comment nodes", async function () {
            const spy_ajax = jest.spyOn($, "ajax").mockImplementation(() => deferred);
            var $a = $('<a class="pat-inject" href="test.html#someid">link</a>');
            var $div = $('<div id="someid" />');
            $("#lab").empty().append($a).append($div);
            var callback = jest.fn();
            $(document).on("patterns-injected-scanned", callback);

            pattern.init($a);
            await utils.timeout(1); // wait a tick for async to settle.

            $a.trigger("click");
            answer(`
              <html>
                <body>
                  <div id="someid">
                    <!-- repl -->
                  </div>
                </body>
              </html>
            `);
            await utils.timeout(1); // wait a tick for async to settle.
            expect(callback).not.toHaveBeenCalled();

            spy_ajax.mockRestore();
        });
    });

    describe("9 - DOM tests", function () {
        beforeEach(function () {});

        describe("9.1 - Injection on an anchor element", function () {
            var $a, $div;
            let spy_ajax;

            beforeEach(function () {
                spy_ajax = jest.spyOn($, "ajax").mockImplementation(() => deferred);
                $a = $('<a class="pat-inject" href="test.html#someid">link</a>');
                $div = $('<div id="someid" />');
                $("#lab").append($a).append($div);
            });

            afterEach(function () {
                spy_ajax.mockRestore();
            });

            it("9.1.1 - fetches url on click", async function () {
                pattern.init($a);
                await utils.timeout(1); // wait a tick for async to settle.

                $a.trigger("click");
                expect($.ajax).toHaveBeenCalled();
                expect($.ajax.mock.calls.pop()[0].url).toBe("test.html");
            });

            it("9.1.2 - fetches url on autoload", async function () {
                $a.attr("data-pat-inject", "autoload");
                pattern.init($a);
                await utils.timeout(1); // wait a tick for async to settle.

                expect($.ajax).toHaveBeenCalled();
                expect($.ajax.mock.calls.pop()[0].url).toBe("test.html");
            });

            it("9.1.3 - fetches url on autoload-delayed", async function () {
                $a.attr("data-pat-inject", "autoload-delayed");
                pattern.init($a);
                await utils.timeout(1); // wait a tick for async to settle.

                // this needs to be checked async - is beyond me
                // expect($.ajax).toHaveBeenCalled();
                // expect($.ajax.mock.calls.pop()[0].url).toBe("test.html");
            });
            it("9.1.4 - fetches url on push_marker sent", async function () {
                $a.attr("data-pat-inject", "push-marker: content-updated");
                pattern.init($a);
                await utils.timeout(1); // wait a tick for async to settle.

                $("body").trigger("push", ["content-updated"]);
                expect($.ajax).toHaveBeenCalled();
                expect($.ajax.mock.calls.pop()[0].url).toBe("test.html");
            });

            it("9.1.5 - injects into existing div", async function () {
                pattern.init($a);
                await utils.timeout(1); // wait a tick for async to settle.

                $a.trigger("click");
                answer('<html><body><div id="someid">replacement</div></body></html>');
                await utils.timeout(1); // wait a tick for async to settle.
                expect($div.html()).toBe("replacement");
            });

            it("9.1.6 - injects multiple times", async function () {
                pattern.init($a);
                await utils.timeout(1); // wait a tick for async to settle.

                $a.trigger("click");
                answer('<html><body><div id="someid">replacement</div></body></html>');
                await utils.timeout(1); // wait a tick for async to settle.
                expect($div.html()).toBe("replacement");

                // Deferred objects are supposed to be resolved only once.
                // This is a trick to force the second ajax() call to return a new Deferred().
                // It is only needed here, because this is the only test case that makes two ajax() calls.
                deferred = new $.Deferred();
                $.ajax.mockRestore();
                const spy_ajax2 = jest
                    .spyOn($, "ajax")
                    .mockImplementation(() => deferred);

                $a.trigger("click");
                answer(
                    '<html><body><div id="someid">new replacement</div></body></html>'
                );
                await utils.timeout(1); // wait a tick for async to settle.
                expect($div.html()).toBe("new replacement");

                spy_ajax2.mockRestore();
            });

            it("9.1.7 - takes multiple source-target pairs", async function () {
                $a.attr("data-pat-inject", "#someid1 #otherid1 && #someid2 #otherid2");
                var $target1 = $('<div id="otherid1" />'),
                    $target2 = $('<div id="otherid2" />');
                $div.append($target1).append($target2);

                pattern.init($a);
                await utils.timeout(1); // wait a tick for async to settle.

                $a.trigger("click");
                answer(
                    "<html><body>" +
                        '<div id="someid1">repl1</div>' +
                        '<div id="someid2">repl2</div>' +
                        "</body></html>"
                );
                await utils.timeout(1); // wait a tick for async to settle.

                expect($target1.html()).toBe("repl1");
                expect($target2.html()).toBe("repl2");
            });

            it("9.1.8 - acts on other selectors as well", async function () {
                $a.attr("data-pat-inject", "target: #someid > .someclass");
                var $target1 = $('<div class="someclass" />'),
                    $target2 = $('<div class="someclass" />');
                $div.append($target1).append($target2);

                pattern.init($a);
                await utils.timeout(1); // wait a tick for async to settle.

                $a.trigger("click");
                answer(
                    "<html><body>" + '<div id="someid">repl</div>' + "</body></html>"
                );
                await utils.timeout(1); // wait a tick for async to settle.

                expect($target1.html()).toBe("repl");
                expect($target2.html()).toBe("repl");
            });

            it("9.1.9 - copies into target if source has ::element", async function () {
                $a.attr("data-pat-inject", "#otherid::element #someid");

                pattern.init($a);
                await utils.timeout(1); // wait a tick for async to settle.

                $a.trigger("click");
                answer(
                    "<html><body>" +
                        '<div id="otherid" class="someclass">repl</div>' +
                        "</body></html>"
                );
                await utils.timeout(1); // wait a tick for async to settle.

                expect($div.children().attr("id")).toBe("otherid");
                expect($div.children().attr("class")).toBe("someclass");
            });

            it("9.1.10 - replaces target if both selectors have ::element", async function () {
                $a.attr("data-pat-inject", "#someid::element #otherid::element");
                $div.append($('<div id="otherid" />'));

                pattern.init($a);
                await utils.timeout(1); // wait a tick for async to settle.

                $a.trigger("click");
                answer(
                    "<html><body>" +
                        '<div id="someid" class="someclass">repl</div>' +
                        "</body></html>"
                );
                await utils.timeout(1); // wait a tick for async to settle.

                expect($div.children().attr("id")).toBe("someid");
                expect($div.children().attr("class")).toBe("someclass");
            });

            it("9.1.11 - allows ::before and ::after in target selector", async function () {
                $a.attr(
                    "data-pat-inject",
                    "target: #target1::after && target: #target2::before"
                );
                var $target1 = $('<div id="target1">content</div>'),
                    $target2 = $('<div id="target2">content</div>');
                $div.append($target1).append($target2);

                pattern.init($a);
                await utils.timeout(1); // wait a tick for async to settle.

                $a.trigger("click");
                answer(
                    "<html><body>" + '<div id="someid">repl</div>' + "</body></html>"
                );
                await utils.timeout(1); // wait a tick for async to settle.

                expect($target1.html()).toBe("contentrepl");
                expect($target2.html()).toBe("replcontent");
            });

            it("9.1.12 - allows mixing ::element and ::after in target", async function () {
                $a.attr("data-pat-inject", "target: #otherid::element::after");
                $div.append($('<div id="otherid" />'));

                pattern.init($a);
                await utils.timeout(1); // wait a tick for async to settle.

                $a.trigger("click");
                answer(
                    "<html><body>" + '<div id="someid">repl</div>' + "</body></html>"
                );
                await utils.timeout(1); // wait a tick for async to settle.

                expect($div.contents().last().text()).toBe("repl");
            });
        });

        describe("9.2 - inject on forms", function () {
            var $form, $div;
            let spy_ajax;

            beforeEach(function () {
                spy_ajax = jest.spyOn($, "ajax").mockImplementation(() => deferred);
                $form = $('<form class="pat-inject" action="test.html#someid" />');
                $div = $('<div id="someid" />');
                $("#lab").append($form).append($div);
            });

            afterEach(function () {
                spy_ajax.mockRestore();
            });

            it("9.2.1 - trigger injection on submit", async function () {
                pattern.init($form);
                await utils.timeout(1); // wait a tick for async to settle.

                $form.trigger("submit");
                answer(
                    "<html><body>" + '<div id="someid">repl</div>' + "</body></html>"
                );
                await utils.timeout(1); // wait a tick for async to settle.

                expect($div.html()).toBe("repl");
            });

            it("9.2.2 - pass get form parameters in ajax call as data", async function () {
                $form.attr("method", "get");
                $form.append($('<input type="text" name="param" value="somevalue" />'));

                pattern.init($form);
                await utils.timeout(1); // wait a tick for async to settle.

                $form.trigger("submit");

                var ajaxargs = $.ajax.mock.calls[$.ajax.mock.calls.length - 1][0];
                expect($.ajax).toHaveBeenCalled();
                expect(ajaxargs.data).toContain("param=somevalue");
            });

            it("9.2.3 - pass post form parameters in ajax call as data", async function () {
                $form.attr("method", "post");
                $form.append($('<input type="text" name="param" value="somevalue" />'));

                pattern.init($form);
                await utils.timeout(1); // wait a tick for async to settle.

                $form.trigger("submit");

                var ajaxargs = $.ajax.mock.calls[$.ajax.mock.calls.length - 1][0];
                expect($.ajax).toHaveBeenCalled();
                expect(ajaxargs.data.get("param")).toContain("somevalue");
            });

            describe("9.2.4 - submit button tests", function () {
                it("9.2.4.1 - pass submit button value in ajax call as data", async function () {
                    document.body.innerHTML = `
                        <form class="pat-inject" action="test.html#someid" method="post">
                            <input type="submit" name="submit" value="label" />
                        </form>
                    `;

                    const form = document.querySelector("form");
                    const submit = document.querySelector("input[type=submit]");

                    pattern.init($(form));
                    await utils.timeout(1); // wait a tick for async to settle.

                    submit.click();

                    const ajaxargs = $.ajax.mock.calls[$.ajax.mock.calls.length - 1][0];
                    expect($.ajax).toHaveBeenCalled();
                    expect(ajaxargs.data.get("submit")).toContain("label");
                });

                it("9.2.4.2 - pass submit button value in ajax call as data when clicked on a dom node within the submit button", async function () {
                    document.body.innerHTML = `
                        <form class="pat-inject" action="test.html#someid" method="post">
                            <button name="submit" value="label">
                                <span>label</span>
                            </button>
                        </form>
                    `;

                    const form = document.querySelector("form");
                    const label = document.querySelector("form button span");

                    pattern.init($(form));
                    await utils.timeout(1); // wait a tick for async to settle.

                    label.click();

                    const ajaxargs = $.ajax.mock.calls[$.ajax.mock.calls.length - 1][0];
                    expect($.ajax).toHaveBeenCalled();
                    expect(ajaxargs.data.get("submit")).toContain("label");
                });

                it("9.2.4.3 - Sends submit button form values even if submit button is added after initialization.", async function () {
                    document.body.innerHTML = `
                        <form class="pat-inject" action="test.cgi">
                        </form>
                    `;
                    const pat_ajax = (await import("../ajax/ajax.js")).default;
                    jest.spyOn(pat_ajax, "onClickSubmit");
                    jest.spyOn(pattern, "onTrigger");

                    const form = document.querySelector("form");

                    pattern.init($(form));
                    await utils.timeout(1); // wait a tick for async to settle.

                    form.innerHTML = `<button type="submit"/>`;
                    const button = form.querySelector("button");
                    button.click();

                    expect(pat_ajax.onClickSubmit).toHaveBeenCalledTimes(1);
                    expect(pattern.onTrigger).toHaveBeenCalledTimes(1);
                });

                describe("9.2.4.4 - formaction attribute on submit buttons", function () {
                    it("9.2.4.4.1 - use submit button formaction value as action URL", async function () {
                        var $submit1 = $(
                                '<input type="submit" name="submit" value="default" />'
                            ),
                            $submit2 = $(
                                '<input type="submit" name="submit" value="special" formaction="other.html" />'
                            );

                        $form.append($submit1).append($submit2);

                        pattern.init($form);
                        await utils.timeout(1); // wait a tick for async to settle.

                        $submit2[0].click();

                        var ajaxargs =
                            $.ajax.mock.calls[$.ajax.mock.calls.length - 1][0];
                        expect($.ajax).toHaveBeenCalled();
                        expect(ajaxargs.url).toBe("other.html");
                        expect(ajaxargs.data).toBe("submit=special");
                    });

                    it("9.2.4.4.2 - use an image submit with a formaction value as action URL", async function () {
                        const $submit = $(`
                            <input
                                type="image"
                                name="submit"
                                value="special"
                                formaction="other.html" />
                        `);

                        $form.append($submit);

                        pattern.init($form);
                        await utils.timeout(1); // wait a tick for async to settle.

                        // Work around jsDOM not submitting with image buttons.
                        $submit[0].addEventListener("click", async () => {
                            await utils.timeout(1); // wait a tick for click event reaching form before submitting.
                            $submit[0].form.dispatchEvent(
                                events.submit_event({ submitter: $submit[0] })
                            );
                        });

                        $submit[0].click();
                        await utils.timeout(1); // wait a tick for click handler

                        var ajaxargs =
                            $.ajax.mock.calls[$.ajax.mock.calls.length - 1][0];
                        expect($.ajax).toHaveBeenCalled();
                        expect(ajaxargs.url).toBe("other.html");
                        expect(ajaxargs.data).toBe("submit=special");
                    });

                    it("9.2.4.4.3 - use fragment in formaction value as source + target selector", async function () {
                        var $submit1 = $(
                                '<input type="submit" name="submit" value="default" />'
                            ),
                            $submit2 = $(
                                '<input type="submit" name="submit" value="special" formaction="other.html#otherid" />'
                            ),
                            $target = $('<div id="otherid" />');

                        $form.append($submit1).append($submit2);
                        $div.append($target);

                        pattern.init($form);
                        await utils.timeout(1); // wait a tick for async to settle.

                        $submit2[0].click();

                        answer(
                            "<html><body>" +
                                '<div id="otherid">other</div>' +
                                "</body></html>"
                        );
                        await utils.timeout(1); // wait a tick for async to settle.

                        var ajaxargs =
                            $.ajax.mock.calls[$.ajax.mock.calls.length - 1][0];
                        expect($.ajax).toHaveBeenCalled();
                        expect(ajaxargs.url).toBe("other.html");
                        expect(ajaxargs.data).toContain("submit=special");
                        expect($target.html()).toBe("other");
                    });

                    it("9.2.4.4.4 - use fragment in formaction value as source selector, respect target", async function () {
                        var $submit1 = $(
                                '<input type="submit" name="submit" value="default" />'
                            ),
                            $submit2 = $(
                                '<input type="submit" name="submit" value="special" formaction="other.html#otherid" />'
                            ),
                            $target = $('<div id="othertarget" />');

                        $form.attr("data-pat-inject", "target: #othertarget");
                        $form.append($submit1).append($submit2);
                        $div.append($target);

                        pattern.init($form);
                        await utils.timeout(1); // wait a tick for async to settle.

                        $submit2[0].click();

                        answer(
                            "<html><body>" +
                                '<div id="otherid">other</div>' +
                                "</body></html>"
                        );
                        await utils.timeout(1); // wait a tick for async to settle.

                        var ajaxargs =
                            $.ajax.mock.calls[$.ajax.mock.calls.length - 1][0];
                        expect($.ajax).toHaveBeenCalled();
                        expect(ajaxargs.url).toBe("other.html");
                        expect(ajaxargs.data).toContain("submit=special");
                        expect($target.html()).toBe("other");
                    });

                    it("9.2.4.4.5 - formaction works with multiple targets", async function () {
                        var $submit1 = $(
                                '<input type="submit" name="submit" value="default" />'
                            ),
                            $submit2 = $(
                                '<input type="submit" name="submit" value="special" formaction="other.html#otherid" />'
                            ),
                            $target1 = $('<div id="target1" />'),
                            $target2 = $('<div id="target2" />');

                        $form.attr(
                            "data-pat-inject",
                            "target: #target1 && target: #target2"
                        );
                        $form.append($submit1).append($submit2);
                        $div.append($target1).append($target2);

                        pattern.init($form);
                        await utils.timeout(1); // wait a tick for async to settle.

                        $submit2[0].click();

                        answer(
                            "<html><body>" +
                                '<div id="otherid">other</div>' +
                                "</body></html>"
                        );
                        await utils.timeout(1); // wait a tick for async to settle.

                        var ajaxargs =
                            $.ajax.mock.calls[$.ajax.mock.calls.length - 1][0];
                        expect($.ajax).toHaveBeenCalled();
                        expect(ajaxargs.url).toBe("other.html");
                        expect(ajaxargs.data).toContain("submit=special");
                        expect($target1.html()).toBe("other");
                        expect($target2.html()).toBe("other");
                    });

                    it("9.2.4.4.6 - formaction works with multiple sources", async function () {
                        var $submit1 = $(
                                '<input type="submit" name="submit" value="default" />'
                            ),
                            $submit2 = $(
                                '<input type="submit" name="submit" value="special" formaction="other.html#otherid" />'
                            ),
                            $target1 = $('<div id="target1" />'),
                            $target2 = $('<div id="target2" />');

                        $form.attr(
                            "data-pat-inject",
                            "#someid #target1 && #otherid #target2"
                        );
                        $form.append($submit1).append($submit2);
                        $div.append($target1).append($target2);

                        pattern.init($form);
                        await utils.timeout(1); // wait a tick for async to settle.

                        $submit2[0].click();

                        answer(
                            "<html><body>" +
                                '<div id="someid">some</div>' +
                                '<div id="otherid">other</div>' +
                                "</body></html>"
                        );
                        await utils.timeout(1); // wait a tick for async to settle.

                        var ajaxargs =
                            $.ajax.mock.calls[$.ajax.mock.calls.length - 1][0];
                        expect($.ajax).toHaveBeenCalled();
                        expect(ajaxargs.url).toBe("other.html");
                        expect(ajaxargs.data).toContain("submit=special");
                        expect($target1.html()).toBe("some");
                        expect($target2.html()).toBe("other");
                    });

                    it("9.2.4.4.7 - formaction works source and target on the button", async function () {
                        var $submit1 = $(
                                '<input type="submit" name="submit" value="default" />'
                            ),
                            $submit2 = $(
                                '<input type="submit" name="submit" value="special" formaction="other.html#otherid" />'
                            ),
                            $target1 = $('<div id="target1" />'),
                            $target2 = $('<div id="target2" />');

                        $submit2.attr(
                            "data-pat-inject",
                            "#someid #target1 && #otherid #target2"
                        );
                        $form.append($submit1).append($submit2);
                        $div.append($target1).append($target2);

                        pattern.init($form);
                        await utils.timeout(1); // wait a tick for async to settle.

                        $submit2[0].click();

                        answer(
                            "<html><body>" +
                                '<div id="someid">some</div>' +
                                '<div id="otherid">other</div>' +
                                "</body></html>"
                        );
                        await utils.timeout(1); // wait a tick for async to settle.

                        var ajaxargs =
                            $.ajax.mock.calls[$.ajax.mock.calls.length - 1][0];
                        expect($.ajax).toHaveBeenCalled();
                        expect(ajaxargs.url).toBe("other.html");
                        expect(ajaxargs.data).toContain("submit=special");
                        expect($target1.html()).toBe("some");
                        expect($target2.html()).toBe("other");
                    });

                    it("9.2.4.4.8 - formaction which replaces itself", async () => {
                        answer(`
                            <html>
                                <body>
                                    <div id="someid">some</div>
                                    <div id="otherid">other</div>
                                </body>
                            </html>
                        `);

                        document.body.innerHTML = `
                            <div id="oha">form inject target</div>
                            <form
                                class="pat-inject"
                                data-pat-inject="target:#oha;source:#id1">
                              <button
                                  type="submit"
                                  formaction="test.cgi"
                                  class="pat-inject"
                                  data-pat-inject="target:self::element;source:#otherid"
                                  />
                            </form>
                        `;

                        pattern.init($("form"));
                        await utils.timeout(1); // wait a tick for async to settle.

                        document.querySelector("form button").click();
                        await utils.timeout(1); // wait a tick for async to settle.

                        expect(document.querySelector("form").innerHTML.trim()).toBe(
                            "other"
                        );
                    });

                    it("9.2.4.4.9 - nested injects keep correct configuration context", async () => {
                        answer(`
                            <html>
                                <body>
                                    <div id="someid">some</div>
                                    <div id="otherid">other</div>
                                </body>
                            </html>
                        `);

                        document.body.innerHTML = `
                            <form class="pat-inject">
                                <span class="pat-inject" data-pat-inject="target:self; source:#otherid">
                                    <button type="submit" formaction="test.cgi"/>
                                </span>
                            </form>
                        `;

                        pattern.init($("form"));
                        await utils.timeout(1); // wait a tick for async to settle.

                        document.querySelector("form button").click();
                        await utils.timeout(1); // wait a tick for async to settle.

                        expect(
                            document.querySelector("form span").innerHTML.trim()
                        ).toBe("other");
                    });

                    it("9.2.4.4.10 - does not call ajax.onClickSubmit twice.", async function () {
                        document.body.innerHTML = `
                            <form class="pat-inject">
                                <button type="submit" formaction="test.cgi"/>
                            </form>
                        `;

                        const pat_ajax = (await import("../ajax/ajax.js")).default;
                        jest.spyOn(pat_ajax, "onClickSubmit");

                        const form = document.querySelector("form");
                        const button = form.querySelector("button");

                        pattern.init($(form));
                        await utils.timeout(1); // wait a tick for async to settle.

                        button.click();

                        expect(pat_ajax.onClickSubmit).toHaveBeenCalledTimes(1);
                    });
                });

                describe("9.2.4.5 - Support submit buttons without type attribute ...", () => {
                    it("9.2.4.5.1 - ... without a formaction atttribute.", async function () {
                        document.body.innerHTML = `
                            <form class="pat-inject" action="test.cgi">
                                <button/>
                            </form>
                        `;

                        const pat_ajax = (await import("../ajax/ajax.js")).default;
                        jest.spyOn(pat_ajax, "onClickSubmit");
                        jest.spyOn(pattern, "onTrigger");

                        const form = document.querySelector("form");
                        const button = form.querySelector("button");

                        pattern.init($(form));
                        await utils.timeout(1); // wait a tick for async to settle.

                        button.click();

                        expect(pat_ajax.onClickSubmit).toHaveBeenCalledTimes(1);
                        expect(pattern.onTrigger).toHaveBeenCalledTimes(1);
                    });

                    it("9.2.4.5.2 - ... with a formaction atttribute.", async function () {
                        document.body.innerHTML = `
                            <form class="pat-inject">
                                <button formaction="test.cgi"/>
                            </form>
                        `;

                        const pat_ajax = (await import("../ajax/ajax.js")).default;
                        jest.spyOn(pat_ajax, "onClickSubmit");
                        jest.spyOn(pattern, "onTrigger");

                        const form = document.querySelector("form");
                        const button = form.querySelector("button");

                        pattern.init($(form));
                        await utils.timeout(1); // wait a tick for async to settle.

                        button.click();

                        expect(pat_ajax.onClickSubmit).toHaveBeenCalledTimes(1);
                        expect(pattern.onTrigger).toHaveBeenCalledTimes(1);
                    });
                });

                describe("9.2.4.6 - Validation on submit", () => {
                    it("9.2.4.6.1 - Submit valid forms.", async function () {
                        document.body.innerHTML = `
                          <form action="." class="pat-inject">
                            <input name="ok" />
                            <button>submit</button>
                          </form>
                        `;
                        jest.spyOn(pattern, "execute");

                        const form = document.querySelector("form");
                        const button = form.querySelector("button");

                        // add submit listener
                        let catched = false;
                        form.addEventListener("submit", () => {
                            catched = true;
                        });

                        pattern.init($(form));
                        await utils.timeout(1); // wait a tick for async to settle.

                        button.click();

                        expect(catched).toBe(true);
                        expect(pattern.execute).toHaveBeenCalled();
                    });

                    it("9.2.4.6.2 - Do not submit invalid forms.", async function () {
                        document.body.innerHTML = `
                          <form action="." class="pat-inject">
                            <input name="ok" required />
                            <button>submit</button>
                          </form>
                        `;
                        jest.spyOn(pattern, "execute");

                        const form = document.querySelector("form");
                        const button = form.querySelector("button");

                        // add submit listener
                        let catched = false;
                        form.addEventListener("submit", () => {
                            catched = true;
                        });

                        pattern.init($(form));
                        await utils.timeout(1); // wait a tick for async to settle.

                        button.click();

                        expect(catched).toBe(false);
                        expect(pattern.execute).not.toHaveBeenCalled();
                    });

                    it("9.2.4.6.3 - Respect a form novalidate attribute and allow submission.", async function () {
                        document.body.innerHTML = `
                          <form novalidate action="." class="pat-inject">
                            <input name="ok" required />
                            <button>submit</button>
                          </form>
                        `;
                        jest.spyOn(pattern, "execute");

                        const form = document.querySelector("form");
                        const button = form.querySelector("button");

                        // add submit listener
                        let catched = false;
                        form.addEventListener("submit", () => {
                            catched = true;
                        });

                        pattern.init($(form));
                        await utils.timeout(1); // wait a tick for async to settle.

                        button.click();

                        expect(catched).toBe(true);
                        expect(pattern.execute).toHaveBeenCalled();
                    });

                    // The following test does not work with jsDOM 25.0.1.
                    // jsDOM supports `form[novalidate]` but not `button[formnovalidate]`
                    // Ref: https://github.com/jsdom/jsdom/pull/3249
                    it.skip("9.2.4.6.4 - Respect a formnovalidate attribute on buttons and allow submission.", async function () {
                        document.body.innerHTML = `
                          <form action="." class="pat-inject">
                            <input name="ok" required />
                            <button class="cancel" formnovalidate>cancel</button>
                            <button class="submit">submit</button>
                          </form>
                        `;
                        jest.spyOn(pattern, "execute");

                        const form = document.querySelector("form");
                        const button_cancel = form.querySelector("button.cancel");
                        const button_submit = form.querySelector("button.submit");

                        // add submit listener
                        let catched = false;
                        form.addEventListener("submit", () => {
                            catched = true;
                        });

                        pattern.init($(form));
                        await utils.timeout(1); // wait a tick for async to settle.

                        button_submit.click();

                        expect(catched).toBe(false);
                        expect(pattern.execute).not.toHaveBeenCalled();

                        button_cancel.click();

                        expect(catched).toBe(true);
                        expect(pattern.execute).toHaveBeenCalled();

                    });

                });
            });
        });

        describe("9.3 - inject with not existing target element", function () {
            let spy_ajax;

            beforeEach(function () {
                spy_ajax = jest.spyOn($, "ajax").mockImplementation(() => deferred);
            });

            afterEach(function () {
                spy_ajax.mockRestore();
            });

            it("9.3.1 - Create non-existing target", async function () {
                // Test a real-world scenario with modals where the target
                // element does not exist and the source is implicitly defined
                // via the href attribue.
                // NOTE: pat-modal does the injecton part on it's own, so you
                // normally use the `pat-modal` class and do not specify a
                // target.
                // For examples, see the pat-modal pattern.

                document.body.innerHTML = `
                    <a class="pat-inject"
                       href="test.html#document-content"
                       data-pat-inject="target: #pat-modal">link</a>
                `;

                answer(`
                    <html>
                        <body>
                            <div id="document-content">
                                <dialog>
                                    <h1>hello</h1>
                                </dialog>
                            </div>
                        </body>
                    </html>
                `);

                const inject = document.querySelector(".pat-inject");

                pattern.init($(inject));
                await utils.timeout(1); // wait a tick for async to settle.

                inject.click();

                await utils.timeout(1); // wait a tick for async to settle.

                console.log(document.body.innerHTML);
                const modal = document.querySelector("#pat-modal");
                expect(modal).toBeTruthy();
                expect(modal.innerHTML.replace(/\s/g, "")).toBe(
                    "<dialog><h1>hello</h1></dialog>"
                );
            });

            it("9.3.2 - Does not create non-existing target without a target specifier", async function () {
                document.body.innerHTML = `
                    <a class="pat-inject"
                       href="test.html#document-content">link</a>
                `;

                answer(`
                    <html>
                        <body>
                            <div id="document-content">
                                <dialog>
                                    <h1>hello</h1>
                                </dialog>
                            </div>
                        </body>
                    </html>
                `);

                const inject = document.querySelector(".pat-inject");

                pattern.init($(inject));
                await utils.timeout(1); // wait a tick for async to settle.

                inject.click();

                await utils.timeout(1); // wait a tick for async to settle.

                console.log(document.body.innerHTML);
                const modal = document.querySelector("#pat-modal");
                expect(modal).toBeFalsy();
            });
        });

    });

    describe("10 - Error handling", () => {
        let $a;
        let spy_ajax;

        beforeEach(() => {
            spy_ajax = jest.spyOn($, "ajax").mockImplementation(() => deferred);
            document.body.innerhtml = `
              <div id="lab">
                <a class="pat-inject" href="test.html#someid">link</a>
                <div id="someid" />
              </div>
            `;
            $a = $(".pat-inject");
        });

        afterEach(() => {
            document.head.innerHTML = "";
            document.body.innerHTML = "";
            spy_ajax.mockRestore();
        });

        it("10.1 - Adds on error a data-error-message to body in standard case.", async () => {
            pattern.init($a);
            await utils.timeout(1); // wait a tick for async to settle.

            // Invoke error case
            pattern._onInjectError($a, [], {
                jqxhr: { status: 404 },
            });
            await utils.timeout(1); // wait a tick for async to settle.

            expect(document.body.querySelector("#lab")).toBeTruthy();
            // In this case, the normal error reporting is used
            expect(document.body.hasAttribute("data-error-message")).toBeTruthy();
        });

        it("10.2 - Gets error page from meta tags", async () => {
            global.fetch = jest.fn().mockImplementation(
                mockFetch(`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <title>404</title>
                          </head>
                          <body>
                            <h1>oh-nose!</h1>
                          </body>
                        </html>
                    `)
            );

            // apparently <head> is empty if we do not set it.
            document.head.innerHTML = `
                <meta name="pat-inject-status-404" content="/404.html" />
            `;

            pattern.init($a);
            await utils.timeout(1); // wait a tick for async to settle.

            // Invoke error case
            pattern._onInjectError($a, [], {
                jqxhr: { status: 404 },
            });
            await utils.timeout(1); // wait a tick for async to settle.

            expect(document.body.innerHTML.trim()).toEqual("<h1>oh-nose!</h1>");

            global.fetch.mockClear();
            delete global.fetch;
        });

        it("10.3 - Removes loading and executing classes.", async () => {
            document.body.innerHTML = `
              <a
                  class="pat-inject i-am-executing"
                  href="test.html"
              >link</a>
              <div id="someid" class="i-am-loading" />
            `;

            $a = $(".pat-inject");

            pattern.init($a);
            await utils.timeout(1); // wait a tick for async to settle.

            // Invoke error case
            pattern._onInjectError(
                $a,
                [
                    {
                        $target: $("#someid"),
                        loadingClass: "i-am-loading",
                        executingClass: "i-am-executing",
                    },
                ],
                {
                    jqxhr: { status: 404 },
                }
            );
            await utils.timeout(1); // wait a tick for async to settle.

            expect(document.querySelector(".pat-inject").getAttribute("class")).toEqual("pat-inject"); // prettier-ignore
            expect(document.querySelector("#someid").getAttribute("class")).toEqual("");
        });

        it("10.4 - Doesnt get error page from meta tags if query string present", async () => {
            const _window_location = global.window.location;
            delete global.window.location;
            global.window.location = {
                search: "?something=nothing&pat-inject-errorhandler.off",
            };

            global.fetch = jest.fn().mockImplementation(
                mockFetch(`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <title>404</title>
                          </head>
                          <body>
                            <h1>oh-nose!</h1>
                          </body>
                        </html>
                    `)
            );

            // apparently <head> is empty if we do not set it.
            document.head.innerHTML = `
                <meta name="pat-inject-status-404" content="/404.html" />
            `;

            pattern.init($a);
            await utils.timeout(1); // wait a tick for async to settle.

            // Invoke error case
            pattern._onInjectError($a, [], {
                jqxhr: { status: 404 },
            });
            await utils.timeout(1); // wait a tick for async to settle.

            expect(document.body.querySelector("#lab")).toBeTruthy();
            // In this case, the normal error reporting is used
            expect(document.body.hasAttribute("data-error-message")).toBeTruthy();

            global.fetch.mockClear();
            delete global.fetch;
            global.window.location = _window_location;
        });

        it("10.5 - Injects an error message from the error response.", async () => {
            // In this test the error message from the error reponse is used instead of the error template.
            // No need to mock fetch which would get the error template.

            // Configure fallback error page with a error zone selector #error-message
            document.head.innerHTML = `
                <meta name="pat-inject-status-404" content="/404.html#error-message" />
            `;

            // Add body with a error zone (#error-message)
            document.body.innerHTML = `
                <a class="pat-inject" href="test.html#someid">link</a>
                <div id="error-message"></div>
            `;

            $a = $(".pat-inject");

            pattern.init($a);
            await utils.timeout(1); // wait a tick for async to settle.

            // Invoke error case
            pattern._onInjectError($a, [], {
                jqxhr: {
                    status: 404,
                    responseText: `
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <title>404</title>
                        </head>
                        <body>
                          <section id="error-message">
                              <h1>oh no, what did you do?!</h1>
                          </section>
                        </body>
                      </html>
                    `,
                },
            });
            await utils.timeout(1); // wait a tick for async to settle.

            expect(document.querySelector("#error-message").innerHTML.trim()).toEqual(
                "<h1>oh no, what did you do?!</h1>"
            );
        });

        it("10.6 - Injects an error message from the error template.", async () => {
            // Let the error response contain a error zone section with an ID as configured further below.
            global.fetch = jest.fn().mockImplementation(
                mockFetch(`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <title>404</title>
                    </head>
                    <body>
                      <section id="error-message">
                          <h1>this is a message from your operator.</h1>
                      </section>
                    </body>
                  </html>
                `)
            );

            // Configure fallback error page with a error zone selector #error-message
            document.head.innerHTML = `
                <meta name="pat-inject-status-404" content="/404.html#error-message"/>
            `;

            // Add body with a error zone (#error-message)
            document.body.innerHTML = `
                <a class="pat-inject" href="test.html#someid">link</a>
                <div id="error-message"></div>
            `;

            $a = $(".pat-inject");

            pattern.init($a);
            await utils.timeout(1); // wait a tick for async to settle.

            // Invoke error case
            pattern._onInjectError($a, [], {
                jqxhr: {
                    status: 404,
                    responseText: `
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <title>404</title>
                        </head>
                        <body>
                          <section id="error-message-not-to-be-found">
                              <h1>oh no, what did you do?!</h1>
                          </section>
                        </body>
                      </html>
                    `,
                },
            });
            await utils.timeout(1); // wait a tick for async to settle.

            expect(document.querySelector("#error-message").innerHTML.trim()).toEqual(
                "<h1>this is a message from your operator.</h1>"
            );

            global.fetch.mockClear();
            delete global.fetch;
        });

        it("10.7 - Falls back to data-error-message attribute if no error page can be found.", async () => {
            global.fetch = jest.fn().mockImplementation(mockFetch(""));

            // Configure fallback error page with a error zone selector #error-message
            document.head.innerHTML = `
                <meta name="pat-inject-status-404" content="/404.html#error-message"/>
            `;

            // Add body with a error zone (#error-message)
            document.body.innerHTML = `
                <a class="pat-inject" href="test.html#someid">link</a>
                <div id="error-message"></div>
            `;

            $a = $(".pat-inject");

            pattern.init($a);
            await utils.timeout(1); // wait a tick for async to settle.

            // Invoke error case
            pattern._onInjectError($a, [], {
                jqxhr: {
                    status: 404,
                    responseText: "",
                },
            });
            await utils.timeout(1); // wait a tick for async to settle.

            expect(document.querySelector("#error-message").innerHTML.trim()).toEqual(
                ""
            );

            expect(document.body.hasAttribute("data-error-message")).toBeTruthy();

            global.fetch.mockClear();
            delete global.fetch;
        });
    });

    describe("11 - Test triggers", function () {
        afterEach(function () {
            document.body.innerHTML = "";
            delete global.__patternslib_test_intersection_observers;
        });

        it("11.1 - Test trigger: autoload-visible, delay 10ms", async () => {
            // Note, as we are heavily mocking the IntersectionObserver we are
            // actually not testing if a trigger is really run when an element
            // becomes visible.
            // Instead we test the setup, loading, unregistration, etc.

            const spy_ajax = jest.spyOn($, "ajax").mockImplementation(() => deferred);
            answer("<html><body>OK</body></html>");

            document.body.innerHTML = `
                <a class="pat-inject"
                    href="test.html"
                    data-pat-inject="
                        delay: 10;
                        target: self;
                        trigger: autoload-visible">test</a>
            `;
            const el = document.querySelector(".pat-inject");

            pattern.init($(el));
            await utils.timeout(1);

            // Get the observer
            const observer = global.__patternslib_test_intersection_observers[0];

            // The observer callback is called once by just initializing.
            expect(observer._cnt).toBe(1);

            // Let's pretend the element is not yet visible.
            observer._set_entry(false);
            await utils.timeout(1);
            expect(observer._cnt).toBe(2);
            expect(el.textContent).toBe("test");

            // Let's pretend the element is now visible.
            observer._set_entry(true);
            await utils.timeout(1);
            expect(observer._cnt).toBe(3);
            expect(el.textContent).toBe("test"); // delay time not yet passed
            await utils.timeout(10); // delay time passed
            expect(el.textContent).toBe("OK");

            // Reset text content to something else
            el.textContent = "NOT";

            // Let's pretend the element is visible.
            // Re-setting does not call the intersection observer anymore.
            observer._set_entry(true);
            await utils.timeout(1);
            expect(observer._cnt).toBe(3);
            await utils.timeout(10); // wait for delay-time
            expect(el.textContent).toBe("NOT");

            spy_ajax.mockRestore();
        });

        it("11.2 - Test trigger: autoload-visible, default delay time", async () => {
            const spy_ajax = jest.spyOn($, "ajax").mockImplementation(() => deferred);
            answer("<html><body>OK</body></html>");

            document.body.innerHTML = `
                <a class="pat-inject"
                    href="test.html"
                    data-pat-inject="
                        target: self;
                        trigger: autoload-visible">test</a>
            `;
            const el = document.querySelector(".pat-inject");

            pattern.init($(el));
            await utils.timeout(1);

            // Get the observer
            const observer = global.__patternslib_test_intersection_observers[0];

            // The observer callback is called once by just initializing.
            expect(observer._cnt).toBe(1);

            observer._set_entry(true);
            await utils.timeout(1);
            expect(observer._cnt).toBe(2);
            await utils.timeout(100);
            expect(el.textContent).toBe("test"); // delay time not yet passed
            await utils.timeout(100); // delay time passed, default is 200ms
            expect(el.textContent).toBe("OK");

            spy_ajax.mockRestore();
        });

        it("11.3 - Test trigger: submit with auto-submit", async () => {
            const PatAutoSubmit = (await import("../auto-submit/auto-submit.js"))
                .default;
            document.body.innerHTML = `
              <form
                  class="pat-inject pat-autosubmit"
                  data-pat-autosubmit="delay: 0"
              >
                <input
                    type="text"
                    name="q"
                />
              </form>
            `;

            const form = document.querySelector("form");
            const input = document.querySelector("input");

            const spy_trigger = jest.spyOn(pattern, "onTrigger");

            pattern.init($(form));
            await utils.timeout(1);
            new PatAutoSubmit(form);

            expect(spy_trigger).not.toHaveBeenCalled();

            input.dispatchEvent(events.input_event());

            expect(spy_trigger).toHaveBeenCalled();

            spy_trigger.mockRestore();
        });
    });

    describe("12 - caching", () => {
        afterEach(function () {
            document.body.innerHTML = "";
        });

        it("12.1 - does not cache by default", async function () {
            const spy_ajax = jest.spyOn($, "ajax");
            document.body.innerHTML = `<a
                href="hello.html"
                class="pat-inject"
                />`;

            registry.scan(document.body);
            await utils.timeout(1);

            document.body.querySelector(".pat-inject").click();
            const ajaxargs = spy_ajax.mock.calls[spy_ajax.mock.calls.length - 1][0];
            expect(ajaxargs.cache).toBe(false);
            spy_ajax.mockRestore();
        });

        it("12.2 - does not cache when explicitly set", async function () {
            const spy_ajax = jest.spyOn($, "ajax");
            document.body.innerHTML = `<a
                href="hello.html"
                class="pat-inject"
                data-pat-inject="browser-cache: no-cache"
                />`;

            registry.scan(document.body);
            await utils.timeout(1);

            document.body.querySelector(".pat-inject").click();
            const ajaxargs = spy_ajax.mock.calls[spy_ajax.mock.calls.length - 1][0];
            expect(ajaxargs.cache).toBe(false);
            spy_ajax.mockRestore();
        });

        it("12.3 - does cache when explicitly set", async function () {
            const spy_ajax = jest.spyOn($, "ajax");
            document.body.innerHTML = `<a
                href="hello.html"
                class="pat-inject"
                data-pat-inject="browser-cache: cache"
                />`;

            registry.scan(document.body);
            await utils.timeout(1);

            document.body.querySelector(".pat-inject").click();
            const ajaxargs = spy_ajax.mock.calls[spy_ajax.mock.calls.length - 1][0];
            expect(ajaxargs.cache).toBe(true);
            spy_ajax.mockRestore();
        });

        it("12.4 - does not cache on POST forms, regardless of the setting", async function () {
            const spy_ajax = jest.spyOn($, "ajax");
            document.body.innerHTML = `<form
                class="pat-inject"
                action="submit.html"
                method="POST"
                data-pat-ajax="browser-cache: cache"
                />`;

            registry.scan(document.body);
            await utils.timeout(1);

            document.querySelector(".pat-inject").dispatchEvent(events.submit_event());
            const ajaxargs = spy_ajax.mock.calls[spy_ajax.mock.calls.length - 1][0];
            expect(ajaxargs.cache).toBe(false);
            spy_ajax.mockRestore();
        });
    });
});

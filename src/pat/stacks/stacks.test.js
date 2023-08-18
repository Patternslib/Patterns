import $ from "jquery";
import events from "../../core/events";
import Stacks from "./stacks";
import utils from "../../core/utils";
import { jest } from "@jest/globals";

describe("pat-stacks", function () {
    beforeEach(function () {
        $("<div/>", { id: "lab" }).appendTo(document.body);
    });

    afterEach(function () {
        $("#lab").remove();
    });

    describe("1 - _base_URL", function () {
        it("1.1 - URL without fragment", async function () {
            const $el = $('<div class="pat-stacks"></div>');
            const pattern = new Stacks($el[0]);
            await events.await_pattern_init(pattern);
            pattern.document = { URL: document.URL };
            pattern.document.URL = "http://www.example.com/folder/file.png";
            expect(pattern._base_URL()).toBe("http://www.example.com/folder/file.png");
        });

        it("1.2 - URL with fragment", async function () {
            const $el = $('<div class="pat-stacks"></div>');
            const pattern = new Stacks($el[0]);
            await events.await_pattern_init(pattern);
            pattern.document = { URL: document.URL };
            pattern.document.URL = "http://www.example.com/folder/file.png#fragment";
            expect(pattern._base_URL()).toBe("http://www.example.com/folder/file.png");
        });
    });

    describe("2 - _currentFragment", function () {
        it("2.1 - without fragment", async function () {
            const $el = $('<div class="pat-stacks"></div>');
            const pattern = new Stacks($el[0]);
            await events.await_pattern_init(pattern);
            pattern.document = { URL: document.URL };
            pattern.document.URL = "http://www.example.com/folder/file.png";
            expect(pattern._currentFragment()).toBeNull();
        });

        it("2.2 - URL with fragment", async function () {
            const $el = $('<div class="pat-stacks"></div>');
            const pattern = new Stacks($el[0]);
            await events.await_pattern_init(pattern);
            pattern.document = { URL: document.URL };
            pattern.document.URL = "http://www.example.com/folder/file.png#fragment";
            expect(pattern._currentFragment()).toBe("fragment");
        });
    });

    describe("3 - The _onClick method", function () {
        beforeEach(function () {
            $("#lab").html(
                "<a id='l1' href='#s1'>1</a><a id='l2' href='#s2'>2</a>" +
                    "<article class='pat-stacks' id='stack'><section id='s1'></section><section id='s2'></section></article>"
            );
        });

        it("3.1 - gets triggered when you click on an external link", async function () {
            const e = { currentTarget: { href: "http://other.domain#s1" } };
            const pattern = new Stacks($(".pat-stacks")[0]);
            await events.await_pattern_init(pattern);
            const spy_update = jest.spyOn(pattern, "_updateAnchors");
            pattern._onClick(e);
            expect(spy_update).not.toHaveBeenCalled();
        });

        it("3.2 - gets triggered when you click on a link without fragment", async function () {
            const pattern = new Stacks($(".pat-stacks")[0]);
            await events.await_pattern_init(pattern);
            pattern.document = { URL: document.URL };
            pattern.document.URL = "http://www.example.com";
            const e = { currentTarget: { href: "http://www.example.com" } };
            const spy_update = jest.spyOn(pattern, "_updateAnchors");
            pattern._onClick(e);
            expect(spy_update).not.toHaveBeenCalled();
        });

        it("3.3 - gets tirggered when you click on a non-stack link", async function () {
            const pattern = new Stacks($(".pat-stacks")[0]);
            await events.await_pattern_init(pattern);
            pattern.document = { URL: document.URL };
            pattern.document.URL = "http://www.example.com";
            const e = {
                currentTarget: { href: "http://www.example.com#other" },
            };
            const spy_update = jest.spyOn(pattern, "_updateAnchors");
            pattern._onClick(e);
            expect(spy_update).not.toHaveBeenCalled();
        });

        it("3.4 - gets called when you click on the stack link", async function () {
            const pattern = new Stacks($(".pat-stacks")[0]);
            await events.await_pattern_init(pattern);
            pattern.document = { URL: document.URL };
            pattern.document.URL = "http://www.example.com";
            const e_mock = {
                preventDefault: () => {},
                currentTarget: { href: "http://www.example.com#s1" },
            };
            jest.spyOn(e_mock, "preventDefault");
            const spy_update = jest.spyOn(pattern, "_updateAnchors");
            const spy_switch = jest.spyOn(pattern, "_switch");
            pattern._onClick(e_mock);
            expect(e_mock.preventDefault).toHaveBeenCalled();
            expect(spy_update).toHaveBeenCalled();
            expect(spy_switch).toHaveBeenCalled();
        });

        it("3.5 - triggers a pat-update event, which other patterns can listen for", async function () {
            const $el = $(".pat-stacks");
            const pattern = new Stacks($el[0]);
            await events.await_pattern_init(pattern);
            pattern.document = { URL: document.URL };
            pattern.document.URL = "http://www.example.com";

            let data = null;
            $el.on("pat-update", (e, d) => {
                data = d;
            });

            const e = {
                target: $el,
                type: "click",
                preventDefault: function () {},
                currentTarget: { href: "http://www.example.com#s1" },
            };
            pattern._onClick(e);

            expect(data.pattern).toBe("stacks");
            expect(data.action).toBe("attribute-changed");
            expect(data.dom).toBe($el[0].querySelector("#s1"));
        });
    });

    describe("4 - The _updateAnchors method", function () {
        beforeEach(function () {
            $("#lab").html(
                "<a id='l1' href='#s1'>1</a><a id='l2' href='#s2'>2</a>" +
                    "<article class='pat-stacks' id='stack'><section id='s1'></section><section id='s2'></section></article>"
            );
        });

        it("4.1 - adds a selected class", async function () {
            const $container = $("#stack");
            const pattern = new Stacks($container[0]);
            await events.await_pattern_init(pattern);
            pattern._updateAnchors("s1");
            expect($("#l1").hasClass("current")).toBe(true);
            expect($("#l2").hasClass("current")).toBe(false);
        });

        it("4.2 - removes a selected class", async function () {
            const $container = $("#stack");
            const pattern = new Stacks($container[0]);
            await events.await_pattern_init(pattern);
            $("#l1").addClass("selected");
            pattern._updateAnchors("s2");
            expect($("#l1").hasClass("current")).toBe(false);
            expect($("#l2").hasClass("current")).toBe(true);
        });
    });

    describe("5 - Scrolling support.", function () {
        beforeEach(function () {
            document.body.innerHTML = "";
            this.spy_scrollTo = jest
                .spyOn(window, "scrollTo")
                .mockImplementation(() => null);
        });

        afterEach(function () {
            this.spy_scrollTo.mockRestore();
        });

        it("5.1 - Scrolls to self.", async function () {
            document.body.innerHTML = `
                <a href='#s51'>1</a>
                <div class="pat-stacks" data-pat-stacks="scroll-selector: self">
                    <section id="s51">
                    </section>
                </div>
            `;
            const el = document.querySelector(".pat-stacks");

            const instance = new Stacks(el);
            await events.await_pattern_init(instance);

            const s51 = document.querySelector("[href='#s51']");
            $(s51).click();
            await utils.timeout(10);

            expect(this.spy_scrollTo).toHaveBeenCalled();
        });

        it("5.2 - Does clear scroll setting from parent config.", async function () {
            // NOTE: We give the stack section a different id.
            // The event handler which is registered on the document in the
            // previous test is still attached. Two event handlers are run when
            // clicking here and if the anchor-targets would have the same id
            // the scrolling would happen as it was set up in the previous
            // test.
            document.body.innerHTML = `
                <div data-pat-stacks="scroll-selector: self">
                    <a href='#s52'>1</a>
                    <div class="pat-stacks" data-pat-stacks="scroll-selector: none">
                        <section id="s52">
                        </section>
                    </div>
                </div>
            `;
            const el = document.querySelector(".pat-stacks");

            const instance = new Stacks(el);
            await events.await_pattern_init(instance);

            const s52 = document.querySelector("[href='#s52']");
            $(s52).click();
            await utils.timeout(10);

            expect(this.spy_scrollTo).not.toHaveBeenCalled();
        });
    });
});

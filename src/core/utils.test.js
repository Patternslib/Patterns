import "regenerator-runtime/runtime"; // needed for ``await`` support
import _ from "underscore";
import utils from "./utils";
import $ from "jquery";
import { jest } from "@jest/globals";

describe("basic tests", function () {
    describe("rebaseURL", function () {
        it("Keep URL with scheme", function () {
            expect(
                utils.rebaseURL("http://example.com/foo/", "http://other.com/me")
            ).toBe("http://other.com/me");
        });

        it("Keep URL with absolute path", function () {
            expect(utils.rebaseURL("http://example.com/foo/", "/me")).toBe("/me");
        });

        it("Rebase to base with filename", function () {
            expect(
                utils.rebaseURL("http://example.com/foo/index.html", "me/page.html")
            ).toBe("http://example.com/foo/me/page.html");
        });

        it("Rebase to base with directory path", function () {
            expect(utils.rebaseURL("http://example.com/foo/", "me/page.html")).toBe(
                "http://example.com/foo/me/page.html"
            );
        });

        it("Rebase with absolute base url", function () {
            expect(
                utils.rebaseURL("/foo/", "me/page.html").indexOf("/foo/me/page.html") > 0
            ).toBe(true);
        });

        it("Rebase with relative base url", function () {
            expect(
                utils
                    .rebaseURL("example.com/foo/", "me/page.html")
                    .indexOf("example.com/foo/me/page.html") > 0
            ).toBe(true);
        });

        it("Doesn't rebase data: urls", function () {
            expect(
                utils.rebaseURL("http://example.com/foo/", "data:image-base64gibberish")
            ).toBe("data:image-base64gibberish");
        });
    });

    describe("removeDuplicateObjects", function () {
        it("removes removes duplicates inside an array of objects", function () {
            var objs = [];
            expect(utils.removeDuplicateObjects(objs).length).toBe(0);
            expect(typeof utils.removeDuplicateObjects(objs)).toBe("object");

            objs = [{}, {}];
            expect(utils.removeDuplicateObjects(objs).length).toBe(1);
            expect(_.isArray(utils.removeDuplicateObjects(objs))).toBeTruthy();

            _.each(
                [
                    [{ a: "1" }],
                    [{ a: "1" }, { a: "1" }],
                    [{ a: "1" }, { a: "1" }, { a: "1" }],
                    [{ a: "1" }, { a: "1" }, { a: "1" }, { a: "1" }],
                ],
                function (objs) {
                    expect(utils.removeDuplicateObjects(objs).length).toBe(1);
                    expect(_.keys(utils.removeDuplicateObjects(objs)[0]).length).toBe(1);
                    expect(_.keys(utils.removeDuplicateObjects(objs)[0])[0]).toBe("a");
                    expect(_.values(utils.removeDuplicateObjects(objs)[0])[0]).toBe("1");
                }
            );

            objs = [{ a: "1" }, { a: "2" }];
            expect(utils.removeDuplicateObjects(objs).length).toBe(2);
            expect(_.keys(utils.removeDuplicateObjects(objs)[0]).length).toBe(1);
            expect(_.keys(utils.removeDuplicateObjects(objs)[0])[0]).toBe("a");
            expect(_.values(utils.removeDuplicateObjects(objs)[0])[0]).toBe("1");
            expect(_.keys(utils.removeDuplicateObjects(objs)[1]).length).toBe(1);
            expect(_.keys(utils.removeDuplicateObjects(objs)[1])[0]).toBe("a");
            expect(_.values(utils.removeDuplicateObjects(objs)[1])[0]).toBe("2");

            objs = [{ a: "1" }, { b: "1" }];
            expect(utils.removeDuplicateObjects(objs).length).toBe(2);
            expect(_.keys(utils.removeDuplicateObjects(objs)[0]).length).toBe(1);
            expect(_.keys(utils.removeDuplicateObjects(objs)[0])[0]).toBe("a");
            expect(_.values(utils.removeDuplicateObjects(objs)[0])[0]).toBe("1");
            expect(_.keys(utils.removeDuplicateObjects(objs)[1]).length).toBe(1);
            expect(_.keys(utils.removeDuplicateObjects(objs)[1])[0]).toBe("b");
            expect(_.values(utils.removeDuplicateObjects(objs)[1])[0]).toBe("1");

            _.each(
                [
                    [{ a: "1" }, { a: "1", b: "1" }],
                    [{ a: "1" }, { a: "1" }, { a: "1", b: "1" }],
                ],
                function (objs) {
                    expect(utils.removeDuplicateObjects(objs).length).toBe(2);
                    expect(_.keys(utils.removeDuplicateObjects(objs)[0]).length).toBe(1);
                    expect(_.keys(utils.removeDuplicateObjects(objs)[1]).length).toBe(2);
                    expect(_.keys(utils.removeDuplicateObjects(objs)[0])[0]).toBe("a");
                    expect(_.values(utils.removeDuplicateObjects(objs)[0])[0]).toBe("1");
                    expect(_.keys(utils.removeDuplicateObjects(objs)[1])[0]).toBe("a");
                    expect(_.values(utils.removeDuplicateObjects(objs)[1])[0]).toBe("1");
                    expect(_.keys(utils.removeDuplicateObjects(objs)[1])[1]).toBe("b");
                    expect(_.values(utils.removeDuplicateObjects(objs)[1])[1]).toBe("1");
                }
            );
        });
    });

    describe("mergeStack", function () {
        it("merges a list of lists of objects", function () {
            var stack = [];
            var length = 0;
            expect(_.isArray(utils.mergeStack(stack, length))).toBeTruthy();
            expect(utils.mergeStack(stack, length).length).toBe(0);

            _.each([1, 2, 3, 99], function (length) {
                expect(_.isArray(utils.mergeStack(stack, length))).toBeTruthy();
                expect(utils.mergeStack(stack, length).length).toBe(length);
                expect(_.isObject(utils.mergeStack(stack, length)[0])).toBeTruthy();
                expect(_.keys(utils.mergeStack(stack, length)[0]).length).toBe(0);
            });

            stack = [[{ a: 1 }], [{ b: 1 }, { b: 2 }]];
            length = 2;
            expect(_.isArray(utils.mergeStack(stack, length))).toBeTruthy();
            expect(utils.mergeStack(stack, length).length).toBe(2);
            expect(_.keys(utils.mergeStack(stack, length)[0])[0]).toBe("a");
            expect(_.keys(utils.mergeStack(stack, length)[0])[1]).toBe("b");
            expect(_.keys(utils.mergeStack(stack, length)[1])[0]).toBe("a");
            expect(_.keys(utils.mergeStack(stack, length)[1])[1]).toBe("b");
            expect(_.values(utils.mergeStack(stack, length)[0])[0]).toBe(1);
            expect(_.values(utils.mergeStack(stack, length)[0])[1]).toBe(1);
            expect(_.values(utils.mergeStack(stack, length)[1])[0]).toBe(1);
            expect(_.values(utils.mergeStack(stack, length)[1])[1]).toBe(2);

            stack = [[{ a: 1 }], [{ a: 2 }, { a: 3 }]];
            length = 2;
            expect(_.isArray(utils.mergeStack(stack, length))).toBeTruthy();
            expect(utils.mergeStack(stack, length).length).toBe(2);
            expect(_.keys(utils.mergeStack(stack, length)[0]).length).toBe(1);
            expect(_.keys(utils.mergeStack(stack, length)[1]).length).toBe(1);
            expect(_.keys(utils.mergeStack(stack, length)[0])[0]).toBe("a");
            expect(_.keys(utils.mergeStack(stack, length)[1])[0]).toBe("a");
            expect(_.values(utils.mergeStack(stack, length)[0])[0]).toBe(2);
            expect(_.values(utils.mergeStack(stack, length)[1])[0]).toBe(3);
        });
    });

    describe("findLabel", function () {
        beforeEach(function () {
            $("<div/>", { id: "lab" }).appendTo(document.body);
        });

        afterEach(function () {
            $("#lab").remove();
        });

        it("Input without a label", function () {
            $("#lab").html('<input id="input"/>');
            var input = document.getElementById("input");
            expect(utils.findLabel(input)).toBeNull();
        });

        it("Input wrapped in a label", function () {
            $("#lab").html('<label id="label"><input id="input"/></label>');
            var input = document.getElementById("input"),
                label = utils.findLabel(input);
            expect(label.id).toBe("label");
        });

        it("External label referencing input by id", function () {
            $("#lab").html(
                '<label id="label" for="input">Label</label><input id="input"/>'
            );
            var input = document.getElementById("input"),
                label = utils.findLabel(input);
            expect(label.id).toBe("label");
        });

        it("External label in same form referencing input by name", function () {
            $("#lab").html(
                '<form><label id="label" for="name">Label</label><input name="name" id="input"/>'
            );
            var input = document.getElementById("input"),
                label = utils.findLabel(input);
            expect(label.id).toBe("label");
        });

        it("External label in different form referencing input by name", function () {
            $("#lab").html(
                '<form><label id="label" for="name">Label</label></form><input name="name" id="input"/>'
            );
            var input = document.getElementById("input");
            expect(utils.findLabel(input)).toBeNull();
        });
    });

    describe("checkInputSupport", function () {
        it("Supports basic input types", function () {
            expect(utils.checkInputSupport("text")).toBe(true);
        });

        // Jest/JSDOM accepts any value for type.
        it.skip("Supports doesnt support non-existent input types", function () {
            expect(utils.checkInputSupport("invalid input type")).toBe(false);
        });
    });
});

describe("removeWildcardClass", function () {
    describe("... with single element", function () {
        it("Remove basic class", function () {
            const el = document.createElement("div");
            el.classList.add("on");
            utils.removeWildcardClass(el, "on");
            expect(el.classList.contains("on")).toBe(false);
        });

        it("Keep other classes", function () {
            const el = document.createElement("div");
            el.classList.add("one");
            el.classList.add("two");
            utils.removeWildcardClass(el, "one");
            expect(el.classList.contains("one")).toBe(false);
            expect(el.classList.contains("two")).toBe(true);
        });

        it("Remove removes whole words", function () {
            const el = document.createElement("div");
            el.classList.add("cheese-on-bread");
            utils.removeWildcardClass(el, "on");
            expect(el.getAttribute("class")).toBe("cheese-on-bread");
        });

        it("Remove wildcard postfix class", function () {
            const el = document.createElement("div");
            el.classList.add("icon-small");
            utils.removeWildcardClass(el, "icon-*");
            expect(el.getAttribute("class")).toBeFalsy();
        });

        it("Remove wildcard infix class", function () {
            const el = document.createElement("div");
            el.classList.add("icon-small-alert");
            utils.removeWildcardClass(el, "icon-*-alert");
            expect(el.getAttribute("class")).toBeFalsy();
        });

        it("Keep other classes when removing wildcards", function () {
            const el = document.createElement("div");
            el.classList.add("icon-small");
            el.classList.add("foo");
            utils.removeWildcardClass(el, "icon-*");
            expect(el.getAttribute("class")).toBe("foo");
        });
    });

    describe("... with a list of elements", function () {
        beforeEach(function () {
            document.body.innerHTML = "";
        });

        afterEach(function () {
            document.body.innerHTML = "";
        });

        it("Keep other classes", function () {
            document.body.innerHTML = `
                <div class="one two"></div>
                <div class="two three"></div>
            `;
            const inner_els = document.querySelectorAll("div");
            utils.removeWildcardClass(inner_els, "two");
            expect(inner_els[0].classList.contains("one")).toBe(true);
            expect(inner_els[0].classList.contains("two")).toBe(false);
            expect(inner_els[1].classList.contains("two")).toBe(false);
            expect(inner_els[1].classList.contains("three")).toBe(true);
        });
        it("Remove wildcard infix class", function () {
            document.body.innerHTML = `
                <div class="one icon-1-alert"></div>
                <div class="two icon-2-alert icon-3-alert"></div>
            `;
            const inner_els = document.querySelectorAll("div");
            utils.removeWildcardClass(inner_els, "icon-*-alert");
            expect(inner_els[0].classList.contains("one")).toBe(true);
            expect(inner_els[0].classList.contains("icon-1-alert")).toBe(false);
            expect(inner_els[1].classList.contains("two")).toBe(true);
            expect(inner_els[1].classList.contains("icon-2-alert")).toBe(false);
            expect(inner_els[1].classList.contains("icon-3-alert")).toBe(false);
        });
    });
});

describe("hideOrShow", function () {
    beforeEach(function () {
        $("<div/>", { id: "lab" }).appendTo(document.body);
    });

    afterEach(function () {
        $("#lab").remove();
    });

    it("Hide without a transition", function () {
        $("#lab").append("<div/>");
        var $el = $("#lab div");
        utils.hideOrShow($el, false, {
            transition: "none",
            effect: { duration: "fast", easing: "swing" },
        });
        expect($el[0].style.display).toBe("none");
        expect(Array.prototype.slice.call($el[0].classList)).toEqual(["hidden"]);
    });

    it("Show without a transition", function () {
        $("#lab").append('<div style="display: none"/>');
        var $el = $("#lab div");
        utils.hideOrShow($el, true, {
            transition: "none",
            effect: { duration: "fast", easing: "swing" },
        });
        expect($el[0].style.display).toBe("");
        expect(Array.prototype.slice.call($el[0].classList)).toEqual(["visible"]);
    });

    it("Single pat-update event without a transition", function () {
        $("#lab").append('<div style="display: none"/>');
        var $el = $("#lab div");
        jest.spyOn($.fn, "trigger");
        utils.hideOrShow(
            $el,
            true,
            {
                transition: "none",
                effect: { duration: "fast", easing: "swing" },
            },
            "depends"
        );
        expect($.fn.trigger.mock.calls.length).toEqual(1);
        expect($.fn.trigger).toHaveBeenCalledWith("pat-update", {
            pattern: "depends",
            transition: "complete",
        });
        $.fn.trigger.mockRestore();
    });

    it("Fadeout with 0 duration", function () {
        $("#lab").append("<div/>");
        var $el = $("#lab div");
        utils.hideOrShow($el, false, {
            transition: "slide",
            effect: { duration: 0, easing: "swing" },
        });
        expect($el[0].style.display).toBe("none");
        expect(Array.prototype.slice.call($el[0].classList)).toEqual(["hidden"]);
    });

    it("Fadeout with non-zero duration", async function () {
        $("#lab").append("<div/>");
        var $el = $("#lab div");
        utils.hideOrShow($el, false, {
            transition: "slide",
            effect: { duration: "fast", easing: "swing" },
        });
        await utils.timeout(500);
        expect($el[0].style.display).toBe("none");
        expect(Array.prototype.slice.call($el[0].classList)).toEqual(["hidden"]);
    });

    it("pat-update event with a transition", async function () {
        $("#lab").append("<div/>");
        var $el = $("#lab div");
        jest.spyOn($.fn, "trigger");
        utils.hideOrShow(
            $el,
            false,
            {
                transition: "slide",
                effect: { duration: "fast", easing: "swing" },
            },
            "depends"
        );
        await utils.timeout(500);
        expect($.fn.trigger.mock.calls.length).toEqual(2);
        expect($.fn.trigger).toHaveBeenCalledWith("pat-update", {
            pattern: "depends",
            transition: "start",
        });
        expect($.fn.trigger).toHaveBeenCalledWith("pat-update", {
            pattern: "depends",
            transition: "complete",
        });
        $.fn.trigger.mockRestore();
    });

    it("CSS-only hide", function () {
        $("#lab").append("<div/>");
        var $el = $("#lab div");
        utils.hideOrShow($el, false, {
            transition: "css",
            effect: { duration: "fast", easing: "swing" },
        });
        expect($el[0].style.display).toBe("");
        expect(Array.prototype.slice.call($el[0].classList)).toEqual(["hidden"]);
    });

    it("transition none does not mess up styles", (done) => {
        const el = document.createElement("div");
        el.style.borderTop = "2em";
        el.style.marginTop = "4em";

        utils.hideOrShow(el, false, { transition: "none" }, "noname");

        expect(el.style.borderTop).toBe("2em");
        expect(el.style.marginTop).toBe("4em");
        expect(el.style.display).toBe("none");
        expect(el.getAttribute("style").indexOf("display") >= -1).toBeTruthy();

        utils.hideOrShow(el, true, { transition: "none" }, "noname");

        expect(el.style.borderTop).toBe("2em");
        expect(el.style.marginTop).toBe("4em");
        expect(el.style.display).toBeFalsy();
        expect(el.getAttribute("style").indexOf("display") === -1).toBeTruthy();

        el.style.display = "inline";
        utils.hideOrShow(el, false, { transition: "none" }, "noname");

        expect(el.style.borderTop).toBe("2em");
        expect(el.style.marginTop).toBe("4em");
        expect(el.style.display).toBe("none");
        expect(el.getAttribute("style").indexOf("display") >= -1).toBeTruthy();

        utils.hideOrShow(el, true, { transition: "none" }, "noname");

        expect(el.style.borderTop).toBe("2em");
        expect(el.style.marginTop).toBe("4em");
        expect(el.style.display).toBe("inline");
        expect(el.getAttribute("style").indexOf("display") >= -1).toBeTruthy();

        done();
    });
});

describe("hasValue", function () {
    it("Handles text input", function () {
        var el = document.createElement("input");
        el.type = "text";
        expect(utils.hasValue(el)).toBeFalsy();
        el.value = "foo";
        expect(utils.hasValue(el)).toBeTruthy();
    });

    it("Handles checkbox inputs", function () {
        var el = document.createElement("input");
        el.type = "checkbox";
        el.value = "foo";
        expect(utils.hasValue(el)).toBeFalsy();
        el.checked = true;
        expect(utils.hasValue(el)).toBeTruthy();
    });

    it("Handles radio inputs", function () {
        var el = document.createElement("input");
        el.type = "radio";
        el.value = "foo";
        expect(utils.hasValue(el)).toBeFalsy();
        el.checked = true;
        expect(utils.hasValue(el)).toBeTruthy();
    });

    it("Handles select elements", function () {
        var el = document.createElement("select");
        el.multiple = true;
        var o = document.createElement("option");
        o.value = "foo";
        el.appendChild(o);
        expect(utils.hasValue(el)).toBeFalsy();
        el.selectedIndex = 0;
        expect(utils.hasValue(el)).toBeTruthy();
    });
});

describe("parseTime", function () {
    it("raises exception for invalid input", function () {
        var p = function () {
            utils.parseTime("abc");
        };
        expect(p).toThrow();
    });

    it("handles units", function () {
        expect(utils.parseTime("1000ms")).toBe(1000);
        expect(utils.parseTime("1s")).toBe(1000);
        expect(utils.parseTime("1m")).toBe(60000);
    });

    it("accepts fractional units", function () {
        expect(utils.parseTime("0.5s")).toBe(500);
    });

    it("rounds fractional units to whole milliseconds", function () {
        expect(utils.parseTime("0.8ms")).toBe(1);
    });

    it("assumes milliseconds by default", function () {
        expect(utils.parseTime("1000")).toBe(1000);
    });

    it("treats unknown units as milliseconds", function () {
        expect(utils.parseTime("1000w")).toBe(1000);
    });
});

describe("getCSSValue", function () {
    beforeEach(function () {
        const el1 = document.createElement("div");
        const el2 = document.createElement("div");

        el1.setAttribute("id", "el1");
        el2.setAttribute("id", "el2");
        el1.appendChild(el2);

        // Need to attach element to body to make CSS calculation work.
        document.body.appendChild(el1);

        el1.style["font-size"] = "12px";
        el1.style["margin-top"] = "1em";
        el1.style.border = "1em solid black";
        el1.style.position = "relative";
        el2.style["margin-bottom"] = "2em";
    });

    afterEach(function () {
        document.querySelector("#el1").remove();
    });

    it("Return values for CSS properties of a HTML node", function () {
        const el1 = document.querySelector("#el1");
        expect(utils.getCSSValue(el1, "font-size")).toBe("12px");
        expect(utils.getCSSValue(el1, "font-size", true)).toBe(12);
        expect(utils.getCSSValue(el1, "position")).toBe("relative");
    });

    it("Return string, int or float, as requested.", function () {
        const el1 = document.querySelector("#el1");
        expect(utils.getCSSValue(el1, "font-size")).toBe("12px");
        expect(utils.getCSSValue(el1, "font-size", true)).toBe(12);
        expect(utils.getCSSValue(el1, "font-size", true, true)).toBe(12.0);
        expect(utils.getCSSValue(el1, "font-size", null, true)).toBe(12.0);
    });

    it("Returns 0 for when requesting a numerical value which doesn't exist.", function () {
        const el = document.createElement("div");
        expect(utils.getCSSValue(el, "hallo", true)).toBe(0);
        expect(utils.getCSSValue(el, "hallo", true, true)).toBe(0.0);
        expect(utils.getCSSValue(el, "hallo", null, true)).toBe(0.0);
    });

    it.skip("Return inherited values for CSS properties", function () {
        // Missing JSDOM support for style inheritance yet. See:
        // https://github.com/jsdom/jsdom/issues/2160
        // https://github.com/jsdom/jsdom/pull/2668
        // https://github.com/jsdom/jsdom/blob/master/Changelog.md

        const el2 = document.querySelector("#el2");
        expect(utils.getCSSValue(el2, "font-size")).toBe("12px");
    });

    it.skip("Shorthand properties are split up", function () {
        // Missing JSDOM support for property split yet.

        const el1 = document.querySelector("#el1");
        // ``em`` are parsed to pixel values.
        // shorthand property sets like ``border`` are split up into their
        // individual properties, like ``border-top-width``.
        expect(utils.getCSSValue(el1, "border-top-width")).toBe("12px");
        expect(utils.getCSSValue(el1, "border-top-style")).toBe("solid");
        expect(utils.getCSSValue(el1, "border-top-color")).toBe("rgb(0, 0, 0)");
    });

    it.skip("Values with relative units are converted to pixels", function () {
        // Missing JSDOM support for unit conversion yet.

        const el1 = document.querySelector("#el1");
        const el2 = document.querySelector("#el2");
        // Relative length-type values are converted to absolute pixels.
        expect(utils.getCSSValue(el1, "margin-top")).toBe("12px");
        expect(utils.getCSSValue(el1, "margin-top", true)).toBe(12);
        expect(utils.getCSSValue(el2, "margin-top", true)).toBe(0);
        expect(utils.getCSSValue(el2, "margin-bottom")).toBe("24px");
        expect(utils.getCSSValue(el2, "margin-bottom", true)).toBe(24);
    });
});

describe("get_bounds", function () {
    it("returns the bounds values as integer numbers instead of double/float values.", () => {
        const el = document.createElement("div");
        jest.spyOn(el, "getBoundingClientRect").mockImplementation(() => {
            return {
                x: 10.01,
                y: 11.11,
                top: 12.22,
                right: 13.33,
                bottom: 14.44,
                left: 15.55,
                width: 16.66,
                height: 17.77,
            };
        });

        const bounds = utils.get_bounds(el);

        expect(bounds.x).toBe(10);
        expect(bounds.y).toBe(11);
        expect(bounds.top).toBe(12);
        expect(bounds.right).toBe(13);
        expect(bounds.bottom).toBe(14);
        expect(bounds.left).toBe(16);
        expect(bounds.width).toBe(17);
        expect(bounds.height).toBe(18);
    });

    it("returns 0 for any dimension where getBoundingClientRect fails.", () => {
        const el = document.createElement("div");
        jest.spyOn(el, "getBoundingClientRect").mockImplementation(() => {
            return {
                x: null,
                y: null,
                top: null,
                right: null,
                bottom: null,
                left: null,
                width: null,
                height: null,
            };
        });

        const bounds = utils.get_bounds(el);

        expect(bounds.x).toBe(0);
        expect(bounds.y).toBe(0);
        expect(bounds.top).toBe(0);
        expect(bounds.right).toBe(0);
        expect(bounds.bottom).toBe(0);
        expect(bounds.left).toBe(0);
        expect(bounds.width).toBe(0);
        expect(bounds.height).toBe(0);
    });
});

describe("core.utils tests", () => {
    describe("jqToNode tests", () => {
        it("always returns a bare DOM node no matter if a jQuery or bare DOM node was passed.", (done) => {
            const el = document.createElement("div");
            const $el = $(el);

            expect(utils.jqToNode($el)).toBe(el);
            expect(utils.jqToNode(el)).toBe(el);

            done();
        });
    });

    describe("ensureArray tests", () => {
        it("returns the passed value as is if it is an array.", (done) => {
            const val = [1, 2, 3];
            expect(utils.ensureArray(val)).toBe(val);

            done();
        });

        it("returns jQuery object as is, as it is array-like.", (done) => {
            const val = $();
            expect(utils.ensureArray(val)).toBe(val);

            done();
        });

        it("returns an array, if the passed value is not an array.", (done) => {
            const val = "1, 2, 3";
            expect(utils.ensureArray(val)[0]).toBe(val);

            done();
        });

        it("returns a array-like NodeList object as is", () => {
            const el = document.createElement("div");
            el.innerHTML = `
                <div></div>
                <div></div>
                <div></div>
            `;
            const node_list = el.querySelectorAll("div");
            const result = utils.ensureArray(node_list);
            expect(result.length).toBe(3);
            expect(NodeList.prototype.isPrototypeOf(result)).toBe(true); // eslint-disable-line no-prototype-builtins
            expect(Array.isArray(result)).toBe(false);
        });

        it("returns a array from a NodeList is force_array is set", () => {
            const el = document.createElement("div");
            el.innerHTML = `
                <div></div>
                <div></div>
                <div></div>
            `;
            const node_list = el.querySelectorAll("div");
            const result = utils.ensureArray(node_list, true);
            expect(result.length).toBe(3);
            expect(NodeList.prototype.isPrototypeOf(result)).toBe(false); // eslint-disable-line no-prototype-builtins
            expect(Array.isArray(result)).toBe(true);
        });
    });

    describe("localized_isodate tests", () => {
        it("Returns an zero-padded ISO 8602 compatible date when passed a JavaScript date", (done) => {
            expect(utils.localized_isodate(new Date(2021, 3, 2))).toBe("2021-04-02");
            done();
        });
    });
});

describe("debounce ...", function () {
    it("runs function after x ms", async () => {
        const test_func = jest.fn();
        const debouncer = utils.debounce(test_func, 1);
        debouncer();
        expect(test_func).not.toHaveBeenCalled();
        await utils.timeout(1);
        expect(test_func).toHaveBeenCalled();
    });
    it("is called with correct args", async () => {
        const test_func = jest.fn();
        const debouncer = utils.debounce(test_func, 1);
        debouncer("hello.", "there.");
        expect(test_func).not.toHaveBeenCalled();
        await utils.timeout(1);
        expect(test_func).toHaveBeenCalledWith("hello.", "there.");
    });
    it("cancels previous runs", async () => {
        const test_func = jest.fn();
        const debouncer = utils.debounce(test_func, 1);
        debouncer();
        debouncer();
        debouncer();
        expect(test_func).not.toHaveBeenCalled();
        await utils.timeout(1);
        expect(test_func).toHaveBeenCalledTimes(1);
    });
    it("incorrect usage by multi instantiation won't cancel previous runs", async () => {
        const test_func = jest.fn();
        utils.debounce(test_func, 1)();
        utils.debounce(test_func, 1)();
        utils.debounce(test_func, 1)();
        expect(test_func).not.toHaveBeenCalled();
        await utils.timeout(1);
        expect(test_func).toHaveBeenCalledTimes(3);
    });
    it("can be instantiated multiple times and cancel previous runs by passing a timer object.", async () => {
        const test_func = jest.fn();
        const timer = { timer: null };
        utils.debounce(test_func, 1, timer)();
        utils.debounce(test_func, 1, timer)();
        utils.debounce(test_func, 1, timer)();
        expect(test_func).not.toHaveBeenCalled();
        await utils.timeout(1);
        expect(test_func).toHaveBeenCalledTimes(1);
    });
});

describe("animation_frame ...", function () {
    it("waits for the next repaint cycle...", async () => {
        const mock = jest.fn();

        const testfn = async () => {
            await utils.animation_frame();
            mock();
        };

        testfn();
        expect(mock).not.toHaveBeenCalled();

        await utils.animation_frame();
        expect(mock).toHaveBeenCalled();
    });
});

describe("escape/unescape html ...", function () {
    it("escapes and unescapes html", () => {
        const unescaped = `<hello attribute="value">this & that</hello>`;
        const escaped = `&lt;hello attribute=&quot;value&quot;&gt;this &amp; that&lt;/hello&gt;`;

        expect(utils.escape_html(unescaped)).toBe(escaped);
        expect(utils.unescape_html(escaped)).toBe(unescaped);
    });

    it("does not break with null-ish input", () => {
        expect(utils.escape_html(null)).toBe("");
        expect(utils.escape_html(undefined)).toBe("");

        expect(utils.unescape_html(null)).toBe("");
        expect(utils.unescape_html(undefined)).toBe("");
    });
});

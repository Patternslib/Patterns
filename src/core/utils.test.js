import _ from "underscore";
import utils from "./utils";
import $ from "jquery";

jest.useFakeTimers();

describe("basic tests", function() {
    describe("rebaseURL", function() {
        it("Keep URL with scheme", function() {
            expect(
                utils.rebaseURL("http://example.com/foo/", "http://other.com/me"))
                .toBe("http://other.com/me");
        });

        it("Keep URL with absolute path", function() {
            expect(
                utils.rebaseURL("http://example.com/foo/", "/me"))
                .toBe("/me");
        });

        it("Rebase to base with filename", function() {
            expect(
                utils.rebaseURL("http://example.com/foo/index.html", "me/page.html"))
                .toBe("http://example.com/foo/me/page.html");
        });

        it("Rebase to base with directory path", function() {
            expect(
                utils.rebaseURL("http://example.com/foo/", "me/page.html"))
                .toBe("http://example.com/foo/me/page.html");
        });
        it("Doesn't rebase data: urls", function() {
            expect(
                utils.rebaseURL("http://example.com/foo/", "data:image-base64gibberish"))
                .toBe("data:image-base64gibberish");
        });
    });

    describe("removeDuplicateObjects", function() {

        it("removes removes duplicates inside an array of objects", function() {
            var objs = [];
            expect(utils.removeDuplicateObjects(objs).length).toBe(0);
            expect(typeof utils.removeDuplicateObjects(objs)).toBe("object");

            objs = [{}, {}];
            expect(utils.removeDuplicateObjects(objs).length).toBe(1);
            expect(_.isArray(utils.removeDuplicateObjects(objs))).toBeTruthy();

            _.each([
                [{a: '1'}],
                [{a: '1'}, {a: '1'}],
                [{a: '1'}, {a: '1'}, {a: '1'}],
                [{a: '1'}, {a: '1'}, {a: '1'}, {a: '1'}]
            ], function (objs) {
                expect(utils.removeDuplicateObjects(objs).length).toBe(1);
                expect(_.keys(utils.removeDuplicateObjects(objs)[0]).length).toBe(1);
                expect(_.keys(utils.removeDuplicateObjects(objs)[0])[0]).toBe('a');
                expect(_.values(utils.removeDuplicateObjects(objs)[0])[0]).toBe('1');
            });

            objs = [{a: '1'}, {a: '2'}];
            expect(utils.removeDuplicateObjects(objs).length).toBe(2);
            expect(_.keys(utils.removeDuplicateObjects(objs)[0]).length).toBe(1);
            expect(_.keys(utils.removeDuplicateObjects(objs)[0])[0]).toBe('a');
            expect(_.values(utils.removeDuplicateObjects(objs)[0])[0]).toBe('1');
            expect(_.keys(utils.removeDuplicateObjects(objs)[1]).length).toBe(1);
            expect(_.keys(utils.removeDuplicateObjects(objs)[1])[0]).toBe('a');
            expect(_.values(utils.removeDuplicateObjects(objs)[1])[0]).toBe('2');

            objs = [{a: '1'}, {b: '1'}];
            expect(utils.removeDuplicateObjects(objs).length).toBe(2);
            expect(_.keys(utils.removeDuplicateObjects(objs)[0]).length).toBe(1);
            expect(_.keys(utils.removeDuplicateObjects(objs)[0])[0]).toBe('a');
            expect(_.values(utils.removeDuplicateObjects(objs)[0])[0]).toBe('1');
            expect(_.keys(utils.removeDuplicateObjects(objs)[1]).length).toBe(1);
            expect(_.keys(utils.removeDuplicateObjects(objs)[1])[0]).toBe('b');
            expect(_.values(utils.removeDuplicateObjects(objs)[1])[0]).toBe('1');

            _.each([
                [{a: '1'}, {a: '1', b: '1'}],
                [{a: '1'}, {a: '1'}, {a: '1', b: '1'}]
            ], function (objs) {
                expect(utils.removeDuplicateObjects(objs).length).toBe(2);
                expect(_.keys(utils.removeDuplicateObjects(objs)[0]).length).toBe(1);
                expect(_.keys(utils.removeDuplicateObjects(objs)[1]).length).toBe(2);
                expect(_.keys(utils.removeDuplicateObjects(objs)[0])[0]).toBe('a');
                expect(_.values(utils.removeDuplicateObjects(objs)[0])[0]).toBe('1');
                expect(_.keys(utils.removeDuplicateObjects(objs)[1])[0]).toBe('a');
                expect(_.values(utils.removeDuplicateObjects(objs)[1])[0]).toBe('1');
                expect(_.keys(utils.removeDuplicateObjects(objs)[1])[1]).toBe('b');
                expect(_.values(utils.removeDuplicateObjects(objs)[1])[1]).toBe('1');
            });
        });
    });

    describe("mergeStack", function() {

        it("merges a list of lists of objects", function() {
            var stack = [];
            var length = 0;
            expect(_.isArray(utils.mergeStack(stack, length))).toBeTruthy();
            expect(utils.mergeStack(stack, length).length).toBe(0);

            _.each([1,2,3,99], function(length) {
                expect(_.isArray(utils.mergeStack(stack, length))).toBeTruthy();
                expect(utils.mergeStack(stack, length).length).toBe(length);
                expect(_.isObject(utils.mergeStack(stack, length)[0])).toBeTruthy();
                expect(_.keys(utils.mergeStack(stack, length)[0]).length).toBe(0);
            });

            stack = [[{a: 1}], [{b: 1}, {b: 2}]];
            length = 2;
            expect(_.isArray(utils.mergeStack(stack, length))).toBeTruthy();
            expect(utils.mergeStack(stack, length).length).toBe(2);
            expect(_.keys(utils.mergeStack(stack, length)[0])[0]).toBe('a');
            expect(_.keys(utils.mergeStack(stack, length)[0])[1]).toBe('b');
            expect(_.keys(utils.mergeStack(stack, length)[1])[0]).toBe('a');
            expect(_.keys(utils.mergeStack(stack, length)[1])[1]).toBe('b');
            expect(_.values(utils.mergeStack(stack, length)[0])[0]).toBe(1);
            expect(_.values(utils.mergeStack(stack, length)[0])[1]).toBe(1);
            expect(_.values(utils.mergeStack(stack, length)[1])[0]).toBe(1);
            expect(_.values(utils.mergeStack(stack, length)[1])[1]).toBe(2);

            stack = [[{a: 1}], [{a: 2}, {a: 3}]];
            length = 2;
            expect(_.isArray(utils.mergeStack(stack, length))).toBeTruthy();
            expect(utils.mergeStack(stack, length).length).toBe(2);
            expect(_.keys(utils.mergeStack(stack, length)[0]).length).toBe(1);
            expect(_.keys(utils.mergeStack(stack, length)[1]).length).toBe(1);
            expect(_.keys(utils.mergeStack(stack, length)[0])[0]).toBe('a');
            expect(_.keys(utils.mergeStack(stack, length)[1])[0]).toBe('a');
            expect(_.values(utils.mergeStack(stack, length)[0])[0]).toBe(2);
            expect(_.values(utils.mergeStack(stack, length)[1])[0]).toBe(3);
        });
    });

    describe("findLabel", function() {
        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        it("Input without a label", function() {
            $("#lab").html("<input id=\"input\"/>");
            var input = document.getElementById("input");
            expect(utils.findLabel(input)).toBeNull();
        });

        it("Input wrapped in a label", function() {
            $("#lab").html("<label id=\"label\"><input id=\"input\"/></label>");
            var input = document.getElementById("input"),
                label = utils.findLabel(input);
            expect(label.id).toBe("label");
        });

        it("External label referencing input by id", function() {
            $("#lab").html("<label id=\"label\" for=\"input\">Label</label><input id=\"input\"/>");
            var input = document.getElementById("input"),
                label = utils.findLabel(input);
            expect(label.id).toBe("label");
        });

        it("External label in same form referencing input by name", function() {
            $("#lab").html("<form><label id=\"label\" for=\"name\">Label</label><input name=\"name\" id=\"input\"/>");
            var input = document.getElementById("input"),
                label = utils.findLabel(input);
            expect(label.id).toBe("label");
        });

        it("External label in different form referencing input by name", function() {
            $("#lab").html("<form><label id=\"label\" for=\"name\">Label</label></form><input name=\"name\" id=\"input\"/>");
            var input = document.getElementById("input");
            expect(utils.findLabel(input)).toBeNull();
        });
    });
});

describe("removeWildcardClass", function() {
    it("Remove basic class", function() {
        var $el = $("<div class='on'/>");
        utils.removeWildcardClass($el, "on");
        expect($el.hasClass("on")).toBe(false);
    });

    it("Keep other classes", function() {
        var $el = $("<div class='one two'/>");
        utils.removeWildcardClass($el, "one");
        expect($el.attr("class")).toBe("two");
    });

    it("Remove uses whole words", function() {
        var $el = $("<div class='cheese-on-bread'/>");
        utils.removeWildcardClass($el, "on");
        expect($el.attr("class")).toBe("cheese-on-bread");
    });

    it("Remove wildcard postfix class", function() {
        var $el = $("<div class='icon-small'/>");
        utils.removeWildcardClass($el, "icon-*");
        expect($el.attr("class")).toBeFalsy();
    });

    it("Remove wildcard infix class", function() {
        var $el = $("<div class='icon-small-alert/>");
        utils.removeWildcardClass($el, "icon-*-alert");
        expect($el.attr("class")).toBeFalsy();
    });

    it("Keep other classes when removing wildcards", function() {
        var $el = $("<div class='icon-small foo'/>");
        utils.removeWildcardClass($el, "icon-*");
        expect($el.attr("class")).toBe("foo");
    });
});

describe("hideOrShow", function() {
    beforeEach(function() {
        $("<div/>", {id: "lab"}).appendTo(document.body);
        $("<div/>", {id: "lab"}).appendTo(document.body);
    });

    afterEach(function() {
        $("#lab").remove();
    });

    it("Hide without a transition", function() {
        $("#lab").append("<div/>");
        var $slave = $("#lab div");
        utils.hideOrShow($slave, false, {transition: "none", effect: {duration: "fast", easing: "swing"}});
        expect($slave[0].style.display).toBe("none");
        expect(Array.prototype.slice.call($slave[0].classList)).toEqual(["hidden"]);
    });

    it("Show without a transition", function() {
        $("#lab").append("<div style=\"display: none\"/>");
        var $slave = $("#lab div");
        utils.hideOrShow($slave, true, {transition: "none", effect: {duration: "fast", easing: "swing"}});
        expect($slave[0].style.display).toBe("");
        expect(Array.prototype.slice.call($slave[0].classList)).toEqual(["visible"]);
    });

    it("Single pat-update event without a transition", function() {
        $("#lab").append("<div style=\"display: none\"/>");
        var $slave = $("#lab div");
        spyOn($.fn, "trigger");
        utils.hideOrShow($slave, true, {transition: "none", effect: {duration: "fast", easing: "swing"}}, "depends");
        expect($.fn.trigger.calls.count()).toEqual(1);
        expect($.fn.trigger).toHaveBeenCalledWith(
            "pat-update", {pattern: "depends", transition: "complete"});
    });

    it("Fadeout with 0 duration", function() {
        $("#lab").append("<div/>");
        var $slave = $("#lab div");
        utils.hideOrShow($slave, false, {transition: "slide", effect: {duration: 0, easing: "swing"}});
        expect($slave[0].style.display).toBe("none");
        expect(Array.prototype.slice.call($slave[0].classList)).toEqual(["hidden"]);
    });

    it("Fadeout with non-zero duration", function() {
        $("#lab").append("<div/>");
        var $slave = $("#lab div");
        utils.hideOrShow($slave, false, {transition: "slide", effect: {duration: "fast", easing: "swing"}} );
        setTimeout(function () {
            expect($slave[0].style.display).toBe("none");
            expect(Array.prototype.slice.call($slave[0].classList)).toEqual(["hidden"]);

        }, 500);
    });

    it("pat-update event with a transition", function() {
        $("#lab").append("<div/>");
        var $slave = $("#lab div");
        spyOn($.fn, "trigger");
        utils.hideOrShow($slave, false, {transition: "slide", effect: {duration: "fast", easing: "swing"}}, "depends");
        setTimeout(function () {
            expect($.fn.trigger.calls.count()).toEqual(2);
            expect($.fn.trigger).toHaveBeenCalledWith(
                "pat-update", {pattern: "depends", transition: "start"});
            expect($.fn.trigger).toHaveBeenCalledWith(
                "pat-update", {pattern: "depends", transition: "complete"});

        }, 500);

    });

    it("CSS-only hide", function() {
        $("#lab").append("<div/>");
        var $slave = $("#lab div");
        utils.hideOrShow($slave, false, {transition: "css", effect: {duration: "fast", easing: "swing"}});
        expect($slave[0].style.display).toBe("");
        expect(Array.prototype.slice.call($slave[0].classList)).toEqual(["hidden"]);
    });
});

describe("hasValue", function() {
    it("Handles text input", function() {
        var el = document.createElement("input");
        el.type = "text";
        expect(utils.hasValue(el)).toBeFalsy();
        el.value = "foo";
        expect(utils.hasValue(el)).toBeTruthy();
    });

    it("Handles checkbox inputs", function() {
        var el = document.createElement("input");
        el.type = "checkbox";
        el.value = "foo";
        expect(utils.hasValue(el)).toBeFalsy();
        el.checked = true;
        expect(utils.hasValue(el)).toBeTruthy();
    });

    it("Handles radio inputs", function() {
        var el = document.createElement("input");
        el.type = "radio";
        el.value = "foo";
        expect(utils.hasValue(el)).toBeFalsy();
        el.checked = true;
        expect(utils.hasValue(el)).toBeTruthy();
    });

    it("Handles select elements", function() {
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

describe("parseTime", function() {
    it("raises exception for invalid input", function() {
        var p = function() {
            utils.parseTime("abc");
        };
        expect(p).toThrow();
    });

    it("handles units", function() {
        expect(utils.parseTime("1000ms")).toBe(1000);
        expect(utils.parseTime("1s")).toBe(1000);
        expect(utils.parseTime("1m")).toBe(60000);
    });

    it("accepts fractional units", function() {
        expect(utils.parseTime("0.5s")).toBe(500);
    });

    it("rounds fractional units to whole milliseconds", function() {
        expect(utils.parseTime("0.8ms")).toBe(1);
    });

    it("assumes milliseconds by default", function() {
        expect(utils.parseTime("1000")).toBe(1000);
    });

    it("treats unknown units as milliseconds", function() {
        expect(utils.parseTime("1000w")).toBe(1000);
    });
});


describe("getCSSValue", function() {
    it("Return values for CSS properties of a HTML node", function() {
        var el1 = document.createElement('div');
        var el2 = document.createElement('div');
        el1.appendChild(el2);

        // Need to attach element to body to make CSS calculation work.
        document.body.appendChild(el1);

        el1.style['font-size'] = '12px';
        el1.style['margin-top'] = '1em';
        el1.style.border = '1em solid black';
        el1.style.position = 'relative';
        el2.style['margin-bottom'] = '2em';

        expect(utils.getCSSValue(el1, 'font-size')).toBe('12px');
        expect(utils.getCSSValue(el1, 'font-size', true)).toBe(12.0);
        expect(utils.getCSSValue(el2, 'font-size')).toBe('12px');

        // ``em`` are parsed to pixel values.
        // shorthand property sets like ``border`` are split up into their
        // individual properties, like ``border-top-width``.
        expect(utils.getCSSValue(el1, 'border-top-width')).toBe('12px');
        expect(utils.getCSSValue(el1, 'border-top-style')).toBe('solid');
        expect(utils.getCSSValue(el1, 'border-top-color')).toBe('rgb(0, 0, 0)');

        expect(utils.getCSSValue(el1, 'position')).toBe('relative');

        // again, relative length-type values are converted to absolute pixels.
        expect(utils.getCSSValue(el1, 'margin-top')).toBe('12px');
        expect(utils.getCSSValue(el1, 'margin-top', true)).toBe(12.0);
        expect(utils.getCSSValue(el2, 'margin-top', true)).toBe(0.0);
        expect(utils.getCSSValue(el2, 'margin-bottom')).toBe('24px');
        expect(utils.getCSSValue(el2, 'margin-bottom', true)).toBe(24.0);
    });
});

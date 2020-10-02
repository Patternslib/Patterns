import $ from "jquery";
import pattern from "./depends";
import utils from "../../core/utils";

describe("pat-depends", function () {
    describe("init", function () {
        beforeEach(function () {
            $("<div/>", { id: "lab" }).appendTo(document.body);
        });

        afterEach(function () {
            $("#lab").remove();
        });

        it("Hide if condition is not met initially", async function () {
            $("#lab").html(
                [
                    '<input type="checkbox" id="control" value="yes"/>',
                    '<div id="dependent" class="pat-depends"/>',
                ].join("\n")
            );
            var $dependent = $("#dependent");
            pattern.init($dependent, { condition: "control" });
            await utils.timeout(1); // wait a tick for async to settle.

            expect($dependent.css("display")).toBe("none");
        });

        it("Show if condition is not met initially", async function () {
            $("#lab").html(
                [
                    '<input type="checkbox" id="control" value="yes" checked="checked"/>',
                    '<div id="dependent" class="pat-depends" style="display: none"/>',
                ].join("\n")
            );
            var $dependent = $("#dependent");
            pattern.init($dependent, { condition: "control" });
            await utils.timeout(1); // wait a tick for async to settle.
            expect($dependent.css("display")).not.toBe("none");
        });
    });

    describe("disable", function () {
        beforeEach(function () {
            $("<div/>", { id: "lab" }).appendTo(document.body);
        });

        afterEach(function () {
            $("#lab").remove();
        });

        it("Input element", async function () {
            $("#lab").html(
                [
                    '<input type="checkbox" id="control" value="yes" checked="checked"/>',
                    '<button id="dependent" class="pat-depends" type="button">Click me</button>',
                ].join("\n")
            );
            var pat = pattern.init($(".pat-depends"), {
                condition: "control",
            });
            await utils.timeout(1); // wait a tick for async to settle.
            var $dependent = $("#dependent");
            pat.disable();
            expect($dependent[0].disabled).toBeTruthy();
            expect($dependent.hasClass("disabled")).toBe(true);
        });

        it("Anchor", async function () {
            $("#lab").html(
                [
                    '<input type="checkbox" id="control" value="yes" checked="checked"/>',
                    '<a class="pat-depends" href="#target">Click me</a>',
                ].join("\n")
            );
            var pat = pattern.init($(".pat-depends"), { condition: "control" });
            await utils.timeout(1); // wait a tick for async to settle.
            var $dependent = $("#lab a");
            pat.disable();
            var events = $._data($dependent[0]).events;
            expect($dependent.hasClass("disabled")).toBe(true);
            expect(events.click).toBeDefined();
            expect(events.click[0].namespace).toBe("patternDepends");
        });
    });

    describe("enable", function () {
        beforeEach(function () {
            $("<div/>", { id: "lab" }).appendTo(document.body);
        });

        afterEach(function () {
            $("#lab").remove();
        });

        it("Input element", async function () {
            $("#lab").html(
                [
                    '<input type="checkbox" id="control" value="yes" checked="checked"/>',
                    '<button disabled="disabled" class="pat-depends disabled" type="button">Click me</button>',
                ].join("\n")
            );
            var pat = pattern.init($(".pat-depends"), {
                condition: "control",
            });
            await utils.timeout(1); // wait a tick for async to settle.
            var $dependent = $("#lab button");
            pat.enable();
            expect($dependent[0].disabled).toBeFalsy();
            expect($dependent.hasClass("disabled")).toBe(false);
        });

        it("Anchor", async function () {
            $("#lab").html(
                [
                    '<input type="checkbox" id="control" value="yes" checked="checked"/>',
                    '<a href="#target" class="pat-depends disabled">Click me</a>',
                ].join("\n")
            );
            var pat = pattern.init($(".pat-depends"), {
                condition: "control",
            });
            await utils.timeout(1); // wait a tick for async to settle.
            var $dependent = $("#lab a");
            $dependent.on("click.patternDepends", false);
            pat.enable();
            expect($dependent.hasClass("disabled")).toBe(false);
            expect($._data($dependent[0]).events).toBe(undefined);
        });
    });
});

import pattern from "./depends";
import $ from "jquery";

describe("pat-depends", function() {
    describe("init", function() {
        beforeEach(function() {
            $("<div/>", { id: "lab" }).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        it("Hide if condition is not met initially", function() {
            $("#lab").html(
                [
                    '<input type="checkbox" id="control" value="yes"/>',
                    '<div id="slave" class="pat-depends"/>'
                ].join("\n")
            );
            var $slave = $("#slave");
            pattern.init($slave, { condition: "control" });
            expect($slave.css("display")).toBe("none");
        });

        it("Show if condition is not met initially", function() {
            $("#lab").html(
                [
                    '<input type="checkbox" id="control" value="yes" checked="checked"/>',
                    '<div id="slave" class="pat-depends" style="display: none"/>'
                ].join("\n")
            );
            var $slave = $("#slave");
            pattern.init($slave, { condition: "control" });
            expect($slave.css("display")).not.toBe("none");
        });
    });

    describe("disable", function() {
        beforeEach(function() {
            $("<div/>", { id: "lab" }).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        it("Input element", function() {
            $("#lab").html(
                [
                    '<input type="checkbox" id="control" value="yes" checked="checked"/>',
                    '<button id="slave" class="pat-depends" type="button">Click me</button>'
                ].join("\n")
            );
            var pat = pattern.init($(".pat-depends"), {
                condition: "control"
            });
            var $slave = $("#slave");
            pat.disable();
            expect($slave[0].disabled).toBeTruthy();
            expect($slave.hasClass("disabled")).toBe(true);
        });

        it("Anchor", function() {
            $("#lab").html(
                [
                    '<input type="checkbox" id="control" value="yes" checked="checked"/>',
                    '<a class="pat-depends" href="#target">Click me</a>'
                ].join("\n")
            );
            var pat = pattern.init($(".pat-depends"), {
                condition: "control"
            });
            var $slave = $("#lab a");
            pat.disable();
            var events = $._data($slave[0]).events;
            expect($slave.hasClass("disabled")).toBe(true);
            expect(events.click).toBeDefined();
            expect(events.click[0].namespace).toBe("patternDepends");
        });
    });

    describe("enable", function() {
        beforeEach(function() {
            $("<div/>", { id: "lab" }).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        it("Input element", function() {
            $("#lab").html(
                [
                    '<input type="checkbox" id="control" value="yes" checked="checked"/>',
                    '<button disabled="disabled" class="pat-depends disabled" type="button">Click me</button>'
                ].join("\n")
            );
            var pat = pattern.init($(".pat-depends"), {
                condition: "control"
            });
            var $slave = $("#lab button");
            pat.enable();
            expect($slave[0].disabled).toBeFalsy();
            expect($slave.hasClass("disabled")).toBe(false);
        });

        it("Anchor", function() {
            $("#lab").html(
                [
                    '<input type="checkbox" id="control" value="yes" checked="checked"/>',
                    '<a href="#target" class="pat-depends disabled">Click me</a>'
                ].join("\n")
            );
            var pat = pattern.init($(".pat-depends"), {
                condition: "control"
            });
            var $slave = $("#lab a");
            $slave.on("click.patternDepends", false);
            pat.enable();
            expect($slave.hasClass("disabled")).toBe(false);
            expect($._data($slave[0]).events).toBe(undefined);
        });
    });
});

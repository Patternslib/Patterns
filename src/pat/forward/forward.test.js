import $ from "jquery";
import pattern from "./forward";
import utils from "../../core/utils";

describe("pat-forward", function () {
    beforeEach(function () {
        $("<div/>", { id: "lab" }).appendTo(document.body);
    });

    afterEach(function () {
        $("#lab").remove();
    });

    describe("pat-forward ...", function () {
        it("allows you to forward the click from an element to another one", function () {
            var $lab = $("#lab");
            $lab.append(
                $(
                    "<form>" +
                        '    <input id="checkbox" type="checkbox" />' +
                        '    <button class="pat-forward" data-pat-forward="#checkbox">Button</button>' +
                        "</form>"
                )
            );

            pattern.init($(pattern.trigger));
            expect($lab.find("#checkbox").is(":checked")).toBeFalsy();
            $lab.find(".pat-forward").click();
            expect($lab.find("#checkbox").is(":checked")).toBeTruthy();
        });

        it("set to auto-trigger allows you to forward the click authomatically when the pattern is initialized", function () {
            var $lab = $("#lab");
            $lab.append(
                $(
                    "<form>" +
                        '    <input id="checkbox" type="checkbox" />' +
                        '    <button class="pat-forward" data-pat-forward="#checkbox; trigger: auto">Button</button>' +
                        "</form>"
                )
            );

            pattern.init($(pattern.trigger));
            expect($lab.find("#checkbox").is(":checked")).toBeTruthy();
            $lab.find(".pat-forward").click();
            expect($lab.find("#checkbox").is(":checked")).toBeFalsy();
        });

        it("forwards the click event to all targets which match the selector", function () {
            var $lab = $("#lab");
            $lab.append(
                $(
                    "<form>" +
                        '    <input id="checkbox1" type="checkbox" />' +
                        '    <input id="checkbox2" type="checkbox" />' +
                        '    <button class="pat-forward" data-pat-forward="input[type=checkbox]">Button</button>' +
                        "</form>"
                )
            );

            pattern.init($(pattern.trigger));
            expect($lab.find("#checkbox1").is(":checked")).toBeFalsy();
            expect($lab.find("#checkbox2").is(":checked")).toBeFalsy();
            $lab.find(".pat-forward").click();
            expect($lab.find("#checkbox1").is(":checked")).toBeTruthy();
            expect($lab.find("#checkbox2").is(":checked")).toBeTruthy();
        });

        it("allows to define a delay after which the click event is forwarded.", async function () {
            var $lab = $("#lab");
            $lab.append(
                $(
                    "<form>" +
                        '    <input id="checkbox" type="checkbox" />' +
                        '    <button class="pat-forward" data-pat-forward="#checkbox; delay: 200">Button</button>' +
                        "</form>"
                )
            );

            pattern.init($(pattern.trigger));
            expect($lab.find("#checkbox").is(":checked")).toBeFalsy();
            $lab.find(".pat-forward").click();
            expect($lab.find("#checkbox").is(":checked")).toBeFalsy();

            await utils.timeout(300);

            expect($lab.find("#checkbox").is(":checked")).toBeTruthy();
        });

        it("allows to define self as target - most useful with delay and/or auto-trigger.", async function () {
            var $lab = $("#lab");
            $lab.append(
                $(
                    `<a href="#oh" class="pat-forward" data-pat-forward="selector: self; trigger: auto; delay: 200ms">leave</a>`
                )
            );

            pattern.init($(pattern.trigger));

            expect(window.location.href.indexOf("#oh") > -1).toBe(false);
            await utils.timeout(300);
            expect(window.location.href.indexOf("#oh") > -1).toBe(true);
        });
    });
});

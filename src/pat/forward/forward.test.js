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
            await utils.timeout(1); // wait a tick for async to settle.
            expect($lab.find("#checkbox").is(":checked")).toBeFalsy();
            await utils.timeout(100);
            expect($lab.find("#checkbox").is(":checked")).toBeFalsy();
            await utils.timeout(100);
            expect($lab.find("#checkbox").is(":checked")).toBeTruthy();
        });

        it("allows to define a delay with units after which the click event is forwarded.", async function () {
            var $lab = $("#lab");
            $lab.append(
                $(
                    "<form>" +
                        '    <input id="checkbox" type="checkbox" />' +
                        '    <button class="pat-forward" data-pat-forward="#checkbox; delay: 200ms">Button</button>' +
                        "</form>"
                )
            );

            pattern.init($(pattern.trigger));
            expect($lab.find("#checkbox").is(":checked")).toBeFalsy();
            $lab.find(".pat-forward").click();
            await utils.timeout(1); // wait a tick for async to settle.
            expect($lab.find("#checkbox").is(":checked")).toBeFalsy();
            await utils.timeout(100);
            expect($lab.find("#checkbox").is(":checked")).toBeFalsy();
            await utils.timeout(100);
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

        it("does not steal the click event but let it bubble up.", function () {
            document.body.innerHTML = `

                <div class="pat-forward" data-pat-forward="#target1">
                  <button class="pat-forward" type="button" data-pat-forward="#target2">Button 2</button>
                </div>

                <div id="target1">Target 1</div>
                <div id="target2">Target 2</div>
            `;

            const source1 = document.querySelector("div.pat-forward");
            const source2 = document.querySelector("button.pat-forward");

            const target1 = document.querySelector("#target1");
            const target2 = document.querySelector("#target2");

            let target1_clicks = 0;
            target1.addEventListener("click", () => {
                target1_clicks++;
            });

            let target2_clicks = 0;
            target2.addEventListener("click", () => {
                target2_clicks++;
            });

            new pattern(source1);
            new pattern(source2);

            source1.click();
            expect(target1_clicks).toBe(1);

            source2.click();
            expect(target2_clicks).toBe(1);
            expect(target1_clicks).toBe(2);
        });
    });
});

import $ from "jquery";
import Pattern, { ClassToggler, AttributeToggler } from "./toggle";
import utils from "../../core/utils";

describe("pat-toggle", function () {
    describe("ClassToggler", function () {
        describe("Check if ClassToggler.get()", function () {
            it("handles elements without classes.", function () {
                var el = document.createElement("div"),
                    toggler = new ClassToggler(["red", "green", "blue"]);
                expect(toggler.get(el)).toBeNull();
            });

            it("handles elements unknown classes.", function () {
                var el = document.createElement("div"),
                    toggler = new ClassToggler(["red", "green", "blue"]);
                el.className = "yellow";
                expect(toggler.get(el)).toBeNull();
            });

            it("handles elements with handled class.", function () {
                var el = document.createElement("div"),
                    toggler = new ClassToggler(["red", "green", "blue"]);
                el.className = "green";
                expect(toggler.get(el)).toBe("green");
            });
        });

        describe("Check if ClassToggler.set()", function () {
            it("can set a first class", function () {
                var el = document.createElement("div"),
                    toggler = new ClassToggler(["red", "green", "blue"]);
                toggler.set(el, "green");
                expect(el.className).toBe("green");
            });

            it("correctly replaces a managed class", function () {
                var el = document.createElement("div"),
                    toggler = new ClassToggler(["red", "green", "blue"]);
                el.className = "red";
                toggler.set(el, "green");
                expect(el.className).toBe("green");
            });

            it("keeps unmanaged classes in tact", function () {
                var el = document.createElement("div"),
                    toggler = new ClassToggler(["red", "green", "blue"]);
                el.className = "red error";
                toggler.set(el, "green");
                expect(el.className).toBe("error green");
            });

            it("can set null class", function () {
                var el = document.createElement("div"),
                    toggler = new ClassToggler(["active"]);
                el.className = "active";
                toggler.set(el, null);
                expect(el.className).toBe("");
            });
        });

        describe("Check if ClassToggler.next()", function () {
            it("returns first value if given null input", function () {
                var toggler = new ClassToggler(["red", "green", "blue"]);
                expect(toggler.next(null)).toBe("red");
            });

            it("will advance to next known value", function () {
                var toggler = new ClassToggler(["red", "green", "blue"]);
                expect(toggler.next("red")).toBe("green");
            });

            it("cycles back to first value", function () {
                var toggler = new ClassToggler(["red", "green", "blue"]);
                expect(toggler.next("blue")).toBe("red");
            });

            it("can handle toggling a single value", function () {
                var toggler = new ClassToggler(["active"]);
                expect(toggler.next("active")).toBeNull();
                expect(toggler.next(null)).toBe("active");
            });
        });
    });

    describe("AttributeToggler", function () {
        describe("Check if AttributeToggler.get()", function () {
            it("handles null attribute value.", function () {
                var el = document.createElement("input"),
                    toggler = new AttributeToggler("disabled");
                expect(toggler.get(el)).toBe(false);
            });

            it("handles known attribute value.", function () {
                var el = document.createElement("input"),
                    toggler = new AttributeToggler("disabled");
                el.disabled = true;
                expect(toggler.get(el)).toBe(true);
            });
        });

        describe("Check if AttributeToggler.set()", function () {
            it("Can clear a boolean property", function () {
                var el = document.createElement("input"),
                    toggler = new AttributeToggler("disabled");
                el.disabled = true;
                toggler.set(el, false);
                expect(el.disabled).toBe(false);
            });

            it("Can set a boolean property", function () {
                var el = document.createElement("input"),
                    toggler = new AttributeToggler("disabled");
                el.disabled = false;
                toggler.set(el, true);
                expect(el.disabled).toBe(true);
            });
        });

        describe("Check if AttributeToggler.next()", function () {
            it("knows false must become true", function () {
                var toggler = new AttributeToggler("disabled");
                expect(toggler.next(false)).toBe(true);
            });

            it("knows true must become false", function () {
                var toggler = new AttributeToggler("disabled");
                expect(toggler.next(true)).toBe(false);
            });
        });
    });
});

describe("Pattern implementation", function () {
    describe("1 - When validating options", function () {
        it("1.1 - make sure a selector is provided", function () {
            const instance = new Pattern(document.createElement("div"));
            expect(instance._validateOptions([{ attr: "disabled" }])).toEqual([]);
        });

        it("1.2 - verify values are provided when class attribute is used", function () {
            const instance = new Pattern(document.createElement("div"));
            expect(instance._validateOptions([{ attr: "class" }])).toEqual([]);
        });

        it("1.3 - verify values are not provided when a non-class attribute is used", function () {
            const instance = new Pattern(document.createElement("div"));
            expect(
                instance._validateOptions([{ attr: "disabled", values: "true false" }])
            ).toEqual([]);
        });

        it("1.4 - check trigger has an id when storage is requested", function () {
            const instance = new Pattern(document.createElement("div"));
            expect(
                instance._validateOptions([{ attr: "disabled", store: "local" }])
            ).toEqual([]);
        });

        it("1.5 - accept valid options", function () {
            const instance = new Pattern(document.createElement("div"));
            var input = {
                    selector: "div",
                    attr: "disabled",
                    store: "none",
                },
                output;
            output = instance._validateOptions([input]);
            expect(output.length).toBe(1);
            output = output[0];
            delete output.toggler;
            expect(output).toEqual({
                selector: "div",
                attr: "disabled",
                store: "none",
            });
        });

        it("1.6 - Accept attribute as an alias to attr.", function () {
            const instance = new Pattern(document.createElement("div"));
            const validated = instance._validateOptions([
                { attribute: "disabled", selector: "input" },
            ]);
            expect(validated.length).toEqual(1);
            expect(validated[0].attribute).toEqual("disabled");
            expect(validated[0].selector).toEqual("input");
        });
    });

    describe("2 - When clicking on a toggle", function () {
        var lab, trigger, victims;

        beforeEach(function () {
            lab = document.createElement("div");
            lab.id = "lab";
            trigger = document.createElement("a");
            trigger.href = "http://google.com";
            trigger.className = "pat-toggle";
            lab.appendChild(trigger);
            victims = [];
            for (var i = 1; i < 3; i++) {
                var v = document.createElement("input");
                v.id = "victim" + i;
                v.className = "victim";
                lab.appendChild(v);
                victims.push(v);
            }
            document.body.appendChild(lab);
        });

        afterEach(function () {
            document.body.removeChild(lab);
        });

        it("2.1 - the class is toggled", async function () {
            var $trigger = $(trigger);
            $(victims).addClass("foo");
            trigger.dataset.patToggle = ".victim; value: foo bar";
            new Pattern($trigger);
            $trigger.click();
            await utils.timeout(1);
            expect(victims[0].className).toBe("victim bar");
            $trigger.click();
            await utils.timeout(1);
            expect(victims[0].className).toBe("victim foo");
        });

        it("2.2 - attributes are updated", async function () {
            var $trigger = $(trigger);
            trigger.dataset.patToggle = ".victim; attr: disabled";
            new Pattern($trigger);
            $trigger.click();
            await utils.timeout(1);
            expect(victims[0].disabled).toBe(true);
            $trigger.click();
            await utils.timeout(1);
            expect(victims[0].disabled).toBe(false);
        });

        it("2.3 - attributes are updated - use the alias", async function () {
            var $trigger = $(trigger);
            trigger.dataset.patToggle = ".victim; attribute: disabled";
            new Pattern($trigger);
            $trigger.click();
            await utils.timeout(1);
            expect(victims[0].disabled).toBe(true);
            $trigger.click();
            await utils.timeout(1);
            expect(victims[0].disabled).toBe(false);
        });
    });

    describe("3 - Toggle event triggers", function () {
        it("3.1 - by default on click event", async function () {
            $(
                "" +
                    '<div id="lab">' +
                    ' <a class="pat-toggle"' +
                    '    data-pat-toggle="selector: #target;' +
                    '                     value: toggled">Button</a>' +
                    ' <div id="target">' +
                    '   <a href="patterns.html">Click here to go somewhere else</a>' +
                    " </div>" +
                    "</div>"
            ).appendTo(document.body);

            expect($(".toggled").length).toEqual(0);
            new Pattern($(".pat-toggle"));

            expect($(".toggled").length).toEqual(0);
            $(".pat-toggle").click();
            await utils.timeout(1);
            expect($(".toggled").length).toEqual(1);
            $(".pat-toggle").click();
            await utils.timeout(1);
            expect($(".toggled").length).toEqual(0);
        });

        it("3.2 - can also listen to custom event", async function () {
            $(
                "" +
                    '<div id="lab">' +
                    ' <a class="pat-toggle"' +
                    '    data-pat-toggle="selector: #target;' +
                    '                     value: toggled; event: onmouseenter">Button</a>' +
                    ' <div id="target">' +
                    '   <a href="patterns.html">Click here to go somewhere else</a>' +
                    " </div>" +
                    "</div>"
            ).appendTo(document.body);

            expect($(".toggled").length).toEqual(0);
            new Pattern($(".pat-toggle"));
            await utils.timeout(1);

            expect($(".toggled").length).toEqual(0);
            $(".pat-toggle").trigger("onmouseenter");
            await utils.timeout(1);
            expect($(".toggled").length).toEqual(1);
        });
    });

    describe("4 - Works together with other patterns", function () {
        afterEach(function () {
            document.body.innerHTML = "";
        });

        it("4.1 - the class is toggled", async function () {
            document.body.innerHTML = `
              <div
                  class="red"
                  id="target">target</div>
              <label
                  class="pat-checklist pat-toggle"
                  data-pat-toggle="selector: #target; value: red green">
				<input type="checkbox" name="toggler">
			  </label>
            `;

            const pattern_checklist = (await import("../checklist/checklist")).default;

            const el_label = document.querySelector("label");
            const el_target = document.querySelector("#target");
            const el_checkbox = document.querySelector("input");

            new Pattern(el_label);
            new pattern_checklist(el_label);
            await utils.timeout(1);

            $(el_label).click();
            await utils.timeout(1);

            expect(el_target.classList.length).toBe(1);
            expect(el_target.classList[0]).toBe("green");
            expect(el_checkbox.checked).toBe(true);

            $(el_label).click();
            await utils.timeout(1);

            expect(el_target.classList.length).toBe(1);
            expect(el_target.classList[0]).toBe("red");
            expect(el_checkbox.checked).toBe(false);
        });
    });
});

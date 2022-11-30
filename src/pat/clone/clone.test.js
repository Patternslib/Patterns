import Base from "../../core/base";
import registry from "../../core/registry";
import Clone from "./clone";
import $ from "jquery";
import { jest } from "@jest/globals";

describe("pat-clone", function () {
    describe("1 - Basic tests", function () {
        beforeEach(function () {
            $("div#lab").remove();
            $("<div/>", { id: "lab" }).appendTo(document.body);
        });
        afterEach(function () {
            $("#lab").remove();
            jest.restoreAllMocks();
        });

        it("clones the node's first child when .add-clone is clicked and places the clone after the cloned element", function () {
            var $lab = $("#lab");
            $lab.html(
                '<div class="pat-clone">' +
                    '    <div class="item">Clone Me</div>' +
                    '    <button class="add-clone">Clone!</button>' +
                    "</div>"
            );
            registry.scan($lab);
            expect($("div.item").length).toBe(1);
            $lab.find(".add-clone").click();
            expect($("div.item").length).toBe(2);

            // Try now a different variation with the trigger inside the cloned
            // element.
            $lab.empty().html(
                '<div class="pat-clone">' +
                    '    <div class="item">' +
                    '       <button class="add-clone">Clone!</button>' +
                    "    </div>" +
                    "</div>"
            );

            registry.scan($lab);
            expect($("div.item").length).toBe(1);
            $lab.find(".add-clone").click();
            expect($("div.item").length).toBe(2);
            $lab.find(".add-clone:last").click();
            expect($("div.item").length).toBe(3);
            $lab.find(".add-clone:first").click();
            expect($("div.item").length).toBe(4);
        });

        it("allows the trigger element to be configured", function () {
            var $lab = $("#lab");
            $lab.html(
                '<div class="pat-clone" data-pat-clone="trigger-element: .real-add-clone;">' +
                    '    <div class="item">Clone Me</div>' +
                    '    <button class="add-clone">Will not Clone!</button>' +
                    '    <button class="real-add-clone">Clone!</button>' +
                    "</div>"
            );
            registry.scan($lab);
            expect($("div.item").length).toBe(1);
            $lab.find(".add-clone").click();
            expect($("div.item").length).toBe(1);
            $lab.find(".real-add-clone").click();
            expect($("div.item").length).toBe(2);
        });

        it("allows the cloned element to be configured", function () {
            var $lab = $("#lab");
            $lab.html(
                '<div class="pat-clone" data-pat-clone="template: #my-template">' +
                    '    <div class="item">Original item</div>' +
                    '    <div class="item" id="my-template">Clone template</div>' +
                    "</div>" +
                    '<button class="add-clone">Clone!</button>'
            );
            registry.scan($lab);
            expect($("div.item").length).toBe(2);
            $lab.find(".add-clone").click();
            expect($("div.item").length).toBe(3);
            expect($("div.item:last").text()).toBe("Clone template");
            expect($("div.item:contains('Clone template')").length).toBe(2);
        });

        it("will replace #{1} in element attributes with the number of the clone", function () {
            var $lab = $("#lab");
            $lab.html(
                '<div class="pat-clone">' +
                    '    <p class="legend clone clone#{1}" hidden name="item-#{1}">Family member #{1}</p>' +
                    "</div>" +
                    '<button class="add-clone">Clone!</button>'
            );
            registry.scan($lab);
            expect($("p.legend").length).toBe(1);
            expect($("p.legend:last").attr("class")).toBe("legend clone clone#{1}");

            $lab.find(".add-clone").click();
            expect($("p.legend").length).toBe(2);
            expect($("p.legend:last").attr("name")).toBe("item-2");
            expect($("p.legend:last").attr("class")).toBe("legend clone clone2");

            $lab.find(".add-clone").click();
            expect($("p.legend").length).toBe(3);
            expect($("p.legend:last").attr("name")).toBe("item-3");
            expect($("p.legend:last").attr("class")).toBe("legend clone clone3");
        });

        it("will replace #{1} in the element id with the number of the clone and remove ids without the substring #{1}", function () {
            var $lab = $("#lab");
            $lab.html(
                '<div class="pat-clone">' +
                    '    <p id="hello world#{1}" class="clone legend clone#{1}" name="item-#{1}">Family member #{1}</p>' +
                    "</div>" +
                    '<button class="add-clone">Clone!</button>'
            );
            registry.scan($lab);
            expect($("p.legend").length).toBe(1);
            expect($("p.legend:last").attr("id")).toBe("hello world#{1}");

            $lab.find(".add-clone").click();
            expect($("p.legend").length).toBe(2);
            expect($("p.legend:last").attr("id")).toBe("world2");

            $lab.find(".add-clone").click();
            expect($("p.legend").length).toBe(3);
            expect($("p.legend:last").attr("id")).toBe("world3");
        });

        it('has a "clone-element" argument which is necessary when starting with pre-existing clones', function () {
            jest.spyOn(window, "confirm").mockImplementation(() => {
                return true;
            });
            var $lab = $("#lab");
            $lab.html(
                '<div class="pat-clone" data-pat-clone="clone-element: .item">' +
                    '    <div class="item"><button type="button" class="remove-clone">Remove</button></div>' +
                    '    <div class="item"><button type="button" class="remove-clone">Remove</button></div>' +
                    '    <div class="item"><button type="button" class="remove-clone">Remove</button></div>' +
                    "</div>" +
                    '<button class="add-clone">Clone!</button>'
            );
            registry.scan($lab);
            expect($("div.item").length).toBe(3);

            $lab.find(".add-clone").click();
            expect($("div.item").length).toBe(4);

            $lab.find(".remove-clone:last").click();
            expect($("div.item").length).toBe(3);

            $lab.find(".remove-clone:last").click();
            expect($("div.item").length).toBe(2);

            $lab.find(".remove-clone:last").click();
            expect($("div.item").length).toBe(1);

            $lab.find(".remove-clone:last").click();
            expect($("div.item").length).toBe(0);
        });

        it("will remove a clone when .remove-clone inside the clone is clicked.", function () {
            var spy_window = jest.spyOn(window, "confirm").mockImplementation(() => {
                return true;
            });
            var $lab = $("#lab");
            $lab.html(
                '<div class="pat-clone" data-pat-clone="clone-element: .item">' +
                    '    <div class="item"><button type="button" class="remove-clone">Remove</button></div>' +
                    "</div>" +
                    '<button class="add-clone">Clone!</button>'
            );
            registry.scan($lab);
            expect($("div.item").length).toBe(1);

            $lab.find(".add-clone").click();
            expect($("div.item").length).toBe(2);

            $lab.find(".remove-clone:last").click();
            expect(spy_window).toHaveBeenCalled();
            expect($("div.item").length).toBe(1);

            $lab.find(".remove-clone").click();
            expect(spy_window).toHaveBeenCalled();
            expect($("div.item").length).toBe(0);
        });

        it("allows the remove element to be configured", function () {
            var spy_window = jest.spyOn(window, "confirm").mockImplementation(() => {
                return true;
            });
            var $lab = $("#lab");
            $lab.html(
                '<div class="pat-clone" data-pat-clone="clone-element: .item; remove-element: .custom-remove-class;">' +
                    '    <div class="item"><button type="button" class="custom-remove-class">Remove</button></div>' +
                    "</div>" +
                    '<button class="add-clone">Clone!</button>'
            );
            registry.scan($lab);
            expect($("div.item").length).toBe(1);

            $lab.find(".add-clone").click();
            expect($("div.item").length).toBe(2);

            $lab.find(".custom-remove-class:last").click();
            expect(spy_window).toHaveBeenCalled();
            expect($("div.item").length).toBe(1);

            $lab.find(".custom-remove-class").click();
            expect(spy_window).toHaveBeenCalled();
            expect($("div.item").length).toBe(0);
        });

        it("will by default ask for confirmation before removing elements, but can be configured otherwise", function () {
            var spy_confirm = jest.spyOn(window, "confirm").mockImplementation(() => {
                return true;
            });
            var $lab = $("#lab");
            $lab.html(
                '<div class="pat-clone" data-pat-clone="clone-element: .item; remove-behaviour: confirm">' +
                    '    <div class="item"><button type="button" class="remove-clone">Remove</button></div>' +
                    "</div>" +
                    '<button class="add-clone">Clone!</button>'
            );
            registry.scan($lab);
            expect($("div.item").length).toBe(1);

            $lab.find(".add-clone").click();
            expect($("div.item").length).toBe(2);

            $lab.find(".remove-clone:last").click();
            expect(spy_confirm).toHaveBeenCalled();
            expect(window.confirm.mock.calls.length).toBe(1);
            expect($("div.item").length).toBe(1);

            $lab.empty();
            $lab.html(
                '<div class="pat-clone" data-pat-clone="clone-element: .item; remove-behaviour: none">' +
                    '    <div class="item"><button type="button" class="remove-clone">Remove</button></div>' +
                    "</div>" +
                    '<button class="add-clone">Clone!</button>'
            );
            registry.scan($lab);
            expect($("div.item").length).toBe(1);

            $lab.find(".add-clone").click();
            expect($("div.item").length).toBe(2);

            $lab.find(".remove-clone:last").click();
            expect(window.confirm.mock.calls.length).toBe(1);
            expect($("div.item").length).toBe(1);
        });
    });

    describe("2 - pat clone and pattern initialization", function () {
        const patterns = registry.patterns;

        beforeEach(function () {
            registry.clear();
            registry.register(Clone, "clone");
        });

        afterEach(function () {
            registry.patterns = patterns;
        });

        it("will initialize patterns when cloned.", function () {
            Base.extend({
                name: "example",
                trigger: ".pat-example",
                init: function () {
                    this.el.innerHTML += "initialized";
                },
            });

            document.body.innerHTML = `
                    <div id="template">
                        <div class="pat-example"></div>
                    </div>
                    <div class="pat-clone" data-pat-clone="template: #template">
                      <button type="button" class="add-clone">clone</button>
                    </div>
                `;
            registry.scan(document.body);

            // Without further action patterns in templates are initialized.
            // Not what we want, normally.
            expect(
                document.body.querySelector("#template .pat-example").textContent
            ).toBe("initialized");

            document.body.querySelector("button").click();

            // The cloned pattern is double-initialized.
            expect(
                document.body.querySelector(".pat-clone .pat-example").textContent
            ).toBe("initializedinitialized");
        });

        it("will not initialize patterns in the template wrapped in disable-patterns.", function () {
            Base.extend({
                name: "example",
                trigger: ".pat-example",
                init: function () {
                    this.el.innerHTML += "initialized";
                },
            });

            document.body.innerHTML = `
                    <div id="template" class="disable-patterns">
                        <div class="pat-example"></div>
                    </div>
                    <div class="pat-clone" data-pat-clone="template: #template">
                      <button type="button" class="add-clone">clone</button>
                    </div>
                `;
            registry.scan(document.body);

            // The template-pattern isn't initialized.
            expect(
                document.body.querySelector("#template .pat-example").textContent
            ).toBe("");

            document.body.querySelector("button").click();

            // The cloned pattern is only initialized once.
            expect(
                document.body.querySelector(".pat-clone .pat-example").textContent
            ).toBe("initialized");
        });

        it("will not initialize patterns wrapped in <template> tags.", function () {
            Base.extend({
                name: "example",
                trigger: ".pat-example",
                init: function () {
                    this.el.innerHTML += "initialized";
                },
            });

            document.body.innerHTML = `
                    <template id="template">
                        <div class="pat-example"></div>
                    </template>
                    <div class="pat-clone" data-pat-clone="template: #template">
                      <button type="button" class="add-clone">clone</button>
                    </div>
                `;
            registry.scan(document.body);

            // The template-pattern isn't initialized.
            expect(
                document.querySelector("#template").content.firstElementChild.textContent
            ).toBe("");

            document.querySelector("button").click();

            // The cloned pattern is only initialized once.
            expect(document.querySelector(".pat-clone .pat-example").textContent).toBe(
                "initialized"
            );
        });

        it("can clone <template> with multiple first-level childs.", function () {
            document.body.innerHTML = `
                    <template id="template">
                        <label>first
                            <input type="text" name="first" />
                        </label>
                        <label>second
                            <input type="text" name="second" />
                        </label>
                        <button type="button" class="remove-clone" />
                    </template>
                    <div class="pat-clone" data-pat-clone="template: #template; remove-behavior: none">
                      <button type="button" class="add-clone">clone</button>
                    </div>
                `;
            registry.scan(document.body);

            document.querySelector(".add-clone").click();

            expect(document.querySelectorAll(".pat-clone label").length).toBe(2); // prettier-ignore

            document.querySelector(".add-clone").click();

            expect(document.querySelectorAll(".pat-clone label").length).toBe(4); // prettier-ignore

            document.querySelector(".remove-clone").click();

            expect(document.querySelectorAll(".pat-clone label").length).toBe(2); // prettier-ignore

            document.querySelector(".remove-clone").click();

            expect(document.querySelectorAll(".pat-clone label").length).toBe(0); // prettier-ignore
        });
    });

    describe("3 - pat-update event support", function () {
        it("throws pat-update when clones are added.", async function () {
            document.body.innerHTML = `
                <div class="pat-clone"
                     data-pat-clone="remove-behaviour: none;">
                    <div class="item">
                        Clone Me
                        <button class="remove-clone" type="button">remove</button>
                    </div>
                    <button class="add-clone" type="button">Clone!</button>
                </div>
            `;

            const el = document.querySelector(".pat-clone");
            new Clone(el);

            let data;
            $(el).on("pat-update", (e, d) => {
                data = d;
            });

            expect(document.querySelectorAll(".item").length).toBe(1);

            document.querySelector(".add-clone").click();
            expect(document.querySelectorAll(".item").length).toBe(2);

            const cloned = document.querySelectorAll(".item")[1];
            expect(data.pattern).toBe("clone");
            expect(data.action).toBe("added");
            expect(data.dom).toBe(cloned);

            cloned.querySelector(".remove-clone").click();
            expect(document.querySelectorAll(".item").length).toBe(1);
            expect(data.pattern).toBe("clone");
            expect(data.action).toBe("removed");
            expect(data.dom).toBe(cloned);
        });
    });
});

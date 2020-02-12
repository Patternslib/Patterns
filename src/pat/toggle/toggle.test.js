import pattern from "./toggle";
import $ from "jquery";
import registry from "../../core/registry";

describe("pat-toggle", function() {
    describe("ClassToggler", function() {
        var ClassToggler = pattern._ClassToggler;

        describe("Check if ClassToggler.get()", function() {
            it("handles elements without classes.", function() {
                var el = document.createElement("div"),
                    toggler = new ClassToggler(["red", "green", "blue"]);
                expect(toggler.get(el)).toBeNull();
            });

            it("handles elements unknown classes.", function() {
                var el = document.createElement("div"),
                    toggler = new ClassToggler(["red", "green", "blue"]);
                el.className = "yellow";
                expect(toggler.get(el)).toBeNull();
            });

            it("handles elements with handled class.", function() {
                var el = document.createElement("div"),
                    toggler = new ClassToggler(["red", "green", "blue"]);
                el.className = "green";
                expect(toggler.get(el)).toBe("green");
            });
        });

        describe("Check if ClassToggler.set()", function() {
            it("can set a first class", function() {
                var el = document.createElement("div"),
                    toggler = new ClassToggler(["red", "green", "blue"]);
                toggler.set(el, "green");
                expect(el.className).toBe("green");
            });

            it("correctly replaces a managed class", function() {
                var el = document.createElement("div"),
                    toggler = new ClassToggler(["red", "green", "blue"]);
                el.className = "red";
                toggler.set(el, "green");
                expect(el.className).toBe("green");
            });

            it("keeps unmanaged classes in tact", function() {
                var el = document.createElement("div"),
                    toggler = new ClassToggler(["red", "green", "blue"]);
                el.className = "red error";
                toggler.set(el, "green");
                expect(el.className).toBe("error green");
            });

            it("can set null class", function() {
                var el = document.createElement("div"),
                    toggler = new ClassToggler(["active"]);
                el.className = "active";
                toggler.set(el, null);
                expect(el.className).toBe("");
            });
        });

        describe("Check if ClassToggler.next()", function() {
            it("returns first value if given null input", function() {
                var toggler = new ClassToggler(["red", "green", "blue"]);
                expect(toggler.next(null)).toBe("red");
            });

            it("will advance to next known value", function() {
                var toggler = new ClassToggler(["red", "green", "blue"]);
                expect(toggler.next("red")).toBe("green");
            });

            it("cycles back to first value", function() {
                var toggler = new ClassToggler(["red", "green", "blue"]);
                expect(toggler.next("blue")).toBe("red");
            });

            it("can handle toggling a single value", function() {
                var toggler = new ClassToggler(["active"]);
                expect(toggler.next("active")).toBeNull();
                expect(toggler.next(null)).toBe("active");
            });
        });
    });

    describe("AttributeToggler", function() {
        var AttributeToggler = pattern._AttributeToggler;

        describe("Check if AttributeToggler.get()", function() {
            it("handles null attribute value.", function() {
                var el = document.createElement("input"),
                    toggler = new AttributeToggler("disabled");
                expect(toggler.get(el)).toBe(false);
            });

            it("handles known attribute value.", function() {
                var el = document.createElement("input"),
                    toggler = new AttributeToggler("disabled");
                el.disabled = true;
                expect(toggler.get(el)).toBe(true);
            });
        });

        describe("Check if AttributeToggler.set()", function() {
            it("Can clear a boolean property", function() {
                var el = document.createElement("input"),
                    toggler = new AttributeToggler("disabled");
                el.disabled = true;
                toggler.set(el, false);
                expect(el.disabled).toBe(false);
            });

            it("Can set a boolean property", function() {
                var el = document.createElement("input"),
                    toggler = new AttributeToggler("disabled");
                el.disabled = false;
                toggler.set(el, true);
                expect(el.disabled).toBe(true);
            });
        });

        describe("Check if AttributeToggler.next()", function() {
            it("knows false must become true", function() {
                var toggler = new AttributeToggler("disabled");
                expect(toggler.next(false)).toBe(true);
            });

            it("knows true must become false", function() {
                var toggler = new AttributeToggler("disabled");
                expect(toggler.next(true)).toBe(false);
            });
        });
    });
});

describe("Pattern implementation", function() {
    var toggle = pattern;

    describe("When validating options", function() {
        it("make sure a selector is provided", function() {
            expect(
                toggle._validateOptions(null, [{ attr: "disabled" }])
            ).toEqual([]);
        });

        it("verify values are provided when class attribute is used", function() {
            expect(
                toggle._validateOptions(null, [{ attr: "class" }])
            ).toEqual([]);
        });

        it("verify values are not provided when a non-class attribute is used", function() {
            expect(
                toggle._validateOptions(null, [
                    { attr: "disabled", values: "true false" }
                ])
            ).toEqual([]);
        });

        it("check trigger has an id when storage is requested", function() {
            var trigger = document.createElement("div");
            expect(
                toggle._validateOptions(trigger, [
                    { attr: "disabled", store: "local" }
                ])
            ).toEqual([]);
        });

        it("accept valid options", function() {
            var input = {
                    selector: "div",
                    attr: "disabled",
                    store: "none"
                },
                output;
            output = toggle._validateOptions(null, [input]);
            expect(output.length).toBe(1);
            output = output[0];
            delete output.toggler;
            expect(output).toEqual({
                selector: "div",
                attr: "disabled",
                store: "none"
            });
        });
    });

    describe("When clicking on a toggle", function() {
        var lab, trigger, victims;

        beforeEach(function() {
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

        afterEach(function() {
            document.body.removeChild(lab);
        });

        it("the class is toggled", function() {
            var $trigger = $(trigger);
            $(victims).addClass("foo");
            trigger.dataset.patToggle = ".victim; value: foo bar";
            pattern.init($trigger);
            $trigger.click();
            expect(victims[0].className).toBe("victim bar");
            $trigger.click();
            expect(victims[0].className).toBe("victim foo");
        });

        it("attributes are updated", function() {
            var $trigger = $(trigger);
            trigger.dataset.patToggle = ".victim; attr: disabled";
            pattern.init($trigger);
            $trigger.click();
            expect(victims[0].disabled).toBe(true);
            $trigger.click();
            expect(victims[0].disabled).toBe(false);
        });
    });

    describe("Toggle default event", function() {
        beforeEach(function() {
            this.$el = $(
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
        });

        afterEach(function() {
            this.$el.remove();
        });

        it("by default toggles on click event", function() {
            expect($(".toggled", this.$el).length).toEqual(0);

            // scan dom for patterns
            registry.scan(this.$el);
            expect($(".toggled", this.$el).length).toEqual(0);
            $(".pat-toggle", this.$el).trigger("click");
            expect($(".toggled", this.$el).length).toEqual(1);
            $(".pat-toggle", this.$el).trigger("click");
            expect($(".toggled", this.$el).length).toEqual(0);
        });
    });

    describe("Toggle custom event", function() {
        beforeEach(function() {
            this.$el = $(
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
        });

        afterEach(function() {
            this.$el.remove();
        });

        it("can also listen to custom event", function() {
            expect($(".toggled", this.$el).length).toEqual(0);
            registry.scan(this.$el);
            expect($(".toggled", this.$el).length).toEqual(0);
            $(".pat-toggle", this.$el).trigger("onmouseenter");
            expect($(".toggled", this.$el).length).toEqual(1);
        });
    });
});

import $ from "jquery";
import Base, { BasePattern } from "./base";
import registry from "./registry";
import utils from "./utils";
import { jest } from "@jest/globals";

describe("pat-base: The Base class for patterns", function () {
    const patterns = registry.patterns;

    beforeEach(function () {
        registry.clear();
    });

    afterEach(function () {
        registry.patterns = patterns;
        jest.restoreAllMocks();
    });

    it("1 - can be extended and used in similar way as classes /1", async function () {
        class Tmp extends BasePattern {
            name = "example";
            some = "thing";
        }
        class Tup extends Tmp {
            name = "example2";
            init() {
                this.extra();
            }
            extra() {
                this.some = "other";
            }
        }

        const $el1 = $("<div />");
        const el1 = $el1[0];
        const $el2 = $("<div />");
        const el2 = $el2[0];

        const tmp = new Tmp(el1);
        await utils.timeout(1);

        const tup = new Tup($el2);
        await utils.timeout(1);

        expect(tmp instanceof Tmp).toBe(true);
        expect(tmp instanceof Tup).toBe(false);
        expect(tmp.el).toEqual(el1);
        expect(tmp.$el).toEqual($el1);
        expect(tmp.some).toEqual("thing");

        expect(tup instanceof Tmp).toBe(true);
        expect(tup instanceof Tup).toBe(true);
        expect(tmp.el).toEqual(el2);
        expect(tmp.$el).toEqual($el2);
        expect(tup.some).toEqual("other");
    });

    it("2 - can be extended and used in similar way as classes /2", async function () {
        const Tmp = Base.extend({
            name: "example",
            some: "thing",
            init: function () {
                expect(this.$el.hasClass("pat-example")).toEqual(true);
                expect(this.options.option).toBe("value");
                this.extra();
            },
            extra: function () {
                expect(this.some).toEqual("thing");
            },
        });
        const $el = $(`<div class="pat-example"/>`);
        const el = $el[0];
        const tmp = new Tmp($el, { option: "value" });
        await utils.timeout(1);
        expect(tmp instanceof Tmp).toBeTruthy();
        expect(tmp.$el).toEqual($el);
        expect(tmp.el).toEqual(el);
        expect(tmp.name).toEqual("example");
    });

    it("3 - can be extended multiple times", async function () {
        class Tmp1 extends BasePattern {
            name = "example1";
            something = "else";
            init() {}
        }
        class Tmp2 extends Tmp1 {
            name = "example2";
            some = "thing2";
            init() {}
        }
        class Tmp3 extends Tmp2 {
            name = "example3";
            some = "thing3";
            init() {}
        }

        const el = document.createElement("div");
        const tmp1 = new Tmp1(el);
        await utils.timeout(1);
        const tmp2 = new Tmp2(el);
        await utils.timeout(1);
        const tmp3 = new Tmp3(el);
        await utils.timeout(1);

        const pattern1 = el["pattern-example1"];
        const pattern2 = el["pattern-example2"];
        const pattern3 = el["pattern-example3"];

        expect(pattern1.name).toEqual("example1");
        expect(pattern1.something).toEqual("else");
        expect(pattern1.some).toEqual(undefined);
        expect(pattern1 instanceof BasePattern).toBeTruthy();
        expect(pattern1 instanceof Tmp2).toBeFalsy();
        expect(pattern1 instanceof Tmp3).toBeFalsy();

        expect(pattern2.name).toEqual("example2");
        expect(pattern2.something).toEqual("else");
        expect(pattern2.some).toEqual("thing2");
        expect(pattern2 instanceof BasePattern).toBeTruthy();
        expect(pattern2 instanceof Tmp1).toBeTruthy();
        expect(pattern2 instanceof Tmp3).toBeFalsy();

        expect(pattern3.name).toEqual("example3");
        expect(pattern3.something).toEqual("else");
        expect(pattern3.some).toEqual("thing3");
        expect(pattern3 instanceof BasePattern).toBeTruthy();
        expect(pattern3 instanceof Tmp1).toBeTruthy();
        expect(pattern3 instanceof Tmp2).toBeTruthy();
    });

    it("4 - can be extended multiple times the old way", function () {
        const Tmp1 = Base.extend({
            name: "thing",
            something: "else",
            init: function () {
                expect(this.some).toEqual("thing3");
                expect(this.something).toEqual("else");
            },
        });
        const Tmp2 = Tmp1.extend({
            name: "thing",
            some: "thing2",
            init: function () {
                expect(this.some).toEqual("thing3");
                expect(this.something).toEqual("else");
                this.constructor.__super__.constructor.__super__.init.call(this);
            },
        });
        const Tmp3 = Tmp2.extend({
            name: "thing",
            some: "thing3",
            init: function () {
                expect(this.some).toEqual("thing3");
                expect(this.something).toEqual("else");
                this.constructor.__super__.init.call(this);
            },
        });
        new Tmp3($("<div>"), { option: "value" });
    });

    it("5 - Accepts jQuery objects on initialization", function () {
        const Tmp = Base.extend({
            name: "example",
            init: () => {},
        });
        const $el = $('<div class="pat-example"/>');
        const tmp = new Tmp($el);
        expect(tmp instanceof Tmp).toBeTruthy();
        expect(tmp.$el).toBe($el);
        expect(tmp.el).toBe($el[0]);
    });

    it("6 - Accepts plain DOM nodes on initialization", function () {
        const Tmp = Base.extend({
            name: "example",
            init: () => {},
        });
        const node = document.createElement("div");
        node.setAttribute("class", "pat-example");
        const tmp = new Tmp(node);
        expect(tmp instanceof Tmp).toBeTruthy();
        expect(tmp.$el.jquery).toBeTruthy();
        expect(tmp.el).toBe(node);
    });

    it("7 - Does nothing when initialized with no DOM node", function () {
        const Tmp = Base.extend({
            name: "example",
            init: () => {},
        });
        const tmp = new Tmp(null);
        expect(tmp instanceof Tmp).toBeTruthy();
        expect(tmp.$el).toBeFalsy();
        expect(tmp.el).toBeFalsy();
    });

    it("8 - will automatically register a pattern in the registry when extended", function () {
        jest.spyOn(registry, "register");
        Base.extend({
            name: "example",
            trigger: ".pat-example",
        });
        expect(registry.register).toHaveBeenCalled();
        expect(Object.keys(registry.patterns).length).toEqual(1);
        expect(registry.patterns["example"]).toBeTruthy();
    });

    it('9 - will not automatically register a pattern when "autoregister" is set to false', async function () {
        jest.spyOn(registry, "register");
        Base.extend({
            name: "example",
            trigger: ".pat-example",
            autoregister: false,
        });
        expect(registry.register).not.toHaveBeenCalled();
        expect(Object.keys(registry.patterns).length).toEqual(0);
    });

    it('10 - will not automatically register a pattern without a "name" attribute', function () {
        jest.spyOn(registry, "register");
        Base.extend({ trigger: ".pat-example" });
        expect(registry.register).toHaveBeenCalled();
        expect(registry.patterns["example"]).toBeFalsy();
    });

    it('11 - will not automatically register a pattern without a "trigger" attribute', function () {
        jest.spyOn(registry, "register");
        Base.extend({ name: "example" });
        expect(registry.register).toHaveBeenCalled();
        expect(registry.patterns["example"]).toBeFalsy();
    });

    it("12 - will instantiate new instances of a pattern when the DOM is scanned", async function () {
        const NewPattern = Base.extend({
            name: "example",
            trigger: ".pat-example",
            init: function () {
                expect(this.$el.attr("class")).toEqual("pat-example");
            },
        });
        jest.spyOn(NewPattern.prototype, "init");
        registry.scan($('<div class="pat-example"/>'));
        await utils.timeout(1);
        expect(NewPattern.prototype.init).toHaveBeenCalled();
    });

    it("13 - requires that patterns that extend it provide an object of properties", function () {
        expect(Base.extend).toThrowError(
            "Pattern configuration properties required when calling Base.extend"
        );
    });

    it.skip("14 - has on/emit helpers to prefix events", function (done) {
        const Tmp = Base.extend({
            name: "tmp",
            trigger: ".pat-tmp",
            init: function () {
                this.on("something", function (e, arg1) {
                    expect(arg1).toEqual("yaay!");
                    done();
                });
                this.emit("somethingelse", ["yaay!"]);
            },
        });
        new Tmp(
            $("<div/>").on("somethingelse.tmp.patterns", function (e, arg1) {
                $(this).trigger("something.tmp.patterns", [arg1]);
            })
        );
    });

    it.skip("15 - has ``one`` helper to prefix events", function (done) {
        const Tmp = Base.extend({
            name: "tmp",
            trigger: ".pat-tmp",
            init: function () {
                this.one("something", function (e, arg1) {
                    expect(arg1).toEqual("yaay!");
                    done();
                });
                this.emit("somethingelse", ["yaay!"]);
            },
        });
        new Tmp(
            $("<div/>").on("somethingelse.tmp.patterns", function (e, arg1) {
                $(this).trigger("something.tmp.patterns", [arg1]);
            })
        );
    });

    it("16 - triggers the init event after init has finished.", async () => {
        const Tmp = Base.extend({
            name: "example",
            init: async function () {
                // await to actually give the Base constructor a chance to
                // throw it's event before we throw it here.
                await utils.timeout(1);
                this.el.dispatchEvent(new Event("init_done"));
            },
        });
        const node = document.createElement("div");
        node.setAttribute("class", "pat-example");
        const event_list = [];
        node.addEventListener("init_done", () => event_list.push("pat init"));
        node.addEventListener("init.example.patterns", () => event_list.push("base init")); // prettier-ignore
        new Tmp(node);

        // await until all asyncs are settled.
        await utils.timeout(1);
        await utils.timeout(1);

        expect(event_list[0]).toBe("pat init");
        expect(event_list[1]).toBe("base init");
    });

    it("17 - adds the pattern instance on the element when manually initialized", async () => {
        const Tmp = Base.extend({
            name: "example",
            init: () => {},
        });
        const node = document.createElement("div");
        node.setAttribute("class", "pat-example");
        const tmp = new Tmp(node);
        await utils.timeout(1);
        expect(tmp instanceof Tmp).toBeTruthy();
        expect(tmp.el["pattern-example"]).toBe(tmp);
        expect(tmp.$el.data("pattern-example")).toBe(tmp);
    });

    it("18 - adds the pattern instance on the element when scanning the DOM tree", async () => {
        const Tmp = Base.extend({
            name: "example",
            trigger: ".pat-example",
            init: () => {},
        });
        const node = document.createElement("div");
        node.setAttribute("class", "pat-example");
        registry.scan(node);
        await utils.timeout(1);
        expect(node["pattern-example"] instanceof Tmp).toBeTruthy();
        expect($(node).data("pattern-example") instanceof Tmp).toBeTruthy();
    });
});

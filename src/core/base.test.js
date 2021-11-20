import "regenerator-runtime/runtime"; // needed for ``await`` support
import $ from "jquery";
import Base, { BasePattern } from "./base";
import registry from "./registry";
import utils from "./utils";
import { jest } from "@jest/globals";

describe("pat-base: The Base class for patterns", function () {
    var patterns = registry.patterns;

    beforeEach(function () {
        registry.clear();
    });

    afterEach(function () {
        registry.patterns = patterns;
        jest.restoreAllMocks();
    });

    it("can be extended and used in similar way as classes", async function () {
        var Tmp = Base.extend({
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
        var tmp = new Tmp($('<div class="pat-example"/>'), { option: "value" });
        await utils.timeout(1);
        expect(tmp instanceof Tmp).toBeTruthy();
    });

    it("can be extended multiple times", async function () {
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

    it("Accepts jQuery objects on initialization", function () {
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

    it("Accepts plain DOM nodes on initialization", function () {
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

    it("will automatically register a pattern in the registry when extended", function () {
        jest.spyOn(registry, "register");
        var NewPattern = Base.extend({
            name: "example",
            trigger: ".pat-example",
        });
        expect(NewPattern.trigger).toEqual(".pat-example");
        expect(registry.register).toHaveBeenCalled();
        expect(Object.keys(registry.patterns).length).toEqual(1);
        expect(registry.patterns["example"]).toBeTruthy();
    });

    it('will not automatically register a pattern without a "name" attribute', function () {
        jest.spyOn(registry, "register");
        var NewPattern = Base.extend({ trigger: ".pat-example" });
        expect(NewPattern.trigger).toEqual(".pat-example");
        expect(registry.register).toHaveBeenCalled();
        expect(registry.patterns["example"]).toBeFalsy();
    });

    it('will not automatically register a pattern without a "trigger" attribute', function () {
        jest.spyOn(registry, "register");
        var NewPattern = Base.extend({ name: "example" });
        expect(registry.register).toHaveBeenCalled();
        expect(registry.patterns["example"]).toBeFalsy();
    });

    it("will instantiate new instances of a pattern when the DOM is scanned", async function () {
        var NewPattern = Base.extend({
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

    it("requires that patterns that extend it provide an object of properties", function () {
        expect(Base.extend).toThrowError(
            "Pattern configuration properties required when calling Base.extend"
        );
    });

    it("triggers the init event after init has finished.", async () => {
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

    it("adds the pattern instance on the element when manually initialized", async () => {
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

    it("adds the pattern instance on the element when scanning the DOM tree", async () => {
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

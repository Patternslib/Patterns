import { BasePattern } from "./basepattern";
import registry from "./registry";
import utils from "./utils";
import { jest } from "@jest/globals";

describe("Basepattern class tests", function () {
    const patterns = registry.patterns;

    beforeEach(function () {
        registry.clear();
    });

    afterEach(function () {
        registry.patterns = patterns;
        jest.restoreAllMocks();
    });

    it("1 - Trigger and name are statically available on the class.", async function () {
        class Pat extends BasePattern {
            static name = "example";
            static trigger = ".example";
        }

        // trigger and name are static and available on the class itself
        expect(Pat.trigger).toBe(".example");
        expect(Pat.name).toBe("example");

        const el = document.createElement("div");

        const pat = new Pat(el);
        await utils.timeout(1);

        expect(pat.name).toEqual("example");
        expect(pat.trigger).toEqual(".example");
    });

    it("2 - Base pattern is class based and does inheritance, polymorphism, encapsulation, ... pt1", async function () {
        class Pat1 extends BasePattern {
            some = "thing";
        }
        class Pat2 extends Pat1 {
            init() {
                this.extra();
            }
            extra() {
                this.some = "other";
            }
        }

        const el1 = document.createElement("div");
        const el2 = document.createElement("div");

        const pat1 = new Pat1(el1);
        await utils.timeout(1);

        const pat2 = new Pat2(el2);
        await utils.timeout(1);

        expect(pat1 instanceof Pat1).toBe(true);
        expect(pat1 instanceof Pat2).toBe(false);
        expect(pat1.el).toEqual(el1);
        expect(pat1.some).toEqual("thing");

        expect(pat2 instanceof Pat1).toBe(true);
        expect(pat2 instanceof Pat2).toBe(true);
        expect(pat2.el).toEqual(el2);
        expect(pat2.some).toEqual("other");
    });

    it("3 - can be extended multiple times", async function () {
        class Pat1 extends BasePattern {
            static name = "example1";
            something = "else";
            init() {}
        }
        class Pat2 extends Pat1 {
            static name = "example2";
            some = "thing2";
            init() {}
        }
        class Pat3 extends Pat2 {
            static name = "example3";
            some = "thing3";
            init() {}
        }

        const el = document.createElement("div");
        const pat1 = new Pat1(el);
        await utils.timeout(1);
        const pat2 = new Pat2(el);
        await utils.timeout(1);
        const pat3 = new Pat3(el);
        await utils.timeout(1);

        expect(pat1.name).toEqual("example1");
        expect(pat1.something).toEqual("else");
        expect(pat1.some).toEqual(undefined);
        expect(pat1 instanceof BasePattern).toBeTruthy();
        expect(pat1 instanceof Pat2).toBeFalsy();
        expect(pat1 instanceof Pat3).toBeFalsy();

        expect(pat2.name).toEqual("example2");
        expect(pat2.something).toEqual("else");
        expect(pat2.some).toEqual("thing2");
        expect(pat2 instanceof BasePattern).toBeTruthy();
        expect(pat2 instanceof Pat1).toBeTruthy();
        expect(pat2 instanceof Pat3).toBeFalsy();

        expect(pat3.name).toEqual("example3");
        expect(pat3.something).toEqual("else");
        expect(pat3.some).toEqual("thing3");
        expect(pat3 instanceof BasePattern).toBeTruthy();
        expect(pat3 instanceof Pat1).toBeTruthy();
        expect(pat3 instanceof Pat2).toBeTruthy();
    });

    it("4 - The pattern instance is stored on the element itself.", async function () {
        class Pat extends BasePattern {
            static name = "example";
        }

        const el = document.createElement("div");
        const pat = new Pat(el);
        await utils.timeout(1);

        expect(el["pattern-example"]).toEqual(pat);
    });

    it("5 - Registers with the registry.", async function () {
        class Pat extends BasePattern {
            static name = "example";
            static trigger = ".example";
        }

        registry.register(Pat);

        const el = document.createElement("div");
        el.classList.add("example");

        registry.scan(el);
        await utils.timeout(1);

        // gh-copilot wrote this line.
        expect(el["pattern-example"]).toBeInstanceOf(Pat);
    });

    it("6.1 - Registers a one-time event listener on the element.", async function () {
        const events = (await import("./events")).default;
        class Pat extends BasePattern {
            static name = "example";
            static trigger = ".example";
        }

        const el = document.createElement("div");
        el.classList.add("example");

        const pat = new Pat(el);
        await events.await_pattern_init(pat);

        // If test reaches this expect statement, the init event catched.
        expect(true).toBe(true);
    });
});

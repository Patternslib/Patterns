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

    it("1 - Trigger, name and parser are statically available on the class.", async function () {
        class Pat extends BasePattern {
            static name = "example";
            static trigger = ".example";
            static parser = { parse: () => {} }; // dummy parser
        }

        // trigger and name are static and available on the class itself
        expect(Pat.name).toBe("example");
        expect(Pat.trigger).toBe(".example");
        expect(typeof Pat.parser.parse).toBe("function");

        const el = document.createElement("div");

        const pat = new Pat(el);
        await utils.timeout(1);

        expect(pat.name).toBe("example");
        expect(pat.trigger).toBe(".example");
        expect(typeof pat.parser.parse).toBe("function");
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
        expect(pat1.el).toBe(el1);
        expect(pat1.some).toBe("thing");

        expect(pat2 instanceof Pat1).toBe(true);
        expect(pat2 instanceof Pat2).toBe(true);
        expect(pat2.el).toBe(el2);
        expect(pat2.some).toBe("other");
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

        expect(pat1.name).toBe("example1");
        expect(pat1.something).toBe("else");
        expect(pat1.some).toBe(undefined);
        expect(pat1 instanceof BasePattern).toBeTruthy();
        expect(pat1 instanceof Pat2).toBeFalsy();
        expect(pat1 instanceof Pat3).toBeFalsy();

        expect(pat2.name).toBe("example2");
        expect(pat2.something).toBe("else");
        expect(pat2.some).toBe("thing2");
        expect(pat2 instanceof BasePattern).toBeTruthy();
        expect(pat2 instanceof Pat1).toBeTruthy();
        expect(pat2 instanceof Pat3).toBeFalsy();

        expect(pat3.name).toBe("example3");
        expect(pat3.something).toBe("else");
        expect(pat3.some).toBe("thing3");
        expect(pat3 instanceof BasePattern).toBeTruthy();
        expect(pat3 instanceof Pat1).toBeTruthy();
        expect(pat3 instanceof Pat2).toBeTruthy();
    });

    it("4.1 - The pattern instance is stored on the element itself.", async function () {
        class Pat extends BasePattern {
            static name = "example";
        }

        const el = document.createElement("div");
        const pat = new Pat(el);
        await utils.timeout(1);

        expect(el["pattern-example"]).toBe(pat);
    });

    it("4.2 - The same pattern cannot be instantiated on the same element twice.", async function () {
        class Pat extends BasePattern {
            static name = "example";
        }

        const el = document.createElement("div");
        const pat = new Pat(el);
        await utils.timeout(1);

        expect(el["pattern-example"]).toBe(pat);

        const pat2 = new Pat(el);
        await utils.timeout(1);

        expect(el["pattern-example"]).toBe(pat);
        expect(el["pattern-example"]).not.toBe(pat2);
    });

    it("4.3 - The same pattern can be instantiated on the same element again, after the first was destroyed.", async function () {
        class Pat extends BasePattern {
            static name = "example";
        }

        const el = document.createElement("div");
        const pat = new Pat(el);
        await utils.timeout(1);

        expect(el["pattern-example"]).toBe(pat);

        pat.destroy();

        const pat2 = new Pat(el);
        await utils.timeout(1);

        expect(el["pattern-example"]).not.toBe(pat);
        expect(el["pattern-example"]).toBe(pat2);
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

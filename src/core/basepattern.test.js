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

    it("1.1 - Trigger, name and parser are statically available on the class.", async function () {
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

        // Test more attributes
        expect(pat.el).toBe(el);
        expect(pat.uuid).toMatch(/^[0-9a-f\-]*$/);
    });

    it("1.2 - Options are created with grouping per default.", async function () {
        const Parser = (await import("./parser")).default;

        const parser = new Parser("example");
        parser.addArgument("a", 1);
        parser.addArgument("camel-b", 2);
        parser.addArgument("test-a", 3);
        parser.addArgument("test-b", 4);

        class Pat extends BasePattern {
            static name = "example";
            static trigger = ".example";
            static parser = parser;
        }

        const el = document.createElement("div");
        const pat = new Pat(el);
        await utils.timeout(1);

        expect(pat.options.a).toBe(1);
        expect(pat.options.camelB).toBe(2);
        expect(pat.options.test.a).toBe(3);
        expect(pat.options.test.b).toBe(4);
    });

    it("1.3 - Option grouping can be turned off.", async function () {
        const Parser = (await import("./parser")).default;

        const parser = new Parser("example");
        parser.addArgument("a", 1);
        parser.addArgument("camel-b", 2);
        parser.addArgument("test-a", 3);
        parser.addArgument("test-b", 4);

        class Pat extends BasePattern {
            static name = "example";
            static trigger = ".example";
            static parser = parser;

            parser_group_options = false;
        }

        const el = document.createElement("div");
        const pat = new Pat(el);
        await utils.timeout(1);

        expect(pat.options.a).toBe(1);
        expect(pat.options["camel-b"]).toBe(2);
        expect(pat.options["test-a"]).toBe(3);
        expect(pat.options["test-b"]).toBe(4);
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

    it("6.1 - Can register a special namespaced one-time event listener on the element.", async function () {
        class Pat extends BasePattern {
            static name = "example";
            static trigger = ".example";
        }

        const el = document.createElement("div");

        const pat = new Pat(el);

        let cnt = 0;
        pat.one("test", () => {
            cnt++;
        });

        el.dispatchEvent(new Event("test.example.patterns")); // Note this special event name.

        expect(cnt).toBe(1);

        // The handler is now unregistered.
        el.dispatchEvent(new Event("test.example.patterns"));

        expect(cnt).toBe(1);
    });

    it("6.2 - Throws bubbling initialization events.", async function () {
        const events = (await import("./events")).default;
        class Pat extends BasePattern {
            static name = "example";
            static trigger = ".example";

            async init() {
                this.el.dispatchEvent(new Event("initializing"), { bubbles: true });
            }
        }

        document.body.innerHTML = "<div></div>";
        const el = document.querySelector("div");

        const event_list = [];
        document.body.addEventListener("pre-init.example.patterns", () =>
            event_list.push("pre-init.example.patterns")
        );
        document.body.addEventListener("pre-init.example.patterns", () =>
            event_list.push("initializing")
        );
        document.body.addEventListener("pre-init.example.patterns", () =>
            event_list.push("init.example.patterns")
        );

        const pat = new Pat(el);
        await events.await_pattern_init(pat);

        expect(event_list[0]).toBe("pre-init.example.patterns");
        expect(event_list[1]).toBe("initializing");
        expect(event_list[2]).toBe("init.example.patterns");
    });

    it("6.3 - Throws a not-init event in case of an double initialization event which is handled by await_pattern_init.", async function () {
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

        // The same pattern cannot be registered twice without destroying the
        // first one. If the same pattern is initialized twice on the same
        // element, a event is thrown.
        const pat2 = new Pat(el);
        try {
            await events.await_pattern_init(pat2);
        } catch (e) {
            expect(e instanceof Error).toBe(true);
            expect(e.message).toBe(`Pattern "example" not initialized.`);
        }

        // We can also use the catch method of the promise to handle that case.
        const pat3 = new Pat(el);
        await events.await_pattern_init(pat3).catch((e) => {
            expect(e instanceof Error).toBe(true);
            expect(e.message).toBe(`Pattern "example" not initialized.`);
            return; // We need to return here.
        });

        // If test reaches this expect statement, the not-init event was catched.
        expect(true).toBe(true);
    });

    it("6.4 - Destroying a pattern before re-initializing again also works together with await_pattern_init.", async function () {
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

        pat.destroy();

        const pat2 = new Pat(el);
        await events.await_pattern_init(pat2).catch(() => {
            // this is not reached.
            expect(false).toBe(true);
        });

        // If test reaches this expect statement, the init event catched.
        expect(true).toBe(true);
    });

    it("7 - Emit update event.", async function () {
        const events = (await import("./events")).default;
        class Pat extends BasePattern {
            static name = "example";
            static trigger = ".example";
        }

        const el = document.createElement("div");
        el.classList.add("example");

        const pat = new Pat(el);
        await events.await_pattern_init(pat);

        let event;
        el.addEventListener("pat-update", (e) => {
            event = e;
        });

        pat.emit_update("test");

        expect(event.detail.pattern).toBe("example");
        expect(event.detail.dom).toBe(el);
        expect(event.detail.action).toBe("test");
    });

    describe("8 - Instance scoped event listeners", function () {
        let events;
        let event_listener_map;

        class Pat extends BasePattern {
            static name = "example";
            static trigger = ".example";
        }

        beforeEach(async function () {
            ({ default: events, event_listener_map } = await import("./events"));
        });

        afterEach(function () {
            events.remove_event_listener();
        });

        it("8.1 - Registers a listener under an instance namespaced id.", async function () {
            const el = document.createElement("div");
            const pat = new Pat(el);
            await events.await_pattern_init(pat);

            const cb = jest.fn();
            pat.add_event_listener(document, "keydown", "close", cb);

            expect(
                event_listener_map
                    .get(document)
                    .has(`example--${pat.uuid}--close`)
            ).toBe(true);

            document.dispatchEvent(new KeyboardEvent("keydown"));
            expect(cb).toHaveBeenCalledTimes(1);
        });

        it("8.2 - Passes options on to addEventListener.", async function () {
            const el = document.createElement("div");
            const pat = new Pat(el);
            await events.await_pattern_init(pat);

            const cb = jest.fn();
            pat.add_event_listener(el, "test", "once", cb, { once: true });

            el.dispatchEvent(new Event("test"));
            el.dispatchEvent(new Event("test"));
            expect(cb).toHaveBeenCalledTimes(1);
        });

        it("8.3 - destroy() removes the instance listeners but not those of other instances.", async function () {
            const el1 = document.createElement("div");
            const el2 = document.createElement("div");
            const pat1 = new Pat(el1);
            const pat2 = new Pat(el2);
            await events.await_pattern_init(pat1);
            await events.await_pattern_init(pat2);

            const cb1_doc = jest.fn();
            const cb1_win = jest.fn();
            const cb2_doc = jest.fn();
            const cb2_win = jest.fn();
            pat1.add_event_listener(document, "keydown", "key", cb1_doc);
            pat1.add_event_listener(window, "resize", "resize", cb1_win);
            pat2.add_event_listener(document, "keydown", "key", cb2_doc);
            pat2.add_event_listener(window, "resize", "resize", cb2_win);

            pat1.destroy();

            document.dispatchEvent(new KeyboardEvent("keydown"));
            window.dispatchEvent(new Event("resize"));

            expect(cb1_doc).not.toHaveBeenCalled();
            expect(cb1_win).not.toHaveBeenCalled();
            expect(cb2_doc).toHaveBeenCalledTimes(1);
            expect(cb2_win).toHaveBeenCalledTimes(1);

            expect([...event_listener_map.get(document).keys()]).toEqual([
                `example--${pat2.uuid}--key`,
            ]);
            expect([...event_listener_map.get(window).keys()]).toEqual([
                `example--${pat2.uuid}--resize`,
            ]);
        });
    });

    describe("9 - Automatic destroy on removal from the DOM.", function () {
        let lifecycle;
        let events;

        class Pat extends BasePattern {
            static name = "example";
            static trigger = ".example";
        }

        beforeEach(async function () {
            ({ default: lifecycle } = await import("./lifecycle"));
            ({ default: events } = await import("./events"));
        });

        afterEach(function () {
            document.body.innerHTML = "";
        });

        it("9.1 - Connected instances are tracked after init.", async function () {
            document.body.innerHTML = `<div class="example"></div>`;
            const el = document.querySelector(".example");
            const pat = new Pat(el);
            await events.await_pattern_init(pat);

            expect(pat.destroyed).toBe(false);
            expect(lifecycle.is_tracked(pat)).toBe(true);
        });

        it("9.2 - Detached instances are not tracked and not destroyed.", async function () {
            const el = document.createElement("div");
            const pat = new Pat(el);
            await events.await_pattern_init(pat);

            expect(lifecycle.is_tracked(pat)).toBe(false);

            // Trigger the observer with an unrelated removal.
            document.body.innerHTML = `<div></div>`;
            document.body.innerHTML = "";
            await utils.timeout(1);

            expect(pat.destroyed).toBe(false);
            expect(el["pattern-example"]).toBe(pat);
        });

        it("9.3 - Removing the element destroys the pattern.", async function () {
            document.body.innerHTML = `<div class="example"></div>`;
            const el = document.querySelector(".example");
            const pat = new Pat(el);
            await events.await_pattern_init(pat);

            const cb = jest.fn();
            pat.add_event_listener(document, "keydown", "key", cb);
            const destroy_spy = jest.spyOn(pat, "destroy");

            el.remove();
            await utils.timeout(1);

            expect(destroy_spy).toHaveBeenCalledTimes(1);
            expect(pat.destroyed).toBe(true);
            expect(lifecycle.is_tracked(pat)).toBe(false);
            expect(el["pattern-example"]).toBe(undefined);

            document.dispatchEvent(new KeyboardEvent("keydown"));
            expect(cb).not.toHaveBeenCalled();
        });

        it("9.4 - Removing an ancestor destroys the pattern.", async function () {
            document.body.innerHTML = `
                <section>
                    <div><div class="example"></div></div>
                </section>
            `;
            const el = document.querySelector(".example");
            const pat = new Pat(el);
            await events.await_pattern_init(pat);

            document.querySelector("section").remove();
            await utils.timeout(1);

            expect(pat.destroyed).toBe(true);
        });

        it("9.5 - Replacing the content destroys the pattern.", async function () {
            document.body.innerHTML = `<div class="example"></div>`;
            const pat = new Pat(document.querySelector(".example"));
            await events.await_pattern_init(pat);

            document.body.innerHTML = `<div class="other"></div>`;
            await utils.timeout(1);

            expect(pat.destroyed).toBe(true);
        });

        it("9.6 - Moving the element within the same task does not destroy the pattern.", async function () {
            document.body.innerHTML = `
                <div class="a"><div class="example"></div></div>
                <div class="b"></div>
            `;
            const el = document.querySelector(".example");
            const pat = new Pat(el);
            await events.await_pattern_init(pat);

            // appendChild removes and re-inserts the node.
            document.querySelector(".b").appendChild(el);
            // Explicit detach and re-attach in the same task.
            el.remove();
            document.querySelector(".a").appendChild(el);
            await utils.timeout(1);

            expect(pat.destroyed).toBe(false);
            expect(lifecycle.is_tracked(pat)).toBe(true);
        });

        it("9.7 - Detaching and re-attaching in a later task destroys the pattern.", async function () {
            document.body.innerHTML = `<div class="example"></div>`;
            const el = document.querySelector(".example");
            const pat = new Pat(el);
            await events.await_pattern_init(pat);

            el.remove();
            await utils.timeout(1);
            document.body.appendChild(el);
            await utils.timeout(1);

            expect(pat.destroyed).toBe(true);
            expect(el["pattern-example"]).toBe(undefined);
        });

        it("9.8 - Only the removed instances are destroyed.", async function () {
            document.body.innerHTML = `
                <div class="example" id="one"></div>
                <div class="example" id="two"></div>
            `;
            const pat1 = new Pat(document.querySelector("#one"));
            const pat2 = new Pat(document.querySelector("#two"));
            await events.await_pattern_init(pat1);
            await events.await_pattern_init(pat2);

            pat1.el.remove();
            await utils.timeout(1);

            expect(pat1.destroyed).toBe(true);
            expect(pat2.destroyed).toBe(false);
        });

        it("9.9 - destroy() is idempotent and untracks the instance.", async function () {
            document.body.innerHTML = `<div class="example"></div>`;
            const el = document.querySelector(".example");
            const pat = new Pat(el);
            await events.await_pattern_init(pat);

            pat.destroy();
            expect(lifecycle.is_tracked(pat)).toBe(false);

            // A new instance on the same element must not be unregistered by
            // destroying the old instance again.
            const pat2 = new Pat(el);
            await events.await_pattern_init(pat2);
            pat.destroy();
            expect(el["pattern-example"]).toBe(pat2);

            // Removing the element destroys the new instance only once.
            const destroy_spy = jest.spyOn(pat2, "destroy");
            el.remove();
            await utils.timeout(1);
            expect(destroy_spy).toHaveBeenCalledTimes(1);
        });

        it("9.10 - destroy() of a not-initialized instance keeps the reference to the initialized one.", async function () {
            const el = document.createElement("div");
            const pat1 = new Pat(el);
            await events.await_pattern_init(pat1);

            const pat2 = new Pat(el);
            await expect(events.await_pattern_init(pat2)).rejects.toBeDefined();

            pat2.destroy();
            expect(el["pattern-example"]).toBe(pat1);
        });

        it("9.11 - A pattern destroyed before init is not initialized.", async function () {
            const init_spy = jest.spyOn(Pat.prototype, "init");

            document.body.innerHTML = `<div class="example"></div>`;
            const el = document.querySelector(".example");
            const pat = new Pat(el);
            pat.destroy();

            await expect(events.await_pattern_init(pat)).rejects.toBeDefined();

            expect(init_spy).not.toHaveBeenCalled();
            expect(el["pattern-example"]).toBe(undefined);
            expect(lifecycle.is_tracked(pat)).toBe(false);
        });

        it("9.12 - A pattern removed while initializing is destroyed after init.", async function () {
            class AsyncPat extends BasePattern {
                static name = "example-async";
                static trigger = ".example";
                async init() {
                    // Element is removed while initializing.
                    this.el.remove();
                    await utils.timeout(1);
                }
            }

            document.body.innerHTML = `<div class="example"></div>`;
            const el = document.querySelector(".example");
            const pat = new AsyncPat(el);
            await events.await_pattern_init(pat);

            expect(pat.destroyed).toBe(true);
            expect(lifecycle.is_tracked(pat)).toBe(false);
            expect(el["pattern-example-async"]).toBe(undefined);
        });

        it("9.13 - A pattern destroyed while initializing is not tracked.", async function () {
            class AsyncPat extends BasePattern {
                static name = "example-async";
                static trigger = ".example";
                async init() {
                    await utils.timeout(1);
                }
            }

            document.body.innerHTML = `<div class="example"></div>`;
            const el = document.querySelector(".example");
            const pat = new AsyncPat(el);
            await utils.timeout(1); // init has started.
            pat.destroy();
            await events.await_pattern_init(pat);

            expect(pat.destroyed).toBe(true);
            expect(lifecycle.is_tracked(pat)).toBe(false);
        });

        it("9.14 - Errors in destroy do not prevent destroying other patterns.", async function () {
            class FailingPat extends BasePattern {
                static name = "example-failing";
                static trigger = ".failing";
                destroy() {
                    super.destroy();
                    throw new Error("destroy failed");
                }
            }

            document.body.innerHTML = `
                <div class="failing"></div>
                <div class="example"></div>
            `;
            const pat1 = new FailingPat(document.querySelector(".failing"));
            const pat2 = new Pat(document.querySelector(".example"));
            await events.await_pattern_init(pat1);
            await events.await_pattern_init(pat2);

            document.body.innerHTML = "";
            await utils.timeout(1);

            expect(pat1.destroyed).toBe(true);
            expect(pat2.destroyed).toBe(true);
        });

        it("9.15 - A subclass not calling super.destroy() is destroyed only once.", async function () {
            const destroy_cb = jest.fn();
            class BadPat extends BasePattern {
                static name = "example-bad";
                static trigger = ".bad";
                destroy() {
                    destroy_cb();
                }
            }

            document.body.innerHTML = `<div class="bad"></div>`;
            const pat = new BadPat(document.querySelector(".bad"));
            await events.await_pattern_init(pat);

            document.body.innerHTML = "";
            await utils.timeout(1);
            document.body.innerHTML = `<div></div>`;
            document.body.innerHTML = "";
            await utils.timeout(1);

            expect(destroy_cb).toHaveBeenCalledTimes(1);
            expect(lifecycle.is_tracked(pat)).toBe(false);
        });
    });
});

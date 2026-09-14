import Pattern from "./bind";
import events from "../../core/events";
import utils from "../../core/utils";

// MutationObserver callbacks and effects both run as microtasks; give them a
// couple of ticks to settle.
const tick = () => utils.timeout(1);

describe("pat-bind", function () {
    afterEach(function () {
        document.body.innerHTML = "";
    });

    describe("1 - source → target", function () {
        it("1.1 - updates a text target when the source select changes", async function () {
            document.body.innerHTML = `
                <select class="pat-bind" data-pat-bind="key: color">
                    <option value="red">red</option>
                    <option value="green">green</option>
                </select>
                <span class="pat-bind" data-pat-bind="key: color; value: ::text"></span>
            `;
            const select = document.querySelector("select");
            const span = document.querySelector("span");

            const source = new Pattern(select);
            const target = new Pattern(span);
            await events.await_pattern_init(source);
            await events.await_pattern_init(target);

            // The target is seeded from the source's initial value.
            await tick();
            expect(span.textContent).toBe("red");

            select.value = "green";
            select.dispatchEvent(events.change_event());
            select.dispatchEvent(events.input_event());
            await tick();

            expect(span.textContent).toBe("green");
        });

        it("1.2 - binds to an attribute target", async function () {
            document.body.innerHTML = `
                <input class="pat-bind" data-pat-bind="key: url" value="/profile" />
                <a class="pat-bind" data-pat-bind="key: url; value: [href]">link</a>
            `;
            const input = document.querySelector("input");
            const anchor = document.querySelector("a");

            const source = new Pattern(input);
            const target = new Pattern(anchor);
            await events.await_pattern_init(source);
            await events.await_pattern_init(target);
            await tick();

            expect(anchor.getAttribute("href")).toBe("/profile");

            input.value = "/dashboard";
            input.dispatchEvent(events.input_event());
            await tick();

            expect(anchor.getAttribute("href")).toBe("/dashboard");
        });
    });

    describe("2 - two-way binding", function () {
        it("2.1 - keeps two inputs on the same channel in sync", async function () {
            document.body.innerHTML = `
                <input id="a" class="pat-bind" data-pat-bind="key: name" value="start" />
                <input id="b" class="pat-bind" data-pat-bind="key: name" />
            `;
            const a = document.querySelector("#a");
            const b = document.querySelector("#b");

            const pa = new Pattern(a);
            const pb = new Pattern(b);
            await events.await_pattern_init(pa);
            await events.await_pattern_init(pb);
            await tick();

            // b is seeded from the channel (which a seeded with "start").
            expect(b.value).toBe("start");

            // Typing into b propagates back to a (two-way).
            b.value = "changed";
            b.dispatchEvent(events.input_event());
            await tick();

            expect(a.value).toBe("changed");
        });
    });

    describe("3 - multiple bindings per element", function () {
        it("3.1 - binds text and an attribute on one element", async function () {
            document.body.innerHTML = `
                <input id="title" class="pat-bind" data-pat-bind="key: title" value="Hello" />
                <input id="cls" class="pat-bind" data-pat-bind="key: cls" value="active" />
                <div id="out" class="pat-bind"
                     data-pat-bind="key: title; value: ::text && key: cls; value: [class]"></div>
            `;
            const out = document.querySelector("#out");

            for (const el of document.querySelectorAll(".pat-bind")) {
                const instance = new Pattern(el);
                await events.await_pattern_init(instance);
            }
            await tick();

            expect(out.textContent).toBe("Hello");
            expect(out.getAttribute("class")).toContain("active");
        });
    });

    describe("4 - scope", function () {
        it("4.1 - isolates channels per scope root", async function () {
            document.body.innerHTML = `
                <div data-pat-bind-scope>
                    <input class="pat-bind" data-pat-bind="key: v" value="one" />
                    <span class="pat-bind" data-pat-bind="key: v; value: ::text"></span>
                </div>
                <div data-pat-bind-scope>
                    <input class="pat-bind" data-pat-bind="key: v" value="two" />
                    <span class="pat-bind" data-pat-bind="key: v; value: ::text"></span>
                </div>
            `;
            for (const el of document.querySelectorAll(".pat-bind")) {
                const instance = new Pattern(el);
                await events.await_pattern_init(instance);
            }
            await tick();

            const spans = document.querySelectorAll("span");
            // Each scope keeps its own "v" channel.
            expect(spans[0].textContent).toBe("one");
            expect(spans[1].textContent).toBe("two");
        });
    });

    describe("5 - direction", function () {
        it("5.1 - a target does not write back to the channel", async function () {
            document.body.innerHTML = `
                <input class="pat-bind" data-pat-bind="key: msg" value="from-source" />
                <input class="pat-bind" data-pat-bind="key: msg; value: [value]; direction: target" />
            `;
            const [source, target] = document.querySelectorAll("input");

            for (const el of document.querySelectorAll(".pat-bind")) {
                const instance = new Pattern(el);
                await events.await_pattern_init(instance);
            }
            await tick();

            expect(target.value).toBe("from-source");

            // Changing the target must NOT propagate back to the source.
            target.value = "edited";
            target.dispatchEvent(events.input_event());
            await tick();

            expect(source.value).toBe("from-source");
        });
    });
});

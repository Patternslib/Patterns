import { signal, computed, effect, batch, untracked } from "./signals";

// A microtask flush helper: effects are batched and run in a microtask.
const flush = () => Promise.resolve();

describe("core/signals", function () {
    describe("1 - signal", function () {
        it("1.1 - stores and returns its value", function () {
            const count = signal(1);
            expect(count.value).toBe(1);
            count.value = 2;
            expect(count.value).toBe(2);
        });

        it("1.2 - peek() reads without subscribing", async function () {
            const count = signal(1);
            let runs = 0;
            effect(() => {
                runs++;
                count.peek();
            });
            await flush();
            expect(runs).toBe(1);

            count.value = 2;
            await flush();
            // The effect did not subscribe via peek(), so it does not re-run.
            expect(runs).toBe(1);
        });
    });

    describe("2 - effect", function () {
        it("does not run an effect disposed while its update is pending", async function () {
            const source = signal(0);
            const read = jest.fn(() => source.value);
            const dispose = effect(read);
            source.value = 1;
            dispose();
            dispose();
            await flush();
            expect(read).toHaveBeenCalledTimes(1);
        });

        it("2.1 - runs immediately and on dependency change", async function () {
            const count = signal(1);
            const seen = [];
            effect(() => seen.push(count.value));

            // Effect runs synchronously on creation.
            expect(seen).toEqual([1]);

            count.value = 2;
            await flush();
            expect(seen).toEqual([1, 2]);
        });

        it("2.2 - coalesces multiple writes into one re-run", async function () {
            const count = signal(0);
            let runs = 0;
            effect(() => {
                runs++;
                count.value;
            });
            expect(runs).toBe(1);

            count.value = 1;
            count.value = 2;
            count.value = 3;
            await flush();
            // The three writes are flushed together → a single re-run.
            expect(runs).toBe(2);
            expect(count.value).toBe(3);
        });

        it("2.3 - does not re-run on equal-value writes", async function () {
            const count = signal(1);
            let runs = 0;
            effect(() => {
                runs++;
                count.value;
            });
            await flush();
            expect(runs).toBe(1);

            count.value = 1; // same value (Object.is) → no notification
            await flush();
            expect(runs).toBe(1);
        });

        it("2.4 - dispose() stops the effect", async function () {
            const count = signal(1);
            let runs = 0;
            const dispose = effect(() => {
                runs++;
                count.value;
            });
            await flush();
            expect(runs).toBe(1);

            dispose();
            count.value = 2;
            await flush();
            expect(runs).toBe(1);
        });

        it("2.5 - re-tracks dependencies on each run", async function () {
            const toggle = signal(true);
            const a = signal("a");
            const b = signal("b");
            const seen = [];
            effect(() => seen.push(toggle.value ? a.value : b.value));
            expect(seen).toEqual(["a"]);

            // While toggle is true, b is not a dependency.
            b.value = "b2";
            await flush();
            expect(seen).toEqual(["a"]);

            toggle.value = false;
            await flush();
            expect(seen).toEqual(["a", "b2"]);

            // Now a is no longer a dependency.
            a.value = "a2";
            await flush();
            expect(seen).toEqual(["a", "b2"]);
        });
    });

    describe("3 - computed", function () {
        it("is lazy and returns current values synchronously, including peek", async function () {
            const source = signal(1);
            const derive = jest.fn(() => source.value * 2);
            const value = computed(derive);
            expect(derive).not.toHaveBeenCalled();
            source.value = 2;
            await flush();
            expect(derive).not.toHaveBeenCalled();
            expect(value.value).toBe(4);
            expect(value.value).toBe(4);
            expect(derive).toHaveBeenCalledTimes(1);
            batch(() => {
                source.value = 3;
                expect(value.peek()).toBe(6);
            });
            expect(derive).toHaveBeenCalledTimes(2);
        });

        it("does not subscribe an effect through computed peek", async function () {
            const source = signal(1);
            const value = computed(() => source.value * 2);
            const read = jest.fn(() => value.peek());
            const dispose = effect(read);
            source.value = 2;
            await flush();
            expect(read).toHaveBeenCalledTimes(1);
            expect(value.peek()).toBe(4);
            dispose();
        });

        it("skips effects when the computed result is unchanged", async function () {
            const source = signal(1);
            const parity = computed(() => source.value % 2);
            const read = jest.fn(() => parity.value);
            const dispose = effect(read);
            source.value = 3;
            await flush();
            expect(read).toHaveBeenCalledTimes(1);
            source.value = 4;
            await flush();
            expect(read).toHaveBeenCalledTimes(2);
            dispose();
        });

        it("evaluates overlapping dependency paths once with consistent values", async function () {
            const source = signal(1);
            const doubled = computed(() => source.value * 2);
            const derive = jest.fn(() => source.value + doubled.value);
            const sum = computed(derive);
            const seen = [];
            const dispose = effect(() => seen.push(sum.value));
            for (const value of [2, 3]) {
                source.value = value;
                await flush();
            }
            expect(seen).toEqual([3, 6, 9]);
            expect(derive).toHaveBeenCalledTimes(3);
            dispose();
        });

        it("caches computation errors and recovers after a dependency changes", function () {
            const source = signal(0);
            const derive = jest.fn(() => {
                if (!source.value) throw new Error("missing value");
                return source.value;
            });
            const value = computed(derive);
            expect(() => value.value).toThrow("missing value");
            expect(() => value.peek()).toThrow("missing value");
            expect(derive).toHaveBeenCalledTimes(1);
            source.value = 1;
            expect(value.value).toBe(1);
        });

        it("freezes undefined when disposed before its first read", function () {
            const derive = jest.fn(() => 42);
            const value = computed(derive);
            value.dispose();
            value.dispose();
            expect(value.value).toBeUndefined();
            expect(derive).not.toHaveBeenCalled();
        });

        it("settles a computed chain before notifying consumers once", async function () {
            const a = signal(1);
            const b = computed(() => a.value * 2);
            const c = computed(() => b.value * 2);
            const seen = [];
            const dispose = effect(() => seen.push([a.value, c.value]));

            a.value = 2;
            await flush();
            expect(seen).toEqual([
                [1, 4],
                [2, 8],
            ]);

            a.value = 3;
            await flush();
            expect(seen).toEqual([
                [1, 4],
                [2, 8],
                [3, 12],
            ]);
            dispose();
            b.dispose();
            c.dispose();
        });

        it("settles derivations written by an effect before remaining consumers", async function () {
            const trigger = signal(0);
            const a = signal(1);
            const b = computed(() => a.value * 2);
            const write = effect(() => {
                if (trigger.value) a.value = 2;
            });
            const seen = [];
            const read = effect(() => seen.push([trigger.value, a.value, b.value]));

            trigger.value = 1;
            await flush();
            expect(seen).toEqual([
                [0, 1, 2],
                [1, 2, 4],
            ]);
            write();
            read();
            b.dispose();
        });

        it("does not run disposed computations that are pending", async function () {
            const a = signal(1);
            const derive = jest.fn(() => a.value * 2);
            const b = computed(derive);
            expect(b.value).toBe(2);
            a.value = 2;
            b.dispose();
            await flush();
            expect(derive).toHaveBeenCalledTimes(1);
            expect(b.value).toBe(2);
        });

        it("3.1 - derives from other signals", async function () {
            const first = signal("Jane");
            const last = signal("Doe");
            const full = computed(() => `${first.value} ${last.value}`);
            expect(full.value).toBe("Jane Doe");

            first.value = "John";
            await flush();
            expect(full.value).toBe("John Doe");
        });

        it("3.2 - is reactive as an effect dependency", async function () {
            const count = signal(2);
            const doubled = computed(() => count.value * 2);
            const seen = [];
            effect(() => seen.push(doubled.value));
            expect(seen).toEqual([4]);

            count.value = 5;
            await flush();
            expect(seen).toEqual([4, 10]);
        });
    });

    describe("4 - batch", function () {
        it("4.1 - defers flushing until the batch ends", async function () {
            const a = signal(1);
            const b = signal(2);
            let runs = 0;
            effect(() => {
                runs++;
                a.value + b.value;
            });
            expect(runs).toBe(1);

            batch(() => {
                a.value = 10;
                b.value = 20;
            });
            await flush();
            expect(runs).toBe(2);
        });
    });

    describe("5 - untracked", function () {
        it("5.1 - reads without creating a dependency", async function () {
            const tracked = signal(1);
            const hidden = signal(1);
            let runs = 0;
            effect(() => {
                runs++;
                tracked.value;
                untracked(() => hidden.value);
            });
            await flush();
            expect(runs).toBe(1);

            hidden.value = 2;
            await flush();
            expect(runs).toBe(1); // not a dependency

            tracked.value = 2;
            await flush();
            expect(runs).toBe(2);
        });
    });
});

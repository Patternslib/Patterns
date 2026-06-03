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

import Base from "./base";
import BasePattern from "./basepattern";
import registry from "./registry";
import utils from "./utils";

describe("pat-registry: The registry for patterns", function () {
    const patterns = registry.patterns;

    beforeEach(function () {
        registry.clear();
    });

    afterEach(function () {
        registry.patterns = patterns;
    });

    it("Does initialize a simple pattern when scanning a DOM tree", function () {
        // Base extend also registers the pattern.
        Base.extend({
            name: "example",
            trigger: ".pat-example",
            init: function () {
                this.el.innerHTML = "initialized";
            },
        });

        const tree = document.createElement("div");
        tree.setAttribute("class", "pat-example");
        registry.scan(tree);
        expect(tree.textContent).toBe("initialized");
    });

    it("Does initialize a tree of simple patterns when scanning a DOM tree", function () {
        Base.extend({
            name: "example1",
            trigger: ".pat-example1",
            init: function () {
                this.el.innerHTML = "initialized1";
            },
        });

        Base.extend({
            name: "example2",
            trigger: ".pat-example2",
            init: function () {
                this.el.innerHTML = "initialized2";
            },
        });

        const tree = document.createElement("div");
        tree.innerHTML = `
            <div class="e1 pat-example1"></div>
            <div class="e2 pat-example2"></div>
            <div class="e3 pat-example1"></div>
            <div class="e4 pat-example2"></div>
        `;
        registry.scan(tree);
        expect(tree.querySelector(".e1").textContent).toBe("initialized1");
        expect(tree.querySelector(".e2").textContent).toBe("initialized2");
        expect(tree.querySelector(".e3").textContent).toBe("initialized1");
        expect(tree.querySelector(".e4").textContent).toBe("initialized2");
    });

    it("Does not initialize patterns matching a filter", function () {
        Base.extend({
            name: "example",
            trigger: ".pat-example",
            init: function () {
                this.el.innerHTML = "initialized";
            },
        });

        const tree = document.createElement("div");
        tree.innerHTML = `
            <div class="e1 pat-example"></div>
            <div class="e2 disable-patterns pat-example"></div>
            <div class="disable-patterns">
                <div class="e3 pat-example"></div>
            </div>
            <pre>
                <div>
                    <div class="e4 pat-example"></div>
                </div>
            </pre>
            <template class="e5">
                <div>
                    <div class="pat-example"></div>
                </div>
            </template>
        `;
        registry.scan(tree);

        expect(tree.querySelector(".e1").textContent).toBe("initialized");
        expect(tree.querySelector(".e2").textContent).toBe("");
        expect(tree.querySelector(".e3").textContent).toBe("");
        expect(tree.querySelector(".e4").textContent).toBe("");
        expect(
            tree
                .querySelector(".e5")
                .content.firstElementChild.querySelector(".pat-example").textContent
        ).toBe("");
    });

    it("Does not break when trying to scan undefined.", function (done) {
        expect(() => registry.scan(undefined, [], "")).not.toThrow(Error);

        done();
    });

    it("Does nothing with Patterns without a trigger.", function () {
        registry.register(
            {
                name: "pattern-without-trigger"
            }
        )

        const el = document.createElement("div");
        expect(() => { registry.scan(el) }).not.toThrow(DOMException);
    });

    it("Does not initialize the pattern if blacklisted", function () {
        window.__patternslib_patterns_blacklist = ["example"];

        Base.extend({
            name: "example",
            trigger: ".pat-example",
            init: function () {
                this.el.innerHTML = "initialized";
            },
        });

        const tree = document.createElement("div");
        tree.setAttribute("class", "pat-example");
        registry.scan(tree);
        expect(tree.textContent).toBe("");
    });

    it("but also doesn't break with invalid blacklists", function () {
        window.__patternslib_patterns_blacklist = "example"; // not an array

        Base.extend({
            name: "example",
            trigger: ".pat-example",
            init: function () {
                this.el.innerHTML = "initialized";
            },
        });

        const tree = document.createElement("div");
        tree.setAttribute("class", "pat-example");
        registry.scan(tree);
        expect(tree.textContent).toBe("initialized");
    });

    describe("orderPatterns", function () {
        it("Orders patterns by their order property with lower values first", function () {
            // Create test patterns with different order values
            class Pattern1 extends BasePattern {
                static name = "pattern1";
                static order = 500;
            }

            class Pattern2 extends BasePattern {
                static name = "pattern2";
                static order = 100;
            }

            class Pattern3 extends BasePattern {
                static name = "pattern3";
                static order = 300;
            }

            // Register patterns
            registry.register(Pattern1);
            registry.register(Pattern2);
            registry.register(Pattern3);

            const pattern_names = ["pattern1", "pattern2", "pattern3"];
            const ordered_patterns = registry.orderPatterns(pattern_names);

            // Should be ordered by order property: pattern2 (100), pattern3 (300), pattern1 (500)
            expect(ordered_patterns).toEqual(["pattern2", "pattern3", "pattern1"]);
        });

        it("Uses default order of 1000 for patterns without explicit order", function () {
            class PatternWithOrder extends BasePattern {
                static name = "pattern-with-order";
                static order = 200;
            }

            class PatternWithoutOrder extends BasePattern {
                static name = "pattern-without-order";
                // No order property, should use default 1000
            }

            registry.register(PatternWithOrder);
            registry.register(PatternWithoutOrder);

            const pattern_names = ["pattern-without-order", "pattern-with-order"];
            const ordered_patterns = registry.orderPatterns(pattern_names);

            // pattern-with-order (200) should come before pattern-without-order (1000)
            expect(ordered_patterns).toEqual(["pattern-with-order", "pattern-without-order"]);
        });

        it("Handles patterns with same order value consistently", function () {
            class Pattern1 extends BasePattern {
                static name = "pattern1";
                static order = 500;
            }

            class Pattern2 extends BasePattern {
                static name = "pattern2";
                static order = 500;
            }

            registry.register(Pattern1);
            registry.register(Pattern2);

            const pattern_names = ["pattern2", "pattern1"];
            const ordered_patterns = registry.orderPatterns(pattern_names);

            // Both have same order, should maintain stable sort
            expect(ordered_patterns).toEqual(["pattern2", "pattern1"]);
        });

        it("Ignores non-existent patterns during ordering", function () {
            class ExistingPattern extends BasePattern {
                static name = "existing";
                static order = 300;
            }

            registry.register(ExistingPattern);

            const pattern_names = ["non-existent", "existing", "another-non-existent"];
            const ordered_patterns = registry.orderPatterns(pattern_names);

            // Only existing pattern should be returned
            expect(ordered_patterns).toEqual(["existing"]);
        });

        it("Returns empty array when no valid patterns are provided", function () {
            const pattern_names = ["non-existent1", "non-existent2"];
            const ordered_patterns = registry.orderPatterns(pattern_names);

            expect(ordered_patterns).toEqual([]);
        });

        it("Does not modify the original patterns array", function () {
            class Pattern1 extends BasePattern {
                static name = "pattern1";
                static order = 500;
            }

            class Pattern2 extends BasePattern {
                static name = "pattern2";
                static order = 100;
            }

            registry.register(Pattern1);
            registry.register(Pattern2);

            const pattern_names = ["pattern1", "pattern2"];
            const original_order = [...pattern_names];

            const ordered_patterns = registry.orderPatterns(pattern_names);

            // Original array should be unchanged
            expect(pattern_names).toEqual(original_order);
            // But result should be sorted
            expect(ordered_patterns).toEqual(["pattern2", "pattern1"]);
        });

        it("Validates expected order values for special patterns", function () {
            // Test the specific order values mentioned in the commit
            class ValidationPattern extends BasePattern {
                static name = "validation";
                static order = 100;
            }

            class CloneCodePattern extends BasePattern {
                static name = "clone-code";
                static order = 200;
            }

            class RegularPattern extends BasePattern {
                static name = "regular";
                static order = 1000;
            }

            registry.register(ValidationPattern);
            registry.register(CloneCodePattern);
            registry.register(RegularPattern);

            const pattern_names = ["regular", "clone-code", "validation"];
            const ordered_patterns = registry.orderPatterns(pattern_names);

            // Should be ordered: validation (100), clone-code (200), regular (1000)
            expect(ordered_patterns).toEqual(["validation", "clone-code", "regular"]);
        });

        it("Works with mixed order values including edge cases", function () {
            class EarliestPattern extends BasePattern {
                static name = "earliest";
                static order = 1;
            }

            class LatestPattern extends BasePattern {
                static name = "latest";
                static order = 9999;
            }

            class NegativeOrderPattern extends BasePattern {
                static name = "negative";
                static order = -50;
            }

            class DefaultPattern extends BasePattern {
                static name = "default";
                // Uses default order 1000
            }

            registry.register(EarliestPattern);
            registry.register(LatestPattern);
            registry.register(NegativeOrderPattern);
            registry.register(DefaultPattern);

            const pattern_names = ["latest", "default", "earliest", "negative"];
            const ordered_patterns = registry.orderPatterns(pattern_names);

            // Should be ordered by order value: negative (-50), earliest (1), default (1000), latest (9999)
            expect(ordered_patterns).toEqual(["negative", "earliest", "default", "latest"]);
        });
    });


    describe("register with replace", function () {
        const reset = () => {
            window.__patternslib_registry_initialized = false;
            delete window.__patternslib_patterns_blacklist;
        };

        beforeEach(reset);
        afterEach(function () {
            reset();
            jest.restoreAllMocks();
        });

        const make_pattern = (text) =>
            class extends BasePattern {
                static name = "example";
                static trigger = ".pat-example";
                init() {
                    this.el.innerHTML = text;
                }
            };

        it("Refuses to register a pattern under an already used name by default", function () {
            const first = make_pattern("first");
            const second = make_pattern("second");

            expect(registry.register(first)).toBe(true);
            expect(registry.register(second)).toBe(false);
            expect(registry.patterns.example).toBe(first);
        });

        it("Replaces an existing pattern with replace: true", function () {
            const first = make_pattern("first");
            const second = make_pattern("second");

            registry.register(first);
            expect(registry.register(second, "example", { replace: true })).toBe(true);
            expect(registry.patterns.example).toBe(second);
        });

        it("Uses the replacement when scanning", async function () {
            registry.register(make_pattern("first"));
            registry.register(make_pattern("second"), "example", { replace: true });

            const tree = document.createElement("div");
            tree.setAttribute("class", "pat-example");
            registry.scan(tree);
            await utils.timeout(1);

            expect(tree.textContent).toBe("second");
        });

        it("Base.extend replaces an existing pattern with replace: true", function () {
            const first = Base.extend({
                name: "example",
                trigger: ".pat-example",
                init: function () {},
            });
            const second = Base.extend({
                name: "example",
                trigger: ".pat-example",
                replace: true,
                init: function () {},
            });

            expect(registry.patterns.example).not.toBe(first);
            expect(registry.patterns.example).toBe(second);
        });

        it("Base.extend without replace keeps the first registration", function () {
            const first = Base.extend({
                name: "example",
                trigger: ".pat-example",
                init: function () {},
            });
            Base.extend({
                name: "example",
                trigger: ".pat-example",
                init: function () {},
            });

            expect(registry.patterns.example).toBe(first);
        });

        it("Re-scans for a replaced pattern when the registry is already initialized", function () {
            registry.register(make_pattern("first"));
            window.__patternslib_registry_initialized = true;
            const scan_spy = jest.spyOn(registry, "scan").mockImplementation(() => {});

            registry.register(make_pattern("second"), "example", { replace: true });

            expect(scan_spy).toHaveBeenCalledWith(document.body, ["example"]);
        });

        it("Does not replace a blacklisted pattern", function () {
            registry.register(make_pattern("first"));
            window.__patternslib_patterns_blacklist = ["example"];

            expect(registry.register(make_pattern("second"), "example", { replace: true })).toBe(false);
        });
    });

    describe("init with Module Federation", function () {
        let scan_spy;

        const reset = () => {
            window.__patternslib_registry_initialized = false;
            delete window.__patternslib_registry_initializing;
            delete window.__patternslib_mf_initialized;
            delete window.__patternslib_mf_init_timeout;
        };

        beforeEach(function () {
            reset();
            scan_spy = jest.spyOn(registry, "scan").mockImplementation(() => {});
        });

        afterEach(function () {
            reset();
            jest.restoreAllMocks();
        });

        it("Scans immediately when no Module Federation host is present", async function () {
            registry.init();
            await utils.timeout(10);

            expect(scan_spy).toHaveBeenCalledWith(document.body);
            expect(window.__patternslib_registry_initialized).toBe(true);
        });

        it("Defers the initial scan until the Module Federation bundles are initialized", async function () {
            let resolve_initialized;
            window.__patternslib_mf_initialized = new Promise((resolve) => {
                resolve_initialized = resolve;
            });

            registry.init();
            await utils.timeout(10);

            expect(scan_spy).not.toHaveBeenCalled();
            expect(window.__patternslib_registry_initialized).toBe(false);

            resolve_initialized([]);
            await utils.timeout(1);

            expect(scan_spy).toHaveBeenCalledWith(document.body);
            expect(window.__patternslib_registry_initialized).toBe(true);
        });

        it("Scans anyway after the timeout when the bundles do not initialize", async function () {
            window.__patternslib_mf_initialized = new Promise(() => {});
            window.__patternslib_mf_init_timeout = 20;

            registry.init();
            await utils.timeout(10);
            expect(scan_spy).not.toHaveBeenCalled();

            await utils.timeout(30);
            expect(scan_spy).toHaveBeenCalledWith(document.body);
            expect(window.__patternslib_registry_initialized).toBe(true);
        });

        it("Does not scan twice when init is called again while waiting", async function () {
            let resolve_initialized;
            window.__patternslib_mf_initialized = new Promise((resolve) => {
                resolve_initialized = resolve;
            });

            registry.init();
            registry.init();
            await utils.timeout(10);

            resolve_initialized([]);
            await utils.timeout(1);

            expect(scan_spy).toHaveBeenCalledTimes(1);
        });
    });
});

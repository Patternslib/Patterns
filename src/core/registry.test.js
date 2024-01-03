import Base from "./base";
import registry from "./registry";

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

});

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
            <div class="e2 cant-touch-this pat-example"></div>
            <pre>
                <div>
                    <div class="e3 pat-example"></div>
                </div>
            </pre>
        `;
        registry.scan(tree);

        console.log(tree.innerHTML);
        expect(tree.querySelector(".e1").textContent).toBe("initialized");
        expect(tree.querySelector(".e2").textContent).toBe("");
        expect(tree.querySelector(".e3").textContent).toBe("");
    });
});

import $ from "jquery";
import dom from "./dom";

describe("core.dom tests", () => {
    // Tests from the core.dom module

    afterEach(() => {
        document.body.innerHTML = "";
    });

    describe("toNodeArray tests", () => {
        it("returns an array of nodes, if a jQuery object was passed.", (done) => {
            const html = document.createElement("div");
            html.innerHTML = `
                <span id="id1" />
                <span id="id2" />
            `;
            const el1 = html.querySelector("#id1");
            const el2 = html.querySelector("#id2");
            const testee = $("span", html);
            expect(testee.length).toBe(2);

            const ret = dom.toNodeArray(testee);
            expect(ret.jquery).toBeFalsy();
            expect(ret.length).toBe(2);
            expect(ret[0]).toBe(el1);
            expect(ret[1]).toBe(el2);

            done();
        });

        it("returns an array of nodes, if a NodeList was passed.", (done) => {
            const html = document.createElement("div");
            html.innerHTML = `
                <span id="id1" />
                <span id="id2" />
            `;
            const el1 = html.querySelector("#id1");
            const el2 = html.querySelector("#id2");
            const testee = html.querySelectorAll("span");
            expect(testee.length).toBe(2);

            const ret = dom.toNodeArray(testee);
            expect(ret instanceof NodeList).toBeFalsy();
            expect(ret.length).toBe(2);
            expect(ret[0]).toBe(el1);
            expect(ret[1]).toBe(el2);

            done();
        });

        it("returns an array with a single node, if a single node was passed.", (done) => {
            const html = document.createElement("div");

            const ret = dom.toNodeArray(html);
            expect(ret instanceof Array).toBeTruthy();
            expect(ret.length).toBe(1);
            expect(ret[0]).toBe(html);

            done();
        });
    });

    describe("querySelectorAllAndMe tests", () => {
        it("return also starting node if query matches.", (done) => {
            const el = document.createElement("div");
            el.setAttribute("class", "node1");
            el.innerHTML = `<span class="node2">hello.</span>`;

            const res1 = dom.querySelectorAllAndMe(el, ".node1");
            expect(res1.length).toBe(1);
            expect(res1[0].outerHTML).toBe(
                `<div class="node1"><span class="node2">hello.</span></div>`
            );

            const res2 = dom.querySelectorAllAndMe(el, ".node2");
            expect(res2.length).toBe(1);
            expect(res2[0].outerHTML).toBe(`<span class="node2">hello.</span>`);

            const res3 = dom.querySelectorAllAndMe(el, "div, span");
            expect(res3.length).toBe(2);
            expect(res3[0].outerHTML).toBe(
                `<div class="node1"><span class="node2">hello.</span></div>`
            );
            expect(res3[1].outerHTML).toBe(`<span class="node2">hello.</span>`);

            done();
        });
    });

    describe("wrap tests", () => {
        it("wraps an element within another element.", (done) => {
            const parent = document.createElement("main");
            const el = document.createElement("div");
            const wrapper = document.createElement("section");
            parent.appendChild(el);

            dom.wrap(el, wrapper);
            expect(parent.outerHTML).toBe(
                `<main><section><div></div></section></main>`
            );

            done();
        });
    });

    describe("show/hide tests", () => {
        it("shows or hides and does keeps the CSS display rule value.", (done) => {
            const el = document.createElement("div");
            el.style.borderTop = "2em";
            el.style.marginTop = "4em";

            dom.hide(el);

            expect(el.style.borderTop).toBe("2em");
            expect(el.style.marginTop).toBe("4em");
            expect(el.style.display).toBe("none");
            expect(
                el.getAttribute("style").indexOf("display") >= -1
            ).toBeTruthy();

            dom.show(el);

            expect(el.style.borderTop).toBe("2em");
            expect(el.style.marginTop).toBe("4em");
            expect(el.style.display).toBeFalsy();
            expect(
                el.getAttribute("style").indexOf("display") === -1
            ).toBeTruthy();

            el.style.display = "inline";
            dom.hide(el);

            expect(el.style.borderTop).toBe("2em");
            expect(el.style.marginTop).toBe("4em");
            expect(el.style.display).toBe("none");
            expect(
                el.getAttribute("style").indexOf("display") >= -1
            ).toBeTruthy();

            dom.show(el);

            expect(el.style.borderTop).toBe("2em");
            expect(el.style.marginTop).toBe("4em");
            expect(el.style.display).toBe("inline");
            expect(
                el.getAttribute("style").indexOf("display") >= -1
            ).toBeTruthy();

            done();
        });
    });

    describe("find_parents", () => {
        it("it finds all parents matching a selector.", (done) => {
            document.body.innerHTML = `
                <div class="findme level1">
                    <div class="dontfindme level2">
                        <div class="findme level3">
                            <div class="findme starthere level4">
                            </div>
                        </div>
                    </div>
                </div>
            `;
            const res = dom.find_parents(
                document.querySelector(".starthere"),
                ".findme"
            );

            // level4 is not found - it's about to find parents.
            expect(res.length).toEqual(2);
            expect(res[0]).toEqual(document.querySelector(".level3")); // inner dom levels first // prettier-ignore
            expect(res[1]).toEqual(document.querySelector(".level1"));

            done();
        });
    });
});

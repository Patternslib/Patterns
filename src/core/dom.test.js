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

        it("return empty list, if no element is passed.", (done) => {
            const res = dom.querySelectorAllAndMe();
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(0);

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
            expect(parent.outerHTML).toBe(`<main><section><div></div></section></main>`);

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
            expect(el.getAttribute("style").indexOf("display") >= -1).toBeTruthy();
            expect(el.hasAttribute("hidden")).toBe(true);

            dom.show(el);

            expect(el.style.borderTop).toBe("2em");
            expect(el.style.marginTop).toBe("4em");
            expect(el.style.display).toBeFalsy();
            expect(el.getAttribute("style").indexOf("display") === -1).toBeTruthy();
            expect(el.hasAttribute("hidden")).toBe(false);

            el.style.display = "inline";
            dom.hide(el);

            expect(el.style.borderTop).toBe("2em");
            expect(el.style.marginTop).toBe("4em");
            expect(el.style.display).toBe("none");
            expect(el.getAttribute("style").indexOf("display") >= -1).toBeTruthy();
            expect(el.hasAttribute("hidden")).toBe(true);

            dom.show(el);

            expect(el.style.borderTop).toBe("2em");
            expect(el.style.marginTop).toBe("4em");
            expect(el.style.display).toBe("inline");
            expect(el.getAttribute("style").indexOf("display") >= -1).toBeTruthy();
            expect(el.hasAttribute("hidden")).toBe(false);

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
        it("don't break with no element.", (done) => {
            const res = dom.find_parents(null, ".findme");
            expect(res.length).toEqual(0);

            done();
        });
        it("don't break with DocumentFragment without a parent.", (done) => {
            const el = new DocumentFragment();
            el.innerHTML = `<div class="starthere"></div>`;
            const res = dom.find_parents(el.querySelector(".starthere"), ".findme");
            expect(res.length).toEqual(0);

            done();
        });
    });

    describe("find_scoped", () => {
        it("Find all instances within the current structure.", (done) => {
            document.body.innerHTML = `
                <div class="findme level1">
                    <div class="starthere level2">
                        <div class="findme level3">
                            <div class="findme level4">
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const res = dom.find_scoped(document.querySelector(".starthere"), ".findme");

            expect(res.length).toEqual(2);
            expect(res[0]).toEqual(document.querySelector(".level3")); // outer dom levels first // prettier-ignore
            expect(res[1]).toEqual(document.querySelector(".level4"));

            done();
        });

        it("Find all instances within the current structure.", (done) => {
            document.body.innerHTML = `
                <div id="findme" class="level1">
                    <div class="starthere level2">
                        <div class="level3">
                        </div>
                    </div>
                </div>
            `;

            const res = dom.find_scoped(document.querySelector(".starthere"), "#findme");

            expect(res.length).toEqual(1);
            expect(res[0]).toEqual(document.querySelector(".level1"));

            done();
        });
    });

    describe("get_parents", () => {
        it("it finds all parents of an element except document itself.", (done) => {
            document.body.innerHTML = `
                <div class="level1">
                    <div class="level2">
                        <div class="level3">
                            <div class="level4">
                            </div>
                        </div>
                    </div>
                </div>
            `;
            const res = dom.get_parents(document.querySelector(".level4"));

            expect(res.length).toEqual(5);
            expect(res[0]).toEqual(document.querySelector(".level3"));
            expect(res[1]).toEqual(document.querySelector(".level2"));
            expect(res[2]).toEqual(document.querySelector(".level1"));
            expect(res[3]).toEqual(document.body);
            expect(res[4]).toEqual(document.body.parentNode); // html

            done();
        });
        it("don't break with no element.", (done) => {
            const res = dom.get_parents(null);
            expect(res.length).toEqual(0);

            done();
        });
        it("don't break with DocumentFragment without a parent.", (done) => {
            const el = new DocumentFragment();
            el.innerHTML = `<div class="starthere"></div>`;
            const res = dom.get_parents(el.querySelector(".starthere"));
            expect(res.length).toEqual(0);

            done();
        });
    });

    describe("acquire_attribute", () => {
        it("finds the first occurrence of an non-empty attribute in all parents.", (done) => {
            document.body.innerHTML = `
                <div lang="en">
                    <div id="start" lang="">
                    </div>
                </div>
            `;
            const el = document.querySelector("#start");
            const res = dom.acquire_attribute(el, "lang");
            expect(res).toBe("en");

            done();
        });
        it("finds the first occurrence of an attribute in all parents, even if empty.", (done) => {
            document.body.innerHTML = `
                <div lang="en">
                    <div lang="">
                        <div id="start">
                        </div>
                    </div>
                </div>
            `;
            const el = document.querySelector("#start");
            const res = dom.acquire_attribute(el, "lang", true);
            expect(res).toBe("");

            done();
        });
        it("traverses up a long way to find an attribute.", (done) => {
            document.body.innerHTML = `
                <div lang="en">
                    <div>
                        <div lang="">
                            <div>
                                <div lang="">
                                    <div>
                                        <div lang="">
                                            <div>
                                                <div lang="">
                                                    <div>
                                                        <div id="start" lang="">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            const el = document.querySelector("#start");
            const res = dom.acquire_attribute(el, "lang");
            expect(res).toBe("en");

            done();
        });
        it("just returns if it finds nothing.", (done) => {
            document.body.innerHTML = `
                <div>
                    <div id="start">
                    </div>
                </div>
            `;
            const el = document.querySelector("#start");
            const res = dom.acquire_attribute(el, "lang");
            expect(res).toBe(undefined);

            done();
        });

        it("includes all parents mode: return a list of all attributes found in the element parents.", (done) => {
            document.body.innerHTML = `
                <div lang="en">
                    <div lang="">
                        <div lang="ga">
                            <div lang="it">
                                <div lang="de">
                                    <div id="start" lang="">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            const el = document.querySelector("#start");
            const res = dom.acquire_attribute(el, "lang", false, true);
            expect(res).toEqual(["de", "it", "ga", "en"]);

            done();
        });

        it("includes all parents mode: also include empties, if requested.", (done) => {
            document.body.innerHTML = `
                <div lang="en">
                    <div lang="">
                        <div lang="ga">
                            <div lang="it">
                                <div lang="de">
                                    <div id="start" lang="">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            const el = document.querySelector("#start");
            const res = dom.acquire_attribute(el, "lang", true, true);
            expect(res).toEqual(["", "de", "it", "ga", "", "en"]);

            done();
        });

        it("includes all parents mode: return an empty list if nothing is found.", (done) => {
            document.body.innerHTML = `
                <div>
                    <div id="start">
                    </div>
                </div>
            `;
            const el = document.querySelector("#start");
            const res = dom.acquire_attribute(el, "lang", true, true);
            expect(res).toEqual([]);

            done();
        });
    });

    describe("is_visible", () => {
        it.skip("checks, if an element is visible or not.", (done) => {
            const div1 = document.createElement("div");
            div1.setAttribute("id", "div1");

            const div2 = document.createElement("div");
            div2.setAttribute("id", "div2");

            const div3 = document.createElement("div");
            div3.setAttribute("id", "div3");

            div2.style.display = "none";
            div3.style.visibility = "hidden";

            document.body.appendChild(div1);
            document.body.appendChild(div2);
            document.body.appendChild(div3);

            expect(dom.is_visible(document.querySelector("#div1"))).toBeTruthy(); // prettier-ignore
            expect(dom.is_visible(document.querySelector("#div2"))).toBeFalsy();
            expect(dom.is_visible(document.querySelector("#div3"))).toBeFalsy();

            done();
        });
    });

    describe("create_from_string", () => {
        it("Creates a DOM element from a string", (done) => {
            let res = dom.create_from_string(`
                <section id="section1">
                    <span class='yo'>does work.</span>
                </section>`);

            expect(res.getAttribute("id")).toEqual("section1");
            expect(res.querySelector("span.yo").textContent).toEqual("does work.");

            res = dom.create_from_string(`
                <section id="section1"></section>
                <section id="section2"></section>
            `);
            // Section 2 is not returned.
            expect(res.getAttribute("id")).toEqual("section1");

            // TD elements or others which can not be direct children of a
            // <div> are not yet supported.
            // Also see: https://stackoverflow.com/a/494348/1337474
            res = dom.create_from_string(`<td></td>`);
            expect(res).toBeFalsy();

            done();
        });
    });

    describe("add / remove event listener", () => {
        const _el = {
            event_list: [],
            addEventListener(event_type, cb) {
                this.event_list.push([event_type, cb]);
            },
            removeEventListener(event_type, cb) {
                const idx = this.event_list.indexOf([event_type, cb]);
                this.event_list.splice(idx, 1);
            },
        };

        it("Registers events only once and unregisters events.", (done) => {
            const cb1 = () => {};
            const cb2 = () => {};

            // register one event handler
            dom.add_event_listener(_el, "click", "test_click", cb1);
            expect(_el.event_list.length).toBe(1);
            expect(_el.event_list[0][1]).toBe(cb1);

            // register another event hander under the same id
            dom.add_event_listener(_el, "click", "test_click", cb2);
            expect(_el.event_list.length).toBe(1);
            expect(_el.event_list[0][1]).toBe(cb2);

            // register two more event handlers with unique ids
            dom.add_event_listener(_el, "click", "test_click_2", () => {});
            dom.add_event_listener(_el, "click", "test_click_3", () => {});
            expect(_el.event_list.length).toBe(3);

            // remove one specific event handler
            dom.remove_event_listener(_el, "test_click_2");
            expect(_el.event_list.length).toBe(2);

            // try to remove an unregistered event handler
            dom.remove_event_listener(_el, "test_click_4");
            expect(_el.event_list.length).toBe(2);

            // remove all registered event handlers on that element
            dom.remove_event_listener(_el);
            expect(_el.event_list.length).toBe(0);

            done();
        });
    });
});

import $ from "jquery";
import dom from "./dom";
import utils from "./utils";

describe("core.dom tests", () => {
    // Tests from the core.dom module

    afterEach(() => {
        document.body.innerHTML = "";
        jest.restoreAllMocks();
    });

    describe("document_ready", () => {
        it("calls the callback, once the document is ready.", async () => {
            let cnt = 0;
            const counter = () => {
                cnt++;
            };

            // Call document ready immediately. It should already call the
            // callback, if ready. Which it isn't.
            jest.spyOn(document, "readyState", "get").mockReturnValue("loading");
            dom.document_ready(counter);
            await utils.timeout(1);
            expect(cnt).toBe(0);

            // While readyState "loading" the callback should not be called.
            document.dispatchEvent(new Event("readystatechange"));
            await utils.timeout(1);
            expect(cnt).toBe(0);

            // While still loading the callback should still not be called.
            document.dispatchEvent(new Event("readystatechange"));
            await utils.timeout(1);
            expect(cnt).toBe(0);

            // Now it's the time.
            jest.spyOn(document, "readyState", "get").mockReturnValue("complete");
            document.dispatchEvent(new Event("readystatechange"));
            await utils.timeout(1);
            expect(cnt).toBe(1);

            // But the callback is only called once and the event handler removed from the document.
            document.dispatchEvent(new Event("readystatechange"));
            await utils.timeout(1);
            expect(cnt).toBe(1);
        });

        it("it will also fire on readyState interactive, not only complete.", async () => {
            let cnt = 0;
            const counter = () => {
                cnt++;
            };

            // Call document ready immediately. It should already call the
            // callback, if ready. Which it isn't.
            jest.spyOn(document, "readyState", "get").mockReturnValue("loading");
            dom.document_ready(counter);
            await utils.timeout(1);
            expect(cnt).toBe(0);

            // When readyState interactive, the callback should be called.
            jest.spyOn(document, "readyState", "get").mockReturnValue("interactive");
            document.dispatchEvent(new Event("readystatechange"));
            await utils.timeout(1);
            expect(cnt).toBe(1);
        });

        it("the callback will be called immedeately if the ready state change has already happended.", async () => {
            let cnt = 0;
            const counter = () => {
                cnt++;
            };

            // Call document ready immediately. It should already call the
            // callback, if ready. Which it isn't.
            jest.spyOn(document, "readyState", "get").mockReturnValue("complete");
            dom.document_ready(counter);
            await utils.timeout(1);
            expect(cnt).toBe(1);

            // But another state change would not call the callback, because
            // the event listener is already de-registered.
            jest.spyOn(document, "readyState", "get").mockReturnValue("interactive");
            document.dispatchEvent(new Event("readystatechange"));
            await utils.timeout(1);
            expect(cnt).toBe(1);
        });
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

        it("return empty list, if the element is not a real element.", (done) => {
            const res = dom.querySelectorAllAndMe("text", ".selector");
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

            dom.show(el);

            expect(el.style.borderTop).toBe("2em");
            expect(el.style.marginTop).toBe("4em");
            expect(el.style.display).toBeFalsy();
            expect(el.getAttribute("style").indexOf("display") === -1).toBeTruthy();

            el.style.display = "inline";
            dom.hide(el);

            expect(el.style.borderTop).toBe("2em");
            expect(el.style.marginTop).toBe("4em");
            expect(el.style.display).toBe("none");
            expect(el.getAttribute("style").indexOf("display") >= -1).toBeTruthy();

            dom.show(el);

            expect(el.style.borderTop).toBe("2em");
            expect(el.style.marginTop).toBe("4em");
            expect(el.style.display).toBe("inline");
            expect(el.getAttribute("style").indexOf("display") >= -1).toBeTruthy();

            done();
        });

        it("most not set the hidden attribute", (done) => {
            // dom.hide must not set the hidden attribute due to,
            // https://stackoverflow.com/a/28340579/1337474
            // otherwise hidden input elements might not be able to be
            // submitted in Chrome and Safari.

            const el = document.createElement("div");
            dom.hide(el);

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

    describe("is_input", () => {
        it("checks, if an element is of type input or not.", (done) => {
            expect(dom.is_input(document.createElement("input"))).toBe(true);
            expect(dom.is_input(document.createElement("select"))).toBe(true);
            expect(dom.is_input(document.createElement("textarea"))).toBe(true);
            expect(dom.is_input(document.createElement("button"))).toBe(true);

            expect(dom.is_input(document.createElement("form"))).toBe(false);
            expect(dom.is_input(document.createElement("div"))).toBe(false);

            done();
        });
    });

    describe("is_button", () => {
        it("checks, if an element is a button-like element or not.", (done) => {

            const button = document.createElement("button");
            const button_button = document.createElement("button");
            button_button.setAttribute("type", "button");
            const button_submit = document.createElement("button");
            button_submit.setAttribute("type", "submit");

            const input_button = document.createElement("input");
            input_button.setAttribute("type", "button");
            const input_submit = document.createElement("input");
            input_submit.setAttribute("type", "submit");
            const input_reset = document.createElement("input");
            input_reset.setAttribute("type", "reset");
            const input_image = document.createElement("input");
            input_image.setAttribute("type", "image");

            expect(dom.is_button(button)).toBe(true);
            expect(dom.is_button(button_button)).toBe(true);
            expect(dom.is_button(button_submit)).toBe(true);
            expect(dom.is_button(input_button)).toBe(true);
            expect(dom.is_button(input_image)).toBe(true);
            expect(dom.is_button(input_reset)).toBe(true);
            expect(dom.is_button(input_submit)).toBe(true);

            const input_text = document.createElement("input");
            input_text.setAttribute("type", "text");

            expect(dom.is_button(input_text)).toBe(false);
            expect(dom.is_button(document.createElement("input"))).toBe(false);
            expect(dom.is_button(document.createElement("select"))).toBe(false);
            expect(dom.is_button(document.createElement("textarea"))).toBe(false);
            expect(dom.is_button(document.createElement("form"))).toBe(false);
            expect(dom.is_button(document.createElement("div"))).toBe(false);

            done();
        });
    });


    describe("create_from_string", () => {
        it("Creates a DOM element from a string", (done) => {
            const res = dom.create_from_string(`
                <section id="section1">
                    <span class='yo'>does work.</span>
                </section>`);

            // The returned result is like a NodeList
            expect(res.firstChild.getAttribute("id")).toEqual("section1");
            expect(res.firstChild.querySelector("span.yo").textContent).toEqual(
                "does work."
            );

            done();
        });

        it("Creates multiple siblings from a string", (done) => {
            const res = dom.create_from_string(`
                <section id="section1"></section>
                <section id="section2"></section>
            `);
            // Multiple sibplings are also returned.
            const sections = res.querySelectorAll("section");
            expect(sections[0].getAttribute("id")).toEqual("section1");
            expect(sections[1].getAttribute("id")).toEqual("section2");

            done();
        });

        it("Can append multiple siblings to another DOM node", (done) => {
            const res = dom.create_from_string(`
                <section id="section1"></section>
                <section id="section2"></section>
            `);
            const el = document.createElement("div");
            // Multiple siblings can be appended to another element
            el.append(res);
            expect(el.querySelectorAll("section").length).toBe(2);

            done();
        });

        it("It cannot create out-of-context elements like a <td> without a <table> 😔", (done) => {
            // TD elements or others which need to be defined in the context of a <table>
            // are not yet supported.
            // Also see: https://stackoverflow.com/a/494348/1337474
            const res = dom.create_from_string(`<td></td>`);
            expect(res.firstChild).toBe(null);

            done();
        });
    });

    describe("get_css_value", function () {
        beforeEach(function () {
            document.body.innerHTML = `
              <div
                  id="el1"
                  style="
                    position: relative;
                    margin-top: 1em;
                    font-size: 12px;
                    border: 1px solid black;
                  ">
                <div
                    id="el2"
                    style="
                      margin-bottom: 2em;
                    ">
                </div>
              </div>
            `;
        });

        afterEach(function () {
            document.body.innerHTML = "";
        });

        it("Return values for CSS properties of a HTML node", function () {
            const el1 = document.querySelector("#el1");
            expect(dom.get_css_value(el1, "font-size")).toBe("12px");
            expect(dom.get_css_value(el1, "font-size", true)).toBe(12);
            expect(dom.get_css_value(el1, "position")).toBe("relative");
        });

        it("Return string, int or float, as requested.", function () {
            const el1 = document.querySelector("#el1");
            expect(dom.get_css_value(el1, "font-size")).toBe("12px");
            expect(dom.get_css_value(el1, "font-size", true)).toBe(12);
            expect(dom.get_css_value(el1, "font-size", true, true)).toBe(12.0);
            expect(dom.get_css_value(el1, "font-size", null, true)).toBe(12.0);
        });

        it("Returns 0 for when requesting a numerical value which doesn't exist.", function () {
            const el = document.createElement("div");
            expect(dom.get_css_value(el, "hallo", true)).toBe(0);
            expect(dom.get_css_value(el, "hallo", true, true)).toBe(0.0);
            expect(dom.get_css_value(el, "hallo", null, true)).toBe(0.0);
        });

        it.skip("Return inherited values for CSS properties", function () {
            // Missing JSDOM support for style inheritance yet. See:
            // https://github.com/jsdom/jsdom/issues/2160
            // https://github.com/jsdom/jsdom/pull/2668
            // https://github.com/jsdom/jsdom/blob/master/Changelog.md

            const el2 = document.querySelector("#el2");
            expect(dom.get_css_value(el2, "font-size")).toBe("12px");
        });

        it.skip("Shorthand properties are split up", function () {
            // Missing JSDOM support for property split yet.

            const el1 = document.querySelector("#el1");
            // ``em`` are parsed to pixel values.
            // shorthand property sets like ``border`` are split up into their
            // individual properties, like ``border-top-width``.
            expect(dom.get_css_value(el1, "border-top-width")).toBe("12px");
            expect(dom.get_css_value(el1, "border-top-style")).toBe("solid");
            expect(dom.get_css_value(el1, "border-top-color")).toBe("rgb(0, 0, 0)");
        });

        it.skip("Values with relative units are converted to pixels", function () {
            // Missing JSDOM support for unit conversion yet.

            const el1 = document.querySelector("#el1");
            const el2 = document.querySelector("#el2");
            // Relative length-type values are converted to absolute pixels.
            expect(dom.get_css_value(el1, "margin-top")).toBe("12px");
            expect(dom.get_css_value(el1, "margin-top", true)).toBe(12);
            expect(dom.get_css_value(el2, "margin-top", true)).toBe(0);
            expect(dom.get_css_value(el2, "margin-bottom")).toBe("24px");
            expect(dom.get_css_value(el2, "margin-bottom", true)).toBe(24);
        });
    });

    describe("find_scroll_container", function () {
        it("finds itself", function (done) {
            document.body.innerHTML = `
              <div
                  id="div1"
                  style="overflow-y: scroll">
                <div
                    id="div2"
                    style="overflow-y: scroll">
                </div>
              </div>
            `;
            const div2 = document.querySelector("#div2");
            expect(dom.find_scroll_container(div2)).toBe(div2);
            done();
        });
        it("finds a scrollable parent", function (done) {
            document.body.innerHTML = `
              <div
                  id="div1"
                  style="overflow-y: scroll">
                <div
                    id="div2">
                </div>
              </div>
            `;
            const div1 = document.querySelector("#div1");
            const div2 = document.querySelector("#div2");
            expect(dom.find_scroll_container(div2)).toBe(div1);
            done();
        });
        it("finds any scrolling direction", function (done) {
            document.body.innerHTML = `
              <div
                  id="div1"
                  style="overflow-x: scroll">
                <div
                    id="div2">
                </div>
              </div>
            `;
            const div1 = document.querySelector("#div1");
            const div2 = document.querySelector("#div2");
            expect(dom.find_scroll_container(div2)).toBe(div1);
            done();
        });
        it.skip("finds any scrolling direction with generic overflow property", function (done) {
            // Skipped due to jsDOM not setting overflow-x or overflow-y when only overflow is set.
            document.body.innerHTML = `
              <div
                  id="div1"
                  style="overflow: scroll">
                <div
                    id="div2">
                </div>
              </div>
            `;
            const div1 = document.querySelector("#div1");
            const div2 = document.querySelector("#div2");
            expect(dom.find_scroll_container(div2)).toBe(div1);
            done();
        });
        it("finds only scrolling direction y", function (done) {
            document.body.innerHTML = `
              <div
                  id="div1"
                  style="overflow-y: scroll">
                <div
                    id="div2"
                    style="overflow-x: scroll">
                  <div
                      id="div3">
                  </div>
                </div>
              </div>
            `;
            const div1 = document.querySelector("#div1");
            const div3 = document.querySelector("#div3");
            expect(dom.find_scroll_container(div3, "y")).toBe(div1);
            done();
        });
        it("finds only scrolling direction x", function (done) {
            document.body.innerHTML = `
              <div
                  id="div1"
                  style="overflow-x: scroll">
                <div
                    id="div2"
                    style="overflow-y: scroll">
                  <div
                      id="div3">
                  </div>
                </div>
              </div>
            `;
            const div1 = document.querySelector("#div1");
            const div3 = document.querySelector("#div3");
            expect(dom.find_scroll_container(div3, "x")).toBe(div1);
            done();
        });
        it("returns a fallback if given, if nothing else is found", function (done) {
            document.body.innerHTML = `
              <div
                  id="div1"
                  style="overflow-x: scroll">
                <div
                    id="div2">
                </div>
              </div>
            `;
            const div2 = document.querySelector("#div2");
            expect(dom.find_scroll_container(div2, "y", null)).toBe(null);
            done();
        });
    });

    describe("get_scroll_y", function () {
        it("get vertical scroll from window", function (done) {
            jest.replaceProperty(window, "scrollY", 2000);
            expect(dom.get_scroll_y(window)).toBe(2000);
            done();
        });

        it("get vertical scroll from window when scrollY is 0", function (done) {
            jest.replaceProperty(window, "scrollY", 0);
            expect(dom.get_scroll_y(window)).toBe(0);
            done();
        });

        it("get vertical scroll from an element", function (done) {
            const el = document.createElement("div");
            jest.spyOn(el, "scrollTop", "get").mockReturnValue(2000);
            expect(dom.get_scroll_y(el)).toBe(2000);
            done();
        });

        it("get vertical scroll from an element when scrollTop is 0", function (done) {
            const el = document.createElement("div");
            jest.spyOn(el, "scrollTop", "get").mockReturnValue(0);
            expect(dom.get_scroll_y(el)).toBe(0);
            done();
        });
    });

    describe("get_scroll_x", function () {
        it("get horizontal scroll from window", function (done) {
            jest.replaceProperty(window, "scrollX", 2000);
            expect(dom.get_scroll_x(window)).toBe(2000);
            done();
        });

        it("get horizontal scroll from window when scrollX is 0", function (done) {
            jest.replaceProperty(window, "scrollX", 0);
            expect(dom.get_scroll_x(window)).toBe(0);
            done();
        });

        it("get horizontal scroll from an element", function (done) {
            const el = document.createElement("div");
            jest.spyOn(el, "scrollLeft", "get").mockReturnValue(2000);
            expect(dom.get_scroll_x(el)).toBe(2000);
            done();
        });

        it("get horizontal scroll from an element when scrollLeft is 0", function (done) {
            const el = document.createElement("div");
            jest.spyOn(el, "scrollLeft", "get").mockReturnValue(0);
            expect(dom.get_scroll_x(el)).toBe(0);
            done();
        });
    });

    describe("set_data, get_data, delete_data", function () {
        it("can be used to store and retrieve data on DOM nodes.", function () {
            const el = document.createElement("div");
            dom.set_data(el, "test_data", "hello.");
            expect(dom.get_data(el, "test_data")).toBe("hello.");
        });
        it("can be used to store and retrieve arbitrary data on DOM nodes.", function () {
            const el = document.createElement("div");
            const data = { okay() {} };
            dom.set_data(el, "test_data", data);
            expect(dom.get_data(el, "test_data")).toBe(data);
        });
        it("supports default values", function () {
            const el = document.createElement("div");
            expect(dom.get_data(el, "test_data", true)).toBe(true);
            expect(dom.get_data(el, "test_data", false)).toBe(false);
            expect(dom.get_data(el, "test_data", null)).toBe(null);
            expect(dom.get_data(el, "test_data")).toBe(undefined);
        });
        it("can also delete the data from dom nodes.", function () {
            const el = document.createElement("div");
            dom.set_data(el, "test_data", "hello.");
            expect(dom.get_data(el, "test_data")).toBe("hello.");
            dom.delete_data(el, "test_data");
            expect(dom.get_data(el, "test_data")).toBe(undefined);
        });
    });

    describe("template", () => {
        it("Expands a template with template variables.", (done) => {
            const res = dom.template("<h1>${this.message}</h1>", { message: "ok" });
            expect(res).toBe("<h1>ok</h1>");
            done();
        });
        it("Returns the string when no template variables are given.", (done) => {
            const res = dom.template(`<h1>hello</h1>`);
            expect(res).toBe(`<h1>hello</h1>`);
            done();
        });
    });

    describe("get_visible_ratio", () => {
        it("returns 0 if the element is not given", (done) => {
            expect(dom.get_visible_ratio()).toBe(0);
            done();
        });

        it("container = window, returns 0 if the element is not visible", (done) => {
            const el = document.createElement("div");
            jest.spyOn(el, "getBoundingClientRect").mockImplementation(() => {
                return {
                    top: 200,
                    bottom: 300,
                };
            });
            jest.replaceProperty(window, "innerHeight", 100);

            expect(dom.get_visible_ratio(el, window)).toBe(0);
            done();
        });

        it("container = window, returns 0.5 if the element is half-visible", (done) => {
            const el = document.createElement("div");
            jest.spyOn(el, "getBoundingClientRect").mockImplementation(() => {
                return {
                    top: 50,
                    bottom: 150,
                };
            });
            jest.replaceProperty(window, "innerHeight", 100);

            expect(dom.get_visible_ratio(el, window)).toBe(0.5);
            done();
        });

        it("container = window, returns 1 if the element is fully visible", (done) => {
            const el = document.createElement("div");
            jest.spyOn(el, "getBoundingClientRect").mockImplementation(() => {
                return {
                    top: 0,
                    bottom: 100,
                };
            });
            jest.replaceProperty(window, "innerHeight", 100);

            expect(dom.get_visible_ratio(el, window)).toBe(1);
            done();
        });
    });
});

describe("escape_css_id", function () {
    it("returns a standard id selector as-is", function () {
        expect(dom.escape_css_id("#foo")).toBe("#foo");
    });

    it("returns an escaped version when the id is a number", function () {
        expect(dom.escape_css_id("#123")).toBe("#\\31 23");
    });

    it("returns an escaped version when the id starts with a number", function () {
        expect(dom.escape_css_id("#1foo")).toBe("#\\31 foo");
    });

    it("returns an escaped version when the id starts with a dash", function () {
        expect(dom.escape_css_id("#-1-2-3")).toBe("#-\\31 -2-3");
    });
});

describe("element_uuid", function () {
    it("returns a UUIDv4 for an element", function () {
        const el = document.createElement("div");
        const uuid = dom.element_uuid(el);
        expect(uuid).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
        );

        // The UUID isn't created anew when called again.
        expect(dom.element_uuid(el)).toBe(uuid);
    });

    it("returns a sufficiently unique id for an element", function () {
        // Mock window.crypto.randomUUID not existing, like in browser with
        // non-secure context.
        const orig_randomUUID = window.crypto.randomUUID;
        window.crypto.randomUUID = undefined;

        const el = document.createElement("div");
        const uuid = dom.element_uuid(el);
        expect(uuid).toMatch(/^[0-9]*$/);

        // The UUID isn't created anew when called again.
        expect(dom.element_uuid(el)).toBe(uuid);

        window.crypto.randomUUID = orig_randomUUID;
    });
});

describe("find_form", function () {
    it("example 1", function () {
        document.body.innerHTML = `
            <form>
                <div id="start"></div>
            </form>
        `;
        const el = document.querySelector("#start");
        const form = document.querySelector("form");
        expect(dom.find_form(el)).toBe(form);
    });

    it("example 2", function () {
        document.body.innerHTML = `
            <form>
                <input>
            </form>
        `;
        const el = document.querySelector("input");
        const form = document.querySelector("form");
        expect(dom.find_form(el)).toBe(form);
    });

    it("example 3", function () {
        document.body.innerHTML = `
            <form id="the-form">
            </form>
            <input form="the-form">
        `;
        const el = document.querySelector("input");
        const form = document.querySelector("#the-form");
        expect(dom.find_form(el)).toBe(form);
    });

    it("example 4", function () {
        document.body.innerHTML = `
            <form id="the-form">
            </form>
            <form id="other-form">
                <input form="the-form">
            </form>
        `;
        const el = document.querySelector("input");
        const form = document.querySelector("#the-form");
        expect(dom.find_form(el)).toBe(form);
    });

    it("example 5", function () {
        document.body.innerHTML = `
            <form id="the-form">
            </form>
            <form id="other-form">
                <input form="the-form">
            </form>
        `;
        const el = document.querySelector("#other-form");
        const form = document.querySelector("#the-form");
        expect(dom.find_form(el)).toBe(form);
    });

    it("example 6", function () {
        document.body.innerHTML = `
            <form id="the-form">
            </form>
            <form id="other-form">
                <select form="the-form"></select>
            </form>
        `;
        const el = document.querySelector("#other-form");
        const form = document.querySelector("#the-form");
        expect(dom.find_form(el)).toBe(form);
    });

    it("example 7", function () {
        document.body.innerHTML = `
            <form id="the-form">
            </form>
            <form id="other-form">
                <textarea form="the-form"></textarea>
            </form>
        `;
        const el = document.querySelector("#other-form");
        const form = document.querySelector("#the-form");
        expect(dom.find_form(el)).toBe(form);
    });

    it("example 8", function () {
        document.body.innerHTML = `
            <form id="the-form">
            </form>
            <form id="other-form">
                <button form="the-form"></button>
            </form>
        `;
        const el = document.querySelector("#other-form");
        const form = document.querySelector("#the-form");
        expect(dom.find_form(el)).toBe(form);
    });

    it("example 9 - subform support", function () {
        // Subform support. Subforms have precedence over forms.
        document.body.innerHTML = `
            <form>
                <div class="pat-subform">
                    <button></button>
                </div>
            </form>
        `;
        const el = document.querySelector("button");
        const subform = document.querySelector(".pat-subform");
        expect(dom.find_form(el)).toBe(subform);
    });
});

describe("find_inputs", () => {
    it("finds an input within a node structure.", (done) => {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = `
            <p>hello</p>
            <fieldset>
                <div>
                    <input type="text" />
                </div>
                <select>
                    <option>1</option>
                    <option>2</option>
                </select>
                <textarea></textarea>
            </fieldset>
            <button>Click me!</button>
        `;
        const inputs = dom.find_inputs(wrapper);
        const input_types = inputs.map((node) => node.nodeName);

        expect(inputs.length).toBe(4);
        expect(input_types.includes("INPUT")).toBeTruthy();
        expect(input_types.includes("SELECT")).toBeTruthy();
        expect(input_types.includes("TEXTAREA")).toBeTruthy();
        expect(input_types.includes("BUTTON")).toBeTruthy();

        done();
    });

    it("finds the input on the node itself.", (done) => {
        const wrapper = document.createElement("input");
        const inputs = dom.find_inputs(wrapper);
        const input_types = inputs.map((node) => node.nodeName);

        expect(inputs.length).toBe(1);
        expect(input_types.includes("INPUT")).toBeTruthy();

        done();
    });
});

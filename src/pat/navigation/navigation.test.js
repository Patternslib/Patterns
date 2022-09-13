import "../inject/inject";
import Pattern from "./navigation";
import Registry from "../../core/registry";
import utils from "../../core/utils";

describe("Navigation pattern tests", function () {
    beforeEach(function () {
        document.body.innerHTML = `
            <div id="page_wrapper">
                <article id="injection_content">test content</article>
                <div id="injection_area"></div>
                <ul class="pat-navigation nav1">
                    <li class="w1">
                        <a
                            href="#injection_content"
                            class="pat-inject a1"
                            data-pat-inject="target: #injection_area">link a1</a>
                        <ul class="nav11">
                            <li class="w11">
                                <a
                                    href="#injection_content"
                                    class="pat-inject a11"
                                    data-pat-inject="target: #injection_area">link a11</a>
                            </li>
                        </ul>
                    </li>
                </ul>
                <nav
                    class="pat-navigation nav2"
                    data-pat-navigation="item-wrapper: div; in-path-class: in-path; current-class: active">
                    <div class="w2">
                        <a
                            href="#injection_content"
                            class="pat-inject a2"
                            data-pat-inject="target: #injection_area">link a2</a>
                        <div class="w21">
                            <a
                                href="#injection_content"
                                class="pat-inject a21"
                                data-pat-inject="target: #injection_area">link a21</a>
                        </div>
                    </div>
                </nav>
            </div>
        `;
    });
    afterEach(function () {
        document.body.innerHTML = "";
    });

    it("Test 1: Test roundtrip", async () => {
        const injection_area = document.querySelector("#injection_area");

        const nav1 = document.querySelector(".nav1");
        const w1 = nav1.querySelector(".w1");
        const a1 = nav1.querySelector(".a1");
        const w11 = nav1.querySelector(".w11");
        const a11 = nav1.querySelector(".a11");

        const nav2 = document.querySelector(".nav2");
        const w2 = nav2.querySelector(".w2");
        const a2 = nav2.querySelector(".a2");
        const w21 = nav2.querySelector(".w21");
        const a21 = nav2.querySelector(".a21");

        Registry.scan("body");
        await utils.timeout(1); // wait a tick for async to settle.

        a1.click();
        await utils.timeout(1); // wait a tick for async to settle.

        expect(injection_area.textContent === "test content").toBeTruthy();
        expect(w1.classList.contains("current")).toBeTruthy();
        expect(w1.classList.contains("navigation-in-path")).toBeFalsy();
        expect(a1.classList.contains("current")).toBeTruthy();
        expect(a1.classList.contains("navigation-in-path")).toBeFalsy();
        expect(w11.classList.contains("current")).toBeFalsy();
        expect(w11.classList.contains("navigation-in-path")).toBeFalsy();
        expect(a11.classList.contains("current")).toBeFalsy();
        expect(a11.classList.contains("navigation-in-path")).toBeFalsy();

        injection_area.innerHTML = "";

        a11.click();
        await utils.timeout(1); // wait a tick for async to settle.

        expect(injection_area.textContent === "test content").toBeTruthy();
        expect(w1.classList.contains("current")).toBeFalsy();
        expect(w1.classList.contains("navigation-in-path")).toBeTruthy();
        expect(a1.classList.contains("current")).toBeFalsy();
        expect(a1.classList.contains("navigation-in-path")).toBeTruthy();
        expect(w11.classList.contains("current")).toBeTruthy();
        expect(w11.classList.contains("navigation-in-path")).toBeFalsy();
        expect(a11.classList.contains("current")).toBeTruthy();
        expect(a11.classList.contains("navigation-in-path")).toBeFalsy();

        injection_area.innerHTML = "";

        a2.click();
        await utils.timeout(1); // wait a tick for async to settle.

        expect(injection_area.textContent === "test content").toBeTruthy();
        expect(w2.classList.contains("active")).toBeTruthy();
        expect(w2.classList.contains("in-path")).toBeFalsy();
        expect(a2.classList.contains("active")).toBeTruthy();
        expect(a2.classList.contains("in-path")).toBeFalsy();
        expect(w21.classList.contains("active")).toBeFalsy();
        expect(w21.classList.contains("in-path")).toBeFalsy();
        expect(a21.classList.contains("active")).toBeFalsy();
        expect(a21.classList.contains("in-path")).toBeFalsy();

        injection_area.innerHTML = "";

        a21.click();
        await utils.timeout(1); // wait a tick for async to settle.

        expect(injection_area.textContent === "test content").toBeTruthy();
        expect(w2.classList.contains("active")).toBeFalsy();
        expect(w2.classList.contains("in-path")).toBeTruthy();
        expect(a2.classList.contains("active")).toBeFalsy();
        expect(a2.classList.contains("in-path")).toBeTruthy();
        expect(w21.classList.contains("active")).toBeTruthy();
        expect(w21.classList.contains("in-path")).toBeFalsy();
        expect(a21.classList.contains("active")).toBeTruthy();
        expect(a21.classList.contains("in-path")).toBeFalsy();
    });

    it("Test 2: Auto load current", async () => {
        const injection_area = document.querySelector("#injection_area");

        const nav2 = document.querySelector(".nav2");
        nav2.classList.add("navigation-load-current");

        const w2 = nav2.querySelector(".w2");
        const a2 = nav2.querySelector(".a2");
        const w21 = nav2.querySelector(".w21");
        const a21 = nav2.querySelector(".a21");
        a21.classList.add("active");

        Registry.scan("body");
        await utils.timeout(1); // wait a tick for async to settle.

        expect(injection_area.textContent === "test content").toBeTruthy();
        expect(w2.classList.contains("active")).toBeFalsy();
        expect(w2.classList.contains("in-path")).toBeTruthy();
        expect(a2.classList.contains("active")).toBeFalsy();
        expect(a2.classList.contains("in-path")).toBeTruthy();
        expect(w21.classList.contains("active")).toBeTruthy();
        expect(w21.classList.contains("in-path")).toBeFalsy();
        expect(a21.classList.contains("active")).toBeTruthy();
        expect(a21.classList.contains("in-path")).toBeFalsy();
    });
});

describe("Navigation pattern tests - no predefined structure", function () {
    it("Reacts on DOM change", async function () {
        document.body.innerHTML = `
          <div id="injected_nav">
            <div class="w1">
              <a href="/path/to" class="a1">link a1</a>
              <div class="w11">
                <a href="/path/to/test" class="a11">link a11</a>
              </div>
            </div>
          </div>
          <a
              href="#injected_nav"
              class="pat-inject load-nav"
              data-pat-inject="target: #injection_target">load navigation</a>
          <nav
              id="injection_target"
              class="pat-navigation nav"
              data-pat-navigation="item-wrapper: div">
          </nav>
        `;

        // TODO: change when using Jest: https://remarkablemark.org/blog/2018/11/17/mock-window-location/
        history.pushState(null, "", "/path/to/test");

        Registry.scan(document.body);

        const nav = document.querySelector("nav");
        const load_nav = document.querySelector(".load-nav");
        load_nav.click();

        await utils.timeout(1); // wait for MutationObserver

        const w1 = nav.querySelector(".w1");
        const a1 = nav.querySelector(".a1");
        const w11 = nav.querySelector(".w11");
        const a11 = nav.querySelector(".a11");

        expect(w1.classList.contains("current")).toBeFalsy();
        expect(w1.classList.contains("navigation-in-path")).toBeTruthy();
        expect(a1.classList.contains("current")).toBeFalsy();
        expect(a1.classList.contains("navigation-in-path")).toBeTruthy();
        expect(w11.classList.contains("current")).toBeTruthy();
        expect(w11.classList.contains("navigation-in-path")).toBeFalsy();
        expect(a11.classList.contains("current")).toBeTruthy();
        expect(a11.classList.contains("navigation-in-path")).toBeFalsy();
    });
});

import Pattern from "./navigation";
import Pattern2 from "../inject/inject";
import Registry from "../../core/registry";

describe("Navigation pattern tests", function () {
    beforeEach(function () {
        var page_wrapper = document.createElement("div");
        page_wrapper.setAttribute("id", "page_wrapper");

        var injection_content = document.createElement("article");
        injection_content.setAttribute("id", "injection_content");
        injection_content.appendChild(document.createTextNode("test content"));
        page_wrapper.appendChild(injection_content);

        var injection_area = document.createElement("div");
        injection_area.setAttribute("id", "injection_area");
        page_wrapper.appendChild(injection_area);

        // Nav 1
        var nav1 = document.createElement("ul");
        nav1.setAttribute("class", "pat-navigation nav1");

        var w1 = document.createElement("li");
        w1.setAttribute("class", "w1");
        nav1.appendChild(w1);

        var a1 = document.createElement("a");
        a1.setAttribute("href", "#injection_content");
        a1.setAttribute("class", "pat-inject a1");
        a1.setAttribute("data-pat-inject", "target: #injection_area");
        a1.appendChild(document.createTextNode("link a1"));
        w1.appendChild(a1);

        var w11 = document.createElement("li");
        w11.setAttribute("class", "w11");
        w1.appendChild(w11);

        var a11 = document.createElement("a");
        a11.setAttribute("href", "#injection_content");
        a11.setAttribute("class", "pat-inject a11");
        a11.setAttribute("data-pat-inject", "target: #injection_area");
        a11.appendChild(document.createTextNode("link a11"));
        w11.appendChild(a11);

        page_wrapper.appendChild(nav1);

        // Nav 2
        var nav2 = document.createElement("nav");
        nav2.setAttribute("class", "pat-navigation nav2");
        nav2.setAttribute(
            "data-pat-navigation",
            "item-wrapper: div; in-path-class: in-path; current-class: active"
        );

        var w2 = document.createElement("div");
        w2.setAttribute("class", "w2");
        nav2.appendChild(w2);

        var a2 = document.createElement("a");
        a2.setAttribute("href", "#injection_content");
        a2.setAttribute("class", "pat-inject a2");
        a2.setAttribute("data-pat-inject", "target: #injection_area");
        a2.appendChild(document.createTextNode("link a2"));
        w2.appendChild(a2);

        var w21 = document.createElement("div");
        w21.setAttribute("class", "w21");
        w2.appendChild(w21);

        var a21 = document.createElement("a");
        a21.setAttribute("href", "#injection_content");
        a21.setAttribute("class", "pat-inject a21");
        a21.setAttribute("data-pat-inject", "target: #injection_area");
        a21.appendChild(document.createTextNode("link a21"));
        w21.appendChild(a21);

        page_wrapper.appendChild(nav2);

        document.body.appendChild(page_wrapper);
    });
    afterEach(function () {
        document.body.removeChild(document.querySelector("#page_wrapper"));
    });

    it("Test 1: Test roundtrip", function (done) {
        var injection_area = document.querySelector("#injection_area");

        var nav1 = document.querySelector(".nav1");
        var w1 = nav1.querySelector(".w1");
        var a1 = nav1.querySelector(".a1");
        var w11 = nav1.querySelector(".w11");
        var a11 = nav1.querySelector(".a11");

        var nav2 = document.querySelector(".nav2");
        var w2 = nav2.querySelector(".w2");
        var a2 = nav2.querySelector(".a2");
        var w21 = nav2.querySelector(".w21");
        var a21 = nav2.querySelector(".a21");

        Registry.scan("body");

        a1.click();
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
        expect(injection_area.textContent === "test content").toBeTruthy();
        expect(w1.classList.contains("current")).toBeFalsy();
        expect(w1.classList.contains("navigation-in-path")).toBeTruthy();
        expect(a1.classList.contains("current")).toBeFalsy();
        expect(a1.classList.contains("navigation-in-path")).toBeFalsy();
        expect(w11.classList.contains("current")).toBeTruthy();
        expect(w11.classList.contains("navigation-in-path")).toBeFalsy();
        expect(a11.classList.contains("current")).toBeTruthy();
        expect(a11.classList.contains("navigation-in-path")).toBeFalsy();

        injection_area.innerHTML = "";

        a2.click();
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
        expect(injection_area.textContent === "test content").toBeTruthy();
        expect(w2.classList.contains("active")).toBeFalsy();
        expect(w2.classList.contains("in-path")).toBeTruthy();
        expect(a2.classList.contains("active")).toBeFalsy();
        expect(a2.classList.contains("in-path")).toBeFalsy();
        expect(w21.classList.contains("active")).toBeTruthy();
        expect(w21.classList.contains("in-path")).toBeFalsy();
        expect(a21.classList.contains("active")).toBeTruthy();
        expect(a21.classList.contains("in-path")).toBeFalsy();

        done();
    });

    it("Test 2: Auto load current", function (done) {
        var injection_area = document.querySelector("#injection_area");

        var nav2 = document.querySelector(".nav2");
        nav2.classList.add("navigation-load-current");

        var w2 = nav2.querySelector(".w2");
        var a2 = nav2.querySelector(".a2");
        var w21 = nav2.querySelector(".w21");
        var a21 = nav2.querySelector(".a21");
        a21.classList.add("active");

        Registry.scan("body");

        expect(injection_area.textContent === "test content").toBeTruthy();
        expect(w2.classList.contains("active")).toBeFalsy();
        expect(w2.classList.contains("in-path")).toBeTruthy();
        expect(a2.classList.contains("active")).toBeFalsy();
        expect(a2.classList.contains("in-path")).toBeFalsy();
        expect(w21.classList.contains("active")).toBeTruthy();
        expect(w21.classList.contains("in-path")).toBeFalsy();
        expect(a21.classList.contains("active")).toBeTruthy();
        expect(a21.classList.contains("in-path")).toBeFalsy();

        done();
    });
});

describe("Navigation pattern tests - no predefined structure", function () {
    it("Reacts on DOM change", function (done) {
        var w1 = document.createElement("div");
        w1.setAttribute("class", "w1");

        var a1 = document.createElement("a");
        a1.setAttribute("href", "/path/to");
        a1.setAttribute("class", "a1");
        a1.appendChild(document.createTextNode("link a1"));
        w1.appendChild(a1);

        var w11 = document.createElement("div");
        w11.setAttribute("class", "w11");
        w1.appendChild(w11);

        var a11 = document.createElement("a");
        a11.setAttribute("href", "/path/to/test");
        a11.setAttribute("class", "a11");
        a11.appendChild(document.createTextNode("link a11"));
        w11.appendChild(a11);

        var injected_nav = document.createElement("div");
        injected_nav.setAttribute("id", "injected_nav");
        injected_nav.appendChild(w1);
        document.body.appendChild(injected_nav);

        var load_nav = document.createElement("a");
        load_nav.setAttribute("href", "#injected_nav");
        load_nav.setAttribute("class", "pat-inject");
        load_nav.setAttribute("data-pat-inject", "target: #injection_target");
        load_nav.appendChild(document.createTextNode("load navigation"));
        document.body.appendChild(load_nav);

        var nav = document.createElement("nav");
        nav.setAttribute("id", "injection_target");
        nav.setAttribute("class", "pat-navigation nav");
        nav.setAttribute("data-pat-navigation", "item-wrapper: div");
        document.body.appendChild(nav);

        // TODO: change when using Jest: https://remarkablemark.org/blog/2018/11/17/mock-window-location/
        history.pushState(null, "", "/path/to/test");

        Registry.scan("body");

        load_nav.click();

        // wait for everything done until testing.
        window.setTimeout(function () {
            var w1 = nav.querySelector(".w1");
            var a1 = nav.querySelector(".a1");
            var w11 = nav.querySelector(".w11");
            var a11 = nav.querySelector(".a11");
            expect(w1.classList.contains("current")).toBeFalsy();
            expect(w1.classList.contains("navigation-in-path")).toBeTruthy();
            expect(a1.classList.contains("current")).toBeFalsy();
            expect(a1.classList.contains("navigation-in-path")).toBeFalsy();
            expect(w11.classList.contains("current")).toBeTruthy();
            expect(w11.classList.contains("navigation-in-path")).toBeFalsy();
            expect(a11.classList.contains("current")).toBeTruthy();
            expect(a11.classList.contains("navigation-in-path")).toBeFalsy();

            done();
        }, 300);
    });
});

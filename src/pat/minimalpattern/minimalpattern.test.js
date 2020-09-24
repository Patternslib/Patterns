import Pattern from "./minimalpattern";

describe("Minimalpattern tests", function () {
    beforeEach(function () {
        const el = document.createElement("div");
        el.setAttribute("id", "lab");
        document.body.appendChild(el);
    });
    afterEach(function () {
        document.body.removeChild(document.querySelector("#lab"));
    });

    it("Changes the color on click.", function (done) {
        const el = document.createElement("div");
        el.setAttribute("class", "pat-minimalpattern");
        document.body.appendChild(el);

        new Pattern(el);

        expect(el.getAttribute("style")).toBeFalsy();
        el.click();

        expect(
            el.getAttribute("style") === "background-color: green;"
        ).toBeTruthy();

        done();
    });

    it("Changes the color to the one specified on click.", function (done) {
        const el = document.createElement("div");
        el.setAttribute("class", "pat-minimalpattern");
        el.setAttribute("data-pat-minimalpattern", "background-color: red;");
        document.body.appendChild(el);

        new Pattern(el);

        expect(el.getAttribute("style")).toBeFalsy();
        el.click();

        expect(
            el.getAttribute("style") === "background-color: red;"
        ).toBeTruthy();

        done();
    });
});

import Pattern from "./minimalpattern";
import utils from "../../core/utils";

describe("Minimalpattern tests", function () {
    beforeEach(function () {
        const el = document.createElement("div");
        el.setAttribute("id", "lab");
        document.body.appendChild(el);
    });
    afterEach(function () {
        document.body.removeChild(document.querySelector("#lab"));
    });

    it("Changes the color on click.", async function (done) {
        const el = document.createElement("div");
        el.setAttribute("class", "pat-minimalpattern");
        document.body.appendChild(el);

        new Pattern(el);
        await utils.timeout(1);

        expect(el.getAttribute("style")).toBeFalsy();
        el.click();

        expect(el.getAttribute("style") === "background-color: green;").toBeTruthy();

        done();
    });

    it("Changes the color to the one specified on click.", async function (done) {
        const el = document.createElement("div");
        el.setAttribute("class", "pat-minimalpattern");
        el.setAttribute("data-pat-minimalpattern", "background-color: red;");
        document.body.appendChild(el);

        new Pattern(el);
        await utils.timeout(1);

        expect(el.getAttribute("style")).toBeFalsy();
        el.click();

        expect(el.getAttribute("style") === "background-color: red;").toBeTruthy();

        done();
    });
});

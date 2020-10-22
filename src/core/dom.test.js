import $ from "jquery";
import dom from "./dom";

describe("core.dom tests", () => {
    // Tests from the core.dom module

    describe("jqToNode tests", () => {
        it("always returns a bare DOM node no matter if a jQuery or bare DOM node was passed.", (done) => {
            const el = document.createElement("div");
            const $el = $(el);

            expect(dom.jqToNode($el)).toBe(el);
            expect(dom.jqToNode(el)).toBe(el);

            done();
        });
    });
});

const webpack_helpers = require("./webpack-helpers");

describe("core.dom tests", () => {
    // Tests from the core.dom module

    describe("top_head_insert tests", () => {
        it("Insert element in top of head if head is not empty.", (done) => {
            document.head.appendChild(document.createElement("title"));
            const el = document.createElement("style");

            webpack_helpers.top_head_insert(el);
            expect(document.head.innerHTML).toBe(
                "<style></style><title></title>"
            );

            done();
        });

        it("Insert element in head if head is empty.", (done) => {
            document.head.innerHTML = "";
            const el = document.createElement("style");

            webpack_helpers.top_head_insert(el);
            expect(document.head.innerHTML).toBe("<style></style>");

            done();
        });
    });
});

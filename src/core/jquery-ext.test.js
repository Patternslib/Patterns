import "./jquery-ext";
import $ from "jquery";

describe("Find including top-level elements", function() {
    it("Top-level elements are included", function() {
        var $col = $(
            "<div>" +
                "<p></p>" +
                "<span></span>" +
                "</div>" +
                "<div></div>" +
                "<p></p>"),
            $match = $col.findInclusive("div p");
        expect($match.length).toBe(1);
    });
});

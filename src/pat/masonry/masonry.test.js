import $ from "jquery";
import pattern from "./masonry";
import utils from "../../core/utils";

describe("pat-masonry", function () {
    beforeEach(function () {
        $("<div/>", { id: "lab" }).appendTo(document.body);
    });
    afterEach(function () {
        $("#lab").remove();
    });

    it("Sets class masonry-ready on the element after masonry has finished", async function () {
        var $msnry;
        $("#lab").html(
            "<div class='pat-masonry'>" +
                "  <div class='item'>" +
                "    <img src='http://i.imgur.com/6Lo8oun.jpg'>" +
                "  </div>" +
                "  <div class='item'>" +
                "    <img src='http://i.imgur.com/HDSAMFl.jpg'>" +
                "  </div>" +
                "</div>"
        );
        $msnry = $("#lab .pat-masonry");
        expect($msnry.hasClass("masonry-ready")).toBeFalsy();
        new pattern($msnry);
        await utils.timeout(1); // wait a tick for async to settle.

        await utils.timeout(2000); // wait a tick for async to settle.
        expect($msnry.hasClass("masonry-ready")).toBeTruthy();
    });
});

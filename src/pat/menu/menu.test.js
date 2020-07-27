import $ from "jquery";
import pattern from "./menu";

describe("pat-menu", function() {

    beforeEach(function() {
        $("<div/>", {id: "lab"}).appendTo(document.body);
    });

    afterEach(function() {
        $("#lab").remove();
    });

    describe("init tests", function() {
        it("adds class closed on init", function() {
            var $lab = $("#lab");
            $lab.html([
                "<ul class=\"pat-menu\">",
                "<li>First Item</li>",
                "<li>Second Item</li>",
                "<li>Third Item</li>",
                "</ul>"
                ].join("\n"));
            var $list = $("ul.pat-menu");

            pattern.init($list);

            expect($($list).children().not(".closed").length).toBe(0);
        });
    });
});

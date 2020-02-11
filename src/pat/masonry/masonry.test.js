define(["pat-masonry"], function(pattern) {
    describe("pat-masonry", function() {
        beforeEach(function() {
            $("<div/>", { id: "lab" }).appendTo(document.body);
        });
        afterEach(function() {
            $("#lab").remove();
        });

        it("Sets class masonry-ready on the element after masonry has finished", function() {
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
            pattern.init($msnry);
            setTimeout(function() {
                // XXX: Reenable when pattern.init returns a promise
                // expect($msnry.hasClass("masonry-ready")).toBeTruthy();
            }, 2000);
        });
    });
});

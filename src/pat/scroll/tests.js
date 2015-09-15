define(["pat-scroll"], function(Pattern) {

    describe("pat-scroll", function() {
        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        it("will automatically scroll to an anchor if the trigger is set to 'auto'", function() {
            $("#lab").html([
                '<a href="#p1" class="pat-scroll" data-pat-scroll="trigger: auto">p1</a>',
                '<p id="p1"></p>'
                ].join("\n"));
            spyOn($.fn, 'animate');
            Pattern.init($(".pat-scroll"));
            expect($.fn.animate).toHaveBeenCalled();
        });
    });
});

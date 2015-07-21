define(["pat-scroll"], function(Pattern) {

    describe("pat-scroll", function() {
        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        it("will automatically click on element if the trigger is set to 'auto'", function() {
            $("#lab").html([
                '<a href="#p1" class="pat-scroll" data-pat-scroll="trigger: auto">p1</a>',
                '<p id="p1"></p>'
                ].join("\n"));
            var $el = $("#lab").find('.pat-scroll');
            spyOn($.fn, 'click');
            Pattern.init($(".pat-scroll"));
            expect($.fn.click).toHaveBeenCalled();
        });
    });
});

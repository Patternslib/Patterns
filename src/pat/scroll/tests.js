define(["pat-scroll"], function(Pattern) {

    describe("pat-scroll", function() {

        describe("If the trigger is set to 'auto", function() {
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

        describe("If the trigger is set to 'click'", function() {
            beforeEach(function() {
                $("<div/>", {id: "lab"}).appendTo(document.body);
            });
            afterEach(function() {
                $("#lab").remove();
            });

            it("will scroll to an anchor on click", function() {
                $("#lab").html([
                    '<a href="#p1" class="pat-scroll" data-pat-scroll="trigger: auto">p1</a>',
                    '<p id="p1"></p>'
                    ].join("\n"));
                var $el = $(".pat-scroll");
                spyOn($.fn, 'animate');
                Pattern.init($el);
                $el.click();
                expect($.fn.animate).toHaveBeenCalled();
            });

            it("will scroll to an anchor on pat-update with originalEvent of click", function() {
                $("#lab").html([
                    '<a href="#p1" class="pat-scroll" data-pat-scroll="trigger: auto">p1</a>',
                    '<p id="p1"></p>'
                    ].join("\n"));
                var $el = $(".pat-scroll");
                spyOn($.fn, 'animate');
                Pattern.init($el);
                $el.trigger("pat-update", {
                    'pattern': "stacks",
                    'originalEvent': {
                        'type': 'click'
                    }
                });
                expect($.fn.animate).toHaveBeenCalled();
            });
        });
    });
});

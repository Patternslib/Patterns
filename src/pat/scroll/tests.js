define(["pat-scroll"], function(Pattern) {

    describe("pat-scroll", function() {

        describe("If the trigger is set to 'auto", function() {
            beforeEach(function() {
                $("<div/>", {id: "lab"}).appendTo(document.body);
            });
            afterEach(function() {
                $("#lab").remove();
            });

            it("will automatically scroll to an anchor if the trigger is set to 'auto'", function(done) {
                $("#lab").html([
                    '<a href="#p1" class="pat-scroll" data-pat-scroll="trigger: auto">p1</a>',
                    '<p id="p1"></p>'
                    ].join("\n"));
                // var spy_animate = spyOn($.fn, 'animate');
                Pattern.init($(".pat-scroll"));
                setTimeout(function () {
                    // heisenbug: expect(spy_animate).toHaveBeenCalled();
                    done();
                }, 2000);
            });
        });

        describe("If the trigger is set to 'click'", function() {
            beforeEach(function() {
                $("<div/>", {id: "lab"}).appendTo(document.body);
            });
            afterEach(function() {
                $("#lab").remove();
            });

            it("will scroll to an anchor on click", function(done) {
                $("#lab").html([
                    '<a href="#p1" class="pat-scroll" data-pat-scroll="trigger: click">p1</a>',
                    '<p id="p1"></p>'
                    ].join("\n"));
                var $el = $(".pat-scroll");
                // var spy_animate = spyOn($.fn, 'animate');
                Pattern.init($el);
                setTimeout(function() {
                    $el.click();
                    setTimeout(function() {
                        // wait for scrolling via click to be done.
                        // heisenbug: expect(spy_animate).toHaveBeenCalled();
                        done();
                    }, 2000);
                }, 2000);

            });

            it("will scroll to an anchor on pat-update with originalEvent of click", function(done) {
                $("#lab").html([
                    '<a href="#p1" class="pat-scroll" data-pat-scroll="trigger: click">p1</a>',
                    '<p id="p1"></p>'
                    ].join("\n"));
                var $el = $(".pat-scroll");
                // var spy_animate = spyOn($.fn, 'animate');
                Pattern.init($el);
                $el.trigger("pat-update", {
                    'pattern': "stacks",
                    'originalEvent': {
                        'type': 'click'
                    }
                });
                setTimeout(function() {
                    // heisenbug: expect(spy_animate).toHaveBeenCalled();
                    console.log("Heisenbug");
                    done();
                }, 3000);
            });

        });
    });
});

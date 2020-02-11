define(["pat-stacks"], function(Stacks) {

    describe("pat-stacks", function() {
        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        describe("The init method", function(){
            it("Returns the jQuery-wrapped DOM node", function() {
                var $el = $('<div class="pat-stacks"></div>');
                var pattern = new Stacks($el);
                expect(pattern.init($el)).toBe($el);
            });
        });

        describe("_base_URL", function() {
            it("URL without fragment", function() {
                var $el = $('<div class="pat-stacks"></div>');
                var pattern = new Stacks($el);
                pattern.document = {URL: document.URL};
                pattern.document.URL="http://www.example.com/folder/file.png";
                expect(pattern._base_URL()).toBe("http://www.example.com/folder/file.png");
            });

            it("URL with fragment", function() {
                var $el = $('<div class="pat-stacks"></div>');
                var pattern = new Stacks($el);
                pattern.document = {URL: document.URL};
                pattern.document.URL = "http://www.example.com/folder/file.png#fragment";
                expect(pattern._base_URL()).toBe("http://www.example.com/folder/file.png");
            });
        });

        describe("_currentFragment", function() {
            it(" without fragment", function() {
                var $el = $('<div class="pat-stacks"></div>');
                var pattern = new Stacks($el);
                pattern.document = {URL: document.URL};
                pattern.document.URL = "http://www.example.com/folder/file.png";
                expect(pattern._currentFragment()).toBeNull();
            });

            it("URL with fragment", function() {
                var $el = $('<div class="pat-stacks"></div>');
                var pattern = new Stacks($el);
                pattern.document = {URL: document.URL};
                pattern.document.URL = "http://www.example.com/folder/file.png#fragment";
                expect(pattern._currentFragment()).toBe("fragment");
            });
        });

        describe("The _onClick method", function() {
            beforeEach(function() {
                $("#lab").html(
                    "<a id='l1' href='#s1'>1</a><a id='l2' href='#s2'>2</a>" +
                    "<article class='pat-stacks' id='stack'><section id='s1'></section><section id='s2'></section></article>");
            });

            it("gets triggered when you click on an external link", function() {
                var e = {currentTarget: {href: "http://other.domain#s1"}};
                var pattern = new Stacks($('.pat-stacks'));
                var spy_update = spyOn(pattern, "_updateAnchors");
                pattern._onClick(e);
                expect(spy_update).not.toHaveBeenCalled();
            });

            it("gets triggered when you click on a link without fragment", function() {
                var pattern = new Stacks($('.pat-stacks'));
                pattern.document = {URL: document.URL};
                pattern.document.URL = "http://www.example.com";
                var e = {currentTarget: {href: "http://www.example.com"}};
                var spy_update = spyOn(pattern, "_updateAnchors");
                pattern._onClick(e);
                expect(spy_update).not.toHaveBeenCalled();
            });

            it("gets tirggered when you click on a non-stack link", function() {
                var pattern = new Stacks($('.pat-stacks'));
                pattern.document = {URL: document.URL};
                pattern.document.URL = "http://www.example.com";
                var e = {currentTarget: {href: "http://www.example.com#other"}};
                var spy_update = spyOn(pattern, "_updateAnchors");
                pattern._onClick(e);
                expect(spy_update).not.toHaveBeenCalled();
            });

            it("gets called when you click on the stack link", function() {
                var pattern = new Stacks($('.pat-stacks'));
                pattern.document = {URL: document.URL};
                pattern.document.URL = "http://www.example.com";
                var e = jasmine.createSpyObj("e", ["preventDefault"]);
                e.currentTarget={href: "http://www.example.com#s1"};
                var spy_update = spyOn(pattern, "_updateAnchors");
                var spy_switch = spyOn(pattern, "_switch");
                pattern._onClick(e);
                expect(e.preventDefault).toHaveBeenCalled();
                expect(spy_update).toHaveBeenCalled();
                expect(spy_switch).toHaveBeenCalled();
            });

            it("triggers a pat-update event, which other patterns can listen for", function() {
                var $el = $('.pat-stacks');
                var pattern = new Stacks($el);
                pattern.document = {URL: document.URL};
                pattern.document.URL = "http://www.example.com";
                var spy_trigger = spyOn($.fn, 'trigger');
                var e = {
                    'target': $el,
                    'type': 'click',
                    'preventDefault': function () {},
                    'currentTarget': { href: "http://www.example.com#s1" }
                };
                pattern._onClick(e);
                expect(spy_trigger).toHaveBeenCalledWith(
                    "pat-update",
                    jasmine.objectContaining({pattern: "stacks"})
                );
            });
        });

        describe("The _updateAnchors method", function() {
            beforeEach(function() {
                $("#lab").html(
                    "<a id='l1' href='#s1'>1</a><a id='l2' href='#s2'>2</a>" +
                    "<article class='pat-stacks' id='stack'><section id='s1'></section><section id='s2'></section></article>");
            });

            it("adds a selected class", function() {
                var $container = $("#stack");
                var pattern = new Stacks($container);
                pattern._updateAnchors("s1");
                expect($("#l1").hasClass("current")).toBe(true);
                expect($("#l2").hasClass("current")).toBe(false);
            });

            it("removes a selected class", function() {
                var $container = $("#stack");
                var pattern = new Stacks($container);
                $("#l1").addClass("selected");
                pattern._updateAnchors("s2");
                expect($("#l1").hasClass("current")).toBe(false);
                expect($("#l2").hasClass("current")).toBe(true);
            });
        });
    });
});

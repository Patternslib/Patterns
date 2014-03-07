define(["pat-stacks"], function(pattern) {
    describe("Stacks pattern", function() {
        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
            pattern.document={URL: document.URL};
        });

        afterEach(function() {
            $("#lab").remove();
            pattern.document=document;
        });

        describe("init", function(){
            it("Return jQuery object", function() {
                var jq = jasmine.createSpyObj("jQuery", ["each"]);
                jq.each.andReturn(jq);
                expect(pattern.init(jq)).toBe(jq);
            });
        });

        describe("_base_URL", function() {
            it("URL without fragment", function() {
                pattern.document.URL="http://www.example.com/folder/file.png";
                expect(pattern._base_URL()).toBe("http://www.example.com/folder/file.png");
            });

            it("URL with fragment", function() {
                pattern.document.URL="http://www.example.com/folder/file.png#fragment";
                expect(pattern._base_URL()).toBe("http://www.example.com/folder/file.png");
            });
        });

        describe("_currentFragment", function() {
            it(" without fragment", function() {
                pattern.document.URL="http://www.example.com/folder/file.png";
                expect(pattern._currentFragment()).toBeNull();
            });

            it("URL with fragment", function() {
                pattern.document.URL="http://www.example.com/folder/file.png#fragment";
                expect(pattern._currentFragment()).toBe("fragment");
            });
        });

        describe("_onClick", function() {
            beforeEach(function() {
                var $lab = $("#lab");
                $lab.html(
                    "<a id='l1' href='#s1'>1</a><a id='l2' href='#s2'>2</a>" +
                    "<article class='pat-stacks' id='stack'><section id='s1'></section><section id='s2'></section></article>");
            });

            it("Click on external link", function() {
                var e = {currentTarget: {href: "http://other.domain#s1"}};
                spyOn(pattern, "_updateAnchors");
                pattern._onClick(e);
                expect(pattern._updateAnchors).not.toHaveBeenCalled();
            });

            it("Click on link without fragment", function() {
                pattern.document.URL = "http://www.example.com";
                var e = {currentTarget: {href: "http://www.example.com"}};
                spyOn(pattern, "_updateAnchors");
                pattern._onClick(e);
                expect(pattern._updateAnchors).not.toHaveBeenCalled();
            });

            it("Click on non-stack link", function() {
                pattern.document.URL = "http://www.example.com";
                var e = {currentTarget: {href: "http://www.example.com#other"}};
                spyOn(pattern, "_updateAnchors");
                pattern._onClick(e);
                expect(pattern._updateAnchors).not.toHaveBeenCalled();
            });
            it("Click on stack link", function() {
                pattern.document.URL = "http://www.example.com";
                var e = jasmine.createSpyObj("e", ["preventDefault"]);
                e.currentTarget={href: "http://www.example.com#s1"};
                spyOn(pattern, "_updateAnchors");
                spyOn(pattern, "_switch");
                pattern._onClick(e);
                expect(e.preventDefault).toHaveBeenCalled();
                expect(pattern._updateAnchors).toHaveBeenCalled();
                expect(pattern._switch).toHaveBeenCalled();
            });
        });

        describe("_updateAnchors", function() {
            var $container;

            beforeEach(function() {
                var $lab = $("#lab");
                $lab.html(
                    "<a id='l1' href='#s1'>1</a><a id='l2' href='#s2'>2</a>" +
                    "<article class='pat-stacks' id='stack'><section id='s1'></section><section id='s2'></section></article>");
                $container=$("#stack");
                pattern.init($container);
            });

            it("Add selected class", function() {
                pattern._updateAnchors($container, "s1");
                expect($("#l1").hasClass("current")).toBe(true);
                expect($("#l2").hasClass("current")).toBe(false);
            });

            it("Remove selected class", function() {
                $("#l1").addClass("selected");
                pattern._updateAnchors($container, "s2");
                expect($("#l1").hasClass("current")).toBe(false);
                expect($("#l2").hasClass("current")).toBe(true);
            });
        });
    });
});

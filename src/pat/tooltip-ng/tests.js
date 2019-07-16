define(["pat-tooltip-ng"], function(pattern) {
    var utils = {
        createTooltip: function(c) {
            var cfg = c || {};
            return $("<a/>", {
                "id":   cfg.id || "tooltip",
                "href": cfg.href || "#anchor",
                "title": cfg.title || "tooltip title attribute",
                "data-pat-tooltip-ng": "" || cfg.data,
                "class": "pat-tooltip-ng"
            }).text(cfg.content
	    ).appendTo($("div#lab"));
        },

        removeTooltip: function removeTooltip() {
            var $el = $("a#tooltip");
            $el.trigger('destroy');
            $el.remove();
        },

        createTooltipSource: function() {
            return $("<span style='display: none' id='tooltip-source'>"+
                    "<strong>Local content</strong></span>")
                .appendTo($("div#lab"));
        },

        click: {
            type: "click",
            preventDefault: function () {}
        },

	mouseenter: jQuery.Event( "mouseenter" ),
    };

    describe("pat-tooltip-ng", function () {
        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

	afterAll(function() {
	    $('a#tooltip').trigger('destroy');
	    console.log('AFTERALLLLLLLLLLLLLLLLLLLLLLLLLLLLLL');
	});

        describe("A tooltip", function () {
            describe("if the 'trigger' parameter is 'hover'", function () {
                describe("if the 'source' parameter is 'title'", function () {
                    afterEach(function() {
                        utils.removeTooltip();
                    });

                    it("will show the contents of the 'title' attribute", function (done) {
                    //it("will show the contents of the 'title' attribute", function () {
                        utils.createTooltip({
		            data: "source: title; trigger: hover"
			});
                        var $el = $("a#tooltip");
                        var title = $el.attr("title");
                        var spy = spyOn(pattern, "_onShown").and.callThrough();
                        pattern.init($el);
                        // The 'title' attr gets removed, otherwise the browser's
                        // tooltip will appear
                        expect($el.attr("title")).toBeFalsy();

			$el.on('mouseenter', function() {console.log("foooo")});
		        $el[0].dispatchEvent(new Event('mouseenter'));
                        //$el.trigger(utils.mouseenter);
	                //$el.mouseenter();
			setTimeout(function() {

                            expect(spy).toHaveBeenCalled();
                            var $container = $(".tippy-popper");
			    expect($container.length).toEqual(1);
                            expect($container.find('.tippy-content').text()).toBe(title);
		            $el[0].dispatchEvent(new Event('mouseleave'));
			    done();
			}, 500);

                    });

		    it("will hide the tooltip on mouseleave", function (done) {
			utils.createTooltip({
			    data: "source: title; trigger: hover"
			});
			var $el = $("a#tooltip");
			var title = $el.attr("title");
			var spy = spyOn(pattern, "_onHidden").and.callThrough();
			pattern.init($el);

			$el[0].dispatchEvent(new Event('mouseenter'));
			setTimeout(function() {
			    expect(spy).not.toHaveBeenCalled();
			    $el[0].dispatchEvent(new Event('mouseleave'));
			}, 100);

			setTimeout(function() {
			    //setTimeout(function() {
				expect(spy).toHaveBeenCalled();
				expect($(".tippy-popper").length).toEqual(0);
				done();
			    //}, 200);
			}, 250);
		    });
                });

                describe("if the 'source' parameter is 'content'", function () {
                    afterEach(function() {
                        utils.removeTooltip();
                    });
		    describe("if the href attribute is hashtag", function() {
                        it("will show the content of the link", function (done) {
		            var content = "Local content";
                            utils.createTooltip({
		                data: "source: content; trigger: hover", 
		                href: "#",
		                content: content
		            });
                            var $el = $("a#tooltip");
                            var spy_show = spyOn(pattern, "_onShown").and.callThrough();
                            pattern.init($el);
		            $el[0].dispatchEvent(new Event('mouseenter'));
		            setTimeout(function() {
                                expect(spy_show).toHaveBeenCalled();
                                var $container = $(".tippy-popper");
                                expect($container.text()).toBe(content);
		                done();
		            }, 2000);
                        });
		    });
		    describe("if the href attribute is #tooltip-source", function() {
                        it("will clone a DOM element from the page", function (done) {
                            utils.createTooltip({
				data: "source: content; trigger: hover",
		                href: "#tooltip-source"
		            });
                            utils.createTooltipSource();
                            var $el = $("a#tooltip");
                            var spy_show = spyOn(pattern, "_onShown").and.callThrough();
                            pattern.init($el);
		            $el[0].dispatchEvent(new Event('mouseenter'));
		            setTimeout(function() {
                                expect(spy_show).toHaveBeenCalled();
                                var $container = $(".tippy-popper");
                                expect($container.find('strong').text()).toBe("Local content");
		                done();
		            }, 2000);
                        });
		    });
                });

            });
        });
    });
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double

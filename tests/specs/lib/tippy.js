define(["tippy.js"], function(tippy) {
    var tippy = tippy.default;
    var utils = {
	_onShown: function(instance) {
	    console.log("SHOWWWWWN!!!");
	},
        removeTooltip: function removeTooltip() {
            var $el = $("a#tooltip");
            $el.remove();
        },

//	_onTrigger: function(instance, event) {
//	    console.log(instance);
//	    console.log(event);
//	}
    };

    describe("tippy", function() {
	afterEach(function() {
	    utils.removeTooltip();
	    $('#lab').remove();
	});

	it("responds to trigger event", function() {
	    $("<div/>", {id: "lab"}).appendTo(document.body);
	    var title = "tooltip 123 title attribute";
	    var $el = $("<a/>", {
		"id": "tooltip",
	        "href": "#anchor",
		"title": title,
		"class": "foo"
	    }).appendTo("div#lab");
	    var $ma = $('<a/>', { "id": "manual" }).appendTo("div#lab");
            $ma[0].addEventListener('mouseenter', event => console.log('FOOO !!!!'));
	    //var tippyd = tippy.default; 
	    console.log($el);
	    console.log(tippy);
	    var inst = tippy($el[0], { content: $el.attr("title"), onShown: utils._onShown, duration: 0, delay: 0, lazy: true});
	    console.log('------------');
	    console.log(inst);
	    //console.log($el[0] === inst.reference[0]);
	    //console.log($._data($el, "events"));
	    //inst.props.onTrigger(inst, 'mouseenter');
	    //$el[0].dispatchEvent(new Event('click', { bubbles: true }));
	    $el[0].dispatchEvent(new Event('mouseenter'));
	    //$el.mouseenter();
	    $ma[0].dispatchEvent(new Event('mouseenter'));
	    //$el.trigger('mouseenter', { bubbles: true });
	    //$el.trigger('mouseenter');
	    //$el.mouseenter();
	    //inst.reference[0].dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
	    var $container = $(".tippy-popper");
	    //console.log($container);
	    expect($container.length).toEqual(1);
	    expect($container.find('.tippy-content').text()).toBe(title);
	    $el[0].dispatchEvent(new Event('mouseleave'));
	});
    });
});

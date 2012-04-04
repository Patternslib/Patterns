
if ( typeof fireunit === "object" ) {
        QUnit.log = fireunit.ok;
        QUnit.done = fireunit.testDone;
}


module("attr");

test("get", function() {
	expect(1);
	equals( jQuery("#mutations").attr("data-test"), "iamhere", "Check get attribute" );
});

test("init", function() {
	expect(3);
	var handler = function(event) {
		equals( event.attrName, "data-test", "Check event.attrName" );
		equals( event.prevValue, undefined, "Check event.prevValue" );
		equals( event.newValue, "iamhere", "Check event.newValue" );
	};
	jQuery("#mutations")
		.bind("attr.@data-test", handler)
		.initMutation("attr", "data-test")
		.unbind("attr");
});

test("addition", function() {
	expect(7);
	var handler = function(event) {
		equals( event.attrChange, 2, "Check event.attrChange" );
		equals( event.attrName, "custom", "Check event.attrName" );
		equals( event.newValue, "foo", "Check event.newValue" );
	};
	var bound = jQuery("body,#mutations").bind("attr", handler);
	jQuery("#mutations").attr("custom", "foo");
	bound.unbind("attr");
	
	equals( jQuery("#mutations").attr("custom"), "foo", "Check new attr value" );
});

test("modification", function() {
	expect(9);
	var handler = function(event) {
		equals( event.attrChange, 1, "Check event.attrChange" );
		equals( event.attrName, "data-test", "Check event.attrName" );
		equals( event.prevValue, "iamhere", "Check event.prevValue" );
		equals( event.newValue, "foobar", "Check event.newValue" );
	};
	var bound = jQuery("body,#mutations").bind("attr", handler);
	jQuery("#mutations").attr("data-test", "foobar");
	bound.unbind("attr");
	
	equals( jQuery("#mutations").attr("data-test"), "foobar", "Check new attr value" );
});

test("removal", function() {
	expect(7);
	var handler = function(event) {
		equals( event.attrChange, 3, "Check event.attrChange" );
		equals( event.attrName, "data-removal", "Check event.attrName" );
		equals( event.prevValue, "washere", "Check event.prevValue" );
	};
	var bound = jQuery("body,#mutations").bind("attr", handler);
	jQuery("#mutations").removeAttr("data-removal");
	bound.unbind("attr");
	
	ok( !jQuery("#mutations").attr("data-removal"), "Check absence of attr value" );
});

test("nochange", function() {
	expect(1);
	var handler = function() {
		ok( true, "This event should not have triggered" );
	};
	var bound = jQuery("body,#mutations").bind("attr", handler);
	jQuery("#mutations").attr("data-nochange", "same");
	bound.unbind("attr");
	
	equals( jQuery("#mutations").attr("data-nochange"), "same", "Check attr value" );
});

test("add again", function() {
	expect(4);
	var handler = function(event) {
		equals( event.attrChange, 2, "Check event.attrChange" );
		equals( event.attrName, "data-removal", "Check event.attrName" );
		equals( event.newValue, "again", "Check event.prevValue" );
	};
	jQuery("#mutations").bind("attr", handler).attr("data-removal", "again").unbind("attr");
	
	equals( jQuery("#mutations").attr("data-removal"), "again", "Check new attr value" );
});


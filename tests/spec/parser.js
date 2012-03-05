describe("ArgumentParser", function() {
	describe("trim", function() {
		it("No whitespace", function() {
			parser=new ArgumentParser();
			expect(parser.trim("foo")).toEqual("foo");
		});

		it("Leading whitespace", function() {
			parser=new ArgumentParser();
			expect(parser.trim("  foo")).toEqual("foo");
		});

		it("Trailing whitespace", function() {
			parser=new ArgumentParser();
			expect(parser.trim("foo  ")).toEqual("foo");
		});

		it("Whitespace everywhere", function() {
			parser=new ArgumentParser();
			expect(parser.trim("  f o o  ")).toEqual("f o o");
		});
	});


	describe("parse", function() {
		it("Positional argument", function() {
			parser=new ArgumentParser();
			parser.add_argument("selector");
			parser.parse(".MyClass");
			expect(parser.options.selector).toEqual(".MyClass");
		});

		it("Default value", function() {
			parser=new ArgumentParser();
			parser.add_argument("selector", "default");
			parser.parse("");
			expect(parser.options.selector).toEqual("default");
		});

		it("Use default for empty value", function() {
			parser=new ArgumentParser();
			parser.add_argument("first", "default");
			parser.add_argument("second");
			parser.parse("; bar");
			expect(parser.options.first).toEqual("default");
			expect(parser.options.second).toEqual("bar");
		});

		it("Named argument", function() {
			parser=new ArgumentParser();
			parser.add_argument("selector");
			parser.add_argument("attr");
			parser.parse("attr: class");
			expect(parser.options.attr).toEqual("class");
		});

		it("Extra colons in named argument", function() {
			parser=new ArgumentParser();
			parser.add_argument("selector");
			parser.parse("selector: nav:first");
			expect(parser.options.selector).toEqual("nav:first");
		});

		it("Ignore extra positional parameters", function() {
			parser=new ArgumentParser();
			parser.add_argument("foo");
			parser.parse("bar; buz");
			expect(parser.options.foo).toEqual("bar");
		});

		it("Ignore unknown named parameter", function() {
			parser=new ArgumentParser();
			parser.add_argument("selector");
			parser.parse("attr: class");
			expect(parser.options.attr).not.toBeDefined();
		});
	});
});

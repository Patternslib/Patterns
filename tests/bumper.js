describe("bumper-pattern", function() {
    var pattern;

    requireDependencies(["patterns/bumper"], function(cls) {
        pattern = cls;
    });

    beforeEach(function() {
        $("<div/>", {id: "lab"}).appendTo(document.body);
    });

    afterEach(function() {
        $("#lab").remove();
    });

	describe("init", function(){
		it("Element witout margin option", function(){
            var $lab = $("#lab");
            $lab.html([
				'<div class="pat-bumper">',
				'<p>Hello World</p>',
				'</div>'
                ].join('\n'));
			var $bumper = $('#lab .pat-bumper');
			pattern.init($bumper);
			expect($bumper.data('patterns.bumper').margin).toBe(0);
		});
		
		it("Element with margin option", function(){
            var $lab = $("#lab");
            $lab.html([
				'<div class="pat-bumper" data-pat-bumper="margin: 100">',
				'<p>Hello World</p>',
				'</div>'
                ].join('\n'));
			var $bumper = $('#lab .pat-bumper');
			pattern.init($bumper);
			expect($bumper.data('patterns.bumper').margin).toBe(100);
		});
		
		it("Element with css margin", function(){
            var $lab = $("#lab");
            $lab.html([
				'<div class="pat-bumper" style="margin-top: 30px;">',
				'<p>Hello World</p>',
				'</div>'
                ].join('\n'));
			var $bumper = $('#lab .pat-bumper');
			pattern.init($bumper);
			expect($bumper.data('patterns.bumper').threshold.top == $bumper.offset().top - 30).toBeTruthy();
		});

	});
	
	describe("_testBump", function() {
		it("Element bumped/not bumped", function() {
            var $lab = $("#lab");
            $lab.html([
				'<div class="pat-bumper">',
				'<p>Hello World</p>',
				'</div>'
                ].join('\n'));

			var $bumper = $("#lab .pat-bumper");
			pattern.init($bumper);
			var opts = $bumper.data("patterns.bumper");			
			var box = {
                top: opts.threshold.top - 10, // should not be bumped on top
                bottom: opts.threshold.bottom + 10, // not bumped on bottom
                left: opts.threshold.left - 10, // not bumped left
                right: opts.threshold.right + 10 // not bumped right
			};

			pattern._testBump($bumper, box);
			expect($bumper.hasClass("bumped")).toBeFalsy();
			
			// bump top
			box.top += 20;
			pattern._testBump($bumper, box);
			expect($bumper.hasClass("bumped")).toBe(true);
			expect($bumper.hasClass("bumped-top")).toBe(true);
			expect($bumper.hasClass("bumped-bottom")).toBe(false);
			expect($bumper.hasClass("bumped-left")).toBe(false);
			expect($bumper.hasClass("bumped-right")).toBe(false);
			
			// bump bottom
			box.top -= 20;
			box.bottom -= 20;
			pattern._testBump($bumper, box);
			expect($bumper.hasClass("bumped")).toBe(true);
			expect($bumper.hasClass("bumped-top")).toBe(false);
			expect($bumper.hasClass("bumped-bottom")).toBe(true);
			expect($bumper.hasClass("bumped-left")).toBe(false);
			expect($bumper.hasClass("bumped-right")).toBe(false);
			
			// bump bottom and left
			box.left += 20;
			pattern._testBump($bumper, box);
			expect($bumper.hasClass("bumped")).toBe(true);
			expect($bumper.hasClass("bumped-top")).toBe(false);
			expect($bumper.hasClass("bumped-bottom")).toBe(true);
			expect($bumper.hasClass("bumped-left")).toBe(true);
			expect($bumper.hasClass("bumped-right")).toBe(false);
			
		});
	});
});

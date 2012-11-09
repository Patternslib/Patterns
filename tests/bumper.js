describe("bumper-pattern", function() {
    var pattern;

    requireDependencies(["patterns/bumper"], function(cls) {
        pattern = cls;
    });

    // Reset the lab before each test
    beforeEach(function() {
        $("#lab *").remove();
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
			expect($bumper.data('patterns.bumper').threshold == $bumper.offset().top - 30).toBeTruthy();
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
			pattern._testBump($bumper, opts.threshold + 10);
			expect($bumper.hasClass("bumped")).toBeTruthy();
			pattern._testBump($bumper, opts.threshold - 10);
			expect($bumper.hasClass("bumped")).toBeFalsy();
		});
	});
});
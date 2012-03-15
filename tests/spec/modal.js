// documentation on jasmine and jasmine-jquery:
//   https://github.com/pivotal/jasmine/wiki
//   https://github.com/velesin/jasmine-jquery
define([
    'require',
    '../../src/lib/jquery',
    '../../src/patterns'
], function(require) {
    var patterns = require('../../src/patterns');
    var finds = function(selector) {
	selector = selector || '';
        return $('#jasmine-fixtures ' + selector);
    };

    describe('modal', function() {
        beforeEach(function() {
            loadFixtures('modal.html');
            patterns.scan(finds());
        });
	for (i=1; i<=3; i++) {
	    var id = '#modal' + i;
            describe('init '+id, function() {
		it("creates body", function() {
                    expect(finds(id)).toContain('.body');
		});
		it("creates header", function() {
		    expect(finds(id)).toContain('.header');
		});
		it("insert closebutton into header", function() {
		    expect($('.header',finds(id))).toContain('.close-panel');
		});
		it("function remove modal", function() {
		    $('.modal', finds(id)).remove();
		    expect(finds(id)).not.toContain('.modal');
		});
		it("remove modal on button click", function() {
		    finds(id).find('.close-panel').click();
        	    expect(finds(id)).not.toContain('.modal');
		});
		// last test doesn't work properly yet
/*		it("remove modal on ESC", function() {
		    finds(id).find('.modal').keyup(27);
        	    expect(finds(id)).not.toContain('.modal');
		});*/
            });
	}
    });
});
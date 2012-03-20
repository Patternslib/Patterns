// documentation on jasmine and jasmine-jquery:
//   https://github.com/pivotal/jasmine/wiki
//   https://github.com/velesin/jasmine-jquery
define(function() {
    return function($) {
        for (var i=1; i<=3; i++) {
            var id = '#modal' + i;
            describe('init '+id, function() {
                it("creates body", function() {
                    expect($(id)).toContain('.body');
                });
                it("creates header", function() {
                    expect($(id)).toContain('.header');
                });
                it("insert closebutton into header", function() {
                    expect($('.header',$(id))).toContain('.close-panel');
                });
                it("function remove modal", function() {
                    $('.modal', $(id)).remove();
                    expect($(id)).not.toContain('.modal');
                });
                it("remove modal on button click", function() {
                    $(id).find('.close-panel').click();
                    expect($(id)).not.toContain('.modal');
                });
                // last test doesn't work properly yet
                /*		it("remove modal on ESC", function() {
                 $(id).find('.modal').keyup(27);
                 expect($(id)).not.toContain('.modal');
                 });*/
            });
        }
    };
});

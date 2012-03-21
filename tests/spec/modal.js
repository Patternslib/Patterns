define(function() {
    return function($) {
        for (var i=1; i<=3; i++) {
            var id = '#modal' + i;
            describe('init '+id, function() {
                it("creates body", function() {
                    assert($(id)).contains('.body');
                });
                it("creates header", function() {
                    assert($(id)).contains('.header');
                });
                it("insert closebutton into header", function() {
                    assert($('.header',$(id))).contains('.close-panel');
                });
                it("function remove modal", function() {
                    $('.modal', $(id)).remove();
                    assert($(id)).lacks('.modal');
                });
                it("remove modal on button click", function() {
                    $(id).find('.close-panel').click();
                    assert($(id)).lacks('.modal');
                });
                // last test doesn't work properly yet
                /*		it("remove modal on ESC", function() {
                 $(id).find('.modal').keyup(27);
                 assert($(id)).lacks('.modal');
                 });*/
            });
        }
    };
});

define(function() {
    // XXX: find some better place for this
    $.ajaxSetup({
        async: false
    });
    return function($) {
        describe('init', function() {
            it("initialises the aloha editor on textarea 1", function() {
                assert($()).contains('textarea#edit1');
       //         assert($('#edit1')).toBeHidden();
                assert($()).contains('div#edit1-aloha');
            });
            it("copies content to aloha div", function() {
                assert($()).contains('#p1');
                assert($('#edit1-aloha')).contains('#p1');
            });
            it("copies it back before serialization", function() {
                // change the aloha div
                $('#edit1-aloha').append('<div id="new"/>');
                $('form').trigger('submit');
                assert($('#edit1').html()).contains('id="new"');
            });
        });
    };
});
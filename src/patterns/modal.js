define([
    'require',
    '../lib/jquery'
], function(require) {

    var init = function($el, opts) {
        var $first = $el.children(':first'),
            $rest = $el.children(':not(:first)'),
            $header = $('<div class="header" />'),
            $body = $('<div class="body" />'),
            $closebutton = $(
                '<button type="button" class="close-panel">Close</button>');

        // separate into header and body
        if ($rest.length === 0) {
            $first.wrap($body);
            $el.prepend($header);
        } else {
            $first.wrap($header);
            $rest.wrapAll($body);
        }

        // add close-panel button to header
        $('.header', $el).append($closebutton);

        // remove on ESC and close-panel button click
        $(document).on('keyup.hide.modal', function(ev) {
            ev.which == 27 && $el.remove();
        });
        $el.find('.close-panel').on('click', function(ev) {
            ev.preventDefault();
            $el.remove();
        });
    };

    var pattern = {
        markup_trigger: "div.modal",
        initialised_class: "modal",
        default_opts: {
            shown: false
        },
        init: init
    };

    return pattern;
});

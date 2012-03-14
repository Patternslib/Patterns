define([
    'require',
    '../lib/jquery'
], function(require) {

    var init = function($el, opts) {
        var $first = $(':first-child', $el); // ':first' could perhaps also be used, difference may be important
        var $rest = $(':not(:first-child)', $el);
        var $header = $('<div class="header" />');
        var $body = $('<div class="panel-content" />');
        //	$rest.length = 0; just for simple manuell testing

        if ($rest.length !== 0) {
            $first.wrap($header);
            $rest.wrapAll($body);
        } else {
            $first.wrap($body);
            $el.prepend($header);
        }

        $('.header', $el).append('<button class="close-panel">Button</button>');
        // If this is seen:
        //  <div class="modal">
        //    <first element />
        //    <further elements />
        //  </div>
        //
        // it shall be turned into:
        //
        //  <div class="modal">
        //    <div class="header">
        //      <first element />
        //      <button class="close-panel">Button</button>
        //    </div>
        //    <div class="panel-content">
        //      <further elements />
        //    </div>
        //  </div>
        //
        // The first child of $el is only placed into the header, if
        // it has more than one child. Otherwise the single child is
        // put into the panel-content.
        //
        // task: transform $el structure using jquery

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

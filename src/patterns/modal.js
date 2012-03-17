define([
    'require',
    '../lib/jquery',
    '../lib/jquery.form'
], function(require) {

    var init = function($el, opts) {
        var $first = $el.children(':first'),
            $rest = $el.children(':not(:first)'),
            $header = $('<div class="header" />'),
            $body = $('<div class="body" />'),
            $form = $el.find('form'),
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

        // event handler to remove element
        var remove = function(ev) {
            if (ev) ev.preventDefault();
            // the modal will be gone, but unhooked from document
            $(document).off('.modal');
            $el.remove();
        };

        // remove on ESC
        $(document).on('keyup.remove.modal', function(ev) {
            if (ev.which == 27) remove(ev);
        });
        // remove on close-panel button click
        $el.find('.close-panel').on('click.remove.modal', remove);
        // remove on click of triggering element
        if (opts && opts.$trigger_el) opts.$trigger_el.on('click.remove.modal', remove);

        // close forms that are successfully submitted or show error
        if ($form) {
            // prepare ajax request and submit function
            var params = {
                data: { submit: "submit" },
                error: function(jqXHR, textStatus, errorThrown) {
                    var msg = [jqXHR.status, textStatus,
                               $form.attr('action')].join(' '),
                        $errdiv = $el.find('.message.error');
                    if ($errdiv.length === 0) {
                        $errdiv = $('<div class="message error"/>');
                        $errdiv.prependTo($el.find('.body'));
                    }
                    $el.removeClass('ajax-in-progress');
                    $errdiv.html(msg);
                    console.error(jqXHR, textStatus, errorThrown);
                },
                success: function(data, textStatus, jqXHR) {
                    $el.remove();
                }
            };
            var submit = function(ev) {
                $el.addClass('ajax-in-progress');
                ev.preventDefault();
                $form.ajaxSubmit(params);
            };
            $form.find('[type=submit]').on('click', submit);
            $(document).on('keyup.submit.modal', function(ev) {
                if (ev.which == 13) submit(ev);
            });
        }
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

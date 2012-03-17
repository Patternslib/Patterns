define([
    'require',
    '../lib/jquery',
    '../lib/jquery.form',
    '../lib/dist/underscore',
    './inject',
    './modal'
], function(require) {
    // those two for error messages
    var inject = require('./inject'),
        modal = require('./modal');

    // can be called on a form or an element in a form
    var init = function($el) {
        // get parameters from markup
        var $form = $el.is('form') ? $el : $el.parents('form').first(),
            url = $form.attr('action');

        // prepare ajax request and submit function
        var params = {
            url: url,
            type: 'POST',
            error: function(jqXHR, textStatus, errorThrown) {
                var msg = [jqXHR.status, textStatus,
                           $form.attr('action')].join(' '),
                    // XXX: error notification pattern!
                    $error = $('<h3>Error</h3><div class="error message">'+msg+'</div>');
                inject.append(modal.init($error), $('body'));
                console.error(url, jqXHR, textStatus, errorThrown);
            },
            success: function(data, textStatus, jqXHR) {
                console.log(jqXHR);
            }
        };
        var submit = function(event) {
            $form.ajaxSubmit(params);
        };

        // submit if a (specific) form element changed
        $el.on("change", submit);

        // debounced keyup submit, if enabled
        if ($el.hasClass('auto-submit-keyup')) {
            ($el.is('input') ? $el : $el.find('input'))
                .on("keyup", _.debounce(submit, 400));
        }

        $form.on('keyup', function(ev) {
            if (ev.which === 13) {
                ev.preventDefault();
                submit(ev);
            }
        });

        // XXX: test whether on webkit and enable only if supported
        // XXX: add code to check whether the click actually changed
        // something
        ($el.is('input[type=search]') ? $el : $el.find('input[type=search]'))
            .on("click", submit);

        // allow for chaining
        return $el;
    };

    var pattern = {
        markup_trigger: ".auto-submit, .auto-submit-keyup",
        initialised_class: "auto-submit",
        init: init
    };

    return pattern;
});

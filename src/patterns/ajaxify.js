define([
    'require',
    '../lib/jquery.form/jquery.form',
    './inject'
], function(require) {
    var init = function($form, opts) {
        // ajaxify form
        $form.ajaxForm({
            // in plone we use this to figure out whether a form is
            // requested or submitted
            // XXX: consider setting this via $.ajaxSetup in a
            // specific application
            data: {submit: "submit"}
        });

        $form.ajaxError(function(ev, jqxhr, opts, error) {
            // ajaxHandlers are global, we are only interested in our form
            if (!(ev.target === $form[0])) return;

            // XXX: this needs to be solved differently
            var msg = [jqxhr.status, jqxhr.statusText, error, opts.url].join(' '),
                // XXX: error notification pattern!
                $error = $('<div class="modal">'
                           + '<h3>Error</h3>'
                           + '<div class="error message">'+msg+'</div>'
                           + '</div>');
            var inject = require('./inject');
            inject.append($error, $('body'));
            console.error(msg, jqxhr, opts);
        });

        $form.ajaxSuccess(function(ev, jqxhr, opts, data) {
            // ajaxHandlers are global, we are only interested in our form
            if (!(ev.target === $form[0])) return;

            // XXX: this needs to be solved differently
            if (!data) return;
            var $forms = $(data).find('form[id]');
            $forms.each(function() {
                var $form = $(this),
                    id = $(this).attr('id'),
                    $ourform = $('#' + id);
                if ($ourform.length > 0) {
                    $ourform.attr({action: $form.attr('action')});
                } else {
                    console.warn(
                        'Ignored form in respone data: not matching id', $form);
                }
            });
        });
    };

    return {
        markup_trigger: 'form.ajaxify',
        initialised_class: 'ajaxified',
        init: init
    };
});
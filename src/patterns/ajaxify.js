define([
    'require',
    '../lib/jquery.form/jquery.form',
    '../logging',
    './inject'
], function(require) {
    var log = require('../logging').getLogger('ajaxify');

    var init = function($el, opts) {
        // skip elements that are covered by old-style injection
        if ($el.is('.injection,[data-injection]')) {
            log.debug('skipping element claimed by old injection', $el);
            return false;
        }

        // ajaxify form
        if ($el.is('form')) {
            $el.ajaxForm({
                // in plone we use this to figure out whether a form is
                // requested or submitted
                // XXX: consider setting this via $.ajaxSetup in a
                // specific application
                data: {submit: "submit"}
            });
        } else {
            $el.on('click.ajaxify', function(ev, opts) {
                ev.preventDefault();
                $.ajax({
                    context: $el,
                    url: $el.attr('href')
                });
            });
        }

        $el.ajaxSend(function(ev, jqxhr, opts) {
            log.debug('send', ev, jqxhr, opts);
        });

        $el.ajaxError(function(ev, jqxhr, opts, error) {
            log.debug('error', ev, jqxhr, opts, error);
            // ajaxHandlers are global, we are only interested in our form
            if (!(ev.target === $el[0])) return;

            // XXX: this needs to be solved differently
            var msg = [jqxhr.status, jqxhr.statusText, error, opts.url].join(' '),
                // XXX: error notification pattern!
                $error = $('<div class="modal">'
                           + '<h3>Error</h3>'
                           + '<div class="error message">'+msg+'</div>'
                           + '</div>');
            var inject = require('./inject');
            inject.append($error, $('body'));
        });

        $el.ajaxSuccess(function(ev, jqxhr, opts, data) {
            log.debug('success', ev, jqxhr, opts);
            // ajaxHandlers are global, we are only interested in our form
            // XXX: figure out how much of this is true with a multi-form test
            if (!(ev.target === $el[0])) return;

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

        return $el;
    };

    return {
        markup_trigger: 'form, a.ajaxify',
        initialised_class: 'ajaxified',
        init: init
    };
});
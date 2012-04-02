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

        var url = ($el.attr('action') || $el.attr('href')).split('#')[0];

        // ajaxify form
        if ($el.is('form')) {
            if (($el.attr('method') || '').toLowerCase() === 'get') {
                log.warn('Ignoring form method GET, enforcing POST');
            }
            $el.ajaxForm({
                context: $el,
                // in plone we use this to figure out whether a form is
                // requested or submitted
                // XXX: consider setting this via $.ajaxSetup in a
                // specific application
                data: {submit: "submit"},
                // enforce POST, as we compare the url to figure out
                // who was triggered
                //type: $el.attr('method') || 'POST',
                type: 'POST',
                url: url
            });
        } else {
            $el.on('click.ajaxify', function(ev, opts) {
                ev.preventDefault();
                $.ajax({
                    context: $el,
                    url: url
                });
            });
        }

        $el.ajaxError(function(ev, jqxhr, ajaxopts, error) {
            // ajaxHandlers are global, we are only interested in our form
            if (url !== ajaxopts.url) {
                log.debug('ignoring ajax event', ajaxopts.url, url);
                return;
            }
            log.debug('error', ev, jqxhr, opts, error);

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

        $el.ajaxSuccess(function(ev, jqxhr, ajaxopts, data) {
            // ajaxHandlers are global, we are only interested in our form
            // XXX: figure out how much of this is true with a multi-form test
            if (url !== ajaxopts.url) {
                log.debug('ignoring ajax event', ajaxopts.url, url);
                return;
            }
            log.debug('success', ev, jqxhr, opts);

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
        markup_trigger: 'form.ajaxify, a.ajaxify',
        initialised_class: 'ajaxified',
        init: init
    };
});

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

        var url = ($el.attr('action') || $el.attr('href') || '').split('#')[0];
        if (!url) {
            log.error('Element has neither action nor href', $el);
            return false;
        }

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
                // XXX: this should not be needed anymore, leaving it
                // in for now not to cause additional problems
                //type: $el.attr('method') || 'POST',
                type: 'POST'
                // XXX: url may not be set here but needs to be
                // determined upon submit in jquery.forms, as a
                // redirect will change the action of already
                // ajaxified forms
                //url: url
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
            if (jqxhr.status === 0) {
                log.debug('ignoring error due to canceled request');
                return;
            }
            log.debug('error', ev, jqxhr, opts, error);

            // XXX: this needs to be solved differently
            var msg = [jqxhr.status, jqxhr.statusText, error, opts && opts.url].join(' '),
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
            if (ev.target !== $el[0]) {
                //log.debug('ignoring ajax event for', $(ev.target), 'not',  $el[0]);
                return;
            }
            if (url !== ajaxopts.url) {
                //log.debug('ignoring ajax event', ajaxopts.url, href[0]);
                return;
            }

            var redirect = jqxhr.getResponseHeader('X-Patterns-Redirect-Url'),
                oldurl = jqxhr.getResponseHeader('X-Patterns-Previous-Url'),
                reload = jqxhr.getResponseHeader('X-Patterns-Reload');

            if ((reload !== null) && (reload !== undefined)) {
                log.debug('received reload request');

                $('form.inject.reload').submit();
                $('a.inject.reload:not(.navigation a)').click();
                $('.navigation a.inject.reload.current').click();
            } else if (redirect) {
                log.debug('received redirect request', redirect);

                // perform redirect
                window.location.href = redirect;
            }

            // We are done
            log.debug('success', ev, jqxhr, opts);

            // XXX: below here disabled for now
            // if (!oldurl) {
            //     log.error('Missing header: X-Patterns-Previous-Url');
            //     return;
            // }
            // if (!oldurl.slice(-1) === '/') oldurl = oldurl + '/';

            // $('form[action^="' + oldurl + '"]').each(function() {
            //     var $form = $(this),
            //         action = $form.attr('action').replace(oldurl, redirect);
            //     $form.attr({action: action});
            //     log.debug('rewrote form action: s:', oldurl, ":", redirect, ":", $form);
            // });

            // XXX: rewrite anchors that point to the old url?
        });

        return $el;
    };

    return {
        markup_trigger: 'form.ajaxify, a.ajaxify',
        initialised_class: 'ajaxified',
        init: init
    };
});

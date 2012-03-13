define([
    'require',
    '../core/parser',
    '../lib/jquery',
    '../lib/jquery.form'
], function(require) {
    var Parser = require('../core/parser'),
        parser = new Parser("source; target: $source");

    var init = function($el, opts) {
        // XXX: if opts, set them on $el as if defined there

        $el.on("click", function(ev) {
            ev.preventDefault();
            trigger($el);
        });

        if ($el.hasClass('autoLoading-visible')) {
            trigger($el);
        }
    };


    var _injectmethod = function(name, method) {
        var injectwrapper = function($sources, $targets, suppress) {
            // no $targets -> called as a jquery method
            // XXX: is it good to have that here?
            if ($targets === undefined) $targets = this;
            $targets = method($sources, $targets);
            if (!suppress) {
                $targets.trigger('inject', {
                    method: name,
                    $sources: $sources
                });
            }
            return $targets;
        };
        return injectwrapper;
    };

    var content = _injectmethod("content", function($sources, $targets) {
        $targets.each(function() {
            $(this).html($sources.html());
        });
        return $targets;
    });

    var replace = _injectmethod(function($sources, $targets) {
        $targets.each(function() {
            $(this).replaceWidth($sources.clone().addClass(replace.marker));
        });
        return $(replace.marker).removClass(replace.marker);
    });
    replace.marker = 'tmp-injection-marker';


    // create an injector to be run on ajax success
    var injector = function(method_name, opts, callback) {
        var $targets = $(opts.target),
            method = pattern[method_name];
        var inject = function(data, textStatus, jqXHR) {
            // just copied from old inject code
            var cleaned = data
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
                    .replace(/<head\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/head>/gi, "")
                    .replace(/<body(.*)>/gi, '<div id="__original_body">')
                    .replace(/<\/body(.*)>/gi,'</div>'),
                $sources = $('<div/>').html(data).find(opts.source);

            // perform injection, suppressing event
            $targets = method($sources, $targets, true);

            if (callback) callback($targets);

            // trigger inject event
            $targets.trigger('inject', {
                method: method_name,
                $sources: $sources
            });
        };
        return inject;
    };

    var trigger = function($el) {
        // retrieve href and split into url and default srcid
        var href = ($el.is('form')
                    ? $el.attr('action')
                    : $el.attr('href')).split('#'),
            srcid = '#' + href.pop(),
            url = href.pop(0);
        if (href.length > 0) console.log('inject: only one #source in href');

        // set default source id and parse opts
        var defaults = { source: srcid },
            opts_str = $el.attr('data-inject') || "",
            opts = parser.parse(opts_str, defaults),
            callback;

        // default: replace targets content with sources content
        var method_name = "content";

        if ($el.hasClass('modal')) {
            callback = function($targets) {
                $targets.addClass('modal');
            };
        }

        // perform ajax call
        var params = {
            url: url,
            type: $el.is('form') ? 'POST' : 'GET',
            error: function(jqXHR, textStatus, errorThrown) {
                console.error(url, jqXHR, textStatus, errorThrown);
            },
            success: injector(method_name, opts, callback)
        };
        if ($el.is('form')) {
            $el.ajaxSubmit(params);
        } else {
            $.ajax(params);
        }
    };

    var pattern = {
        initialised_class: 'inject',
        markup_trigger: 'a.inject, a[data-inject], form.inject, form[data-inject]',
        supported_tags: ['a', 'form'], // XXX: unsupported
        init: init,
        content: content,
        replace: replace,
        trigger: trigger
    };

    return pattern;
});

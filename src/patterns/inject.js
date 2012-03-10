define([
    'require',
    '../core/parser',
    '../lib/jquery'
], function(require) {
    var Parser = require('../core/parser'),
        parser = new Parser("source; target: $source");

    var init = function($el, opts) {
        // XXX: if opts, set them on $el as if defined there

        $el.on("click", function(ev) {
            ev.preventDefault();
            trigger($el);
        });
    };


    var _injectmethod = function(name, method) {
        var injectwrapper = function($sources, $targets) {
            // no $targets -> called as a jquery method
            // XXX: is it good to have that here?
            if ($targets === undefined) $targets = this;
            return method($sources, $targets).trigger('inject', name, $sources);
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
    var injector = function(method, opts) {
        var $targets = $(opts.target);
        var inject = function(data, textStatus, jqXHR) {
            // just copied from old inject code
            var cleaned = data
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
                    .replace(/<head\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/head>/gi, "")
                    .replace(/<body(.*)>/gi, '<div id="__original_body">')
                    .replace(/<\/body(.*)>/gi,'</div>'),
                $sources = $('<div/>').html(data).find(opts.source);

            // perform injection
            method($sources, $targets);
        };
        return inject;
    };

    var trigger = function($el) {
        // retrieve href and split into url and default srcid
        var href = $el.attr('href').split('#'),
            srcid = '#' + href.pop(),
            url = href.pop(0);
        if (href.length > 0) console.log('inject: only one #source in href');

        // set default source id and parse opts
        var defaults = { source: srcid },
            opts_str = $el.attr('data-inject') || "",
            opts = parser.parse(opts_str, defaults);

        // default: replace targets content with sources content
        var method_name = "content",
            method = pattern[method_name];

        // perform ajax call
        $.ajax({
            url: url,
            error: function(jqXHR, textStatus, errorThrown) {
                console.error(url, jqXHR, textStatus, errorThrown);
            },
            success: injector(method, opts)
        });
    };

    var pattern = {
        initialised_class: 'inject',
        markup_trigger: '.inject,[data-inject]',
        supported_els: ['a'],
        init: init,
        content: content,
        replace: replace,
        trigger: trigger
    };

    return pattern;
});

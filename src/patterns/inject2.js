define(function(require) {
    var log = require('../logging').getLogger('inject2'),
        inject = require('../lib/inject').inject,
        ajax = require('../lib/ajax');

    var init = function($el, opts) {
        var injecthandler = function() {
            triggerinject($el);
        };
        $el.on('patterns-collapsible-open', injecthandler);
    };

    var extract_opts = function($el, opts_spec) {
        // XXX: would be great to get this somehow supported by the parser
        // like: url#source
        var post_process_url = function(acc) {
            if (!acc.url) return;
            // can be:
            // - http://foo.html  -> href, no source
            // - http://foo.html#source -> href, source
            // - foo.html#source -> href, source
            var tmp = acc.url.split('#');
            acc.url = tmp[0];
            acc.source = tmp[1] ? "#" + tmp[1] : "";
            if (tmp.length > 2) {
                log.error('Ignoring additional source ids:', tmp.slice(2));
            }
        };

        var Parser = require('../core/parser');
        var opts = opts_spec.reduce(function(acc, opts_src) {
            var attr = opts_src[0],
                spec = opts_src[1],
                opts_str = $el.attr(attr) || "",
                parser;

            // special treatment: href and action always map to url
            if ((attr === "href") || (attr === "action")) {
                acc.url = opts_str;
            } else {
                parser = new Parser(spec);
                acc = parser.parse(opts_str, acc);
            }
            post_process_url(acc);
            return acc;
        }, {});

        return opts;
    };


    var triggerinject = function($el) {
        var opts_spec = [
            // href -> url + source
            ["href"],
            ["data-inject",
             "source; target; replace; pre; post; prepend; append; url"]
        ];

        var opts = extract_opts($el, opts_spec);

        // special target cases
        if ($el.is('.collapsible')) {
            opts.$targets = $el.find('.panel-content');
        }

        if (!opts.source) {
            opts.source = '#__original_body';
        }

        if (!opts.url) {
            log.error(
                'local source not supported yet, need url for now', $el, opts);
        } else {
            ajax($el, {
                url: opts.url,
                success: function(data, status, jqxhr) {
                    var $data = $('<div/>').html(
                        data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
                            .replace(/<head\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/head>/gi, "")
                            .replace(/<body(.*)>/gi, '<div id="__original_body">')
                            .replace(/<\/body(.*)>/gi,'</div>')
                    );
                    inject($data, opts);
                }
            });
        }
    };

    var pattern = {
        initialised_class: 'inject',
        markup_trigger: '.collapsible[data-inject]',
        init: init,
        triggerinject: triggerinject
    };

    return pattern;
});
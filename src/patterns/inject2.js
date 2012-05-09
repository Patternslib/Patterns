define(function(require) {
    var log = require('../logging').getLogger('inject2'),
        inject = require('../lib/inject'),
        ajax = require('../lib/ajax');

    var init = function($el, opts) {
        var injecthandler = function(ev) {
            if (ev) ev.preventDefault();
            triggerinject($el);
        };

        // if the element referenced by href-next exists already,
        // point to it and disable injection
        // XXX: probably only makes sense for anchors
        var hrefnext = $el.data('href-next');
        if (hrefnext && ($(hrefnext).length > 0)) {
            log.debug('Skipping as href-next already exists', $(hrefnext));
            return $el.attr({href: hrefnext});
        }

        if ($el.is('.collapsible')) {
            log.debug('will trigger on patterns-collapsible-open', $el);
            $el.on('patterns-collapsible-open.inject', injecthandler);
        } else if ($el.is('a')) {
            log.debug('will trigger on click', $el);
            $el.on('click.inject', injecthandler);
        }

        return $el;
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
            if (tmp[1]) acc.source = '#' + tmp[1];
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

            // XXX: support data-*-config on parents
            // in the old new inject that was data-inject-default,
            // unused so far

            // special treatment: href and action always map to url
            if ((attr === "href") || (attr === "action")) {
                acc.url = opts_str;
            } else {
                parser = new Parser(spec);
                acc = parser.parse(opts_str, acc);
            }
            if (opts_str) post_process_url(acc);
            return acc;
        }, {});

        log.debug('parsed:', opts, $el);
        return opts;
    };


    var triggerinject = function($el) {
        var opts_spec = [
            // href -> url + source
            ["href"],
            ["data-inject",
             "source; target; replace; pre; post; prepend; append; url"]
        ];

        var opts = extract_opts($el, opts_spec),
            $targets;

        // special target cases
        if ($el.is('.collapsible')) {
            $targets = $el.find('.panel-content');
        }

        var source = opts.source || '#__original_body';

        // default: replace targets content with sources content
        var method_name = "content",
            method, target;

        // find targets
        if (!$targets) {
            if (opts.replace) {
                target = opts.replace;
                method_name = "replace";
            } else if (opts.pre) {
                target = opts.pre;
                method_name = "pre";
            } else if (opts.post) {
                target = opts.post;
                method_name = "post";
            } else if (opts.append) {
                target = opts.append;
                method_name = "append";
            } else if (opts.prepend) {
                target = opts.prepend;
                method_name = "prepend";
            } else if (opts.target) {
                target = opts.target;
            } else {
                target = opts.source;
            }
            $targets = $(target);
        }
        method = inject[method_name];
        if ($targets.length === 0) {
            log.error('empty targets, aborting');
            return;
        }

        if (!opts.url) {
            log.error(
                'local source not supported yet, need url for now', $el, opts);
            return;
        }

        var injecting = 'injecting injecting-' + method_name;
        $targets.addClass(injecting);
        ajax($el, {
            url: opts.url,
            success: function(data, status, jqxhr) {
                var $data = $('<div/>').html(
                    data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
                        .replace(/<head\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/head>/gi, "")
                        .replace(/<body(.*)>/gi, '<div id="__original_body">')
                        .replace(/<\/body(.*)>/gi,'</div>')
                );
                var $sources = $data.find(source);

                if ($sources.length === 0) {
                    log.error(
                        'Aborting, sources are empty for selector:', opts.source, data);
                    return;
                }
                method($sources, $targets);
                $targets.removeClass(injecting);

                $el.trigger('patterns-inject-triggered');

                // XXX: think about making the href-next thing implicit
                var hrefnext = $el.data('href-next');
                if (hrefnext) {
                    $el.attr({href: hrefnext});
                    $el.off('.inject');
                }
            }
        });
    };

    var pattern = {
        initialised_class: 'inject',
        markup_trigger: '.collapsible[data-inject],'
            + 'a.inject, a[data-inject]',
        init: init,
        triggerinject: triggerinject
    };

    return pattern;
});
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
        } else if ($el.is('.folder')) {
            log.debug('will trigger on patterns-folder-open', $el);
            $el.on('patterns-folder-open.inject', function(ev) {
                if (ev.target !== ev.currentTarget) return;
                injecthandler(ev);
            });
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
             "source; target; replace; pre; post; "
             + "prepend; append; url; replacetagwithcontent"]
        ];

        var opts = extract_opts($el, opts_spec),
            modal = false;

	opts.$trigger = $el;

        // special target cases
        if ($el.is('.collapsible')) {
            // poor array detection
            if (opts.slice) {
                log.error('Multi injection not supported for .collapsible');
                return;
            }
            opts.$targets = $el.find('.panel-content');
        } else if ($el.is('.folder')) {
            // poor array detection
            if (opts.slice) {
                log.error('Multi injection not supported for .folder');
                return;
            }
            opts.$targets = $el.children('ul');
        } else if ($el.is('.modal')) {
            // poor array detection
            if (opts.slice) {
                log.error('Multi injection not supported for modals');
                return;
            }
            modal = true;
            opts.replace = '#modal';
        }

        if (!opts.slice) opts = [opts];

        var prev_url;
        opts.forEach(function(opts) {
            opts.source = opts.source || '#__original_body';

            // default: replace targets content with sources content
            var method_name = "content",
                target;

            // find targets
            if (!opts.$targets) {
                if (opts.replace) {
                    target = opts.replace;
                    method_name = "replace";
                } else if (opts["replacetagwithcontent"]) {
                    target = opts["replacetagwithcontent"];
                    method_name = "replacetagwithcontent";
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
                opts.$targets = $(target);
            }
            opts.method = inject[method_name];
            if (opts.$targets.length === 0) {
                if (target.slice(0,1) !== '#') {
                    log.error('only id supported for non-existing target');
                }
                opts.$targets = $('<div />').attr({id: target.slice(1)});
                $('body').append(opts.$targets);
            }

            if (!opts.url) {
                log.error(
                    'local source not supported yet, need url for now', $el, opts);
                return;
            }

            opts.classes = 'injecting injecting-' + method_name;
            opts.$targets.addClass(opts.classes);
        });

        // XXX: key options by url and support url per opts
        var url = opts[0].url;
        if (!opts.every(function(opts) {
            return opts.url === url;
        })) {
            log.error('Unsupported different urls for inject');
            return;
        };

        if (!opts.every(function(opts) {
            return opts.$targets.length;
        })) {
            log.error('Missing targets, aborting');
            return;
        }

        ajax($el, {
            url: opts[0].url,
            success: function(data, status, jqxhr) {
                var $data = $('<div/>').html(
                    data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
                        .replace(/<head\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/head>/gi, "")
                        .replace(/<body(.*)>/gi, '<div id="__original_body">')
                        .replace(/<\/body(.*)>/gi,'</div>')
                );
                opts.forEach(function(opts) {
                    var $sources = $data.find(opts.source);

                    if ($sources.length === 0) {
                        log.error(
                            'Aborting, sources are empty for selector:', opts.source, data);
                        return;
                    }

                    if (modal) {
                        var $modal = $('<div id="modal" class="modal" />');
                        if ($sources.length === 1) {
                            // for single source copy its content into the modal
                            $sources = $modal.html($sources.html());
                        } else {
                            // for multiple sources wrap them into a modal
                            $sources = $modal.html($sources);
                        }
                    }

                    opts.method($sources, opts.$targets, opts);
                    opts.$targets.removeClass(opts.classes);
                });
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
            + '.folder[data-inject],'
            + 'a.inject, a[data-inject]',
        init: init,
        triggerinject: triggerinject
    };

    return pattern;
});
define(function(require) {
    var Parser = require('../core/parser'),
        parser = new Parser("source; target; replace; pre; post; append; prepend"),
        injectlib = require('../lib/inject'),
        log = require('../logging').getLogger('inject');

    var init = function($el, opts) {
        // XXX: if opts, set them on $el as if defined there

        // if the element referenced by href-next exists already,
        // point to it and disable injection
        var hrefnext = $el.data('href-next');
        if (hrefnext && ($(hrefnext).length > 0)) {
            log.debug('Skipping as href-next already exists', $(hrefnext));
            return $el.attr({href: hrefnext});
        }

        // ensure element is ajaxified
        var ajaxify = require('../patterns').ajaxify.init;
        ajaxify($el);

        // inject in case of successfull ajax request
        $el.ajaxSuccess(function(ev, jqxhr, ajaxopts, data) {
            // retrieve href and split into url and default srcid
            var href = ($el.is('form')
                        ? $el.attr('action')
                        : $el.attr('href')).split('#'),
                srcid = href[1];

            if (ev.target !== $el[0]) {
                //log.debug('ignoring ajax event for', $(ev.target), 'not',  $el[0]);
                return;
            }
            if (href[0] !== ajaxopts.url) {
                //log.debug('ignoring ajax event', ajaxopts.url, href[0]);
                return;
            }
            log.debug('executing', $el);

            if (href.length > 2) {
                log.warn('Ignoring additional source ids:', href.slice(2), $el);
            }

            // fetch defaults from parents
            var $defaults = $el.parents('[data-inject-defaults]'),
                defaults = $defaults.toArray().reduceRight(function(acc, el) {
                    var opts_str = $(el).attr('data-inject-defaults');
                    return parser.parse(opts_str, acc);
                }, {});

            if (srcid) defaults.source = '#' + srcid;

            var opts_str = $el.attr('data-inject') || "",
                opts = parser.parse(opts_str, defaults);

            // default: replace targets content with sources content
            var method_name = "content";

            // post-process options
            if (opts.replace) {
                opts.target = opts.replace;
                method_name = "replace";
            }
            if (opts.pre) {
                opts.target = opts.pre;
                method_name = "pre";
            }
            if (opts.post) {
                opts.target = opts.post;
                method_name = "post";
            }
            if (!opts.source) {
                opts.source = '#__original_body';
            }

            injector($el, method_name, opts)(data);
        });

        return $el;
    };


    // create an injector to be run on ajax success
    var injector = function($el, method_name, opts) {
        // hack to support modals
        var modal = $el.hasClass('modal');
        if (modal) {
            if (opts.target) log.warn('Overriding target for modal');
            opts.target = '#modal';
            method_name = "replace";
        }

        if (!opts.target) {
            opts.target = opts.source;
        }

        var method = injectlib[method_name],
            $targets = $(opts.target);


        if ($targets.length === 0) {
            if (opts.target.slice(0,1) !== '#') {
                log.error('only id supported for non-existing target');
            }
            $targets = $('<div />').attr({id: opts.target.slice(1)});
            $('body').append($targets);
        }

        var inject = function(data) {
            // just copied from old inject code
            data = data
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
                .replace(/<head\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/head>/gi, "")
                .replace(/<body(.*)>/gi, '<div id="__original_body">')
                .replace(/<\/body(.*)>/gi,'</div>');
            var $sources = $('<div/>').html(data).find(opts.source);

            if ($sources.length === 0) {
                log.error('Sources are empty for selector:', opts.source);
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

            // perform injection, suppressing event
            $targets = method($sources, $targets, true);

            // XXX: think about making the href-next thing implicit
            var hrefnext = $el.data('href-next');
            if (hrefnext) {
                $el.attr({href: hrefnext});
                $el.off('.ajaxify');
                $el.off('.inject.ajaxify');
            }

            // check whether we are inside a navigation element and
            // set .current accordingly
            var $nav = $el.parents('nav, .navigation');
            if ($nav.length > 1) {
                $nav = $($nav[0]);
                log.warn('Inside multiple navigations, using innermost', $nav);
            }
            if ($nav.length > 0) {
                $nav.children('.current').removeClass('current');
                $el.addClass('current');
            }

            // trigger inject event
            $targets.trigger('inject', {
                method: method_name,
                $sources: $sources,
                $trigger_el: $el
            });
            $el.trigger('patterns-inject_interim-triggered');
        };
        return inject;
    };

    var pattern = {
        initialised_class: 'inject',
        markup_trigger: 'form.inject, form[data-inject]',
        // XXX: unsupported
        opts: {
            "data-inject":
            "source; target; replace; pre; post; append; prepend"
        },
        supported_tags: ['a', 'form'], // XXX: unsupported
        init: init
    };

    return pattern;
});

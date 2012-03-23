define([
    'require',
    '../core/parser',
    '../lib/jquery',
    '../lib/jquery.form/jquery.form',
    '../logging',
    './ajaxify'
], function(require) {
    var Parser = require('../core/parser'),
        parser = new Parser("source; target; replace; pre; post; append; prepend"),
        log = require('../logging').getLogger('inject');

    var init = function($el, opts) {
        // XXX: if opts, set them on $el as if defined there

        // if the element referenced by href-next exists already,
        // point to it and disable injection
        var hrefnext = $el.data('href-next');
        if (hrefnext && ($(hrefnext).length > 0)) {
            return $el.attr({href: hrefnext});
        }

        var ajaxify = require('./ajaxify').init;
        ajaxify($el);

        $el.ajaxSuccess(function(ev, jqxhr, ajaxopts, data) {
            // retrieve href and split into url and default srcid
            var href = ($el.is('form')
                        ? $el.attr('action')
                        : $el.attr('href')).split('#'),
                srcid = href[1];
            if (href.length > 2) {
                log.warn('Ignoring additional source ids:', href.slice(2), $el);
            }

            // set default source id and parse opts
            var defaults = { source: srcid && ('#' + srcid) },
                opts_str = $el.attr('data-inject') || "",
                opts = parser.parse(opts_str, defaults),
                callback;

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

    /*
     * Injection methods
     */

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

    var replace = _injectmethod("replace", function($sources, $targets) {
        if ($targets.length === 1) {
            $targets.replaceWith($sources);
            return $sources;
        }
        $targets.each(function() {
            $(this).replaceWith($sources.clone().addClass(replace.marker));
        });
        return $("." + replace.marker).removeClass(replace.marker);
    });
    replace.marker = 'tmp-injection-marker';

    // XXX: name under discussion
    var pre = _injectmethod("pre", function($sources, $targets) {
        $targets.each(function() {
            $(this).before($sources);
        });
        return $sources;
    });

    // XXX: name under discussion
    var post = _injectmethod("post", function($sources, $targets) {
        $targets.each(function() {
            $(this).after($sources);
        });
        return $sources;
    });

    // XXX: name under discussion
    var append = _injectmethod("append", function($sources, $targets) {
        $targets.each(function() {
            $(this).append($sources);
        });
        return $sources;
    });

    var prepend = _injectmethod("prepend", function($sources, $targets) {
        $targets.each(function() {
            $(this).append($sources);
        });
        return $sources;
    });



    // create an injector to be run on ajax success
    var injector = function($el, method_name, opts) {
        // hack to support modals
        var modal = $el.hasClass('modal');
        if (modal) {
            if (opts.target) console.warn('Overriding target for modal');
            opts.target = '#modal';
            method_name = "replace";
        }

        if (!opts.target) {
            opts.target = opts.source;
        }

        var method = pattern[method_name],
            $targets = $(opts.target);


        if ($targets.length === 0) {
            if (opts.target.slice(0,1) !== '#') {
                console.error('only id supported for non-existing target');
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

            if ($sources.length === 0) console.error('inject: Sources are empty');

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
                $el.off('.inject');
            }

            // trigger inject event
            $targets.trigger('inject', {
                method: method_name,
                $sources: $sources,
                $trigger_el: $el
            });
        };
        return inject;
    };

    var pattern = {
        initialised_class: 'inject',
        markup_trigger: 'a.inject, a[data-inject], form.inject, form[data-inject]',
        supported_tags: ['a', 'form'], // XXX: unsupported
        init: init,
        content: content,
        pre: pre,
        post: post,
        append: append,
        prepend: prepend,
        replace: replace
    };

    return pattern;
});

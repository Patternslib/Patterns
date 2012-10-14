/*
 * changes to previous injection implementations
 * - no support for data-injection anymore, switch to new data-inject
 * - no support for data-href-next anymore, switch to data-inject: next-href
 * - XXX: add support for forms, see remnants in inject1 and ajaxify
 */
define([
    "jquery",
    "../core/parser",
    "../lib/ajax",
    "../lib/inject",
    "../logging",
    "../registry",
    "../3rdparty/URI"
], function($, Parser, ajax, injectlib, logging, registry) {
    var log = logging.getLogger('inject'),
        parser = new Parser("inject");

    parser.add_argument('source');
    parser.add_argument('target');
    parser.add_argument('replace');
    parser.add_argument('replacetagwithcontent');
    parser.add_argument('pre');
    parser.add_argument('post');
    parser.add_argument('prepend');
    parser.add_argument('append');
    parser.add_argument('url');
    parser.add_argument('method', 'content');
    parser.add_argument('type');
    parser.add_argument('next-href');

    var _ = {
        name: "inject",
        trigger: "a.pat-inject, form.pat-inject",
        init: function($el, opts) {
            return $el.each(function() {
                var $el = $(this),
                    cfg = _.extractConfig($el, opts);
                $el.data('patterns.inject', cfg);

                // In case next-href is specified the anchor's href will
                // be set to it after the injection is triggered. In case
                // the next href already exists, we do not activate the
                // injection but instead just change the anchors href.
                //
                // XXX: This is used in only one project for linked
                // fullcalendars, it's sanity is wonky and we should
                // probably solve it differently.
                var $nexthref = $(cfg.nextHref);
                if ($el.is('a') && $nexthref.length > 0) {
                    log.debug('Skipping as next href already exists', $nexthref);
                    // XXX: reconsider how the injection enters exhausted state
                    return $el.attr({href: cfg.nextHref});
                }

                // setup event handlers
                if ($el.is('a'))
                    $el.on("click.pat-inject", _.onClick);
                return $el;
            });
        },
        destroy: function($el) {
            $el.off('.pat-inject');
            $el.data('patterns.inject', null);
            return $el;
        },

        onClick: function(ev) {
            var $el = $(this),
                cfg = $el.data('patterns.inject');

            if (ev)
                ev.preventDefault();

            // modals are special
            if ($el.is('.modal')) {
                if (cfg.slice) {
                    log.error('Multi injection not supported for modals');
                    return;
                }
                cfg.target = '#modal';
                cfg.method = "replace";
                cfg.modal = true;
            }

            cfg.forEach(function(cfg) {
                cfg.$targets = $(cfg.target);

                // create non-existing targets
                if (cfg.$targets.length === 0) {
                    if (cfg.target.slice(0,1) !== '#') {
                        log.error('only id supported for non-existing target');
                    }
                    cfg.$targets = $('<div />').attr({id: cfg.target.slice(1)});
                    $('body').append(cfg.$targets);
                }
            });
            _.execute(cfg);
        },
        // XXX: this should be over in expandable
        onFolderOpen: function(ev) {
            if (ev && ev.target !== ev.currentTarget) return;
            var cfg = $(this).data('patterns.inject');
            if (Array.prototype.isArray.call(cfg)) {
                log.error('Multi injection not supported for .folder');
                return;
            }
            cfg.$targets = $.children('ul', this);
            _.execute(cfg);
        },

        extractConfig: function($el, opts) {
            var cfg = {}, urlparts,
                url = $el.attr('href') || $el.attr('action');

            cfg = parser.parse($el, opts, true);

            cfg.forEach(function(cfg) {
                if (!cfg.url) cfg.url = url;

                // Check for source id as part of url
                urlparts = cfg.url.split('#');
                cfg.url = urlparts[0];
                cfg.source = cfg.source || urlparts[1] ? '#' + urlparts[1] : "";
                if (urlparts.length > 2) {
                    log.warn('Ignoring additional source ids:', urlparts.slice(2));
                }

                // XXX: this syntax is under discussion
                // injection method
                ["replace", "replacetagwithcontent", "pre", "post",
                 "append", "prepend"
                ].forEach(function(method) {
                    if (cfg[method]) {
                        cfg.target = cfg[method];
                        cfg.method = method;
                    }
                });

                // target defaults to source, source needed in this case
                if (!cfg.target) {
                    if (!cfg.source) {
                        log.error('Need source!');
                    }
                    cfg.target = cfg.source;
                }
            });
            return cfg;
        },

        execute: function(cfg) {
            var $this = $(this);

            // sanity checks
            var url = cfg[0].url;
            if (!cfg.every(function(opts) {
                return opts.url === url;
            })) {
                log.error('Unsupported different urls for multi-inject');
                return;
            };
            if (!cfg.every(function(opts) {
                return opts.$targets.length;
            })) {
                log.error('Missing targets, aborting');
                return;
            }

            cfg.forEach(function(cfg) {
                cfg.method = cfg.method || 'content';
                cfg.source = cfg.source || 'body';
                cfg.classes = 'injecting injecting-' + cfg.method;
                cfg.$targets.addClass(cfg.classes);
            });

            var successHandler = function(data, status, jqxhr) {
                var uri,
                    $data = $('<div/>').html(
                        data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
                            .replace(/<head\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/head>/gi, "")
                            .replace(/<body(.*)>/gi, '<div id="__original_body">')
                            .replace(/<\/body(.*)>/gi,'</div>')
                    );
                $data.filter(":uri(is:relative)").each(function() {
                    switch (this.tagName) {
                    case "A":
                        this.href=new URI(this.href).absoluteTo(url).toString();
                        break;
                    case "FORM":
                        this.action=new URI(this.action).absoluteTo(url).toString();
                        break;
                    case "IMG":
                        this.src=new URI(this.src).absoluteTo(url).toString();
                        break;
                    }
                });
                cfg.forEach(function(cfg) {
                    var source = cfg.source === "body" ?
                            "#__original_body" : cfg.source,
                        $sources = $data.find(source);

                    if ($sources.length === 0) {
                        log.error(
                            'Aborting, sources are empty for selector:', cfg.source, data);
                        return;
                    }

                    if (cfg.modal) {
                        var $modal = $('<div id="modal" class="modal" />');
                        if ($sources.length === 1) {
                            // for single source. copy its content into the modal
                            $sources = $modal.html($sources.html());
                        } else {
                            // for multiple sources wrap them into a modal
                            $sources = $modal.html($sources);
                        }
                    }

                    injectlib[cfg.method]($sources, cfg.$targets, cfg);
                    cfg.$targets.removeClass(cfg.classes);
                });
                $this.trigger('patterns-inject-triggered');

                if (cfg['next-href']) {
                    $this.attr({href: cfg['next-href']});
                    _.destroy($this);
                }
            };

            ajax($this, {
                url: cfg[0].url,
                success: successHandler
            });
        }
    };
    registry.register(_);
    return _;
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

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
    "../logging",
    "../registry",
    "jquery_ext", // for :scrollable for autoLoading-visible
    "URI"
], function($, Parser, ajax, logging, registry) {
    var log = logging.getLogger('inject'),
        parser = new Parser("inject");

    //parser.add_argument('selector', 'body');
    parser.add_argument('selector');
    //XXX: (yet) unsupported: parser.add_argument('target', '$selector');
    parser.add_argument('target');
    parser.add_argument('type');
    parser.add_argument('next-href');
    //XXX: (yet) unsupported: parser.add_argument('source', '$selector');
    parser.add_argument('source');
    // XXX: this should not be here but the parser would bail on
    // unknown parameters and expand/collapsible need to pass the url
    // to us
    parser.add_argument('url');
    parser.add_argument('class');

    var _ = {
        name: "inject",
        trigger: "a.pat-inject, form.pat-inject",
        init: function($el, opts) {
            return $el.each(function() {
                var $el = $(this),
                    cfgs = _.extractConfig($el, opts);
                $el.data('patterns.inject', cfgs);

                // In case next-href is specified the anchor's href will
                // be set to it after the injection is triggered. In case
                // the next href already exists, we do not activate the
                // injection but instead just change the anchors href.
                //
                // XXX: This is used in only one project for linked
                // fullcalendars, it's sanity is wonky and we should
                // probably solve it differently. -- Maybe it's cool
                // after all.
                var $nexthref = $(cfgs[0].nextHref);
                if ($el.is('a') && $nexthref.length > 0) {
                    log.debug('Skipping as next href already exists', $nexthref);
                    // XXX: reconsider how the injection enters exhausted state
                    return $el.attr({href: cfgs[0].nextHref});
                }

                // setup event handlers
                if ($el.is('a'))
                    $el.on("click.pat-inject", _.onClick);
                else if ($el.is('form'))
                    $el.on("submit.pat-inject", _.onSubmit);

                // XXX: hack to support the old autoLoading-visible class
                if ($el.hasClass("autoLoading-visible"))
                    _._initAutoloadVisible($el);

                return $el;
            });
        },
        destroy: function($el) {
            $el.off('.pat-inject');
            $el.data('patterns.inject', null);
            return $el;
        },
        onClick: function(ev) {
            var cfgs = $(this).data('patterns.inject');
            if (ev)
                ev.preventDefault();
            $(this).trigger('patterns-inject-triggered');
            _.execute(cfgs);
        },
        onSubmit: function(ev) {
            var cfgs = $(this).data('patterns.inject');
            if (ev)
                ev.preventDefault();
            $(this).trigger('patterns-inject-triggered');
            _.execute(cfgs);
        },
        extractConfig: function($el, opts) {
            opts = $.extend({}, opts);

            var urlparts, cfgs, defaultSelector;
            // opts has priority, fallback to href/action
            opts.url = opts.url || $el.attr('href') || $el.attr('action') || "";

            // separate selector from url
            urlparts = opts.url.split('#');
            opts.url = urlparts[0];

            // if no selector, check for selector as part of original url
            defaultSelector = urlparts[1] && '#' + urlparts[1] || 'body';

            if (urlparts.length > 2) {
                log.warn('Ignoring additional source ids:', urlparts.slice(2));
            }

            cfgs = parser.parse($el, opts, true);
            cfgs.forEach(function(cfg) {
                cfg.selector = cfg.selector || defaultSelector;
            });
            return cfgs;
        },
        // verify and post-process config
        verifyConfig: function(cfgs) {
            var url = cfgs[0].url;

            // verification for each cfg in the array needs to succeed
            return cfgs.every(function(cfg) {
                // in case of multi-injection, all injections need to use
                // the same url
                if (cfg.url !== url) {
                    log.error('Unsupported different urls for multi-inject');
                    return false;
                }

                // defaults
                cfg.source = cfg.source || cfg.selector;
                cfg.target = cfg.target || cfg.selector;

                if (!_._extractModifiers(cfg))
                    return false;

                // make sure target exist
                cfg.$target = cfg.$target || $(cfg.target);
                if (cfg.$target.length === 0) {
                    if (!cfg.target) {
                        log.error('Need target selector', cfg);
                        return false;
                    }
                    cfg.$target = _._createTarget(cfg.target);
                }
                return true;
            });
        },
        _extractModifiers: function(cfg) {
            var source_re = /^(.+?)(::element)?$/,
                target_re = /^(.+?)(::element)?(::after|::before)?$/,
                source_match = source_re.exec(cfg.source),
                target_match = target_re.exec(cfg.target),
                targetMod, targetPosition;

            // source content or element?
            cfg.source = source_match[1];
            // XXX: turn into source processor
            cfg.sourceMod = source_match[2] ? "element" : "content";

            // will be added while the ajax request is in progress
            cfg.targetLoadClasses = "injecting";

            // target content or element?
            targetMod = target_match[2] ? "element" : "content";
            cfg.target = target_match[1];
            cfg.targetLoadClasses += " injecting-" + targetMod;

            // position relative to target
            targetPosition = (target_match[3] || "::").slice(2);
            if (targetPosition)
                cfg.targetLoadClasses += " injecting-" + targetPosition;

            cfg.action = targetMod + targetPosition;

            // Once we start detacting illegal combinations, we'll
            // return false in case of error
            return true;
        },

        // create a target that matches the selector
        //
        // XXX: so far we only support #target and create a div with
        // that id appended to the body.
        _createTarget: function(selector) {
            var $target;
            if (selector.slice(0,1) !== '#') {
                log.error('only id supported for non-existing target');
                return null;
            }
            $target = $('<div />').attr({id: selector.slice(1)});
            $('body').append($target);
            return $target;
        },
        execute: function(cfgs) {
            var $this = $(this);

            // get a kinda deep copy, we scribble on it
            cfgs = cfgs.map(function(cfg) {
                return $.extend({}, cfg);
            });

            if (!_.verifyConfig(cfgs))
                return;

            // possibility for spinners on targets
            cfgs.forEach(function(cfg) {
                cfg.$target.addClass(cfg.targetLoadClasses);
            });

            var onSuccess = function(data, status, jqxhr) {
                // list of $source objects, one for each cfg
                var sources = cfgs.map(function(cfg) { return cfg.source; }),
                    sources$ = _._sourcesFromHtml(data, cfgs[0].url, sources);

                cfgs.forEach(function(cfg, idx) {
                    var $source = sources$[idx];

                    // XXX: generalize to do postProcessing for modals
                    if (cfg.sourceMod === "content")
                        $source = $source.contents();

                    // perform injection
                    cfg.$target.each(function() {
                        var $target = $(this),
                            $src = $source.clone();
                        if (_._inject($src, $target, cfg.action, cfg["class"])) {
                            if (cfg.sourceMod === "content") {
                                $target.addClass(cfg["class"]);
                                $target.trigger('patterns-injected', cfg);
                            } else {
                                $src.addClass(cfg["class"]);
                                $src.trigger('patterns-injected', cfg);
                            }
                        }
                    });
                });

                if (cfgs.nexthref) {
                    $this.attr({href: cfgs['next-href']});
                    _.destroy($this);
                }
            };

            ajax($this, {
                url: cfgs[0].url,
                success: onSuccess
            });
        },
        _inject: function($source, $target, action, classes) {
            // action to jquery method mapping, except for "content"
            // and "element"
            var method = {
                contentbefore: "prepend",
                contentafter:  "append",
                elementbefore: "before",
                elementafter:  "after"
            }[action];

            if ($source.length === 0) {
                log.warn('Aborting injection, source not found:', $source);
                return false;
            }
            if ($target.length === 0) {
                log.warn('Aborting injection, target not found:', $target);
                return false;
            }

            if (action === "content")
                $target.empty().append($source);
            else if (action === "element")
                $target.replaceWith($source);
            else
                $target[method]($source);

            return true;
        },
        _sourcesFromHtml: function(html, url, sources) {
            var $html = _._parseRawHtml(html, url);
            return sources.map(function(source) {
                if (source === "body")
                    source = "#__original_body";

                var $source = $html.find(source);

                if ($source.length === 0)
                    log.warn('No source elements for selector:', source, $html);

                return $source;
            });
        },
        _parseRawHtml: function(html, url) {
            url = url || "";
            var $html;
            $html = $('<div/>').html(
                html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
                    .replace(/<head\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/head>/gi, "")
                    .replace(/<body(.*)>/gi, '<div id="__original_body">')
                    .replace(/<\/body(.*)>/gi,'</div>')
            );
            $html.filter(":uri(is:relative)").each(function() {
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
            return $html;
        },
        // XXX: hack
        _initAutoloadVisible: function($el) {
            // ignore executed autoloads
            if ($el.data('patterns.inject.autoloaded')) return false;

            var $scrollable = $el.parents(":scrollable");

            // function to trigger the autoload and mark as triggered
            var trigger = function() {
                $el.data('patterns.inject.autoloaded', true);
                $el.trigger('click');
                return true;
            };

            // if autoload has no scrollable parent -> trigger it, it is visible
            if ($scrollable.length === 0) return trigger();

            // if scrollable parent and visible -> trigger it
            // we only look at the closest scrollable parent, no nesting
            var checkVisibility = function() {
                if ($el.data('patterns.autoload')) return false;
                var reltop = $el.offset().top - $scrollable.offset().top - 1000,
                    doTrigger = reltop <= $scrollable.innerHeight();
                if (doTrigger) return trigger();
                return false;
            };
            if (checkVisibility()) return true;

            // wait to become visible - again only immediate scrollable parent
            $($scrollable[0]).on("scroll", checkVisibility);
            $(window).on('resize.pat-autoload', checkVisibility);
            return false;
        }
    };

    $(document).on("patterns-injected", function(ev, cfg) {
        cfg.$target.removeClass(cfg.targetLoadClasses);
    });

    registry.register(_);
    return _;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

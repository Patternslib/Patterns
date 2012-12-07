/*
 * changes to previous injection implementations
 * - no support for data-injection anymore, switch to new data-inject
 * - no support for data-href-next anymore, switch to data-inject: next-href
 * - XXX: add support for forms, see remnants in inject1 and ajaxify
 */
define([
    "jquery",
    "../core/parser",
    "../core/logger",
    "../lib/ajax",
    "../registry",
    "URIjs/URI",
    "jquery_ext", // for :scrollable for autoLoading-visible
    "URIjs/jquery.URI"
], function($, Parser, logger, ajax, registry, URI) {
    var log = logger.getLogger("pat.inject"),
        parser = new Parser("inject");

    //parser.add_argument("selector", "body");
    parser.add_argument("selector");
    //XXX: (yet) unsupported: parser.add_argument("target", "$selector");
    parser.add_argument("target");
    parser.add_argument("type", "default");
    parser.add_argument("next-href");
    //XXX: (yet) unsupported: parser.add_argument("source", "$selector");
    parser.add_argument("source");
    // XXX: this should not be here but the parser would bail on
    // unknown parameters and expand/collapsible need to pass the url
    // to us
    parser.add_argument("url");
    parser.add_argument("class");

    var _ = {
        name: "inject",
        trigger: "a.pat-inject, form.pat-inject",
        init: function($el, opts) {
            if ($el.length > 1)
                return $el.each(function() { _.init($(this), opts); });

            var cfgs = _.extractConfig($el, opts);
            $el.data("patterns.inject", cfgs);

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
            if ($el.is("a") && $nexthref.length > 0) {
                log.debug("Skipping as next href already exists", $nexthref);
                // XXX: reconsider how the injection enters exhausted state
                return $el.attr({href: (window.location.href.split("#")[0] || "") +
                                 cfgs[0].nextHref});
            }

            // setup event handlers
            if ($el.is("a"))
                $el.on("click.pat-inject", _.onClick);
            else if ($el.is("form"))
                $el.on("submit.pat-inject", _.onSubmit);

            // XXX: hack to support the old autoLoading-visible class
            if ($el.hasClass("autoLoading-visible"))
                _._initAutoloadVisible($el);

            log.debug("initialised:", $el);

            return $el;
        },

        destroy: function($el) {
            $el.off(".pat-inject");
            $el.data("patterns.inject", null);
            return $el;
        },

        onClick: function(ev) {
            var cfgs = $(this).data("patterns.inject"),
                $el = $(this);
            if (ev)
                ev.preventDefault();
            $el.trigger("patterns-inject-triggered");
            _.execute(cfgs, $el);
        },

        onSubmit: function(ev) {
            var cfgs = $(this).data("patterns.inject"),
                $el = $(this);
            if (ev)
                ev.preventDefault();
            $el.trigger("patterns-inject-triggered");
            _.execute(cfgs, $el);
        },

        extractConfig: function($el, opts) {
            opts = $.extend({}, opts);

            var urlparts, cfgs, defaultSelector;
            // opts has priority, fallback to href/action
            opts.url = opts.url || $el.attr("href") || $el.attr("action") || "";

            // separate selector from url
            urlparts = opts.url.split("#");
            opts.url = urlparts[0];

            // if no selector, check for selector as part of original url
            defaultSelector = urlparts[1] && "#" + urlparts[1] || "body";

            if (urlparts.length > 2) {
                log.warn("Ignoring additional source ids:", urlparts.slice(2));
            }

            cfgs = parser.parse($el, opts, true);
            cfgs.forEach(function(cfg) {
                cfg.selector = cfg.selector || defaultSelector;
            });
            return cfgs;
        },
        // verify and post-process config
        // XXX: this should return a command instead of messing around on the config
        verifyConfig: function(cfgs) {
            var url = cfgs[0].url;

            // verification for each cfg in the array needs to succeed
            return cfgs.every(function(cfg) {
                // in case of multi-injection, all injections need to use
                // the same url
                if (cfg.url !== url) {
                    log.error("Unsupported different urls for multi-inject");
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
                        log.error("Need target selector", cfg);
                        return false;
                    }
                    cfg.$target = _._createTarget(cfg.target);
                    cfg.$injected = cfg.$target;
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

            // Once we start detecting illegal combinations, we'll
            // return false in case of error
            return true;
        },

        // create a target that matches the selector
        //
        // XXX: so far we only support #target and create a div with
        // that id appended to the body.
        _createTarget: function(selector) {
            var $target;
            if (selector.slice(0,1) !== "#") {
                log.error("only id supported for non-existing target");
                return null;
            }
            $target = $("<div />").attr({id: selector.slice(1)});
            $("body").append($target);
            return $target;
        },

        execute: function(cfgs, $el) {
            // get a kinda deep copy, we scribble on it
            cfgs = cfgs.map(function(cfg) {
                return $.extend({}, cfg);
            });

            // XXX: this need to get functional, returning a command
            // for internal use, instead of passing on cfgs
            if (!_.verifyConfig(cfgs))
                return;

            // possibility for spinners on targets
            cfgs.forEach(function(cfg) {
                cfg.$target.addClass(cfg.targetLoadClasses);
            });

            var onSuccess = function(ev) {
                var data = ev && ev.jqxhr && ev.jqxhr.responseText;
                if (!data) {
                    log.warn("No response content, aborting", ev);
                    return;
                }

                var sources$ = _.callTypeHandler(cfgs[0].type, 'sources', $el, [cfgs, data, ev]);

                cfgs.forEach(function(cfg, idx) {
                    var $source = sources$[idx];

                    if (cfg.sourceMod === "content")
                        $source = $source.contents();

                    // perform injection
                    cfg.$target.each(function() {
                        var $target = $(this),
                            $src = $source.clone(),
                            $injected = cfg.$injected || $src;
                        if (_._inject($src, $target, cfg.action, cfg["class"])) {
                            $injected.filter(function() {
                                // setting data on textnode fails in IE8
                                return this.nodeType !== 3; //Node.TEXT_NODE
                            }).data("pat-injected", {origin: cfg.url});
                            $injected.addClass(cfg["class"])
                                .trigger("patterns-injected", cfg);
                        }
                    });
                });

                if (cfgs[0].nextHref) {
                    $el.attr({href: (window.location.href.split("#")[0] || "") +
                              cfgs[0].nextHref});
                    _.destroy($el);

                    // XXX: this used to be the case, but I don't see
                    // why that would be a good idea.
                    //
                    // jump to new href target
                    //if (!$el.hasClass("autoLoading-visible"))
                    //    window.location.href = $el.attr('href');
                }
                $el.off("pat-ajax-success.pat-inject");
            };

            $el.on("pat-ajax-success.pat-inject", onSuccess);

            ajax($el, {
                url: cfgs[0].url
            });
        },

        _inject: function($source, $target, action /* , classes */) {
            // action to jquery method mapping, except for "content"
            // and "element"
            var method = {
                contentbefore: "prepend",
                contentafter:  "append",
                elementbefore: "before",
                elementafter:  "after"
            }[action];

            if ($source.length === 0) {
                log.warn("Aborting injection, source not found:", $source);
                return false;
            }
            if ($target.length === 0) {
                log.warn("Aborting injection, target not found:", $target);
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
                    log.warn("No source elements for selector:", source, $html);

                return $source;
            });
        },

        _link_attributes: {
            A: "href",
            FORM: "action",
            IMG: "src"
        },

        _parseRawHtml: function(html, url) {
            url = url || "";

            // remove script tags and head and replace body by a div
            var clean_html = html
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
                    .replace(/<head\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/head>/gi, "")
                    .replace(/<body([^>]*?)>/gi, "<div id=\"__original_body\">")
                    .replace(/<\/body([^>]*?)>/gi, "</div>");
            var $html = $("<div/>").html(clean_html);

            if ($html.children().length === 0)
                log.warn("Parsing html resulted in empty jquery object:", clean_html);

            // make relative links in _link_attributes relative to current page
            $html.find(":uri(is:relative)").each(function() {
                var attr = _._link_attributes[this.tagName],
                    rel_url, new_rel_url;
                if (!attr) {
                    return;
                }

                // this.(href|action|src) yields absolute uri -> retrieve relative
                // uris with getAttribute
                rel_url = this.getAttribute(attr);
                if (!rel_url) {
                    log.info("Skipping empty url for (el, attr)", this, attr);
                    return;
                }
                // leave hash and plone views untouched
                if ((rel_url[0] === "#") || (rel_url[0] === "@")) {
                    return;
                }
                new_rel_url = new URI(rel_url).absoluteTo(url).toString();
                if (new_rel_url !== rel_url) {
                    log.debug("Adjusted url from:", rel_url, "to:", new_rel_url);
                    this[attr] = new_rel_url;
                }
            });
            return $html;
        },

        // XXX: hack
        _initAutoloadVisible: function($el) {
            // ignore executed autoloads
            if ($el.data("patterns.inject.autoloaded")) return false;

            var $scrollable = $el.parents(":scrollable");

            // function to trigger the autoload and mark as triggered
            var trigger = function() {
                $el.data("patterns.inject.autoloaded", true);
                $el.trigger("click");
                return true;
            };

            // if autoload has no scrollable parent -> trigger it, it is visible
            if ($scrollable.length === 0) return trigger();

            // if scrollable parent and visible -> trigger it
            // we only look at the closest scrollable parent, no nesting
            var checkVisibility = function() {
                if ($el.data("patterns.autoload")) return false;
                var reltop = $el.offset().top - $scrollable.offset().top - 1000,
                    doTrigger = reltop <= $scrollable.innerHeight();
                if (doTrigger) {
                    // checkVisibility was possibly installed as a scroll
                    // handler and has now served its purpose -> remove
                    $($scrollable[0]).off("scroll", checkVisibility);
                    return trigger();
                }
                return false;
            };
            if (checkVisibility()) return true;

            // wait to become visible - again only immediate scrollable parent
            $($scrollable[0]).on("scroll", checkVisibility);
            $(window).on("resize.pat-autoload", checkVisibility);
            return false;
        },

        // XXX: simple so far to see what the team thinks of the idea
        registerTypeHandler: function(type, handler) {
            _.handlers[type] = handler;
        },

        callTypeHandler: function(type, fn, context, params) {
            if (!type) {
                log.warn('No type specified');
                return null;
            }

            if (_.handlers[type] && $.isFunction(_.handlers[type][fn])) {
                return _.handlers[type][fn].apply(context, params);
            } else {
                return null;
            }
        },

        handlers: {
            'default': {
                sources: function(cfgs, data) {
                    var sources = cfgs.map(function(cfg) { return cfg.source; });
                    return _._sourcesFromHtml(data, cfgs[0].url, sources);
                }
            }
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

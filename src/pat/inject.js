/*
 * changes to previous injection implementations
 * - no support for data-injection anymore, switch to new data-inject
 * - no support for data-href-next anymore, switch to data-inject: next-href
 * - XXX: add support for forms, see remnants in inject1 and ajaxify
 */
define([
    "jquery",
    "./ajax",
    "../core/parser",
    "../core/logger",
    "../registry",
    "../utils",
    "../lib/htmlparser",
    "../jquery-ext"  // for :scrollable for autoLoading-visible
], function($, ajax, Parser, logger, registry, utils, htmlparser) {
    var log = logger.getLogger("pat.inject"),
        parser = new Parser("inject");

    //parser.add_argument("selector", "body");
    parser.add_argument("selector");
    //XXX: (yet) unsupported: parser.add_argument("target", "$selector");
    parser.add_argument("target");
    parser.add_argument("data-type", "html");
    parser.add_argument("next-href");
    //XXX: (yet) unsupported: parser.add_argument("source", "$selector");
    parser.add_argument("source");
    parser.add_argument("trigger", "default", ["default", "autoload", "autoload-visible"]);
    // XXX: this should not be here but the parser would bail on
    // unknown parameters and expand/collapsible need to pass the url
    // to us
    parser.add_argument("url");
    parser.add_argument("class");
    parser.add_argument("history");

    var _ = {
        name: "inject",
        trigger: "a.pat-inject, form.pat-inject, .pat-subform.pat-inject",
        init: function($el, opts) {
            if ($el.length > 1)
                return $el.each(function() { _.init($(this), opts); });

            var cfgs = _.extractConfig($el, opts);

            // if the injection shall add a history entry and HTML5 pushState
            // is missing, then don't initialize the injection.
            if (cfgs.some(function(e){return e.history === "record";}) &&
                    !("pushState" in history))
                return $el;

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

            switch (cfgs[0].trigger) {
            case "default":
                // setup event handlers
                if ($el.is("a")) {
                    $el.on("click.pat-inject", _.onClick);
                } else if ($el.is("form")) {
                    $el.on("submit.pat-inject", _.onSubmit)
                       .on("click.pat-inject", "[type=submit]", ajax.onClickSubmit);
                } else if ($el.is(".pat-subform")) {
                    log.debug("Initializing subform with injection");
                }
                break;
            case "autoload":
                try {
                    _.onClick.apply($el[0], []);
                } catch (e) {
                    log.error("autoload", e);
                }
                break;
            case "autoload-visible":
                _._initAutoloadVisible($el);
                break;
            }

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
            try {
                $el.trigger("patterns-inject-triggered");
            } catch (e) {
                log.error("patterns-inject-triggered", e);
            }
            _.execute(cfgs, $el);
        },

        onSubmit: function(ev) {
            var cfgs = $(this).data("patterns.inject"),
                $el = $(this);
            if (ev)
                ev.preventDefault();
            try {
                $el.trigger("patterns-inject-triggered");
            } catch (e) {
                log.error("patterns-inject-triggered", e);
            }
            _.execute(cfgs, $el);
        },

        submitSubform: function($sub) {
            var $el = $sub.parents('form'),
                cfgs = $sub.data("patterns.inject");
            try {
                $el.trigger("patterns-inject-triggered");
            } catch (e) {
                log.error("patterns-inject-triggered", e);
            }
            _.execute(cfgs, $el);
        },

        extractConfig: function($el, opts) {
            opts = $.extend({}, opts);

            var cfgs = parser.parse($el, opts, true);
            cfgs.forEach(function(cfg) {
                var urlparts, defaultSelector;
                // opts and cfg have priority, fallback to href/action
                cfg.url = opts.url || cfg.url || $el.attr("href") || $el.attr("action") || "";

                // separate selector from url
                urlparts = cfg.url.split("#");
                cfg.url = urlparts[0];

                // if no selector, check for selector as part of original url
                defaultSelector = urlparts[1] && "#" + urlparts[1] || "body";

                if (urlparts.length > 2) {
                    log.warn("Ignoring additional source ids:", urlparts.slice(2));
                }

                cfg.selector = cfg.selector || defaultSelector;
            });
            return cfgs;
        },
        // verify and post-process config
        // XXX: this should return a command instead of messing around on the config
        verifyConfig: function(cfgs, $el) {
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
                cfg.$target = cfg.$target || (cfg.target==="self" ? $el : $(cfg.target));
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
            var source_re = /^(.*?)(::element)?$/,
                target_re = /^(.*?)(::element)?(::after|::before)?$/,
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
            if (!_.verifyConfig(cfgs, $el))
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

                var sources$ = _.callTypeHandler(cfgs[0].dataType, "sources", $el, [cfgs, data, ev]);

                cfgs.forEach(function(cfg, idx) {
                    var $source = sources$[idx];

                    if (cfg.sourceMod === "content")
                        $source = $source.contents();

                    // perform injection
                    cfg.$target.each(function() {
                        var $src;

                        // $source.clone() does not work with shived elements in IE8
                        if (document.all && document.querySelector &&
                            !document.addEventListener) {
                            $src = $source.map(function() {
                                return $(this.outerHTML)[0];
                            });
                        } else {
                            $src = $source.clone();
                        }

                        var $target = $(this),
                            $injected = cfg.$injected || $src;

                        $src.findInclusive('img').on('load', function() {
                            try {
                                $(this).trigger('pat-inject-content-loaded');
                            } catch (e) {
                                log.error("pat-inject-content-loaded", e);
                            }
                        });

                        if (_._inject($src, $target, cfg.action, cfg["class"])) {
                            $injected.filter(function() {
                                // setting data on textnode fails in IE8
                                return this.nodeType !== 3; //Node.TEXT_NODE
                            }).data("pat-injected", {origin: cfg.url});
                            $injected.addClass(cfg["class"]);
                            try {
                                $injected.trigger("patterns-injected", cfg);
                            } catch (e) {
                                log.error("patterns-injected", e);
                            }
                        }
                        if ((cfg.history === "record") &&
                            ("pushState" in history))
                            history.pushState({url: cfg.url}, "", cfg.url);
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
                $el.off("pat-ajax-error.pat-inject");
            };

            var onError = function() {
                cfgs.forEach(function(cfg) {
                    if ("$injected" in cfg)
                        cfg.$injected.remove();
                });
                $el.off("pat-ajax-success.pat-inject");
                $el.off("pat-ajax-error.pat-inject");
            };

            $el.on("pat-ajax-success.pat-inject", onSuccess);
            $el.on("pat-ajax-error.pat-inject", onError);

            ajax.request($el, {url: cfgs[0].url});
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

                $source.find("a[href^=\"#\"]").each(function() {
                    var href = this.getAttribute("href");
                    // Skip in-document links pointing to an id that is inside
                    // this fragment.
                    if (href.length === 1)  // Special case for top-of-page links
                        this.href=url;
                    else if (!$source.find(href).length)
                        this.href=url+href;
                });

                return $source;
            });
        },

        _link_attributes: {
            A: "href",
            FORM: "action",
            IMG: "src",
            SOURCE: "src",
            VIDEO: "src"
        },

        _rebaseHTML_via_HTMLParser: function(base, html) {
            var output = [],
                i, link_attribute, value;

            htmlparser.HTMLParser(html, {
                start: function(tag, attrs, unary) {
                    output.push("<"+tag);
                    link_attribute = _._link_attributes[tag.toUpperCase()];
                    for (i=0; i<attrs.length; i++) {
                        if (attrs[i].name.toLowerCase() === link_attribute) {
                            value = attrs[i].value;
                            // Do not rewrite Zope views or in-document links.
                            // In-document links will be processed later after
                            // extracting the right fragment.
                            if (value.slice(0, 2) !== "@@" && value[0] !== "#") {
                                value = utils.rebaseURL(base, value);
                                value = value.replace(/(^|[^\\])"/g, '$1\\\"');
                            }
                        }  else
                            value = attrs[i].escaped;
                        output.push(" " + attrs[i].name + "=\"" + value + "\"");
                    }
                    output.push(unary ? "/>" : ">");
                },

                end: function(tag) {
                    output.push("</"+tag+">");
                },

                chars: function(text) {
                    output.push(text);
                },

                comment: function(text) {
                    output.push("<!--"+text+"-->");
                }
            });
            return output.join("");
        },

        _rebaseAttrs: {
            A: "href",
            FORM: "action",
            IMG: "data-pat-inject-rebase-src",
            SOURCE: "data-pat-inject-rebase-src",
            VIDEO: "data-pat-inject-rebase-src"
        },

        _rebaseHTML: function(base, html) {
            var $page = $(html.replace(
                /(\s)(src\s*)=/gi,
                '$1src="" data-pat-inject-rebase-$2='
            ).trim()).wrapAll('<div>').parent();

            $page.find(Object.keys(_._rebaseAttrs).join(',')).each(function() {
                var $this = $(this),
                    attrName = _._rebaseAttrs[this.tagName],
                    value = $this.attr(attrName);

                if (value && value.slice(0, 2) !== "@@" && value[0] !== "#" &&
                    value.slice(0, 7) !== 'mailto:') {
                    value = utils.rebaseURL(base, value);
                    $this.attr(attrName, value);
                }
            });
            // XXX: IE8 changes the order of attributes in html. The following
            // lines move data-pat-inject-rebase-src to src.
            $page.find('[data-pat-inject-rebase-src]').each(function() {
                var $el = $(this);
                $el.attr('src', $el.attr('data-pat-inject-rebase-src'))
                   .removeAttr('data-pat-inject-rebase-src');
            });

            return $page.html().replace(
                    /src="" data-pat-inject-rebase-/g, ''
                ).trim();
        },

        _parseRawHtml: function(html, url) {
            url = url || "";

            // remove script tags and head and replace body by a div
            var clean_html = html
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
                    .replace(/<head\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/head>/gi, "")
                    .replace(/<body([^>]*?)>/gi, "<div id=\"__original_body\">")
                    .replace(/<\/body([^>]*?)>/gi, "</div>");
            try {
                clean_html = _._rebaseHTML(url, clean_html);
            } catch (e) {
                log.error("Error rebasing urls", e);
            }
            var $html = $("<div/>").html(clean_html);

            if ($html.children().length === 0)
                log.warn("Parsing html resulted in empty jquery object:", clean_html);

            return $html;
        },

        // XXX: hack
        _initAutoloadVisible: function($el) {
            // ignore executed autoloads
            if ($el.data("patterns.inject.autoloaded"))
                return false;

            var $scrollable = $el.parents(":scrollable");

            // function to trigger the autoload and mark as triggered
            var trigger = function() {
                $el.data("patterns.inject.autoloaded", true);
                _.onClick.apply($el[0], []);
                return true;
            };

            // if autoload has no scrollable parent -> trigger it, it is visible
            if ($scrollable.length === 0)
                return trigger();

            // if scrollable parent and visible -> trigger it
            // we only look at the closest scrollable parent, no nesting
            var checkVisibility = function() {
                if ($el.data("patterns.autoload"))
                    return false;
                var reltop = $el.offset().top - $scrollable.offset().top - 1000,
                    doTrigger = reltop <= $scrollable.innerHeight();
                if (doTrigger) {
                    // checkVisibility was possibly installed as a scroll
                    // handler and has now served its purpose -> remove
                    $($scrollable[0]).off("scroll", checkVisibility);
                    $(window).off("resize.pat-autoload", checkVisibility);
                    return trigger();
                }
                return false;
            };
            if (checkVisibility())
                return true;

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
            type = type || "html";
            
            if (_.handlers[type] && $.isFunction(_.handlers[type][fn])) {
                return _.handlers[type][fn].apply(context, params);
            } else {
                return null;
            }
        },

        handlers: {
            "html": {
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

    $(window).bind("popstate", function (event) {
        // popstate also triggers on traditional anchors
        if (!event.originalEvent.state) {
            history.replaceState("anchor", "", document.location.href);
            return;
        }
        window.location.reload();
    });

    // this entry ensures that the initally loaded page can be reached with
    // the back button
    if ("replaceState" in history) {
        history.replaceState("pageload", "", document.location.href);
    }

    registry.register(_);
    return _;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

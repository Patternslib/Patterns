define([
    import $ from "jquery";,
    import _ from "underscore";,
    "pat-ajax",
    import Parser from "../../core/parser";
    import logger from "../../core/logger";
    import registry from "../../core/registry";
    import utils from "../../core/utils";
    "pat-htmlparser",
    "intersection-observer",
    "pat-jquery-ext" // for :scrollable for autoLoading-visible
], function($, _, ajax, Parser, logger, registry, utils, htmlparser) {
    var log = logger.getLogger("pat.inject"),
        parser = new Parser("inject"),
        TEXT_NODE = 3,
        COMMENT_NODE = 8;

    parser.addArgument("selector");
    parser.addArgument("target");
    parser.addArgument("data-type", "html");
    parser.addArgument("next-href");
    parser.addArgument("source");
    parser.addArgument("trigger", "default", [
        "default",
        "autoload",
        "autoload-visible",
        "idle"
    ]);
    parser.addArgument("delay"); // only used in autoload
    parser.addArgument("confirm", "class", [
        "never",
        "always",
        "form-data",
        "class"
    ]);
    parser.addArgument(
        "confirm-message",
        "Are you sure you want to leave this page?"
    );
    parser.addArgument("hooks", [], ["raptor"], true); // After injection, pat-inject will trigger an event for each hook: pat-inject-hook-$(hook)
    parser.addArgument("loading-class", "injecting"); // Add a class to the target while content is still loading.
    parser.addArgument("executing-class", "executing"); // Add a class to the element while content is still loading.
    parser.addArgument("executed-class", "executed"); // Add a class to the element when content is loaded.
    parser.addArgument("class"); // Add a class to the injected content.
    parser.addArgument("history");
    parser.addArgument("push-marker");
    parser.addArgument("scroll");
    // XXX: this should not be here but the parser would bail on
    // unknown parameters and expand/collapsible need to pass the url
    // to us
    parser.addArgument("url");

    var inject = {
        name: "inject",
        trigger:
            ".raptor-ui .ui-button.pat-inject, a.pat-inject, form.pat-inject, .pat-subform.pat-inject",
        init: function inject_init($el, opts) {
            var cfgs = inject.extractConfig($el, opts);
            if (
                cfgs.some(function(e) {
                    return e.history === "record";
                }) &&
                !("pushState" in history)
            ) {
                // if the injection shall add a history entry and HTML5 pushState
                // is missing, then don't initialize the injection.
                return $el;
            }
            $el.data("pat-inject", cfgs);

            if (cfgs[0].nextHref && cfgs[0].nextHref.indexOf("#") === 0) {
                // In case the next href is an anchor, and it already
                // exists in the page, we do not activate the injection
                // but instead just change the anchors href.

                // XXX: This is used in only one project for linked
                // fullcalendars, it's sanity is wonky and we should
                // probably solve it differently.
                if ($el.is("a") && $(cfgs[0].nextHref).length > 0) {
                    log.debug(
                        "Skipping as next href is anchor, which already exists",
                        cfgs[0].nextHref
                    );
                    // XXX: reconsider how the injection enters exhausted state
                    return $el.attr({
                        href:
                            (window.location.href.split("#")[0] || "") +
                            cfgs[0].nextHref
                    });
                }
            }
            if (cfgs[0].pushMarker) {
                $("body").on("push", function(event, data) {
                    if (data == cfgs[0].pushMarker) {
                        inject.onTrigger.apply($el[0], []);
                    }
                });
            }
            if (cfgs[0].idleTrigger) {
                // XXX TODO: handle item removed from DOM
                var timeout = parseInt(cfgs[0].idleTrigger, 10);
                var timer;

                function onTimeout() {
                    inject.onTrigger.apply($el[0], []);
                    unsub();
                    clearTimeout(timer);
                }

                var onInteraction = utils.debounce(function onInteraction() {
                    clearTimeout(timer);
                    timer = setTimeout(onTimeout, cfgs[0].trigger);
                }, timeout);

                function unsub() {
                    ["scroll", "resize"].forEach(function(e) {
                        window.removeEventListener(e, onInteraction);
                    });
                    [
                        "click",
                        "keypress",
                        "keyup",
                        "mousemove",
                        "touchstart",
                        "touchend"
                    ].forEach(function(e) {
                        document.removeEventListener(e, onInteraction);
                    });
                }

                onInteraction();

                ["scroll", "resize"].forEach(function(e) {
                    window.addEventListener(e, onInteraction);
                });
                [
                    "click",
                    "keypress",
                    "keyup",
                    "mousemove",
                    "touchstart",
                    "touchend"
                ].forEach(function(e) {
                    document.addEventListener(e, onInteraction);
                });
            } else {
                switch (cfgs[0].trigger) {
                    case "default":
                        cfgs.forEach(function(cfg) {
                            if (cfg.delay) {
                                cfg.processDelay = cfg.delay;
                            }
                        });
                        // setup event handlers
                        if ($el.is("form")) {
                            $el.on("submit.pat-inject", inject.onTrigger)
                                .on(
                                    "click.pat-inject",
                                    "[type=submit]",
                                    ajax.onClickSubmit
                                )
                                .on(
                                    "click.pat-inject",
                                    "[type=submit][formaction], [type=image][formaction]",
                                    inject.onFormActionSubmit
                                );
                        } else if ($el.is(".pat-subform")) {
                            log.debug("Initializing subform with injection");
                        } else {
                            $el.on("click.pat-inject", inject.onTrigger);
                        }
                        break;
                    case "autoload":
                        if (!cfgs[0].delay) {
                            inject.onTrigger.apply($el[0], []);
                        } else {
                            // generate UID
                            var uid = Math.random().toString(36);
                            $el.attr("data-pat-inject-uid", uid);

                            // function to trigger the autoload and mark as triggered
                            function delayed_trigger(uid) {
                                // Check if the element has been removed from the dom
                                var still_there = $(
                                    "[data-pat-inject-uid='" + uid + "']"
                                );
                                if (still_there.length == 0) return false;

                                $el.data("pat-inject-autoloaded", true);
                                inject.onTrigger.apply($el[0], []);
                                return true;
                            }
                            window.setTimeout(
                                delayed_trigger.bind(null, uid),
                                cfgs[0].delay
                            );
                        }
                        break;
                    case "autoload-visible":
                        inject._initAutoloadVisible($el, cfgs);
                        break;
                    case "idle":
                        inject._initIdleTrigger($el, cfgs[0].delay);
                        break;
                }
            }

            log.debug("initialised:", $el);
            return $el;
        },

        destroy: function inject_destroy($el) {
            $el.off(".pat-inject");
            $el.data("pat-inject", null);
            return $el;
        },

        onTrigger: function inject_onTrigger(ev) {
            /* Injection has been triggered, either via form submission or a
             * link has been clicked.
             */
            var cfgs = $(this).data("pat-inject"),
                $el = $(this);
            if ($el.is("form")) {
                $(cfgs).each(function(i, v) {
                    v.params = $.param($el.serializeArray());
                });
            }
            ev && ev.preventDefault();
            $el.trigger("patterns-inject-triggered");
            inject.execute(cfgs, $el);
        },

        onFormActionSubmit: function inject_onFormActionSubmit(ev) {
            ajax.onClickSubmit(ev); // make sure the submitting button is sent with the form

            var $button = $(ev.target),
                formaction = $button.attr("formaction"),
                $form = $button.parents(".pat-inject").first(),
                opts = { url: formaction },
                $cfg_node = $button.closest("[data-pat-inject]"),
                cfgs = inject.extractConfig($cfg_node, opts);

            $(cfgs).each(function(i, v) {
                v.params = $.param($form.serializeArray());
            });

            ev.preventDefault();
            $form.trigger("patterns-inject-triggered");
            inject.execute(cfgs, $form);
        },

        submitSubform: function inject_submitSubform($sub) {
            /* This method is called from pat-subform
             */
            var $el = $sub.parents("form"),
                cfgs = $sub.data("pat-inject");

            // store the params of the subform in the config, to be used by history
            $(cfgs).each(function(i, v) {
                v.params = $.param($sub.serializeArray());
            });

            try {
                $el.trigger("patterns-inject-triggered");
            } catch (e) {
                log.error("patterns-inject-triggered", e);
            }
            inject.execute(cfgs, $el);
        },

        extractConfig: function inject_extractConfig($el, opts) {
            opts = $.extend({}, opts);

            var cfgs = parser.parse($el, opts, true);
            cfgs.forEach(function inject_extractConfig_each(cfg) {
                // opts and cfg have priority, fallback to href/action
                cfg.url =
                    opts.url ||
                    cfg.url ||
                    $el.attr("href") ||
                    $el.attr("action") ||
                    $el.parents("form").attr("action") ||
                    "";

                // separate selector from url
                var urlparts = cfg.url.split("#");
                cfg.url = urlparts[0];

                // if no selector, check for selector as part of original url
                var defaultSelector =
                    (urlparts[1] && "#" + urlparts[1]) || "body";

                if (urlparts.length > 2) {
                    log.warn(
                        "Ignoring additional source ids:",
                        urlparts.slice(2)
                    );
                }

                cfg.selector = cfg.selector || defaultSelector;
                if (cfg.delay) {
                    try {
                        cfg.delay = utils.parseTime(cfg.delay);
                    } catch (e) {
                        log.warn("Invalid delay value: ", cfg.delay);
                        cfg.delay = null;
                    }
                }
                cfg.processDelay = 0;
            });
            return cfgs;
        },

        elementIsDirty: function(m) {
            /* Check whether the passed in form element contains a value.
             */
            var data = $.map(m.find(":input:not(select)"), function(i) {
                var val = $(i).val();
                return Boolean(val) && val !== $(i).attr("placeholder");
            });
            return $.inArray(true, data) !== -1;
        },

        askForConfirmation: function inject_askForConfirmation(cfgs) {
            /* If configured to do so, show a confirmation dialog to the user.
             * This is done before attempting to perform injection.
             */
            var should_confirm = false,
                message;

            _.each(cfgs, function(cfg) {
                var _confirm = false;
                if (cfg.confirm == "always") {
                    _confirm = true;
                } else if (cfg.confirm === 'form-data') {
                    if (cfg.target  != 'none')
                        _confirm = inject.elementIsDirty(cfg.$target);
                } else if (cfg.confirm === 'class') {
                    if (cfg.target  != 'none')
                        _confirm = cfg.$target.hasClass('is-dirty');
                }
                if (_confirm) {
                    should_confirm = true;
                    message = cfg.confirmMessage;
                }
            });
            if (should_confirm) {
                if (!window.confirm(message)) {
                    return false;
                }
            }
            return true;
        },

        ensureTarget: function inject_ensureTarget(cfg, $el) {
            /* Make sure that a target element exists and that it's assigned to
             * cfg.$target.
             */
            // make sure target exist
            if (cfg.target === "none")
                // special case, we don't want to inject anything
                return true;
            cfg.$target = cfg.$target || (cfg.target==="self" ? $el : $(cfg.target));
            if (cfg.$target.length === 0) {
                if (!cfg.target) {
                    log.error("Need target selector", cfg);
                    return false;
                }
                cfg.$target = inject.createTarget(cfg.target);
                cfg.$injected = cfg.$target;
            }
            return true;
        },

        verifySingleConfig: function inject_verifySingleonfig($el, url, cfg) {
            /* Verify one of potentially multiple configs (i.e. argument lists).
             *
             * Extract modifiers such as ::element or ::after.
             * Ensure that a target element exists.
             */
            if (cfg.url !== url) {
                // in case of multi-injection, all injections need to use
                // the same url
                log.error("Unsupported different urls for multi-inject");
                return false;
            }
            // defaults
            cfg.source = cfg.source || cfg.selector;
            cfg.target = cfg.target || cfg.selector;

            if (!inject.extractModifiers(cfg)) {
                return false;
            }
            if (!inject.ensureTarget(cfg, $el)) {
                return false;
            }
            inject.listenForFormReset(cfg);
            return true;
        },

        verifyConfig: function inject_verifyConfig(cfgs, $el) {
            /* Verify and post-process all the configurations.
             * Each "config" is an arguments list separated by the &&
             * combination operator.
             *
             * In case of multi-injection, only one URL is allowed, which
             * should be specified in the first config (i.e. arguments list).
             *
             * Verification for each cfg in the array needs to succeed.
             */
            return cfgs.every(
                _.partial(inject.verifySingleConfig, $el, cfgs[0].url)
            );
        },

        listenForFormReset: function(cfg) {
            /* if pat-inject is used to populate target in some form and when
             * Cancel button is pressed (this triggers reset event on the
             * form) you would expect to populate with initial placeholder
             */
            if (cfg.target === 'none')
                // Special case, we don't want to display any return value.
                return;
            var $form = cfg.$target.parents('form');
            if ($form.length !== 0 && cfg.$target.data('initial-value') === undefined) {
                cfg.$target.data('initial-value', cfg.$target.html());
                $form.on('reset', function() {
                    cfg.$target.html(cfg.$target.data('initial-value'));
                });
            }
        },

        extractModifiers: function inject_extractModifiers(cfg) {
            /* The user can add modifiers to the source and target arguments.
             * Modifiers such as ::element, ::before and ::after.
             * We identifiy and extract these modifiers here.
             */
            var source_re = /^(.*?)(::element)?$/,
                target_re = /^(.*?)(::element)?(::after|::before)?$/,
                source_match = source_re.exec(cfg.source),
                target_match = target_re.exec(cfg.target),
                targetMod,
                targetPosition;

            cfg.source = source_match[1];
            cfg.sourceMod = source_match[2] ? "element" : "content";
            cfg.target = target_match[1];
            targetMod = target_match[2] ? "element" : "content";
            targetPosition = (target_match[3] || "::").slice(2); // position relative to target

            if (cfg.loadingClass) {
                cfg.loadingClass += " " + cfg.loadingClass + "-" + targetMod;
                if (targetPosition && cfg.loadingClass) {
                    cfg.loadingClass +=
                        " " + cfg.loadingClass + "-" + targetPosition;
                }
            }
            cfg.action = targetMod + targetPosition;
            // Once we start detecting illegal combinations, we'll
            // return false in case of error
            return true;
        },

        createTarget: function inject_createTarget(selector) {
            /* create a target that matches the selector
             *
             * XXX: so far we only support #target and create a div with
             * that id appended to the body.
             */
            var $target;
            if (selector.slice(0, 1) !== "#") {
                log.error("only id supported for non-existing target");
                return null;
            }
            $target = $("<div />").attr({ id: selector.slice(1) });
            $("body").append($target);
            return $target;
        },

        stopBubblingFromRemovedElement: function($el, cfgs, ev) {
            /* IE8 fix. Stop event from propagating IF $el will be removed
             * from the DOM. With pat-inject, often $el is the target that
             * will itself be replaced with injected content.
             *
             * IE8 cannot handle events bubbling up from an element removed
             * from the DOM.
             *
             * See: http://stackoverflow.com/questions/7114368/why-is-jquery-remove-throwing-attr-exception-in-ie8
             */
            var s; // jquery selector
            for (var i = 0; i < cfgs.length; i++) {
                s = cfgs[i].target;
                if ($el.parents(s).addBack(s) && !ev.isPropagationStopped()) {
                    ev.stopPropagation();
                    return;
                }
            }
        },

        _performInjection: function($el, $source, cfg, trigger, title) {
            /* Called after the XHR has succeeded and we have a new $source
             * element to inject.
             */
            if (cfg.sourceMod === "content") {
                $source = $source.contents();
            }
            var $src;
            // $source.clone() does not work with shived elements in IE8
            if (
                document.all &&
                document.querySelector &&
                !document.addEventListener
            ) {
                $src = $source.map(function() {
                    return $(this.outerHTML)[0];
                });
            } else {
                $src = $source.safeClone();
            }
            var $target = $(this),
                $injected = cfg.$injected || $src;

            $src.findInclusive("img").on("load", function() {
                $(this).trigger("pat-inject-content-loaded");
            });
            // Now the injection actually happens.
            if (inject._inject(trigger, $src, $target, cfg)) {
                inject._afterInjection($el, $injected, cfg);
            }
            // History support. if subform is submitted, append form params
            var glue = "?";
            if (cfg.history === "record" && "pushState" in history) {
                if (cfg.params) {
                    if (cfg.url.indexOf("?") > -1) glue = "&";
                    history.pushState(
                        { url: cfg.url + glue + cfg.params },
                        "",
                        cfg.url + glue + cfg.params
                    );
                } else {
                    history.pushState({ url: cfg.url }, "", cfg.url);
                }
                // Also inject title element if we have one
                if (title)
                    inject._inject(trigger, title, $("title"), {
                        action: "element"
                    });
            }
        },

        _afterInjection: function($el, $injected, cfg) {
            /* Set a class on the injected elements and fire the
             * patterns-injected event.
             */
            $injected
                .filter(function() {
                    // setting data on textnode fails in IE8
                    return this.nodeType !== TEXT_NODE;
                })
                .data("pat-injected", { origin: cfg.url });

            if ($injected.length === 1 && $injected[0].nodeType == TEXT_NODE) {
                // Only one element injected, and it was a text node.
                // So we trigger "patterns-injected" on the parent.
                // The event handler should check whether the
                // injected element and the triggered element are
                // the same.
                $injected
                    .parent()
                    .trigger("patterns-injected", [cfg, $el[0], $injected[0]]);
            } else {
                $injected.each(function() {
                    // patterns-injected event will be triggered for each injected (non-text) element.
                    if (this.nodeType !== TEXT_NODE) {
                        $(this)
                            .addClass(cfg["class"])
                            .trigger("patterns-injected", [cfg, $el[0], this]);
                    }
                });
            }

            if (cfg.scroll && cfg.scroll !== 'none') {
                var scroll_container = cfg.$target.parents().addBack().filter(':scrollable');
                scroll_container = scroll_container.length ? scroll_container[0] : window;

                // default for scroll===top
                var top = 0;
                var left = 0;

                if (cfg.scroll !== 'top') {
                    var scroll_target;
                    if (cfg.scroll === 'target') {
                        scroll_target = cfg.$target[0];
                    } else {
                        scroll_target = $injected.filter(cfg.scroll)[0];
                    }

                    // Get the reference element to which against we calculate
                    // the relative position of the target.
                    // In case of a scroll container of window, we do not have
                    // getBoundingClientRect method, so get the body instead.
                    var scroll_container_ref = scroll_container;
                    if (scroll_container_ref === window) {
                        scroll_container_ref = document.body;
                    }

                    // Calculate absolute [¹] position difference between
                    // scroll_container and scroll_target.
                    // Substract the container's border from the scrolling
                    // value, as this one isn't respected by
                    // getBoundingClientRect [²] and would lead to covered
                    // items [³].
                    // ¹) so that it doesn't make a difference, if the element
                    // is below or above the scrolling container. We just need
                    // to know the absolute difference.
                    // ²) Calculations are based from the viewport.
                    // ³) See:
                    //      https://docs.microsoft.com/en-us/previous-versions//hh781509(v=vs.85)
                    //      https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
                    left = Math.abs(
                        scroll_target.getBoundingClientRect().left
                        + scroll_container_ref.scrollLeft
                        - scroll_container_ref.getBoundingClientRect().left
                        - utils.getCSSValue(scroll_container_ref, 'border-left-width', true)
                    );
                    top = Math.abs(
                        scroll_target.getBoundingClientRect().top
                        + scroll_container_ref.scrollTop
                        - scroll_container_ref.getBoundingClientRect().top
                        - utils.getCSSValue(scroll_container_ref, 'border-top-width', true)
                    );
                }
                if (scroll_container === window) {
                    scroll_container.scrollTo(left, top);
                } else {
                    scroll_container.scrollLeft = left;
                    scroll_container.scrollTop = top;
                }
            }

            $el.trigger("pat-inject-success");
        },

        _onInjectSuccess: function($el, cfgs, ev) {
            var sources$,
                data = ev && ev.jqxhr && ev.jqxhr.responseText;
            if (!data) {
                log.warn("No response content, aborting", ev);
                return;
            }
            if (cfgs[0].source === 'none') {
                // Special case, we want to call something, but we don't want to inject anything
                data = '';
            }
            $.each(cfgs[0].hooks || [], function (idx, hook) {
                $el.trigger("pat-inject-hook-"+hook);
            });
            inject.stopBubblingFromRemovedElement($el, cfgs, ev);
            sources$ = inject.callTypeHandler(
                cfgs[0].dataType,
                "sources",
                $el,
                [cfgs, data, ev]
            );
            /* pick the title source for dedicated handling later
              Title - if present - is always appended at the end. */
            var title;
            if (
                sources$ &&
                sources$[sources$.length - 1] &&
                sources$[sources$.length - 1][0] &&
                sources$[sources$.length - 1][0].nodeName == "TITLE"
            ) {
                title = sources$[sources$.length - 1];
            }
            cfgs.forEach(function(cfg, idx) {
                function perform_inject() {
                    if (cfg.target  != 'none')
                        cfg.$target.each(function() {
                            inject._performInjection.apply(this, [$el, sources$[idx], cfg, ev.target, title]);
                        });
                }
                if (cfg.processDelay) {
                    setTimeout(function() {
                        perform_inject();
                    }, cfg.processDelay);
                } else {
                    perform_inject();
                }
            });
            if (cfgs[0].nextHref && $el.is("a")) {
                // In case next-href is specified the anchor's href will
                // be set to it after the injection is triggered.
                $el.attr({ href: cfgs[0].nextHref.replace(/&amp;/g, "&") });
                inject.destroy($el);
            }
            $el.off("pat-ajax-success.pat-inject");
            $el.off("pat-ajax-error.pat-inject");
        },

        _onInjectError: function($el, cfgs, event) {
            var explanation = "";
            var timestamp = new Date();
            if (event.jqxhr.status % 100 == 4) {
                explanation =
                    "Sorry! We couldn't find the page to load. Please make a screenshot and send it to support. Thank you!";
            } else if (event.jqxhr.status % 100 == 5) {
                explanation =
                    "I am very sorry! There was an error at the server. Please make a screenshot and contact support. Thank you!";
            } else if (event.jqxhr.status == 0) {
                explanation =
                    "It seems, the server is down. Please make a screenshot and contact support. Thank you!";
            }
            var msg_attr =
                explanation +
                " Status is " +
                event.jqxhr.status +
                " " +
                event.jqxhr.statusText +
                ", time was " +
                timestamp +
                ". You can click to close this.";
            $("body").attr("data-error-message", msg_attr);
            $("body").on("click", function() {
                $("body").removeAttr("data-error-message");
                window.location.href = window.location.href;
            });
            cfgs.forEach(function(cfg) {
                if ("$injected" in cfg) cfg.$injected.remove();
            });
            $el.off("pat-ajax-success.pat-inject");
            $el.off("pat-ajax-error.pat-inject");
        },

        execute: function inject_execute(cfgs, $el) {
            /* Actually execute the injection.
             *
             * Either by making an ajax request or by spoofing an ajax
             * request when the content is readily available in the current page.
             */
            // get a kinda deep copy, we scribble on it
            cfgs = cfgs.map(function(cfg) {
                return $.extend({}, cfg);
            });
            if (!inject.verifyConfig(cfgs, $el)) {
                return;
            }
            if (!inject.askForConfirmation(cfgs)) {
                return;
            }
            if ($el.data("pat-inject-triggered")) {
                // Prevent double triggers;
                return;
            }
            $el.data("pat-inject-triggered", true);
            // possibility for spinners on targets
            _.chain(cfgs).filter(_.property('loadingClass')).each(function(cfg) {
                if (cfg.target  != 'none')
                    cfg.$target.addClass(cfg.loadingClass);
            });
            // Put the execute class on the elem that has pat inject on it
            _.chain(cfgs)
                .filter(_.property("loadingClass"))
                .each(function(cfg) {
                    $el.addClass(cfg.executingClass);
                });

            $el.on("pat-ajax-success.pat-inject", this._onInjectSuccess.bind(this, $el, cfgs));
            $el.on("pat-ajax-error.pat-inject", this._onInjectError.bind(this, $el, cfgs));
            $el.on("pat-ajax-success.pat-inject pat-ajax-error.pat-inject", function() {
                $el.removeData('pat-inject-triggered');
            });

            if (cfgs[0].url.length) {
                ajax.request($el, { url: cfgs[0].url });
            } else {
                // If there is no url specified, then content is being fetched
                // from the same page.
                // No need to do an ajax request for this, so we spoof the ajax
                // event.
                $el.trigger({
                    type: "pat-ajax-success",
                    jqxhr: {
                        responseText: $("body").html()
                    }
                });
            }
        },

        _inject: function inject_inject(trigger, $source, $target, cfg) {
            // action to jquery method mapping, except for "content"
            // and "element"
            var method = {
                contentbefore: "prepend",
                contentafter: "append",
                elementbefore: "before",
                elementafter: "after"
            }[cfg.action];

            if (cfg.source === 'none') {
                $target.replaceWith('');
                return true;
            }
            if ($source.length === 0) {
                log.warn("Aborting injection, source not found:", $source);
                $(trigger).trigger("pat-inject-missingSource", {
                    url: cfg.url,
                    selector: cfg.source
                });
                return false;
            }
            if (cfg.target === "none")
                // Special case. Don't do anything, we don't want any result
                return true;
            if ($target.length === 0) {
                log.warn("Aborting injection, target not found:", $target);
                $(trigger).trigger("pat-inject-missingTarget", {
                    selector: cfg.target
                });
                return false;
            }
            if (cfg.action === "content") {
                $target.empty().append($source);
            } else if (cfg.action === "element") {
                $target.replaceWith($source);
            } else {
                $target[method]($source);
            }
            return true;
        },

        _sourcesFromHtml: function inject_sourcesFromHtml(html, url, sources) {

            var $html = inject._parseRawHtml(html, url);
            return sources.map(function inject_sourcesFromHtml_map(source) {
                if (source === "body") {
                    source = "#__original_body";
                }
                if (source === "none") {
                    return $('<!-- -->');
                }
                var $source = $html.find(source);

                if ($source.length === 0) {
                    log.warn("No source elements for selector:", source, $html);
                }

                $source.find('a[href^="#"]').each(function() {
                    var href = this.getAttribute("href");
                    if (href.indexOf("#{1}") !== -1) {
                        // We ignore hrefs containing #{1} because they're not
                        // valid and only applicable in the context of
                        // pat-clone.
                        return;
                    }
                    // Skip in-document links pointing to an id that is inside
                    // this fragment.
                    if (href.length === 1) {
                        // Special case for top-of-page links
                        this.href = url;
                    } else if (!$source.find(href).length) {
                        this.href = url + href;
                    }
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

        _rebaseHTML_via_HTMLParser: function inject_rebaseHTML_via_HTMLParser(
            base,
            html
        ) {
            var output = [],
                i,
                link_attribute,
                value;

            htmlparser.HTMLParser(html, {
                start: function(tag, attrs, unary) {
                    output.push("<" + tag);
                    link_attribute = inject._link_attributes[tag.toUpperCase()];
                    for (i = 0; i < attrs.length; i++) {
                        if (attrs[i].name.toLowerCase() === link_attribute) {
                            value = attrs[i].value;
                            // Do not rewrite Zope views or in-document links.
                            // In-document links will be processed later after
                            // extracting the right fragment.
                            if (
                                value.slice(0, 2) !== "@@" &&
                                value[0] !== "#"
                            ) {
                                value = utils.rebaseURL(base, value);
                                value = value.replace(/(^|[^\\])"/g, '$1\\"');
                            }
                        } else value = attrs[i].escaped;
                        output.push(" " + attrs[i].name + '="' + value + '"');
                    }
                    output.push(unary ? "/>" : ">");
                },

                end: function(tag) {
                    output.push("</" + tag + ">");
                },

                chars: function(text) {
                    output.push(text);
                },

                comment: function(text) {
                    output.push("<!--" + text + "-->");
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

        _rebaseHTML: function inject_rebaseHTML(base, html) {
            if (html === '') {
                // Special case, source is none
                return '';
            }
            var $page = $(html.replace(
                /(\s)(src\s*)=/gi,
                "$1src=\"\" data-pat-inject-rebase-$2="
            ).trim()).wrapAll("<div>").parent();

            $page.find(Object.keys(inject._rebaseAttrs).join(",")).each(function() {
                var $this = $(this),
                    attrName = inject._rebaseAttrs[this.tagName],
                    value = $this.attr(attrName);

                if (value && value.slice(0, 2) !== "@@" && value[0] !== "#" &&
                    value.slice(0, 7) !== "mailto:" && value.slice(0, 11) !== "javascript:") {
                    value = utils.rebaseURL(base, value);
                    $this.attr(attrName, value);
                }
            });

            // XXX: IE8 changes the order of attributes in html. The following
            // lines move data-pat-inject-rebase-src to src.
            $page.find("[data-pat-inject-rebase-src]").each(function() {
                var $el = $(this);
                $el.attr(
                    "src",
                    $el.attr("data-pat-inject-rebase-src")
                ).removeAttr("data-pat-inject-rebase-src");
            });

            return $page
                .html()
                .replace(/src="" data-pat-inject-rebase-/g, "")
                .trim();
        },

        _parseRawHtml: function inject_parseRawHtml(html, url) {
            url = url || "";

            // remove script tags and head and replace body by a div
            var title = html.match(/\<title\>(.*)\<\/title\>/);
            var clean_html = html
                .replace(
                    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                    ""
                )
                .replace(/<head\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/head>/gi, "")
                .replace(/<body([^>]*?)>/gi, '<div id="__original_body">')
                .replace(/<\/body([^>]*?)>/gi, "</div>");
            if (title && title.length == 2) {
                clean_html = title[0] + clean_html;
            }
            try {
                clean_html = inject._rebaseHTML(url, clean_html);
            } catch (e) {
                log.error("Error rebasing urls", e);
            }
            var $html = $("<div/>").html(clean_html);
            if ($html.children().length === 0) {
                log.warn(
                    "Parsing html resulted in empty jquery object:",
                    clean_html
                );
            }
            return $html;
        },

        // XXX: hack
        _initAutoloadVisible: function inject_initAutoloadVisible($el, cfgs) {
            if ($el.data("pat-inject-autoloaded")) {
                // ignore executed autoloads
                return false;
            }
            var $scrollable = $el.parents(":scrollable"),
                checkVisibility;

            // function to trigger the autoload and mark as triggered
            function trigger(event) {
                if ($el.data("pat-inject-autoloaded")) {
                    return false;
                }
                $el.data("pat-inject-autoloaded", true);
                inject.onTrigger.apply($el[0], []);
                event && event.preventDefault();
                return true;
            }
            $el.click(trigger);

            // Use case 1: a (heigh-constrained) scrollable parent
            if ($scrollable.length) {
                // if scrollable parent and visible -> trigger it
                // we only look at the closest scrollable parent, no nesting
                checkVisibility = utils.debounce(
                    function inject_checkVisibility_scrollable() {
                        if (
                            $el.data("patterns.autoload") ||
                            !$.contains(document, $el[0])
                        ) {
                            return false;
                        }
                        if (!$el.is(":visible")) {
                            return false;
                        }
                        // check if the target element still exists. Otherwise halt and catch fire
                        var target = (
                            $el.data("pat-inject")[0].target || cfgs[0].selector
                        ).replace(/::element/, "");
                        if (
                            target &&
                            target !== "self" &&
                            $(target).length === 0
                        ) {
                            return false;
                        }
                        var reltop =
                                $el.safeOffset().top -
                                $scrollable.safeOffset().top -
                                1000,
                            doTrigger = reltop <= $scrollable.innerHeight();
                        if (doTrigger) {
                            // checkVisibility was possibly installed as a scroll
                            // handler and has now served its purpose -> remove
                            $($scrollable[0]).off("scroll", checkVisibility);
                            $(window).off(
                                "resize.pat-autoload",
                                checkVisibility
                            );
                            return trigger();
                        }
                        return false;
                    },
                    100
                );
                if (checkVisibility()) {
                    return true;
                }
                // wait to become visible - again only immediate scrollable parent
                $($scrollable[0]).on("scroll", checkVisibility);
                $(window).on("resize.pat-autoload", checkVisibility);
            } else {
                // Use case 2: scrolling the entire page
                checkVisibility = utils.debounce(
                    function inject_checkVisibility_not_scrollable() {
                        if ($el.parents(":scrollable").length) {
                            // Because of a resize the element has now a scrollable parent
                            // and we should reset the correct event
                            $(window).off(".pat-autoload", checkVisibility);
                            return inject._initAutoloadVisible($el);
                        }
                        if ($el.data("patterns.autoload")) {
                            return false;
                        }
                        if (!$el.is(":visible")) {
                            return false;
                        }
                        if (!utils.elementInViewport($el[0])) {
                            return false;
                        }
                        // check if the target element still exists. Otherwise halt and catch fire
                        var target = (
                            $el.data("pat-inject")[0].target || cfgs[0].selector
                        ).replace(/::element/, "");
                        if (
                            target &&
                            target !== "self" &&
                            $(target).length === 0
                        ) {
                            return false;
                        }
                        $(window).off(".pat-autoload", checkVisibility);
                        return trigger();
                    },
                    100
                );
                if (checkVisibility()) {
                    return true;
                }
                // https://github.com/w3c/IntersectionObserver/tree/master/polyfill
                if (IntersectionObserver) {
                    var observer = new IntersectionObserver(checkVisibility);
                    $el.each(function(idx, el) {
                        observer.observe(el);
                    });
                } else {
                    $(window).on(
                        "resize.pat-autoload scroll.pat-autoload",
                        checkVisibility
                    );
                }
            }
            return false;
        },

        _initIdleTrigger: function inject_initIdleTrigger($el, delay) {
            // XXX TODO: handle item removed from DOM
            var timeout = parseInt(delay, 10);
            var timer;

            function onTimeout() {
                inject.onTrigger.apply($el[0], []);
                unsub();
                clearTimeout(timer);
            }

            var onInteraction = utils.debounce(function onInteraction() {
                if (!document.body.contains($el[0])) {
                    unsub();
                    return;
                }
                clearTimeout(timer);
                timer = setTimeout(onTimeout, timeout);
            }, timeout);

            function unsub() {
                ["scroll", "resize"].forEach(function(e) {
                    window.removeEventListener(e, onInteraction);
                });
                [
                    "click",
                    "keypress",
                    "keyup",
                    "mousemove",
                    "touchstart",
                    "touchend"
                ].forEach(function(e) {
                    document.removeEventListener(e, onInteraction);
                });
            }

            onInteraction();

            ["scroll", "resize"].forEach(function(e) {
                window.addEventListener(e, onInteraction);
            });
            [
                "click",
                "keypress",
                "keyup",
                "mousemove",
                "touchstart",
                "touchend"
            ].forEach(function(e) {
                document.addEventListener(e, onInteraction);
            });
        },

        // XXX: simple so far to see what the team thinks of the idea
        registerTypeHandler: function inject_registerTypeHandler(
            type,
            handler
        ) {
            inject.handlers[type] = handler;
        },

        callTypeHandler: function inject_callTypeHandler(
            type,
            fn,
            context,
            params
        ) {
            type = type || "html";
            if (
                inject.handlers[type] &&
                $.isFunction(inject.handlers[type][fn])
            ) {
                return inject.handlers[type][fn].apply(context, params);
            } else {
                return null;
            }
        },

        handlers: {
            html: {
                sources: function(cfgs, data) {
                    var sources = cfgs.map(function(cfg) {
                        return cfg.source;
                    });
                    sources.push("title");
                    return inject._sourcesFromHtml(data, cfgs[0].url, sources);
                }
            }
        }
    };

    $(document).on("patterns-injected.inject", function onInjected(
        ev,
        cfg,
        trigger,
        injected
    ) {
        /* Listen for the patterns-injected event.
         *
         * Remove the "loading-class" classes from all injection targets and
         * then scan the injected content for new patterns.
         */
        cfg.$target.removeClass(cfg.loadingClass);
        // Remove the executing class, add the executed class to the element with pat.inject on it.
        $(trigger)
            .removeClass(cfg.executingClass)
            .addClass(cfg.executedClass);
        if (injected.nodeType !== TEXT_NODE && injected !== COMMENT_NODE) {
            registry.scan(injected, null, {
                type: "injection",
                element: trigger
            });
            $(injected).trigger("patterns-injected-scanned");
        }
    });

    $(window).on("popstate", function(event) {
        // popstate also triggers on traditional anchors
        if (!event.originalEvent.state && "replaceState" in history) {
            try {
                history.replaceState("anchor", "", document.location.href);
            } catch (e) {
                log.debug(e);
            }
            return;
        }
        // Not only change the URL, also reload the page.
        window.location.reload();
    });

    // this entry ensures that the initally loaded page can be reached with
    // the back button
    if ("replaceState" in history) {
        try {
            history.replaceState("pageload", "", document.location.href);
        } catch (e) {
            log.debug(e);
        }
    }
    registry.register(inject);
    return inject;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

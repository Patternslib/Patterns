import "../../core/jquery-ext"; // for :scrollable for autoLoading-visible
import "regenerator-runtime/runtime"; // needed for ``await`` support
import $ from "jquery";
import _ from "underscore";
import ajax from "../ajax/ajax";
import dom from "../../core/dom";
import logging from "../../core/logging";
import Parser from "../../core/parser";
import registry from "../../core/registry";
import utils from "../../core/utils";

const log = logging.getLogger("pat.inject");
const TEXT_NODE = 3;
const COMMENT_NODE = 8;

export const parser = new Parser("inject");
parser.addArgument("default-selector");
parser.addArgument("target");
parser.addArgument("data-type", "html");
parser.addArgument("next-href");
parser.addArgument("source");
parser.addArgument("trigger", "default", [
    "default",
    "autoload",
    "autoload-visible",
    "idle",
]);
parser.addArgument("delay"); // only used in autoload
parser.addArgument("confirm", "class", ["never", "always", "form-data", "class"]);
parser.addArgument("confirm-message", "Are you sure you want to leave this page?");
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

const inject = {
    name: "inject",
    trigger:
        ".raptor-ui .ui-button.pat-inject, a.pat-inject, form.pat-inject, .pat-subform.pat-inject",
    parser: parser,

    init($el, opts) {
        const cfgs = this.extractConfig($el, opts);
        if (cfgs.some((e) => e.history === "record") && !("pushState" in history)) {
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
                    href: (window.location.href.split("#")[0] || "") + cfgs[0].nextHref,
                });
            }
        }
        if (cfgs[0].pushMarker) {
            $("body").on("push", (event, data) => {
                log.debug("received push message: " + data);
                if (data == cfgs[0].pushMarker) {
                    log.debug("re-injecting " + data);
                    this.onTrigger({ currentTarget: $el[0] });
                }
            });
        }
        if (cfgs[0].idleTrigger) {
            this._initIdleTrigger($el, cfgs[0].idleTrigger);
        } else {
            switch (cfgs[0].trigger) {
                case "default":
                    cfgs.forEach((cfg) => {
                        if (cfg.delay) {
                            cfg.processDelay = cfg.delay;
                        }
                    });
                    // setup event handlers
                    if ($el.is("form")) {
                        $el.on("submit.pat-inject", this.onTrigger.bind(this))
                            .on("click.pat-inject", "[type=submit]", ajax.onClickSubmit)
                            .on(
                                "click.pat-inject",
                                "[type=submit][formaction], [type=image][formaction]",
                                this.onFormActionSubmit.bind(this)
                            );
                    } else if ($el.is(".pat-subform")) {
                        log.debug("Initializing subform with injection");
                    } else {
                        $el.on("click.pat-inject", this.onTrigger.bind(this));
                    }
                    break;
                case "autoload":
                    if (!cfgs[0].delay) {
                        this.onTrigger({ currentTarget: $el[0] });
                    } else {
                        // generate UID
                        const uid = Math.random().toString(36);
                        $el.attr("data-pat-inject-uid", uid);

                        // function to trigger the autoload and mark as triggered
                        const delayed_trigger = (uid_) => {
                            // Check if the element has been removed from the dom
                            const still_there = $(
                                "[data-pat-inject-uid='" + uid_ + "']"
                            );
                            if (still_there.length == 0) return false;

                            $el.data("pat-inject-autoloaded", true);
                            this.onTrigger({ currentTarget: $el[0] });
                            return true;
                        };
                        window.setTimeout(
                            delayed_trigger.bind(null, uid),
                            cfgs[0].delay
                        );
                    }
                    break;
                case "autoload-visible":
                    this._initAutoloadVisible($el, cfgs);
                    break;
                case "idle":
                    this._initIdleTrigger($el, cfgs[0].delay);
                    break;
            }
        }

        log.debug("initialised:", $el);
        return $el;
    },

    destroy($el) {
        $el.off(".pat-inject");
        $el.data("pat-inject", null);
        return $el;
    },

    onTrigger(e) {
        /* Injection has been triggered, either via form submission or a
         * link has been clicked.
         */
        const $el = $(e.currentTarget);
        const cfgs = $el.data("pat-inject");
        if ($el.is("form")) {
            $(cfgs).each((i, v) => {
                v.params = $.param($el.serializeArray());
            });
        }
        e.preventDefault && e.preventDefault();
        $el.trigger("patterns-inject-triggered");
        this.execute(cfgs, $el);
    },

    onFormActionSubmit(e) {
        ajax.onClickSubmit(e); // make sure the submitting button is sent with the form

        const $button = $(e.target);
        const formaction = $button.attr("formaction");
        const $form = $button.parents(".pat-inject").first();
        const opts = {
            url: formaction,
        };
        const $cfg_node = $button.closest("[data-pat-inject]");
        const cfgs = this.extractConfig($cfg_node, opts);

        $(cfgs).each((i, v) => {
            v.params = $.param($form.serializeArray());
        });

        e.preventDefault();
        $form.trigger("patterns-inject-triggered");
        this.execute(cfgs, $form);
    },

    submitSubform($sub) {
        /* This method is called from pat-subform
         */
        const $el = $sub.parents("form");
        const cfgs = $sub.data("pat-inject");

        // store the params of the subform in the config, to be used by history
        $(cfgs).each((i, v) => {
            v.params = $.param($sub.serializeArray());
        });

        try {
            $el.trigger("patterns-inject-triggered");
        } catch (e) {
            log.error("patterns-inject-triggered", e);
        }
        this.execute(cfgs, $el);
    },

    extractConfig($el, opts) {
        opts = $.extend({}, opts);

        const cfgs = parser.parse($el, opts, true);
        cfgs.forEach((cfg) => {
            cfg.$context = $el;
            // opts and cfg have priority, fallback to href/action
            cfg.url =
                opts.url ||
                cfg.url ||
                $el.attr("href") ||
                $el.attr("action") ||
                $el.parents("form").attr("action") ||
                "";

            // separate selector from url
            const urlparts = cfg.url.split("#");
            cfg.url = urlparts[0];

            if (urlparts.length > 2) {
                log.warn("Ignoring additional source ids:", urlparts.slice(2));
            }

            if (!cfg.defaultSelector) {
                // if no selector, check for selector as part of original url
                cfg.defaultSelector = (urlparts[1] && "#" + urlparts[1]) || "body";
            }
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

    elementIsDirty(m) {
        /* Check whether the passed in form element contains a value.
         */
        const data = $.map(m.find(":input:not(select)"), (i) => {
            const val = $(i).val();
            return Boolean(val) && val !== $(i).attr("placeholder");
        });
        return $.inArray(true, data) !== -1;
    },

    askForConfirmation(cfgs) {
        /* If configured to do so, show a confirmation dialog to the user.
         * This is done before attempting to perform injection.
         */
        let should_confirm = false;
        let message;

        _.each(cfgs, (cfg) => {
            let _confirm = false;
            if (cfg.confirm == "always") {
                _confirm = true;
            } else if (cfg.confirm === "form-data") {
                if (cfg.target != "none") _confirm = this.elementIsDirty(cfg.$target);
            } else if (cfg.confirm === "class") {
                if (cfg.target != "none") _confirm = cfg.$target.hasClass("is-dirty");
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

    ensureTarget(cfg) {
        /* Make sure that a target element exists and that it's assigned to
         * cfg.$target.
         */
        // make sure target exist
        if (cfg.target === "none") {
            // special case, we don't want to inject anything
            return true;
        }
        cfg.$target =
            cfg.$target || (cfg.target === "self" ? cfg.$context : $(cfg.target));
        if (cfg.$target.length === 0) {
            if (!cfg.target) {
                log.error("Need target selector", cfg);
                return false;
            }
            cfg.$target = this.createTarget(cfg.target);
            cfg.$injected = cfg.$target;
        }
        return true;
    },

    verifySingleConfig(url, cfg) {
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
        cfg.source = cfg.source || cfg.defaultSelector;
        cfg.target = cfg.target || cfg.defaultSelector;

        if (!this.extractModifiers(cfg)) {
            return false;
        }
        if (!this.ensureTarget(cfg)) {
            return false;
        }
        this.listenForFormReset(cfg);
        return true;
    },

    verifyConfig(cfgs) {
        /* Verify and post-process all the configurations.
         * Each "config" is an arguments list separated by the &&
         * combination operator.
         *
         * In case of multi-injection, only one URL is allowed, which
         * should be specified in the first config (i.e. arguments list).
         *
         * Verification for each cfg in the array needs to succeed.
         */
        return cfgs.every(_.partial(this.verifySingleConfig.bind(this), cfgs[0].url));
    },

    listenForFormReset(cfg) {
        /* if pat-inject is used to populate target in some form and when
         * Cancel button is pressed (this triggers reset event on the
         * form) you would expect to populate with initial placeholder
         */
        if (cfg.target === "none")
            // Special case, we don't want to display any return value.
            return;
        const $form = cfg.$target.parents("form");
        if ($form.length !== 0 && cfg.$target.data("initial-value") === undefined) {
            cfg.$target.data("initial-value", cfg.$target.html());
            $form.on("reset", () => {
                cfg.$target.html(cfg.$target.data("initial-value"));
            });
        }
    },

    extractModifiers(cfg) {
        /* The user can add modifiers to the source and target arguments.
         * Modifiers such as ::element, ::before and ::after.
         * We identifiy and extract these modifiers here.
         */
        const source_re = /^(.*?)(::element)?$/;
        const target_re = /^(.*?)(::element)?(::after|::before)?$/;
        const source_match = source_re.exec(cfg.source);
        const target_match = target_re.exec(cfg.target);

        cfg.source = source_match[1];
        cfg.sourceMod = source_match[2] ? "element" : "content";
        cfg.target = target_match[1];
        const targetMod = target_match[2] ? "element" : "content";
        const targetPosition = (target_match[3] || "::").slice(2); // position relative to target

        if (cfg.loadingClass) {
            cfg.loadingClass += " " + cfg.loadingClass + "-" + targetMod;
            if (targetPosition && cfg.loadingClass) {
                cfg.loadingClass += " " + cfg.loadingClass + "-" + targetPosition;
            }
        }
        cfg.action = targetMod + targetPosition;
        // Once we start detecting illegal combinations, we'll
        // return false in case of error
        return true;
    },

    createTarget(selector) {
        /* create a target that matches the selector
         *
         * XXX: so far we only support #target and create a div with
         * that id appended to the body.
         */
        if (selector.slice(0, 1) !== "#") {
            log.error("only id supported for non-existing target");
            return null;
        }
        const $target = $("<div />").attr({ id: selector.slice(1) });
        $("body").append($target);
        return $target;
    },

    stopBubblingFromRemovedElement($el, cfgs, ev) {
        /* IE8 fix. Stop event from propagating IF $el will be removed
         * from the DOM. With pat-inject, often $el is the target that
         * will itself be replaced with injected content.
         *
         * IE8 cannot handle events bubbling up from an element removed
         * from the DOM.
         *
         * See: http://stackoverflow.com/questions/7114368/why-is-jquery-remove-throwing-attr-exception-in-ie8
         */
        for (const cfg of cfgs) {
            const sel = cfg.target;
            if ($el.parents(sel).addBack(sel) && !ev.isPropagationStopped()) {
                ev.stopPropagation();
                return;
            }
        }
    },

    _performInjection(target, $el, $source, cfg, trigger, title) {
        /* Called after the XHR has succeeded and we have a new $source
         * element to inject.
         */
        if (cfg.sourceMod === "content") {
            $source = $source.contents();
        }
        let $src;
        // $source.clone() does not work with shived elements in IE8
        if (document.all && document.querySelector && !document.addEventListener) {
            $src = $source.map((idx, el) => $(el.outerHTML)[0]);
        } else {
            $src = $source.safeClone();
        }

        $src.findInclusive("img").on("load", (e) => {
            $(e.currentTarget).trigger("pat-inject-content-loaded");
        });

        const $injected = cfg.$injected || $src;
        // Now the injection actually happens.
        if (this._inject(trigger, $src, $(target), cfg)) {
            this._afterInjection($el, $injected, cfg);
        }
        // History support. if subform is submitted, append form params
        const glue = cfg.url.indexOf("?") > -1 ? "&" : "?";
        if (cfg.history === "record" && "pushState" in history) {
            if (cfg.params) {
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
                this._inject(trigger, title, $("title"), {
                    action: "element",
                });
        }
    },

    _afterInjection($el, $injected, cfg) {
        /* Set a class on the injected elements and fire the
         * patterns-injected event.
         */
        $injected
            .filter((idx, el_) => {
                // setting data on textnode fails in IE8
                return el_.nodeType !== TEXT_NODE;
            })
            .data("pat-injected", { origin: cfg.url });

        if ($injected.length === 1 && $injected[0].nodeType == TEXT_NODE) {
            // Only one element injected, and it was a text node.
            // So we trigger "patterns-injected" on the parent.
            // The event handler should check whether the
            // injected element and the triggered element are
            // the same.
            $injected.parent().trigger("patterns-injected", [cfg, $el[0], $injected[0]]);
        } else {
            $injected.each((idx, el_) => {
                // patterns-injected event will be triggered for each injected (non-text) element.
                if (el_.nodeType !== TEXT_NODE) {
                    $(el_)
                        .addClass(cfg["class"])
                        .trigger("patterns-injected", [cfg, $el[0], el_]);
                }
            });
        }

        if (cfg.scroll && cfg.scroll !== "none") {
            let scroll_container = cfg.$target.parents().addBack().filter(":scrollable");
            scroll_container = scroll_container.length ? scroll_container[0] : window;

            // default for scroll===top
            let top = 0;
            let left = 0;

            if (cfg.scroll !== "top") {
                const scroll_target =
                    cfg.scroll === "target"
                        ? cfg.$target[0]
                        : $injected.filter(cfg.scroll)[0];

                // Get the reference element to which against we calculate
                // the relative position of the target.
                // In case of a scroll container of window, we do not have
                // getBoundingClientRect method, so get the body instead.
                const scroll_container_ref =
                    scroll_container === window ? document.body : scroll_container;

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
                    scroll_target.getBoundingClientRect().left +
                        scroll_container_ref.scrollLeft -
                        scroll_container_ref.getBoundingClientRect().left -
                        utils.getCSSValue(
                            scroll_container_ref,
                            "border-left-width",
                            true
                        )
                );
                top = Math.abs(
                    scroll_target.getBoundingClientRect().top +
                        scroll_container_ref.scrollTop -
                        scroll_container_ref.getBoundingClientRect().top -
                        utils.getCSSValue(scroll_container_ref, "border-top-width", true)
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

    async _onInjectSuccess($el, cfgs, ev) {
        let data = ev && ev.jqxhr && ev.jqxhr.responseText;
        if (!data) {
            log.warn("No response content, aborting", ev);
            return;
        }
        if (cfgs[0].source === "none") {
            // Special case, we want to call something, but we don't want to inject anything
            data = "";
        }
        $.each(cfgs[0].hooks || [], (idx, hook) =>
            $el.trigger("pat-inject-hook-" + hook)
        );
        this.stopBubblingFromRemovedElement($el, cfgs, ev);
        const sources$ = await this.callTypeHandler(cfgs[0].dataType, "sources", $el, [
            cfgs,
            data,
            ev,
        ]);
        /* pick the title source for dedicated handling later
          Title - if present - is always appended at the end. */
        let title;
        if (
            sources$ &&
            sources$[sources$.length - 1] &&
            sources$[sources$.length - 1][0] &&
            sources$[sources$.length - 1][0].nodeName == "TITLE"
        ) {
            title = sources$[sources$.length - 1];
        }
        cfgs.forEach((cfg, idx1) => {
            const perform_inject = () => {
                if (cfg.target != "none")
                    cfg.$target.each((idx2, target) => {
                        this._performInjection(
                            target,
                            $el,
                            sources$[idx1],
                            cfg,
                            ev.target,
                            title
                        );
                    });
            };
            if (cfg.processDelay) {
                setTimeout(() => perform_inject(), cfg.processDelay);
            } else {
                perform_inject();
            }
        });
        if (cfgs[0].nextHref && $el.is("a")) {
            // In case next-href is specified the anchor's href will
            // be set to it after the injection is triggered.
            $el.attr({ href: cfgs[0].nextHref.replace(/&amp;/g, "&") });
            this.destroy($el);
        }
        $el.off("pat-ajax-success.pat-inject");
        $el.off("pat-ajax-error.pat-inject");
    },

    async _onInjectError($el, cfgs, event) {
        let explanation = "";
        let fallback;
        const status = event.jqxhr.status;
        const timestamp = new Date();
        if (status % 100 == 4) {
            explanation =
                "Sorry! We couldn't find the page to load. Please make a screenshot and send it to support. Thank you!";
        } else if (status % 100 == 5) {
            explanation =
                "I am very sorry! There was an error at the server. Please make a screenshot and contact support. Thank you!";
        } else if (status == 0) {
            explanation =
                "It seems, the server is down. Please make a screenshot and contact support. Thank you!";
        }

        const url_params = new URLSearchParams(window.location.search);

        const fallback_url = document
            .querySelector(`meta[name=pat-inject-status-${status}]`)
            ?.getAttribute("content", false);
        if (fallback_url && url_params.get("pat-inject-errorhandler.off") === null) {
            try {
                const fallback_response = await fetch(fallback_url, {
                    method: "GET",
                });
                fallback = document.createElement("html");
                fallback.innerHTML = await fallback_response.text();
                fallback = fallback.querySelector("body");
            } catch {
                // fallback to standard error message and ignore.
            }
        }

        // clean up
        cfgs.forEach((cfg) => {
            if ("$injected" in cfg) cfg.$injected.remove();
        });
        $el.off("pat-ajax-success.pat-inject");
        $el.off("pat-ajax-error.pat-inject");

        if (fallback) {
            document.body.innerHTML = fallback.innerHTML;
        } else {
            const msg_attr =
                fallback ||
                `${explanation} Status is ${status} ${event.jqxhr.statusText}, time was ${timestamp}. You can click to close this.`;
            $("body").attr("data-error-message", msg_attr);
            $("body").on("click", () => {
                $("body").removeAttr("data-error-message");
                window.location.href = window.location.href; // reload
            });
        }
    },

    execute(cfgs, $el) {
        /* Actually execute the injection.
         *
         * Either by making an ajax request or by spoofing an ajax
         * request when the content is readily available in the current page.
         */
        // get a kinda deep copy, we scribble on it
        cfgs = cfgs.map((cfg) => $.extend({}, cfg));
        if (!this.verifyConfig(cfgs)) {
            return;
        }
        if (!this.askForConfirmation(cfgs)) {
            return;
        }
        if ($el.data("pat-inject-triggered")) {
            // Prevent double triggers;
            return;
        }
        $el.data("pat-inject-triggered", true);
        // possibility for spinners on targets
        _.chain(cfgs)
            .filter(_.property("loadingClass"))
            .each((cfg) => {
                if (cfg.target != "none") cfg.$target.addClass(cfg.loadingClass);
            });
        // Put the execute class on the elem that has pat inject on it
        _.chain(cfgs)
            .filter(_.property("loadingClass"))
            .each((cfg) => $el.addClass(cfg.executingClass));

        $el.on(
            "pat-ajax-success.pat-inject",
            this._onInjectSuccess.bind(this, $el, cfgs)
        );
        $el.on("pat-ajax-error.pat-inject", this._onInjectError.bind(this, $el, cfgs));
        $el.on("pat-ajax-success.pat-inject pat-ajax-error.pat-inject", () =>
            $el.removeData("pat-inject-triggered")
        );

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
                    responseText: $("body").html(),
                },
            });
        }
    },

    _inject(trigger, $source, $target, cfg) {
        // action to jquery method mapping, except for "content"
        // and "element"
        const method = {
            contentbefore: "prepend",
            contentafter: "append",
            elementbefore: "before",
            elementafter: "after",
        }[cfg.action];

        if (cfg.source === "none") {
            $target.replaceWith("");
            return true;
        }
        if ($source.length === 0) {
            log.warn("Aborting injection, source not found:", $source);
            $(trigger).trigger("pat-inject-missingSource", {
                url: cfg.url,
                selector: cfg.source,
            });
            return false;
        }
        if (cfg.target === "none")
            // Special case. Don't do anything, we don't want any result
            return true;
        if ($target.length === 0) {
            log.warn("Aborting injection, target not found:", $target);
            $(trigger).trigger("pat-inject-missingTarget", {
                selector: cfg.target,
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

    _sourcesFromHtml(html, url, sources) {
        const $html = this._parseRawHtml(html, url);
        return sources.map((source) => {
            if (source === "body") {
                source = "#__original_body";
            }
            if (source === "none") {
                return $("<!-- -->");
            }
            const $source = $html.find(source);

            if ($source.length === 0) {
                if (source != "title") {
                    log.warn("No source elements for selector:", source, $html);
                }
            }

            $source.find('a[href^="#"]').each((idx, el_) => {
                const href = el_.getAttribute("href");
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
                    el_.href = url;
                } else if (!$source.find(href).length) {
                    el_.href = url + href;
                }
            });
            return $source;
        });
    },

    _rebaseAttrs: {
        A: "href",
        FORM: "action",
        IMG: "data-pat-inject-rebase-src",
        OBJECT: "data",
        SOURCE: "data-pat-inject-rebase-src",
        VIDEO: "data-pat-inject-rebase-src",
    },

    _rebaseOptions: {
        "calendar": ["url", "event-sources"],
        "collapsible": ["load-content"],
        "date-picker": ["i18n"],
        "datetime-picker": ["i18n"],
        "inject": ["url"],
    },

    _rebaseHTML(base, html) {
        if (html === "") {
            // Special case, source is none
            return "";
        }
        const $page = $(
            html.replace(/(\s)(src\s*)=/gi, '$1src="" data-pat-inject-rebase-$2=').trim()
        )
            .wrapAll("<div>")
            .parent();

        $page.find(Object.keys(this._rebaseAttrs).join(",")).each((idx, el_) => {
            const $el_ = $(el_);
            const attrName = this._rebaseAttrs[el_.tagName];
            let value = $el_.attr(attrName);

            if (
                value &&
                value.slice(0, 2) !== "@@" &&
                value[0] !== "#" &&
                value.slice(0, 7) !== "mailto:" &&
                value.slice(0, 4) !== "tel:" &&
                value.slice(0, 4) !== "fax:" &&
                value.slice(0, 7) !== "callto:" &&
                value.slice(0, 10) !== "ts3server:" &&
                value.slice(0, 6) !== "teams:" &&
                value.slice(0, 11) !== "javascript:"
            ) {
                value = utils.rebaseURL(base, value);
                $el_.attr(attrName, value);
            }
        });

        for (const [pattern_name, opts] of Object.entries(this._rebaseOptions)) {
            for (const el_ of dom.querySelectorAllAndMe(
                $page[0],
                `[data-pat-${pattern_name}]`
            )) {
                const val = el_.getAttribute(`data-pat-${pattern_name}`, false);
                if (val) {
                    const pattern = registry.patterns[pattern_name];
                    const pattern_parser = pattern?.parser;
                    if (!pattern_parser) {
                        continue;
                    }
                    let options = pattern_parser._parse(val);
                    let changed = false;
                    for (const opt of opts) {
                        const val = options[opt];
                        if (!val) {
                            continue;
                        }
                        changed = true;
                        if (Array.isArray(val)) {
                            options[opt] = val.map((it) => utils.rebaseURL(base, it));
                        } else {
                            options[opt] = utils.rebaseURL(base, val);
                        }
                    }
                    if (changed) {
                        el_.setAttribute(
                            `data-pat-${pattern_name}`,
                            JSON.stringify(options)
                        );
                    }
                }
            }
        }

        // XXX: IE8 changes the order of attributes in html. The following
        // lines move data-pat-inject-rebase-src to src.
        $page.find("[data-pat-inject-rebase-src]").each((id, el_) => {
            const $el = $(el_);
            $el.attr("src", $el.attr("data-pat-inject-rebase-src")).removeAttr(
                "data-pat-inject-rebase-src"
            );
        });

        return $page
            .html()
            .replace(/src="" data-pat-inject-rebase-/g, "")
            .trim();
    },

    _parseRawHtml(html, url) {
        url = url || "";

        // remove script tags and head and replace body by a div
        const title = html.match(/\<title\>(.*)\<\/title\>/);
        let clean_html = html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
            .replace(/<head\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/head>/gi, "")
            .replace(/<body([^>]*?)>/gi, '<div id="__original_body">')
            .replace(/<\/body([^>]*?)>/gi, "</div>");
        if (title && title.length == 2) {
            clean_html = title[0] + clean_html;
        }
        try {
            clean_html = this._rebaseHTML(url, clean_html);
        } catch (e) {
            log.error("Error rebasing urls", e);
        }
        const $html = $("<div/>").html(clean_html);
        if ($html.children().length === 0) {
            log.warn("Parsing html resulted in empty jquery object:", clean_html);
        }
        return $html;
    },

    // XXX: hack
    _initAutoloadVisible($el, cfgs) {
        if ($el.data("pat-inject-autoloaded")) {
            // ignore executed autoloads
            return false;
        }
        const $scrollable = $el.parents(":scrollable");

        // function to trigger the autoload and mark as triggered
        const trigger = (event) => {
            if ($el.data("pat-inject-autoloaded")) {
                return false;
            }
            $el.data("pat-inject-autoloaded", true);
            this.onTrigger({ currentTarget: $el[0] });
            event && event.preventDefault();
            return true;
        };
        $el.click(trigger);

        // Use case 1: a (heigh-constrained) scrollable parent
        if ($scrollable.length) {
            // if scrollable parent and visible -> trigger it
            // we only look at the closest scrollable parent, no nesting
            // Check visibility for scrollable
            const checkVisibility = utils.debounce(() => {
                if ($el.data("patterns.autoload") || !$.contains(document, $el[0])) {
                    return false;
                }
                if (!$el.is(":visible")) {
                    return false;
                }
                // check if the target element still exists. Otherwise halt and catch fire
                const target = (
                    $el.data("pat-inject")[0].target || cfgs[0].defaultSelector
                ).replace(/::element/, "");
                if (target && target !== "self" && $(target).length === 0) {
                    return false;
                }
                const reltop =
                        $el.safeOffset().top - $scrollable.safeOffset().top - 1000,
                    doTrigger = reltop <= $scrollable.innerHeight();
                if (doTrigger) {
                    // checkVisibility was possibly installed as a scroll
                    // handler and has now served its purpose -> remove
                    $($scrollable[0]).off("scroll", checkVisibility);
                    $(window).off("resize.pat-autoload", checkVisibility);
                    return trigger();
                }
                return false;
            }, 100);
            if (checkVisibility()) {
                return true;
            }
            // wait to become visible - again only immediate scrollable parent
            $($scrollable[0]).on("scroll", checkVisibility);
            $(window).on("resize.pat-autoload", checkVisibility);
        } else {
            // Use case 2: scrolling the entire page
            // Check visibility for non-scrollable
            const checkVisibility = utils.debounce(() => {
                if ($el.parents(":scrollable").length) {
                    // Because of a resize the element has now a scrollable parent
                    // and we should reset the correct event
                    $(window).off(".pat-autoload", checkVisibility);
                    return this._initAutoloadVisible($el);
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
                const target = (
                    $el.data("pat-inject")[0].target || cfgs[0].defaultSelector
                ).replace(/::element/, "");
                if (target && target !== "self" && $(target).length === 0) {
                    return false;
                }
                $(window).off(".pat-autoload", checkVisibility);
                return trigger();
            }, 100);
            if (checkVisibility()) {
                return true;
            }
            // https://github.com/w3c/IntersectionObserver/tree/master/polyfill
            if (IntersectionObserver) {
                const observer = new IntersectionObserver(checkVisibility);
                $el.each((idx, el) => observer.observe(el));
            } else {
                $(window).on("resize.pat-autoload scroll.pat-autoload", checkVisibility);
            }
        }
        return false;
    },

    _initIdleTrigger($el, delay) {
        // XXX TODO: handle item removed from DOM
        const timeout = parseInt(delay, 10);
        let timer;

        const onTimeout = () => {
            this.onTrigger({ currentTarget: $el[0] });
            unsub();
            clearTimeout(timer);
        };

        const onInteraction = utils.debounce(() => {
            if (!document.body.contains($el[0])) {
                unsub();
                return;
            }
            clearTimeout(timer);
            timer = setTimeout(onTimeout, timeout);
        }, timeout);

        const unsub = () => {
            ["scroll", "resize"].forEach((e) =>
                window.removeEventListener(e, onInteraction)
            );
            [
                "click",
                "keypress",
                "keyup",
                "mousemove",
                "touchstart",
                "touchend",
            ].forEach((e) => document.removeEventListener(e, onInteraction));
        };

        onInteraction();

        ["scroll", "resize"].forEach((e) => window.addEventListener(e, onInteraction));
        [
            "click",
            "keypress",
            "keyup",
            "mousemove",
            "touchstart",
            "touchend",
        ].forEach((e) => document.addEventListener(e, onInteraction));
    },

    // XXX: simple so far to see what the team thinks of the idea
    registerTypeHandler(type, handler) {
        this.handlers[type] = handler;
    },

    async callTypeHandler(type, fn, context, params) {
        type = type || "html";
        if (this.handlers[type] && $.isFunction(this.handlers[type][fn])) {
            return await this.handlers[type][fn].bind(this)(...params);
        } else {
            return null;
        }
    },

    handlers: {
        html: {
            sources(cfgs, data) {
                const sources = cfgs.map((cfg) => cfg.source);
                sources.push("title");
                return this._sourcesFromHtml(data, cfgs[0].url, sources);
            },
        },
    },
};

$(document).on("patterns-injected.inject", (ev, cfg, trigger, injected) => {
    /* Listen for the patterns-injected event.
     *
     * Remove the "loading-class" classes from all injection targets and
     * then scan the injected content for new patterns.
     */
    if (cfg && cfg.skipPatInjectHandler) {
        // Allow skipping this handler but still have other handlers in other
        // patterns listen to ``patterns-injected``.
        return;
    }
    if (cfg) {
        cfg.$target.removeClass(cfg.loadingClass);
        // Remove the executing class, add the executed class to the element with pat.inject on it.
        $(trigger).removeClass(cfg.executingClass).addClass(cfg.executedClass);
    }
    if (injected.nodeType !== TEXT_NODE && injected !== COMMENT_NODE) {
        registry.scan(injected, null, { type: "injection", element: trigger });
        $(injected).trigger("patterns-injected-scanned");
    }
});

$(window).on("popstate", (event) => {
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
export default inject;

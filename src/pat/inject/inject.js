import "regenerator-runtime/runtime"; // needed for ``await`` support
import $ from "jquery";
import _ from "underscore";
import ajax from "../ajax/ajax";
import Base from "../../core/base";
import logging from "../../core/logging";
import Parser from "../../core/parser";
import registry from "../../core/registry";
import utils from "../../core/utils";
import "../../core/jquery-ext"; // for :scrollable for autoLoading-visible

const log = logging.getLogger("pat.inject");
const parser = new Parser("inject");
const TEXT_NODE = 3;
const COMMENT_NODE = 8;

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
parser.addArgument("confirm", "class", [
    "never",
    "always",
    "form-data",
    "class",
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

const inject = {
    name: "inject",
    trigger:
        ".raptor-ui .ui-button.pat-inject, a.pat-inject, form.pat-inject, .pat-subform.pat-inject",

    init($el, opts) {
        const cfgs = this.extractConfig($el, opts);
        if (
            !("pushState" in history) &&
            cfgs.some((e) => {
                return e.history === "record";
            })
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
                        cfgs[0].nextHref,
                });
            }
        }
        if (cfgs[0].pushMarker) {
            $("body").on("push", (event, data) => {
                console.log("received push message: " + data);
                if (data == cfgs[0].pushMarker) {
                    console.log("re-injecting " + data);
                    this.onTrigger({ target: $el[0] });
                }
            });
        }
        if (cfgs[0].idleTrigger) {
            // XXX TODO: handle item removed from DOM
            const timeout = parseInt(cfgs[0].idleTrigger, 10);
            let timer;

            const onTimeout = () => {
                this.onTrigger({ target: $el[0] });
                unsub();
                clearTimeout(timer);
            };

            const onInteraction = utils.debounce(() => {
                clearTimeout(timer);
                timer = setTimeout(onTimeout, cfgs[0].trigger);
            }, timeout);

            const unsub = () => {
                for (const e of ["scroll", "resize"]) {
                    window.removeEventListener(e, onInteraction);
                }
                for (const e of [
                    "click",
                    "keypress",
                    "keyup",
                    "mousemove",
                    "touchstart",
                    "touchend",
                ]) {
                    document.removeEventListener(e, onInteraction);
                }
            };

            onInteraction();

            for (const e of ["scroll", "resize"]) {
                window.addEventListener(e, onInteraction);
            }
            for (const e of [
                "click",
                "keypress",
                "keyup",
                "mousemove",
                "touchstart",
                "touchend",
            ]) {
                document.addEventListener(e, onInteraction);
            }
        } else {
            switch (cfgs[0].trigger) {
                case "default":
                    for (const cfg of cfgs) {
                        if (cfg.delay) {
                            cfg.processDelay = cfg.delay;
                        }
                    }
                    // setup event handlers
                    if ($el.is("form")) {
                        $el.on("submit.pat-inject", this.onTrigger.bind(this))
                            .on(
                                "click.pat-inject",
                                "[type=submit]",
                                ajax.onClickSubmit.bind(this)
                            )
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
                        this.onTrigger({ target: $el[0] });
                    } else {
                        // generate UID
                        const uid = Math.random().toString(36);
                        $el.attr("data-pat-inject-uid", uid);

                        // function to trigger the autoload and mark as triggered
                        const delayed_trigger = (uid) => {
                            // Check if the element has been removed from the dom
                            const still_there = $(
                                "[data-pat-inject-uid='" + uid + "']"
                            );
                            if (still_there.length == 0) return false;

                            $el.data("pat-inject-autoloaded", true);
                            this.onTrigger({ target: $el[0] });
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

    extractConfig($el, opts) {
        opts = $.extend({}, opts);

        const cfgs = parser.parse($el, opts, true);
        for (const cfg of cfgs) {
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
            if (urlparts.length > 2) {
                log.warn("Ignoring additional source ids:", urlparts.slice(2));
            }

            cfg.url = urlparts[0];

            // if no selector, check for selector as part of original url
            const defaultSelector =
                (urlparts[1] && "#" + urlparts[1]) || "body";

            cfg.defaultSelector = cfg.defaultSelector || defaultSelector;
            if (cfg.delay) {
                try {
                    cfg.delay = utils.parseTime(cfg.delay);
                } catch (e) {
                    log.warn("Invalid delay value: ", cfg.delay);
                    cfg.delay = null;
                }
            }
            cfg.processDelay = 0;
        }
        return cfgs;
    },

    destroy($el) {
        $el.off(".pat-inject");
        $el.data("pat-inject", null);
        return $el;
    },

    onTrigger(ev) {
        /* Injection has been triggered, either via form submission or a
         * link has been clicked.
         */
        const $el = $(ev.target);
        const cfgs = $el.data("pat-inject");
        if ($el.is("form")) {
            for (const cfg of cfgs) {
                cfg.params = $.param($el.serializeArray());
            }
        }
        ev.preventDefault && ev.preventDefault();
        $el.trigger("patterns-inject-triggered");
        this.execute(cfgs, $el);
    },

    onFormActionSubmit(ev) {
        ajax.onClickSubmit(ev); // make sure the submitting button is sent with the form

        const $button = $(ev.target);
        const formaction = $button.attr("formaction");
        const $form = $button.parents(".pat-inject").first();
        const opts = { url: formaction };
        const $cfg_node = $button.closest("[data-pat-inject]");
        const cfgs = this.extractConfig($cfg_node, opts);

        for (const cfg of cfgs) {
            cfg.params = $.param($form.serializeArray());
        }

        ev.preventDefault();
        $form.trigger("patterns-inject-triggered");
        this.execute(cfgs, $form);
    },

    submitSubform($sub) {
        /* This method is called from pat-subform
         */
        const $el = $sub.parents("form");
        const cfgs = $sub.data("pat-inject");

        // store the params of the subform in the config, to be used by history
        for (const cfg of cfgs) {
            cfg.params = $.param($sub.serializeArray());
        }

        try {
            $el.trigger("patterns-inject-triggered");
        } catch (e) {
            log.error("patterns-inject-triggered", e);
        }
        this.execute(cfgs, $el);
    },

    elementIsDirty(m) {
        /* Check whether the passed in form element contains a value.
         */
        const data = m.find(":input:not(select)").map((el) => {
            const val = el.value;
            return Boolean(val) && val !== el.getAttribute("placeholder");
        });
        return $.inArray(true, data) !== -1;
    },

    askForConfirmation(cfgs) {
        /* If configured to do so, show a confirmation dialog to the user.
         * This is done before attempting to perform injection.
         */
        let should_confirm = false;
        let message;

        for (const cfg of cfgs) {
            let _confirm = false;
            if (cfg.confirm == "always") {
                _confirm = true;
            } else if (cfg.confirm === "form-data") {
                if (cfg.target != "none")
                    _confirm = this.elementIsDirty(cfg.$target);
            } else if (cfg.confirm === "class") {
                if (cfg.target != "none")
                    _confirm = cfg.$target.hasClass("is-dirty");
            }
            if (_confirm) {
                should_confirm = true;
                message = cfg.confirmMessage;
            }
        }
        if (should_confirm) {
            if (!window.confirm(message)) {
                return false;
            }
        }
        return true;
    },

    ensureTarget(cfg, $el) {
        /* Make sure that a target element exists and that it's assigned to
         * cfg.$target.
         */
        // make sure target exist
        if (cfg.target === "none")
            // special case, we don't want to inject anything
            return true;
        cfg.$target =
            cfg.$target || (cfg.target === "self" ? $el : $(cfg.target));
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

    verifySingleConfig($el, url, cfg) {
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
        if (!this.ensureTarget(cfg, $el)) {
            return false;
        }
        this.listenForFormReset(cfg);
        return true;
    },

    verifyConfig(cfgs, $el) {
        /* Verify and post-process all the configurations.
         * Each "config" is an arguments list separated by the &&
         * combination operator.
         *
         * In case of multi-injection, only one URL is allowed, which
         * should be specified in the first config (i.e. arguments list).
         *
         * Verification for each cfg in the array needs to succeed.
         */

        const url = cfgs[0].url;
        return cfgs.every(
            (cfg) => this.verifySingleConfig($el, url, cfg) === true
        );
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
        if (
            $form.length !== 0 &&
            cfg.$target.data("initial-value") === undefined
        ) {
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
        let targetMod;
        let targetPosition;

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

    createTarget(selector) {
        /* create a target that matches the selector
         *
         * XXX: so far we only support #target and create a div with
         * that id appended to the body.
         */
        let $target;
        if (selector.slice(0, 1) !== "#") {
            log.error("only id supported for non-existing target");
            return null;
        }
        $target = $("<div />").attr({ id: selector.slice(1) });
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
        let sel; // jquery selector
        for (const cfg of cfgs) {
            sel = cfg.target;
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
        if (
            document.all &&
            document.querySelector &&
            !document.addEventListener
        ) {
            $src = $source.map((idx, el) => {
                return $(el.outerHTML)[0];
            });
        } else {
            $src = $source.safeClone();
        }
        const $target = $(target);
        const $injected = cfg.$injected || $src;

        $src.findInclusive("img").on("load", (ev) => {
            $(ev.target).trigger("pat-inject-content-loaded");
        });
        // Now the injection actually happens.
        if (this._inject(trigger, $src, $target, cfg)) {
            this._afterInjection($el, $injected, cfg);
        }
        // History support. if subform is submitted, append form params
        const glue = "?";
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
            .filter((idx, el) => {
                // setting data on textnode fails in IE8
                return el.nodeType !== TEXT_NODE;
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
            for (const inj of $injected) {
                // patterns-injected event will be triggered for each injected (non-text) element.
                if (inj.nodeType !== TEXT_NODE) {
                    $(inj)
                        .addClass(cfg["class"])
                        .trigger("patterns-injected", [cfg, $el[0], inj]);
                }
            }
        }

        if (cfg.scroll && cfg.scroll !== "none") {
            let scroll_container = cfg.$target
                .parents()
                .addBack()
                .filter(":scrollable");
            scroll_container = scroll_container.length
                ? scroll_container[0]
                : window;

            // default for scroll===top
            let top = 0;
            let left = 0;

            if (cfg.scroll !== "top") {
                let scroll_target;
                if (cfg.scroll === "target") {
                    scroll_target = cfg.$target[0];
                } else {
                    scroll_target = $injected.filter(cfg.scroll)[0];
                }

                // Get the reference element to which against we calculate
                // the relative position of the target.
                // In case of a scroll container of window, we do not have
                // getBoundingClientRect method, so get the body instead.
                let scroll_container_ref = scroll_container;
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
                        utils.getCSSValue(
                            scroll_container_ref,
                            "border-top-width",
                            true
                        )
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
        let sources$;
        let data = ev && ev.jqxhr && ev.jqxhr.responseText;
        if (!data) {
            log.warn("No response content, aborting", ev);
            return;
        }
        if (cfgs[0].source === "none") {
            // Special case, we want to call something, but we don't want to inject anything
            data = "";
        }
        for (const hook of cfgs[0].hooks || []) {
            $el.trigger("pat-inject-hook-" + hook);
        }
        this.stopBubblingFromRemovedElement($el, cfgs, ev);
        sources$ = await this.callTypeHandler(
            cfgs[0].dataType,
            "sources",
            $el,
            [cfgs, data, ev]
        );
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

        for (const [idx, cfg] of cfgs.entries()) {
            if (cfg.processDelay) {
                await utils.timeout(cfg.processDelay);
            }
            if (cfg.target != "none") {
                for (const target of cfg.$target) {
                    this._performInjection(
                        target,
                        $el,
                        sources$[idx],
                        cfg,
                        ev.target,
                        title
                    );
                }
            }
        }
        if (cfgs[0].nextHref && $el.is("a")) {
            // In case next-href is specified the anchor's href will
            // be set to it after the injection is triggered.
            $el.attr({ href: cfgs[0].nextHref.replace(/&amp;/g, "&") });
            this.destroy($el);
        }
        $el.off("pat-ajax-success.pat-inject");
        $el.off("pat-ajax-error.pat-inject");
    },

    _onInjectError($el, cfgs, event) {
        let explanation = "";
        let timestamp = new Date();
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
        const msg_attr =
            explanation +
            " Status is " +
            event.jqxhr.status +
            " " +
            event.jqxhr.statusText +
            ", time was " +
            timestamp +
            ". You can click to close this.";
        $("body").attr("data-error-message", msg_attr);
        $("body").on("click", () => {
            $("body").removeAttr("data-error-message");
            window.location.href = window.location.href;
        });
        for (const cfg of cfgs) {
            if ("$injected" in cfg) cfg.$injected.remove();
        }
        $el.off("pat-ajax-success.pat-inject");
        $el.off("pat-ajax-error.pat-inject");
    },

    execute(cfgs, $el) {
        /* Actually execute the injection.
         *
         * Either by making an ajax request or by spoofing an ajax
         * request when the content is readily available in the current page.
         */
        // get a kinda deep copy, we scribble on it
        cfgs = cfgs.map((cfg) => {
            return $.extend({}, cfg);
        });
        if (!this.verifyConfig(cfgs, $el)) {
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
                if (cfg.target != "none") {
                    cfg.$target.addClass(cfg.loadingClass);
                }
            });
        // Put the execute class on the elem that has pat inject on it
        _.chain(cfgs)
            .filter(_.property("loadingClass"))
            .each((cfg) => {
                $el.addClass(cfg.executingClass);
            });

        $el.on(
            "pat-ajax-success.pat-inject",
            this._onInjectSuccess.bind(this, $el, cfgs)
        );
        $el.on(
            "pat-ajax-error.pat-inject",
            this._onInjectError.bind(this, $el, cfgs)
        );
        $el.on("pat-ajax-success.pat-inject pat-ajax-error.pat-inject", () => {
            $el.removeData("pat-inject-triggered");
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

            for (const anchor of $source.find('a[href^="#"]')) {
                const href = anchor.getAttribute("href");
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
                    anchor.href = url;
                } else if (!$source.find(href).length) {
                    anchor.href = url + href;
                }
            }
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

    _rebaseHTML(base, html) {
        if (html === "") {
            // Special case, source is none
            return "";
        }
        const $page = $(
            html
                .replace(
                    /(\s)(src\s*)=/gi,
                    '$1src="" data-pat-inject-rebase-$2='
                )
                .trim()
        )
            .wrapAll("<div>")
            .parent();

        for (const el of $page.find(Object.keys(this._rebaseAttrs).join(","))) {
            const $el = $(el);
            const attrName = this._rebaseAttrs[el.tagName];
            const value = $el.attr(attrName);

            if (
                value &&
                value.slice(0, 2) !== "@@" &&
                value[0] !== "#" &&
                value.slice(0, 7) !== "mailto:" &&
                value.slice(0, 11) !== "javascript:"
            ) {
                value = utils.rebaseURL(base, value);
                $el.attr(attrName, value);
            }
        }
        // XXX: IE8 changes the order of attributes in html. The following
        // lines move data-pat-inject-rebase-src to src.
        for (const el of $page.find("[data-pat-inject-rebase-src]")) {
            const $el = $(el);
            $el.attr("src", $el.attr("data-pat-inject-rebase-src")).removeAttr(
                "data-pat-inject-rebase-src"
            );
        }

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
            log.warn(
                "Parsing html resulted in empty jquery object:",
                clean_html
            );
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
        let checkVisibility;

        // function to trigger the autoload and mark as triggered
        function trigger(event) {
            if ($el.data("pat-inject-autoloaded")) {
                return false;
            }
            $el.data("pat-inject-autoloaded", true);
            this.onTrigger({ target: $el[0] });
            event && event.preventDefault();
            return true;
        }
        $el.click(trigger);

        // Use case 1: a (heigh-constrained) scrollable parent
        if ($scrollable.length) {
            // if scrollable parent and visible -> trigger it
            // we only look at the closest scrollable parent, no nesting
            checkVisibility = utils.debounce(() => {
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
                const target = (
                    $el.data("pat-inject")[0].target || cfgs[0].defaultSelector
                ).replace(/::element/, "");
                if (target && target !== "self" && $(target).length === 0) {
                    return false;
                }
                const reltop =
                        $el.safeOffset().top -
                        $scrollable.safeOffset().top -
                        1000,
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
            $($scrollable[0]).on("scroll", checkVisibility.bind(this));
            $(window).on("resize.pat-autoload", checkVisibility.bind(this));
        } else {
            // Use case 2: scrolling the entire page
            checkVisibility = utils.debounce(() => {
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
                for (const el of $el) {
                    observer.observe(el);
                }
            } else {
                $(window).on(
                    "resize.pat-autoload scroll.pat-autoload",
                    checkVisibility.bind(this)
                );
            }
        }
        return false;
    },

    _initIdleTrigger($el, delay) {
        // XXX TODO: handle item removed from DOM
        const timeout = parseInt(delay, 10);
        let timer;

        function onTimeout() {
            this.onTrigger({ target: $el[0] });
            unsub();
            clearTimeout(timer);
        }

        const onInteraction = utils.debounce(() => {
            if (!document.body.contains($el[0])) {
                unsub();
                return;
            }
            clearTimeout(timer);
            timer = setTimeout(onTimeout, timeout);
        }, timeout);

        function unsub() {
            for (const e of ["scroll", "resize"]) {
                window.removeEventListener(e, onInteraction);
            }
            for (const e of [
                "click",
                "keypress",
                "keyup",
                "mousemove",
                "touchstart",
                "touchend",
            ]) {
                document.removeEventListener(e, onInteraction);
            }
        }

        onInteraction();

        for (const e of ["scroll", "resize"]) {
            window.addEventListener(e, onInteraction);
        }
        for (const e of [
            "click",
            "keypress",
            "keyup",
            "mousemove",
            "touchstart",
            "touchend",
        ]) {
            document.addEventListener(e, onInteraction);
        }
    },

    // XXX: simple so far to see what the team thinks of the idea
    registerTypeHandler(type, handler) {
        this.handlers[type] = handler;
    },

    async callTypeHandler(type, fn, context, params) {
        type = type || "html";
        if (this.handlers[type] && $.isFunction(this.handlers[type][fn])) {
            const handler = this.handlers[type][fn].bind(this);
            return await handler.apply(context, params);
        } else {
            return null;
        }
    },

    handlers: {
        html: {
            sources(cfgs, data) {
                const sources = cfgs.map((cfg) => {
                    return cfg.source;
                });
                sources.push("title");
                return this._sourcesFromHtml(data, cfgs[0].url, sources);
            },
        },
    },
};

registry.register(inject);
export default inject;

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

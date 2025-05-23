import "../../core/polyfills"; // SubmitEvent.submitter for Safari < 15.4 and jsDOM
import $ from "jquery";
import ajax from "../ajax/ajax";
import dom from "../../core/dom";
import events from "../../core/events";
import logging from "../../core/logging";
import Parser from "../../core/parser";
import registry from "../../core/registry";
import create_uuid from "../../core/uuid";
import utils from "../../core/utils";

const log = logging.getLogger("pat.inject");
//log.setLevel(logging.Level.DEBUG);

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
parser.addArgument("browser-cache", "no-cache", ["cache", "no-cache"]); // Cache ajax requests. Pass to pat-ajax.
parser.addArgument("confirm", "class", ["never", "always", "form-data", "class"]);
parser.addArgument("confirm-message", "Are you sure you want to leave this page?");
parser.addArgument("loading-class", "injecting"); // Add a class to the target while content is still loading.
parser.addArgument("executing-class", "executing"); // Add a class to the element while content is still loading.
parser.addArgument("executed-class", "executed"); // Add a class to the element when content is loaded.
parser.addArgument("class"); // Add a class to the injected content.
parser.addArgument("history", "none", ["none", "record"]);
parser.addArgument("push-marker");
parser.addArgument("scroll");

// Note: this should not be here but the parser would bail on unknown
// parameters and expand/collapsible need to pass the url to us.
parser.addArgument("url");

const inject = {
    name: "inject",
    trigger: "a.pat-inject, form.pat-inject, .pat-subform.pat-inject",
    parser: parser,

    async init($el, opts) {
        // We need to wait a tick. Modern BasePattern based patterns like
        // pat-validation do always wait a tick before initializing. The
        // patterns registry always initializes pat-validation first but since
        // it is waiting a tick the event handlers are registerd after the ones
        // from pat-inject. Waiting a tick in pat-inject solves this -
        // pat-validation's event handlers are initialized first.
        await utils.timeout(1);

        const el = utils.jqToNode($el);

        const cfgs = this.extractConfig($el, opts);
        if (cfgs.some((e) => e.history === "record") && !("pushState" in history)) {
            // if the injection shall add a history entry and HTML5 pushState
            // is missing, then don't initialize the injection.
            log.warn("HTML5 pushState is missing, aborting");
            return $el;
        }
        $el.data("pat-inject", cfgs);

        if (cfgs[0].nextHref && cfgs[0].nextHref.indexOf("#") === 0) {
            // In case the next href is an anchor, and it already
            // exists in the page, we do not activate the injection
            // but instead just change the anchors href.

            // Note: This is used in only one project for linked fullcalendars,
            // it's sanity is wonky and we should probably solve it differently.
            if (el.nodeName === "A" && $(cfgs[0].nextHref).length > 0) {
                log.debug(
                    "Skipping as next href is anchor, which already exists",
                    cfgs[0].nextHref
                );
                // TODO: reconsider how the injection enters exhausted state
                el.setAttribute(
                    "href",
                    (window.location.href.split("#")[0] || "") + cfgs[0].nextHref
                );
                return $el;
            }
        }
        if (cfgs[0].pushMarker) {
            $("body").on("push", (event, data) => {
                log.debug("received push message: " + data);
                if (data == cfgs[0].pushMarker) {
                    log.debug("re-injecting " + data);
                    this.onTrigger({ currentTarget: el });
                }
            });
        }
        if (cfgs[0].idleTrigger) {
            this._initIdleTrigger($el, cfgs[0].idleTrigger);
        } else {
            switch (cfgs[0].trigger) {
                case "default":
                    for (const cfg of cfgs) {
                        if (cfg.delay) {
                            cfg.processDelay = cfg.delay;
                        }
                    }
                    // setup event handlers
                    if (el?.nodeName === "FORM") {
                        log.debug("Initializing form with injection on", el);
                        events.add_event_listener(
                            el,
                            "submit",
                            "pat-inject--form-submit",
                            (e) => {
                                if (
                                    e.submitter?.matches(
                                        "[type=submit], button:not([type=button]), [type=image]"
                                    )
                                ) {
                                    // make sure the submitting button is sent
                                    // with the form
                                    ajax.onClickSubmit(e);
                                }
                                this.onTrigger(e);
                            }
                        );
                    } else if (el?.matches(".pat-subform")) {
                        log.debug("Initializing subform with injection");
                    } else {
                        $el.on("click.pat-inject", this.onTrigger.bind(this));
                    }
                    break;
                case "autoload":
                    if (!cfgs[0].delay) {
                        this.onTrigger({ currentTarget: el });
                    } else {
                        // generate UUID
                        const uuid = create_uuid();
                        el.setAttribute("data-pat-inject-uuid", uuid);

                        // function to trigger the autoload and mark as triggered
                        const delayed_trigger = (uuid_) => {
                            // Check if the element has been removed from the dom
                            const still_there = document.querySelector(
                                `[data-pat-inject-uuid="${uuid_}"]`
                            );
                            if (!still_there) {
                                return false;
                            }

                            $el.data("pat-inject-autoloaded", true);
                            this.onTrigger({ currentTarget: el });
                            // Cleanup again.
                            still_there.removeAttribute("data-pat-inject-uuid");
                            return true;
                        };
                        window.setTimeout(
                            delayed_trigger.bind(null, uuid),
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

        log.debug("initialised:", el);
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

        // Prevent the original event from doing it's work.
        // We want an AJAX request instead.
        e.preventDefault && e.preventDefault();

        const el = e.currentTarget;
        const $el = $(el);
        let cfgs = $el.data("pat-inject");
        if (el.nodeName === "FORM" && e.type === "submit") {
            const form = el;
            const submitter = e.submitter;

            // Do not submit invalid forms, if validation is active.
            // Works with native form validation and with pat-validation.
            if (
                !submitter?.matches("[formnovalidate]") &&
                !form.matches("[novalidate]") &&
                form.matches(":invalid")
            ) {
                log.debug("Form is invalid, aborting");
                return;
            }

            const formaction = submitter?.getAttribute("formaction");
            if (formaction) {
                const opts = {
                    url: formaction,
                };

                // Support custom data-pat-inject on formaction buttons.
                const cfg_node = submitter.closest("[data-pat-inject]");
                cfgs = this.extractConfig($(cfg_node), opts);
            }

            // store the params of the form in the config, to be used by history
            for (const cfg of cfgs) {
                cfg.params = $.param($el.serializeArray());
            }
        }

        $el.trigger("patterns-inject-triggered");
        this.execute(cfgs, $el);
    },

    submitSubform($sub) {
        /* This method is called from pat-subform
         */
        const $el = $($sub[0].closest("form"));
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

    extractConfig($el, options = {}) {
        const el = utils.jqToNode($el);
        options = Object.assign({}, options); // copy

        const cfgs = parser.parse($el, options, true);
        for (const cfg of cfgs) {
            cfg.$context = $el;
            // options and cfg have priority, fall back to href/action
            cfg.url =
                options.url ||
                cfg.url ||
                el?.getAttribute("href") ||
                el?.getAttribute("action") ||
                el?.closest("form")?.getAttribute("action") ||
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
                } catch {
                    log.warn("Invalid delay value: ", cfg.delay);
                    cfg.delay = null;
                }
            }
            cfg.processDelay = 0;
        }
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

        for (const cfg of cfgs) {
            let _confirm = false;
            if (cfg.confirm == "always") {
                _confirm = true;
            } else if (
                cfg.confirm === "form-data" &&
                cfg.target &&
                cfg.target !== "none"
            ) {
                _confirm = this.elementIsDirty(cfg.$target);
            } else if (cfg.confirm === "class" && cfg.target && cfg.target !== "none") {
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
            cfg.$created_target = cfg.$target;
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
        return cfgs.every((cfg) => this.verifySingleConfig(cfgs[0].url, cfg));
    },

    listenForFormReset(cfg) {
        /* if pat-inject is used to populate target in some form and when
         * Cancel button is pressed (this triggers reset event on the
         * form) you would expect to populate with initial placeholder
         */
        if (cfg.target === "none") {
            // Special case, we don't want to display any return value.
            return;
        }
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
         * Note: so far we only support #target and create a div with that id
         * appended to the body.
         */
        if (selector.slice(0, 1) !== "#") {
            log.error("only id supported for non-existing target");
            return null;
        }
        const $target = $("<div />").attr({ id: selector.slice(1) });
        $("body").append($target);
        return $target;
    },

    _performInjection(target, $el, $sources, cfg, trigger, $title) {
        /* Called after the XHR has succeeded and we have a new $sources
         * element to inject.
         */
        const wrapper = document.createElement("template");
        if ($sources.length > 0) {
            const method = cfg.sourceMod === "content" ? "innerHTML" : "outerHTML";
            // There might be multiple sources, so we need to loop over them.
            // Access them with "innerHTML" or "outerHTML" depending on the sourceMod.
            const sources_string = [...$sources].map(source => source[method]).join("\n");
            wrapper.innerHTML = sources_string;

            for (const img of wrapper.content.querySelectorAll("img")) {
                events.add_event_listener(
                    img,
                    "load",
                    "inject_img_load",
                    (e) => {
                        $(e.currentTarget).trigger("pat-inject-content-loaded");
                    },
                    { once: true }
                );
            }
        }

        // Copy, because after insertion wrapper.children is empty.
        const source_nodes = [...wrapper.content.childNodes];

        // Now the injection actually happens.
        if (this._inject(trigger, source_nodes, target, cfg)) {
            // Update history
            this._update_history(cfg, trigger, $title);
            // Post-injection
            this._afterInjection($el, cfg.$created_target || $(source_nodes), cfg);
        }
    },

    _update_history(cfg, trigger, $title) {
        // History support. if subform is submitted, append form params
        if (cfg.history !== "record" || !history?.pushState) {
            return;
        }
        let url = cfg.url;
        if (cfg.params) {
            const glue = url.indexOf("?") > -1 ? "&" : "?";
            url = `${url}${glue}${cfg.params}`;
        }
        history.pushState({ url: url }, "", url);
        // Also inject title element if we have one
        if ($title?.length) {
            const title_el = document.querySelector("title");
            if (title_el) {
                this._inject(trigger, $title, title_el, {
                    action: "element",
                });
            }
        }
    },

    _afterInjection($el, $injected, cfg) {
        /* Set a class on the injected elements and fire the
         * patterns-injected event.
         */
        const el = utils.jqToNode($el);
        $injected
            .filter((idx, el_) => {
                return el_.nodeType !== TEXT_NODE;
            })
            .data("pat-injected", { origin: cfg.url });

        if ($injected.length === 1 && $injected[0].nodeType == TEXT_NODE) {
            // Only one element injected, and it was a text node.
            // So we trigger "patterns-injected" on the parent.
            // The event handler should check whether the
            // injected element and the triggered element are
            // the same.
            $injected.parent().trigger("patterns-injected", [cfg, el, $injected[0]]);
        } else {
            $injected.each((idx, el_) => {
                // patterns-injected event will be triggered for each injected (non-text) element.
                if (el_.nodeType !== TEXT_NODE) {
                    $(el_)
                        .addClass(cfg["class"])
                        .trigger("patterns-injected", [cfg, el, el_]);
                }
            });
        }

        if (cfg.scroll && cfg.scroll !== "none") {
            // Get the scroll target for
            // 1) finding the scroll container
            // 2) getting the element to scroll to (if not "top")
            const scroll_target = ["top", "target"].includes(cfg.scroll)
                ? cfg.$target[0]
                : dom.querySelectorAllAndMe($injected[0], cfg.scroll);

            const scroll_container = dom.find_scroll_container(
                scroll_target,
                null,
                window
            );

            if (cfg.scroll === "top") {
                dom.scroll_to_top(scroll_container);
            } else if (scroll_target) {
                dom.scroll_to_element(scroll_target, scroll_container);
            }
        }

        el.dispatchEvent(
            new Event("pat-inject-success", { bubbles: true, cancelable: true })
        );
    },

    async _onInjectSuccess($el, cfgs, ev) {
        let data = ev?.jqxhr?.responseText;
        if (!data) {
            log.warn("No response content, aborting", ev);
            return;
        }
        if (cfgs[0].source === "none") {
            // Special case, we want to call something, but we don't want to inject anything
            data = "";
        }
        const sources$ = await this.callTypeHandler(cfgs[0].dataType, "sources", $el, [
            cfgs,
            data,
            ev,
        ]);
        /* pick the title source for dedicated handling later
          Title - if present - is always appended at the end. */
        let $title;
        if (
            sources$ &&
            sources$[sources$.length - 1] &&
            sources$[sources$.length - 1][0] &&
            sources$[sources$.length - 1][0].nodeName === "TITLE"
        ) {
            $title = sources$[sources$.length - 1];
        }
        cfgs.forEach((cfg, idx1) => {
            const perform_inject = () => {
                if (cfg.target !== "none") {
                    for (const target of cfg.$target) {
                        this._performInjection(
                            target,
                            $el,
                            sources$[idx1],
                            cfg,
                            ev.target,
                            $title
                        );
                    }
                }
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

        let error_page;
        let error_page_fragment;
        const url_params = new URLSearchParams(window.location.search);
        if (url_params.get("pat-inject-errorhandler.off") === null) {
            // Prepare a error page to be injected into the document.

            // Try to get a suitable error message from pre-configured error pages.
            const error_page_url = document
                ?.querySelector(`meta[name^=pat-inject-status-${status}]`)
                ?.getAttribute("content", false);
            error_page_fragment = error_page_url?.split("#")[1];
            error_page_fragment = error_page_fragment ? `#${error_page_fragment}` : null;

            if (error_page_fragment) {
                error_page = document.createElement("html");
                error_page.innerHTML = event.jqxhr.responseText;
                error_page = error_page.querySelector(error_page_fragment);
            }

            if (!error_page && error_page_url) {
                try {
                    const error_page_response = await fetch(error_page_url, {
                        method: "GET",
                    });
                    error_page = document.createElement("html");
                    error_page.innerHTML = await error_page_response.text();
                    error_page = error_page.querySelector(error_page_fragment || "body");
                } catch {
                    // fall back to standard error message and ignore.
                }
            }
        }

        // clean up
        for (const cfg of cfgs) {
            if ("$created_target" in cfg) {
                cfg.$created_target.remove();
            }
            cfg.$target.removeClass(cfg.loadingClass);
            $el.removeClass(cfg.executingClass);
        }
        $el.off("pat-ajax-success.pat-inject");
        $el.off("pat-ajax-error.pat-inject");

        if (error_page) {
            const error_zone = document.querySelector(error_page_fragment || "body");
            error_zone.innerHTML = error_page.innerHTML;
            registry.scan(error_zone); // initialize any patterns in error page
        } else {
            const msg_attr = `${explanation} Status is ${status} ${event.jqxhr.statusText}, time was ${timestamp}. You can click to close this.`;
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
        const el = utils.jqToNode($el);
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

        for (const cfg of cfgs) {
            // Add a execute class on the pat-inject element.
            if (cfg?.executingClass) {
                el.classList.add(cfg.executingClass);
            }
            // Add a loading class to the target.
            // Can be used for loading-spinners.
            if (cfg?.loadingClass && cfg?.target !== "none") {
                cfg.$target.addClass(cfg.loadingClass);
            }
        }

        $el.on("pat-ajax-success.pat-inject", async (e) => {
            this._onInjectSuccess($el, cfgs, e);

            // Wait for the next tick to ensure that the close-panel listener
            // is called before this one, even for non-async local injects.
            await utils.timeout(1);
            // Remove the close-panel event listener.
            events.remove_event_listener(el, "pat-inject--close-panel");
            // Only close the panel if a close-panel event was catched previously.
            if (do_close_panel) {
                do_close_panel = false;
                // Re-trigger close-panel event if it was caught while injection was in progress.
                el.dispatchEvent(
                    new Event("close-panel", { bubbles: true, cancelable: true })
                );
            }
        });
        $el.on("pat-ajax-error.pat-inject", this._onInjectError.bind(this, $el, cfgs));
        $el.on("pat-ajax-success.pat-inject pat-ajax-error.pat-inject", () =>
            $el.removeData("pat-inject-triggered")
        );

        // Prevent closing the panel while injection is in progress.
        let do_close_panel = false;
        events.add_event_listener(el, "close-panel", "pat-inject--close-panel", (e) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
            do_close_panel = true;
        });

        if (cfgs[0].url.length) {
            ajax.request($el, {
                "url": cfgs[0].url,
                "browser-cache": cfgs[0].browserCache,
            });
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

    _inject(trigger, source_nodes, target, cfg) {
        if (cfg.source === "none") {
            // Special case. Clear the target after ajax call.
            target.replaceWith("");
            return true;
        }
        if (source_nodes.length === 0) {
            log.warn("Aborting injection, source not found:", source_nodes);
            $(trigger).trigger("pat-inject-missingSource", {
                url: cfg.url,
                selector: cfg.source,
            });
            return false;
        }
        if (cfg.target === "none") {
            // Special case. Don't do anything, we don't want any result
            return true;
        }
        if (!target) {
            log.warn("Aborting injection, target not found:", target);
            $(trigger).trigger("pat-inject-missingTarget", {
                selector: cfg.target,
            });
            return false;
        }

        // cfg.action to DOM method mapping
        const method = {
            content: "replaceChildren",
            contentafter: "append",
            contentbefore: "prepend",
            element: "replaceWith",
            elementafter: "after",
            elementbefore: "before",
        }[cfg.action];

        // Inject the content HERE!
        target[method](...source_nodes);

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
        a: "href",
        form: "action",
        img: "src",
        object: "data",
        source: "src",
        video: "src",
    },

    _rebaseOptions: {
        "calendar": ["url", "event-sources"],
        "collapsible": ["load-content"],
        "date-picker": ["i18n"],
        "datetime-picker": ["i18n"],
        "inject": ["url"],
    },

    _rebaseURL(base, url) {
        if (url.indexOf("://") !== -1 || url[0] === "/" || url.indexOf("data:") === 0) {
            return url;
        }
        base = new URL(base, window.location).href; // If base is relative make it absolute.
        return base.slice(0, base.lastIndexOf("/") + 1) + url;
    },

    _rebaseHTML(base, html) {
        if (html === "") {
            // Special case, source is none
            return "";
        }

        // Parse the html string into a DOM tree.
        const page = document.createElement("div");
        page.innerHTML = html;

        // Create efficient selector for any tag with it's corresponding
        // attribute from _rebaseAttrs. Note: the current data structure allows
        // only for one attribute to be rebased per tag.
        const rebase_selector = Object.entries(this._rebaseAttrs)
            .map(([tag, attr]) => `${tag}[${attr}]`)
            .join(", ");
        for (const el_ of page.querySelectorAll(rebase_selector)) {
            const attr = this._rebaseAttrs[el_.nodeName.toLowerCase()];
            let value = el_.getAttribute(attr);

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
                value = this._rebaseURL(base, value);
                el_.setAttribute(attr, value);
            }
        }

        for (const [pattern_name, opts] of Object.entries(this._rebaseOptions)) {
            for (const el_ of dom.querySelectorAllAndMe(
                page,
                `[data-pat-${pattern_name}]`
            )) {
                const pattern = registry.patterns?.[pattern_name];
                const pattern_parser = pattern?.parser;
                if (!pattern_parser) {
                    continue;
                }
                // parse: no default options, possibly multiple configs, no grouping.
                const options = pattern_parser.parse(el_, {}, true, false, false);
                let changed = false;
                for (const config of options) {
                    for (const opt of opts) {
                        const val = config[opt];
                        if (!val) {
                            continue;
                        }
                        changed = true;
                        if (Array.isArray(val)) {
                            config[opt] = val.map((it) => this._rebaseURL(base, it));
                        } else {
                            config[opt] = this._rebaseURL(base, val);
                        }
                    }
                }
                if (changed) {
                    el_.setAttribute(
                        `data-pat-${pattern_name}`,
                        JSON.stringify(options.length === 1 ? options[0] : options)
                    );
                }
            }
        }

        return page.innerHTML.trim();
    },

    _parseRawHtml(html, url = "") {
        // remove script tags and head and replace body by a div
        const title = html.match(/\<title\>(.*)\<\/title\>/);
        let clean_html = html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
            .replace(/<head\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/head>/gi, "")
            .replace(/<html([^>]*?)>/gi, "")
            .replace(/<\/html([^>]*?)>/gi, "")
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

    _initAutoloadVisible($el, cfgs) {
        if ($el.data("pat-inject-autoloaded")) {
            // ignore executed autoloads
            return false;
        }

        const el = utils.jqToNode($el);

        // delay: default is 200ms to allow scrolling over and past autoload-visible elements without loading them.
        const delay = cfgs[0].delay || 200;
        log.debug(`Delay time: ${delay}`);

        // function to trigger the autoload and mark as triggered
        const trigger = (event) => {
            if ($el.data("pat-inject-autoloaded")) {
                log.debug(`autoload-visible trigger skipped ${el}`);
                return false;
            }
            $el.data("pat-inject-autoloaded", true);
            this.onTrigger({ currentTarget: el });
            event && event.preventDefault();
            log.debug(`autoload-visible trigger run ${el}`);
            return true;
        };

        // Config see: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
        const intersection_observer_config = {
            threshold: 0, // If even one pixel is visible, the callback will be run.
            root: null, // Root is browser viewport. If the element is visible to the user, the callback will be run.
            margin: "0px", // No margins. The element is not preloaded.
        };

        let timeout_id = null;
        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    // Run the callback after 200ms to prevent loading all
                    // visible elements when scrolling over.
                    timeout_id = window.setTimeout(() => {
                        observer.disconnect(); // Stop observing loaded elements.
                        trigger();
                    }, delay);
                    log.debug(`autoload-visible intersecting ${el}`);
                } else {
                    window.clearTimeout(timeout_id);
                    log.debug(`autoload-visible not intersecting ${el}`);
                }
            }
        }, intersection_observer_config);
        observer.observe(el);
    },

    _initIdleTrigger($el, delay) {
        // TODO: handle item removed from DOM
        const timeout = parseInt(delay, 10);
        let timer;

        const el = utils.jqToNode($el);

        const onTimeout = () => {
            this.onTrigger({ currentTarget: el });
            unsub();
            clearTimeout(timer);
        };

        const onInteraction = utils.debounce(() => {
            if (!document.body.contains(el)) {
                unsub();
                return;
            }
            clearTimeout(timer);
            timer = setTimeout(onTimeout, timeout);
        }, timeout);

        const unsub = () => {
            for (const event of ["scroll", "resize"]) {
                window.removeEventListener(event, onInteraction);
            }
            for (const event of [
                "click",
                "keypress",
                "keyup",
                "mousemove",
                "touchstart",
                "touchend",
            ]) {
                document.removeEventListener(event, onInteraction);
            }
        };

        onInteraction();

        for (const event of ["scroll", "resize"]) {
            window.addEventListener(event, onInteraction);
        }
        for (const event of [
            "click",
            "keypress",
            "keyup",
            "mousemove",
            "touchstart",
            "touchend",
        ]) {
            document.addEventListener(event, onInteraction);
        }
    },

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
                const result = this._sourcesFromHtml(data, cfgs[0].url, sources);
                return result;
            },
        },
    },
};

$(document).on("patterns-injected.inject", async (ev, cfg, trigger, injected) => {
    /* Listen for the patterns-injected event.
     *
     * Remove the "loading-class" classes from all injection targets and
     * then scan the injected content for new patterns.
     */
    if (cfg?.skipPatInjectHandler) {
        // Allow skipping this handler but still have other handlers in other
        // patterns listen to ``patterns-injected``.
        return;
    }
    if (cfg) {
        cfg.$target.removeClass(cfg.loadingClass);
        // Remove the executing class, add the executed class to the element with pat.inject on it.
        $(trigger).removeClass(cfg.executingClass).addClass(cfg.executedClass);
    }
    if (injected.nodeType !== TEXT_NODE && injected.nodeType !== COMMENT_NODE) {
        registry.scan(injected, null, { type: "injection", element: trigger });
        $(injected).trigger("patterns-injected-scanned");

        await utils.timeout(10); // Wait a bit before dispatching next event.
        injected.dispatchEvent(
            new CustomEvent("patterns-injected-delayed", {
                bubbles: true,
                cancelable: true,
                detail: {
                    injected: injected,
                },
            })
        );
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

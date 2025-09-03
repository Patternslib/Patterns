/**
 * Patterns registry - Central registry and scan logic for patterns
 *
 * Copyright 2012-2013 Simplon B.V.
 * Copyright 2012-2013 Florian Friesdorf
 * Copyright 2013 Marko Durkovic
 * Copyright 2013 Rok Garbas
 * Copyright 2014-2015 Syslab.com GmBH, JC Brand
 */

/*
 * changes to previous patterns.register/scan mechanism
 * - if you want initialised class, do it in init
 * - init returns set of elements actually initialised
 * - handle once within init
 * - no turnstile anymore
 * - set pattern.jquery_plugin if you want it
 */
import $ from "jquery";
import dom from "./dom";
import events from "./events";
import logging from "./logging";
import utils from "./utils";

const log = logging.getLogger("registry");
const disable_re = /patterns-disable=([^&]+)/g;
const dont_catch_re = /patterns-dont-catch/g;
const disabled = {};
let dont_catch = false;
let match;

while ((match = disable_re.exec(window.location.search)) !== null) {
    disabled[match[1]] = true;
    log.info("Pattern disabled via url config:", match[1]);
}

while ((match = dont_catch_re.exec(window.location.search)) !== null) {
    dont_catch = true;
    log.info("I will not catch init exceptions");
}

/**
 * Global pattern registry.
 *
 * This is a singleton and shared among any instance of the Patternslib
 * registry since Patternslib version 8.
 *
 * You normally don't need this as the registry handles it for you.
 */
if (typeof window.__patternslib_registry === "undefined") {
    window.__patternslib_registry = {};
}
export const PATTERN_REGISTRY = window.__patternslib_registry;
if (typeof window.__patternslib_registry_initialized === "undefined") {
    window.__patternslib_registry_initialized = false;
}

const registry = {
    patterns: PATTERN_REGISTRY, // reference to global patterns registry
    // as long as the registry is not initialized, pattern
    // registration just registers a pattern. Once init is called,
    // the DOM is scanned. After that registering a new pattern
    // results in rescanning the DOM only for this pattern.
    init() {
        dom.document_ready(() => {
            if (window.__patternslib_registry_initialized) {
                // Do not reinitialize a already initialized registry.
                return;
            }
            window.__patternslib_registry_initialized = true;
            log.debug("Loaded: " + Object.keys(registry.patterns).sort().join(", "));
            registry.scan(document.body);
            log.debug("Finished initial scan.");
        });
    },

    clear() {
        // Removes all patterns from the registry. Currently only being
        // used in tests.
        for (const name in registry.patterns) {
            delete registry.patterns[name];
        }
    },

    transformPattern(name, content) {
        /* Call the transform method on the pattern with the given name, if
         * it exists.
         */
        if (disabled[name]) {
            log.debug(`Skipping disabled pattern: ${name}.`);
            return;
        }

        const pattern = registry.patterns[name];
        const transform = pattern.transform || pattern.prototype?.transform;
        if (transform) {
            try {
                transform($(content));
            } catch (e) {
                if (dont_catch) {
                    throw e;
                }
                log.error(`Transform error for pattern ${name}.`, e);
            }
        }
    },

    initPattern(name, el, trigger) {
        /* Initialize the pattern with the provided name and in the context
         * of the passed in DOM element.
         */
        const $el = $(el);
        const pattern = registry.patterns[name];
        const plog = logging.getLogger(`pat.${name}`);
        if (el.matches(pattern.trigger)) {
            plog.debug("Initialising.", el);
            try {
                if (pattern.init) {
                    // old style initialisation
                    pattern.init($el, null, trigger);
                } else {
                    // class based pattern initialisation
                    new pattern($el, null, trigger);
                }

                plog.debug("done.");
            } catch (e) {
                if (dont_catch) {
                    throw e;
                }
                plog.error("Caught error:", e);
            }
        }
    },

    orderPatterns(patterns) {
        // Always add pat-validation as first pattern, so that it can prevent
        // other patterns from reacting to submit events if form validation
        // fails.
        if (patterns.includes("validation")) {
            patterns.splice(patterns.indexOf("validation"), 1);
            patterns.unshift("validation");
        }
        // Add clone-code to the very beginning - we want to copy the markup
        // before any other patterns changed the markup.
        if (patterns.includes("clone-code")) {
            patterns.splice(patterns.indexOf("clone-code"), 1);
            patterns.unshift("clone-code");
        }

        return patterns;
    },

    async scan(content, patterns, trigger) {
        if (!content) {
            return;
        }

        if (typeof content === "string") {
            content = document.querySelector(content);
        } else if (content instanceof Text) {
            // No need to scan a TextNode.
            return;
        } else if (content.jquery) {
            content = content[0];
        }

        const selectors = [];
        patterns = this.orderPatterns(patterns || Object.keys(registry.patterns));
        for (const name of patterns) {
            this.transformPattern(name, content);
            const pattern = registry.patterns[name];
            if (pattern.trigger) {
                selectors.unshift(pattern.trigger);
            }
        }

        // Clean up selectors:
        // - Remove whitespace,
        // - Remove trailing commas,
        // - Join to selecto string.
        const selector_string = selectors.map(
            (selector) => selector.trim().replace(/,$/, "")
        ).join(",");

        // Exit, if no selector.
        if (!selector_string) {
            return;
        }

        let matches = dom.querySelectorAllAndMe(
            content,
            selector_string
        );
        matches = matches.filter((el) => {
            // Filter out patterns:
            // - with class ``.disable-patterns`` or wrapped within.
            // - wrapped in ``<pre>`` elements
            // - wrapped in ``<template>`` elements (not reachable anyways)
            return (
                !el?.closest?.(".disable-patterns") &&
                !el?.parentNode?.closest?.("pre") &&
                // BBB. TODO: Remove with next major version.
                !el?.closest?.(".cant-touch-this")
            );
        });

        // walk list backwards and initialize patterns inside-out.
        const pattern_instances = [];
        for (const el of matches.reverse()) {
            for (const name of patterns) {
                pattern_instances.push(this.initPattern(name, el, trigger));
            }
        }

        // Notify for all patterns loaded.
        document.dispatchEvent(
            new Event("patterns-loaded")
        );
        document.body.classList.add("patterns-loaded");

        // Notify for all Patterns initialized.
        await Promise.all(pattern_instances);
        document.dispatchEvent(
            new Event("patterns-initialized")
        );
        document.body.classList.add("patterns-initialized");
    },

    register(pattern, name) {
        name = name || pattern.name;
        if (!name) {
            log.error("Pattern lacks a name.", pattern);
            return false;
        }

        // Do not register blacklisted patterns.
        let BLACKLIST = window.__patternslib_patterns_blacklist;
        if (!Array.isArray(BLACKLIST)) {
            BLACKLIST = [];
        }
        if (BLACKLIST.includes(name)) {
            log.warn(`Pattern name ${name} is blacklisted.`);
            return false;
        }

        if (registry.patterns[name]) {
            log.debug(`Already have a pattern called ${name}.`);
            return false;
        }
        // register pattern to be used for scanning new content
        registry.patterns[name] = pattern;

        // register pattern as jquery plugin
        if (pattern.jquery_plugin) {
            const plugin_name = ("pat-" + name).replace(
                /-([a-zA-Z])/g,
                function (match, p1) {
                    return p1.toUpperCase();
                }
            );
            $.fn[plugin_name] = utils.jqueryPlugin(pattern);
            // BBB 2012-12-10 and also for Mockup patterns.
            $.fn[plugin_name.replace(/^pat/, "pattern")] = $.fn[plugin_name];
        }
        log.debug(`Registered pattern ${name}`, pattern);
        if (window.__patternslib_registry_initialized) {
            // Once the first initialization has been done, do only scan for
            // newly registered patterns.
            registry.scan(document.body, [name]);
            log.debug(`Re-scanned dom with newly registered pattern ${name}.`);
        }
        return true;
    },
};

export default registry;

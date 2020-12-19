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

const registry = {
    patterns: {},
    // as long as the registry is not initialized, pattern
    // registration just registers a pattern. Once init is called,
    // the DOM is scanned. After that registering a new pattern
    // results in rescanning the DOM only for this pattern.
    initialized: false,
    init() {
        $(document).ready(function () {
            log.info(
                "loaded: " + Object.keys(registry.patterns).sort().join(", ")
            );
            registry.scan(document.body);
            registry.initialized = true;
            log.info("finished initial scan.");
        });
    },

    clear() {
        // Removes all patterns from the registry. Currently only being
        // used in tests.
        this.patterns = {};
    },

    transformPattern(name, content) {
        /* Call the transform method on the pattern with the given name, if
         * it exists.
         */
        if (disabled[name]) {
            log.debug("Skipping disabled pattern:", name);
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
                log.error("Transform error for pattern" + name, e);
            }
        }
    },

    initPattern(name, el, trigger) {
        /* Initialize the pattern with the provided name and in the context
         * of the passed in DOM element.
         */
        const $el = $(el);
        const pattern = registry.patterns[name];
        if (pattern.init) {
            const plog = logging.getLogger("pat." + name);
            if ($el.is(pattern.trigger)) {
                plog.debug("Initialising:", $el);
                try {
                    pattern.init($el, null, trigger);
                    plog.debug("done.");
                } catch (e) {
                    if (dont_catch) {
                        throw e;
                    }
                    plog.error("Caught error:", e);
                }
            }
        }
    },

    orderPatterns(patterns) {
        // XXX: Bit of a hack. We need the validation pattern to be
        // parsed and initiated before the inject pattern. So we make
        // sure here, that it appears first. Not sure what would be
        // the best solution. Perhaps some kind of way to register
        // patterns "before" or "after" other patterns.
        if (patterns.includes("validation") && patterns.includes("inject")) {
            patterns.splice(patterns.indexOf("validation"), 1);
            patterns.unshift("validation");
        }
        return patterns;
    },

    scan(content, patterns, trigger) {
        if (typeof content === "string") {
            content = document.querySelector(content);
        } else if (content.jquery) {
            content = content[0];
        }

        const selectors = [];
        patterns = this.orderPatterns(
            patterns || Object.keys(registry.patterns)
        );
        for (const name of patterns) {
            this.transformPattern(name, content);
            const pattern = registry.patterns[name];
            if (pattern.trigger) {
                selectors.unshift(pattern.trigger);
            }
        }

        let matches = dom.querySelectorAllAndMe(content, selectors.join(","));
        matches = matches.filter((el) => {
            // Filter out code examples wrapped in <pre> elements.
            // Also filter special class ``.cant-touch-this``
            return (
                dom.find_parents(el, "pre").length === 0 &&
                !el.matches(".cant-touch-this")
            );
        });

        // walk list backwards and initialize patterns inside-out.
        for (const el of matches.reverse()) {
            for (const name of patterns) {
                this.initPattern(name, el, trigger);
            }
        }
        document.body.classList.add("patterns-loaded");
    },

    register(pattern, name) {
        name = name || pattern.name;
        if (!name) {
            log.error("Pattern lacks a name:", pattern);
            return false;
        }
        if (registry.patterns[name]) {
            log.error("Already have a pattern called: " + name);
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
        log.debug("Registered pattern:", name, pattern);
        if (registry.initialized) {
            registry.scan(document.body, [name]);
        }
        return true;
    },
};

export default registry;

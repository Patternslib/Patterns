/**
 * Patterns registry - Central registry and scan logic for patterns
 *
 * Copyright 2012-2013 Simplon B.V.
 * Copyright 2012-2013 Florian Friesdorf
 * Copyright 2013 Marko Durkovic
 * Copyright 2013 Rok Garbas
 */

/*
 * changes to previous patterns.register/scan mechanism
 * - if you want initialised class, do it in init
 * - init returns set of elements actually initialised
 * - handle once within init
 * - no turnstile anymore
 * - set pattern.jquery_plugin if you want it
 */
define([
    "jquery",
    "./core/logger",
    "./utils",
    // below here modules that are only loaded
    "./compat"
], function($, logger, utils) {
    var log = logger.getLogger("registry"),
        jquery_plugin = utils.jquery_plugin;

    var disable_re = /patterns-disable=([^&]+)/g,
        disabled = {}, match;

    while ((match=disable_re.exec(window.location.search))!==null) {
        disabled[match[1]] = true;
        log.info('Pattern disabled via url config:', match[1]);
    }

    var registry = {
        patterns: {},
        // as long as the registry is not initialized, pattern
        // registration just registers a pattern. Once init is called,
        // the DOM is scanned. After that registering a new pattern
        // results in rescanning the DOM only for this pattern.
        initialized: false,
        init: function() {
            $(document).ready(function() {
                log.info('loaded: ' + Object.keys(registry.patterns).sort().join(', '));
                registry.scan(document.body);
                registry.initialized = true;
                log.info('finished initial scan.');
            });
        },

        scan: function(content, do_not_catch_init_exception, patterns) {
            var $content = $(content),
                all = [], allsel,
                pattern, $match, plog;

            // If no list of patterns was specified, we scan for all
            // patterns
            patterns = patterns || Object.keys(registry.patterns);

            // selector for all patterns
            patterns.forEach(function(name) {
                if (disabled[name]) {
                    log.debug('Skipping disabled pattern:', name);
                    return;
                }
                pattern = registry.patterns[name];
                if (pattern.transform) {
                    try {
                        pattern.transform($content);
                    } catch (e) {
                        log.critical("Transform error for pattern" + name, e);
                    }
                }
                if (pattern.trigger) {
                    all.push(pattern.trigger);
                }
            });
            allsel = all.join(",");

            // Find all elements that belong to any pattern.
            $match = $content.find(allsel);
            if ($content.is(allsel))
                $match = $match.add($content);
            $match = $match.filter(function() { return $(this).parents('pre').length === 0; });
            $match = $match.filter(":not(.cant-touch-this)");

            // walk list backwards and initialize patterns inside-out.
            //
            // XXX: If patterns would only trigger via classes, we
            // could iterate over an element classes and trigger
            // patterns in order.
            //
            // Advantages: Order of pattern initialization controled
            // via order of pat-classes and more efficient.
            $match.toArray().reduceRight(function(acc, el) {
                var $el = $(el);

                for (var name in registry.patterns) {
                    pattern = registry.patterns[name];
                    plog = logger.getLogger("pat." + name);

                    if ($el.is(pattern.trigger)) {
                        plog.debug("Initialising:", $el);
                        try {
                            pattern.init($el);
                            plog.debug("done.");
                        } catch (e) {
                            if (do_not_catch_init_exception) {
                              throw e;
                            } else {
                              plog.error("Caught error:", e);
                            }
                        }
                    }
                }
            }, null);
        },

        // XXX: differentiate between internal and custom patterns
        // _register vs register
        register: function(pattern) {
            if (!pattern.name) {
                log.error("Pattern lacks name:", pattern);
                return false;
            }

            if (registry.patterns[pattern.name]) {
                log.error("Already have a pattern called: " + pattern.name);
                return false;
            }

            // register pattern to be used for scanning new content
            registry.patterns[pattern.name] = pattern;

            // register pattern as jquery plugin
            if (pattern.jquery_plugin) {
                var pluginName = ("pat-" + pattern.name)
                        .replace(/-([a-zA-Z])/g, function(match, p1) {
                            return p1.toUpperCase();
                        });
                $.fn[pluginName] = jquery_plugin(pattern);
                // BBB 2012-12-10
                $.fn[pluginName.replace(/^pat/, "pattern")] = jquery_plugin(pattern);
            }

            log.debug("Registered pattern:", pattern.name, pattern);

            if (registry.initialized) {
                registry.scan(document.body, false, [pattern.name]);
            }
            return true;
        }
    };

    $(document) .on("patterns-injected.patterns", function(ev) {
        registry.scan(ev.target);
        $(ev.target).trigger("patterns-injected-scanned");
    });

    return registry;
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

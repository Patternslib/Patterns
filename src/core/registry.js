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
    "pat-logger",
    "pat-utils",
    // below here modules that are only loaded
    "pat-compat",
    "pat-jquery-ext"
], function($, logger, utils) {
    var log = logger.getLogger("registry"),
        jquery_plugin = utils.jquery_plugin;

    var disable_re = /patterns-disable=([^&]+)/g,
        dont_catch_re = /patterns-dont-catch/g,
        dont_catch = false,
        disabled = {}, match;

    while ((match=disable_re.exec(window.location.search)) !== null) {
        disabled[match[1]] = true;
        log.info('Pattern disabled via url config:', match[1]);
    }

    while ((match=dont_catch_re.exec(window.location.search)) !== null) {
        dont_catch = true;
        log.info('I will not catch init exceptions');
    }

    var registry = {
        patterns: {},
        // as long as the registry is not initialized, pattern
        // registration just registers a pattern. Once init is called,
        // the DOM is scanned. After that registering a new pattern
        // results in rescanning the DOM only for this pattern.
        initialized: false,
        init: function registry_init() {
            $(document).ready(function() {
                log.info('loaded: ' + Object.keys(registry.patterns).sort().join(', '));
                registry.scan(document.body);
                registry.initialized = true;
                log.info('finished initial scan.');
            });
        },

        // FIXME: from mockup
        getOptions: function($el, patternName, options) {
            options = options || {};
            // get options from parent element first, stop if element tag name is 'body'
            if ($el.length !== 0 && !$.nodeName($el[0], 'body')) {
                options = registry.getOptions($el.parent(), patternName, options);
            }
            // collect all options from element
            var elOptions = {};
            if ($el.length !== 0) {
                elOptions = $el.data('pat-' + patternName);
                if (elOptions) {
                    // parse options if string
                    if (typeof(elOptions) === 'string') {
                        var tmpOptions = {};
                        $.each(elOptions.split(';'), function(i, item) {
                            item = item.split(':');
                            item.reverse();
                            var key = item.pop();
                            key = key.replace(/^\s+|\s+$/g, '');  // trim
                            item.reverse();
                            var value = item.join(':');
                            value = value.replace(/^\s+|\s+$/g, '');  // trim
                            tmpOptions[key] = value;
                        });
                        elOptions = tmpOptions;
                    }
                }
            }
            return $.extend(true, {}, options, elOptions);
        },

        isMockupPattern: function(pattern) {
            if (typeof pattern.prototype !== "undefined") {
                return pattern.prototype.is_mockup_pattern;
            } else {
                return false;
            }
        },

        initPattern: function registry_initPattern($el, pattern, name, trigger) {
            var plog = logger.getLogger("pat." + name);
            plog.debug("Initialising:", $el);
            if (pattern.init) {
                try {
                    pattern.init($el, null, trigger);
                } catch (e) {
                    if (dont_catch) { throw(e); }
                    plog.error("Caught error:", e);
                }
                plog.debug("done.");
            }
        },

        scan: function registry_scan(content, patterns, trigger) {
            var $content = $(content), all = [], allsel, $match;

            // If no list of patterns was specified, we scan for all patterns
            patterns = patterns || Object.keys(registry.patterns);

            // selector for all patterns
            patterns.forEach(function registry_scan_loop(name) {
                if (disabled[name]) {
                    log.debug('Skipping disabled pattern:', name);
                    return;
                }
                var pattern = registry.patterns[name];
                if (pattern.transform) {
                    try {
                        pattern.transform($content);
                    } catch (e) {
                        if (dont_catch) { throw(e); }
                        log.error("Transform error for pattern" + name, e);
                    }
                }
                if (registry.isMockupPattern(pattern)) {
                    all.push(pattern.prototype.trigger);
                } else if (pattern.trigger) {
                    all.push(pattern.trigger);
                }
            });
            // Find all elements that belong to any pattern.
            allsel = all.join(",");
            $match = $content.findInclusive(allsel);
            $match = $match.filter(function() { return $(this).parents('pre').length === 0; });
            $match = $match.filter(":not(.cant-touch-this)");

            // walk list backwards and initialize patterns inside-out.
            $match.toArray().reduceRight(function registry_pattern_init(acc, el) {
                var trigger;
                var pattern, $el = $(el);
                for (var name in registry.patterns) {
                    pattern = registry.patterns[name];
                    if (registry.isMockupPattern(pattern)) {
                        trigger = pattern.prototype.trigger;
                    } else {
                        trigger = pattern.trigger;
                    }
                    if ($el.is(trigger)) {
                        registry.initPattern($el, pattern, name, trigger);
                    }
                }
            }, null);
        },

        register: function registry_register(pattern) {
            var mockup = registry.isMockupPattern(pattern);
            var name = mockup ? pattern.prototype.name : pattern.name;
            if (!name) {
                log.warn("Pattern lacks a name:", pattern);
                return false;
            }
            if (registry.patterns[name]) {
                log.error("Already have a pattern called: " + name);
                return false;
            }
            // register pattern to be used for scanning new content
            registry.patterns[name] = pattern;

            if (mockup) {
                // automatically create jquery plugin from pattern
                if (pattern.prototype.jqueryPlugin === undefined) {
                    // FIXME: make jquery name similar to Patternslib
                    pattern.prototype.jqueryPlugin = 'pattern' + name.charAt(0).toUpperCase() + name.slice(1);
                }
                $.fn[pattern.prototype.jqueryPlugin] = function mockupJQueryPlugin(method, options) {
                    var pattern = registry.patterns[name];
                    var log = logger.getLogger("pat." + name);
                    $(this).each(function() {
                        var pat, $el = $(this);
                        if (typeof method === 'object') {
                            options = method;
                            method = undefined;
                        }
                        pat = pattern.init($el, options);
                        if (method) {
                            if (pat[method] === undefined) {
                                log.error('Method "' + method + '" does not exists.');
                                return false;
                            }
                            if (method.charAt(0) === '_') {
                                log.warn('Method "' + method + '" is private.');
                                return false;
                            }
                            pat[method].apply(pat, [options]);
                        }
                    });
                    return this;
                };
            } else {
                // register pattern as jquery plugin
                if (pattern.jquery_plugin) {
                    var pluginName = ("pat-" + name)
                            .replace(/-([a-zA-Z])/g, function(match, p1) {
                                return p1.toUpperCase();
                            });
                    $.fn[pluginName] = jquery_plugin(pattern);
                    // BBB 2012-12-10
                    $.fn[pluginName.replace(/^pat/, "pattern")] = jquery_plugin(pattern);
                }
            }
            log.debug("Registered pattern:", name, pattern);
            if (registry.initialized) {
                registry.scan(document.body, [name]);
            }
            return true;
        }
    };

    $(document).on("patterns-injected.patterns",
        function registry_onInject(ev, inject_config, inject_trigger) {
            registry.scan(ev.target, null, {type: "injection", element: inject_trigger});
            $(ev.target).trigger("patterns-injected-scanned");
        });

    return registry;
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

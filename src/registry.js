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
    "./transforms",
    "./utils",
    // below here modules that are only loaded
    "./compat"
], function($, logger, transforms, utils) {
    var log = logger.getLogger('registry'),
        jquery_plugin = utils.jquery_plugin;

    var registry = {
        patterns: {},
        scan: function(content) {
            var $content = $(content),
                all = [], allsel,
                pattern, $match, plog, name;

            transforms.transformContent($content);

            // selector for all patterns and patterns stored by their trigger
            for (name in registry.patterns) {
                pattern = registry.patterns[name];
                if (pattern.trigger) {
                    all.push(pattern.trigger);
                }
            }
            allsel = all.join(',');

            // find all elements that belong to any pattern
            $match = $content.filter(allsel);
            $match = $match.add($content.find(allsel));
            $match = $match.filter(':not(.cant-touch-this)');

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

                for (name in registry.patterns) {
                    pattern = registry.patterns[name];
                    plog = logger.getLogger("pat." + name);

                    if ($el.is(pattern.trigger)) {
                        plog.debug('Initialising:', $el);
                        try {
                            pattern.init($el);
                            plog.debug('done.');
                        } catch (e) {
                            plog.error("Caught error:", e);
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

            log.debug('Registered pattern:', pattern.name, pattern);
            return true;
        }
    };

    $(document).on('patterns-injected.patterns', function(ev) {
        registry.scan(ev.target);
        $(ev.target).trigger('patterns-injected-scanned');
    });


    return registry;
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

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
    "./core/logging",
    "./transforms",
    "./utils",
    // below here modules that are only loaded
    "./compat"
], function($, logging, transforms, utils) {
    var log = logging.getLogger('registry'),
        jquery_plugin = utils.jquery_plugin;

    var registry = {
        patterns: {},
        scan: function(content) {
            var $content = $(content), pattern, $match, plog, $initialised;
            transforms.transformContent($content);
            for (var name in registry.patterns) {
                pattern = registry.patterns[name];
                plog = logging.getLogger(name);

                // construct set of matching elements
                $match = $content.filter(pattern.trigger);
                $match = $match.add($content.find(pattern.trigger));
                $match = $match.filter(':not(.cant-touch-this)');

                // call pattern init in case of matching elements, the
                // pattern returns the set of actually initialised
                // elements
                if ($match.length > 0) {
                    plog.debug('Initialising:', $match);
                    try {
                        pattern.init($match);
                        plog.debug('Initialised:', $initialised);
                    } catch (e) {
                        plog.error("Error initialising pattern", e);
                    }
                }
            }
        },
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
                // XXX: here the pattern used to be jquery_plugin wrapped
                $.fn[pattern.jquery_plugin] = jquery_plugin(pattern);
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

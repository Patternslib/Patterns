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
    "./logging",
    "./utils",
    // below here modules that are only loaded
    "./compat"
], function($, logging, utils) {
    var log = logging.getLogger('registry'),
        jquery_plugin = utils.jquery_plugin;

    var _ = {
        patterns: {},
        scan: function(content) {
            var $content = $(content), pattern, $match, plog, $initialised;
            for (var name in _.patterns) {
                pattern = _.patterns[name];
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
            if (_.patterns[pattern.name]) {
                log.error("Already have a pattern called: " + pattern.name);
                return null;
            }

            // register pattern to be used for scanning new content
            _.patterns[pattern.name] = pattern;

            // register pattern as jquery plugin
            if (pattern.jquery_plugin) {
                // XXX: here the pattern used to be jquery_plugin wrapped
                $.fn[pattern.name] = jquery_plugin(pattern);
            }

            log.info('Registered pattern:', pattern.name, pattern);
            return pattern;
        }
    };
    return _;
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

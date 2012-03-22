define([
    'require',
    './lib/jquery',
    './patterns/ajaxify',
    './patterns/autosubmit',
    './patterns/collapsible',
    './patterns/edit',
    './patterns/inject',
    './patterns/inject_log_old',
    './patterns/modal',
    './utils'
], function(require) {
    var utils = require('./utils'),
        jquery_plugin = utils.jquery_plugin,
        pimp_pattern = utils.pimp_pattern;

    var plain_patterns = {
        ajaxify: require('./patterns/ajaxify'),
        autosubmit: require('./patterns/autosubmit'),
        collapsible: require('./patterns/collapsible'),
        edit: require('./patterns/edit'),
        inject: require('./patterns/inject'),
        inject_log_old: require('./patterns/inject_log_old'),
        modal: require('./patterns/modal')
    };

    var patterns = {};

    // If you use this to register custom patterns make sure to prefix
    // their names to avoid name collision.
    patterns.register = function(name, pattern) {
        patterns[name] = pattern = pimp_pattern(name, pattern);
        // make available as jquery plugins - this is optional and not
        // needed for the functionality of the patterns library. Should be
        // configurable.
        $.fn[name] = jquery_plugin(name, pattern);
    };

    patterns.scan = function(content, opts) {
        var $content = $(content);
        for (var name in patterns) {
            if (name === "scan") continue;
            if (name === "register") continue;
            var pattern = patterns[name],
                trigger = pattern.markup_trigger;
            if (!trigger) continue;
            if ($content.is(trigger)) pattern.init($content, opts);
            $content.find(trigger).each(function() { pattern.init($(this), opts); });
        }
    };

    for (var name in plain_patterns) {
        patterns.register(name, plain_patterns[name]);
    }

    // for now this happens in main.js
    //
    // $(document).on('inject.patterns.scan', function(ev, opts) {
    //     patterns.scan(ev.target, opts);
    // });

    return patterns;
});

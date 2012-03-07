define([
    'require',
    './lib/jquery',
    './patterns/collapsible',
    './utils'
], function(require) {
    var utils = require('./utils'),
        jquery_plugin = utils.jquery_plugin,
        pimp_pattern = utils.pimp_pattern;

    var plain_patterns = {
        collapsible: require('./patterns/collapsible')
    };

    var patterns = {};
    for (var name in plain_patterns) {
        patterns[name] = pimp_pattern(name, plain_patterns[name]);
    }

    // make available as jquery plugins - this is optional and not
    // needed for the functionality of the patterns library. Should be
    // configurable.
    for (name in patterns) {
        $.fn[name] = jquery_plugin(name, patterns[name]);
    }

    patterns.scan = function(root) {
        for (var name in patterns) {
            if (name === "scan") continue;
            var pattern = patterns[name],
                trigger = pattern.markup_trigger;
            if (!trigger) continue;
            $(root).find(trigger).each(function() { pattern.init($(this)); });
        }
    };

    return patterns;
});

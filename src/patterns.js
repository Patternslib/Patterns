define([
    'require',
    './lib/jquery',
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
        autosubmit: require('./patterns/autosubmit'),
        collapsible: require('./patterns/collapsible'),
        edit: require('./patterns/edit'),
        inject: require('./patterns/inject'),
        inject_log_old: require('./patterns/inject_log_old'),
        modal: require('./patterns/modal')
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

    patterns.scan = function(content, opts) {
        var $content = $(content);
        for (var name in patterns) {
            if (name === "scan") continue;
            var pattern = patterns[name],
                trigger = pattern.markup_trigger;
            if (!trigger) continue;
            if ($content.is(trigger)) pattern.init($content, opts);
            $content.find(trigger).each(function() { pattern.init($(this), opts); });
        }
    };

    // for now this happens in main.js
    //
    // $(document).on('inject.patterns.scan', function(ev, opts) {
    //     patterns.scan(ev.target, opts);
    // });

    return patterns;
});

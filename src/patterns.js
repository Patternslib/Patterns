define([
    'require',
    './lib/jquery',
    './logging',
    './patterns/ajaxify',
    './patterns/autosuggest',
    './patterns/autosubmit',
    './patterns/collapsible',
    './patterns/checklist',
    './patterns/chosen',
//    './patterns/edit',
//    './patterns/edit-aloha',
    './patterns/edit-tinymce',
    './patterns/expandable',
    './patterns/inject',
    './patterns/inject_log_old',
    './patterns/modal',
    './patterns/navigation',
    './patterns/validate',
    './utils'
], function(require) {
    var log = require('./logging').getLogger(),
        utils = require('./utils'),
        jquery_plugin = utils.jquery_plugin,
        pimp_pattern = utils.pimp_pattern;

    var plain_patterns = {
        ajaxify: require('./patterns/ajaxify'),
        autosubmit: require('./patterns/autosubmit'),
        autosuggest: require('./patterns/autosuggest'),
        collapsible: require('./patterns/collapsible'),
        checklist: require('./patterns/checklist'),
        chosen: require('./patterns/chosen'),
//        edit: require('./patterns/edit'),
//        "edit-aloha": require('./patterns/edit-aloha'),
        "edit-tinymce": require('./patterns/edit-tinymce'),
        expandable: require('./patterns/expandable'),
        inject: require('./patterns/inject'),
        inject_log_old: require('./patterns/inject_log_old'),
        modal: require('./patterns/modal'),
        navigation: require('./patterns/navigation'),
        validate: require('./patterns/validate')
    };

    var patterns = {};

    // If you use this to register custom patterns make sure to prefix
    // their names to avoid name collision.
    patterns.register = function(name, pattern) {
        patterns[name] = pattern = pimp_pattern(name, pattern);
        // make available as jquery plugins - this is optional and not
        // needed for the functionality of the patterns library. Should be
        // configurable.
        if (pattern.register_jquery_plugin === undefined) {
            pattern.register_jquery_plugin = true;
        }
        if (pattern.register_jquery_plugin) {
            $.fn[name] = jquery_plugin(name, pattern);
        }
        log.info('Registered pattern:', name, pattern);
    };

    patterns.scan = function(content, opts) {
        var $content = $(content);
        for (var name in patterns) {
            if (name === "scan") continue;
            if (name === "register") continue;
            var pattern = patterns[name],
                trigger = pattern.markup_trigger;
            if (!trigger) continue;
            trigger = trigger.split(',').map(function(el, idx) {
                return el + ':not(.cant-touch-this)';
            }).join(',');
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

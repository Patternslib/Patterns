define(function(require) {
    require('./compat');

    var log = require('./logging').getLogger(),
        utils = require('./utils'),
        jquery_plugin = utils.jquery_plugin,
        pimp_pattern = utils.pimp_pattern;

    var patterns_order = [
        'ajaxify',
        'autosuggest',
        'autosubmit',
        'breadcrumbs',
        'collapsible',
        'checklist',
        'chosen',
        'edit-tinymce',
        'expandable',
        'inject',
        'inject2',
        'inject_log_old',
        'modal',
        'navigation',
        'placeholder',
        'validate'
    ];


    var plain_patterns = {
        ajaxify: require('./patterns/ajaxify'),
        autosuggest: require('./patterns/autosuggest'),
        autosubmit: require('./patterns/autosubmit'),
        breadcrumbs: require('./patterns/breadcrumbs'),
        collapsible: require('./patterns/collapsible'),
        checklist: require('./patterns/checklist'),
        chosen: require('./patterns/chosen'),
//        edit: require('./patterns/edit'),
        "edit-tinymce": require('./patterns/edit-tinymce'),
        expandable: require('./patterns/expandable'),
        inject: require('./patterns/inject'),
        inject2: require('./patterns/inject2'),
        inject_log_old: require('./patterns/inject_log_old'),
        modal: require('./patterns/modal'),
        navigation: require('./patterns/navigation'),
        placeholder: require('./patterns/placeholder'),
        validate: require('./patterns/validate')
    };

    var patterns = {};

    // If you use this to register custom patterns make sure to prefix
    // their names to avoid name collision.
    patterns._ordered = [];
    patterns.register = function(name, pattern) {
        patterns[name] = pattern = pimp_pattern(name, pattern);
        patterns._ordered.push(name);
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
        patterns._ordered.forEach(function(name) {
            var pattern = patterns[name],
                trigger = pattern.markup_trigger;
            if (!trigger) return;
            trigger = trigger.split(',').map(function(el, idx) {
                return el + ':not(.cant-touch-this)';
            }).join(',');
            if ($content.is(trigger)) pattern.init($content, opts);
            $content.find(trigger).each(function() { pattern.init($(this), opts); });
        });
    };

    patterns_order.forEach(function(name) {
        patterns.register(name, plain_patterns[name]);
    });

    // for now this happens in main.js
    //
    // $(document).on('inject.patterns.scan', function(ev, opts) {
    //     patterns.scan(ev.target, opts);
    // });

    return patterns;
});

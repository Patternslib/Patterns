// auto-suggest docs:
// http://code.drewwilson.com/entry/autosuggest-jquery-plugin
define([
    'require',
    '../logging',
    '../../lib/jquery.autoSuggest'
], function(require) {
    var log = require('../logging').getLogger('autosuggest');

    var init = function($el, opts) {
        // fetch words for auto-suggestion
        var $cfg = $el.parents('[data-auto-suggest-config]:first');

        // XXX: do this properly
        var words = (($cfg.data('auto-suggest-config') || '')
                     .split(':')[1] || '').split(/\s*,\s*/);
        var data = words.map(function(word) {
            return {value: word, name: word};
        });
        var $prefillcfg = $el.parents('[data-auto-suggest-prefill]:first');
        var prefill = $prefillcfg.data('auto-suggest-prefill') || '';

        var $asHtmlIDcfg = $el.parents('[data-auto-suggest-ashtmlid]:first');
        var asHtmlID = $asHtmlIDcfg.data('auto-suggest-ashtmlid') || false;

        // are we autosubmit?
        var autosubmit = $el.is('.auto-submit') ||
                ($el.parents('.auto-submit').length > 0);
        log.debug('auto-submit', autosubmit, $el);

        $el.on('keydown', function(ev) {
            if (ev.which === 13) {
                ev.preventDefault();
                var newev = $.Event("keydown");
                newev.ctrlKey = false;
                newev.which = 188;
                newev.keyCode = 188;
                $el.trigger(newev);
            }
        });

        var cfg = {
            asHtmlID: asHtmlID,
            preFill: prefill,
            selectedValueProp: "name",
            searchObjProp: "name",
            startText: $el.attr('readonly') ? "" : "Enter name here"
        };
        var $form;
        if (autosubmit) {
            $form = $el.parents('form');
            cfg.selectionAdded = function($item) {
                log.debug('submit because selection was added', $item);
                // trigger the form
                $form.submit();
            };
            cfg.selectionRemoved = function($item) {
                // ignore removal request if readonly
                if ($el.attr('readonly')) return;
                log.debug('submit because selection was removed', $item);
                // trigger the form
                $item.remove();
                $form.submit();
            };
        }

        $el.autoSuggest(data, cfg);
    };

    var pattern = {
        markup_trigger: "input.auto-suggest",
        initialised_class: "auto-suggest",
        register_jquery_plugin: false,
        init: init
    };

    return pattern;
});

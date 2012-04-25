// auto-suggest docs:
// http://code.drewwilson.com/entry/autosuggest-jquery-plugin
define([
    'require',
    '../lib/jquery',
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

        var cfg = {
            asHtmlID: asHtmlID,
            preFill: prefill,
            selectedValueProp: "name",
            searchObjProp: "name",
            startText: "Enter name here"
        };
        var $form;
        if (autosubmit) {
            $form = $el.parents('form');
            cfg.selectionAdded = function($el) {
                log.debug('submit because selection was added', $el);
                // trigger the form
                $form.submit();
            };
            cfg.selectionRemoved = function($el) {
                log.debug('submit because selection was removed', $el);
                // trigger the form
                $el.remove();
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

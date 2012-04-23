define([
    'require',
    '../lib/jquery',
    '../../lib/jquery.autoSuggest'
], function(require) {

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

        $el.autoSuggest(
            data,
            {
                asHtmlID: asHtmlID,
                preFill: prefill,
                selectedValueProp: "name",
                searchObjProp: "name"
            }
        );
    };

    var pattern = {
        markup_trigger: "input.auto-suggest",
        initialised_class: "auto-suggest",
        register_jquery_plugin: false,
        init: init
    };

    return pattern;
});

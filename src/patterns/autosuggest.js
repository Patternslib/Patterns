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
        $el.autoSuggest(
            data,
            {
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

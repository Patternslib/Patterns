define([
    'require',
    '../lib/jquery',
    '../../lib/jquery.autoSuggest'
], function(require) {

    var init = function($el, opts) {
        $el.autoSuggest([
            {value: "test1", name: "test1"},
            {value: "test2", name: "test2"},
            {value: "test3", name: "test3"},
            {value: "fest1", name: "fest1"},
            {value: "fest2", name: "fest2"},
            {value: "fest3", name: "fest3"}
        ], {
            selectedValueProp: "name",
            searchObjProp: "name"
        });
    };

    var pattern = {
        markup_trigger: "input.auto-suggest",
        initialised_class: "auto-suggest",
        register_jquery_plugin: false,
        init: init
    };

    return pattern;
});

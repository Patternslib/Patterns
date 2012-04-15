define([
    'require',
    '../lib/jquery',
    '../../lib/jquery.autoSuggest'
], function(require) {

    var init = function($el, opts) {
        $el.autoSuggest([
            {value: "1", name: "test1"},
            {value: "2", name: "test2"},
            {value: "3", name: "test3"},
            {value: "10", name: "fest1"},
            {value: "20", name: "fest2"},
            {value: "30", name: "fest3"}
        ]);
    };

    var pattern = {
        markup_trigger: "input.auto-suggest",
        initialised_class: "auto-suggest",
        register_jquery_plugin: false,
        init: init
    };

    return pattern;
});

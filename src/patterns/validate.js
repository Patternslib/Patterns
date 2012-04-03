define([
    'require',
    '../../lib/jquery.validate'
], function(require) {
    var init = function($el, opts) {
        $el.validate();
        return $el;
    };

    var pattern = {
        markup_trigger: 'form.validate',
        register_jquery_plugin: false,
        init: init
    };
    return pattern;
});
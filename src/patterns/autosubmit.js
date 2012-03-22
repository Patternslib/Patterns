define([
    'require',
    '../lib/dist/underscore',
    '../lib/jquery',
    '../lib/jquery.form/jquery.form',
    './ajaxify'
], function(require) {
    var ajaxify = require('./ajaxify').init;

    // can be called on a form or an element in a form
    var init = function($el) {
        // get parameters from markup
        var $form = $el.is('form') ? $el : $el.parents('form').first(),
            url = $form.attr('action');

        ajaxify($form);

        var submit = function(event) {
            $form.submit();
        };

        // submit if a (specific) form element changed
        $el.on("change", submit);

        // debounced keyup submit, if enabled
        if ($el.hasClass('auto-submit-keyup')) {
            ($el.is('input') ? $el : $el.find('input'))
                .on("keyup", _.debounce(submit, 400));
        }

        // XXX: this should anyway work
        // $form.on('keyup', function(ev) {
        //     if (ev.which === 13) {
        //         ev.preventDefault();
        //         submit(ev);
        //     }
        // });

        // XXX: test whether on webkit and enable only if supported
        // XXX: add code to check whether the click actually changed
        // something
        ($el.is('input[type=search]') ? $el : $el.find('input[type=search]'))
            .on("click", submit);

        // allow for chaining
        return $el;
    };

    var pattern = {
        markup_trigger: ".auto-submit, .auto-submit-keyup",
        initialised_class: "auto-submit",
        init: init
    };

    return pattern;
});

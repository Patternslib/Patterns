define([
    'require',
    '../lib/dist/underscore',
    '../lib/jquery.form/jquery.form',
    '../logging'
], function(require) {
    var log = require('../logging').getLogger('autosubmit');

    // can be called on a form or an element in a form
    var init = function($el) {
        // get parameters from markup
        var $form = $el.is('form') ? $el : $el.parents('form').first();

        var submit = function(event) {
            // ignore auto-suggest fields, the change event will be
            // triggered on the hidden input
            if ($(event.target).is('.auto-suggest')) {
                log.debug('ignored event from autosuggest field');
                return;
            }
            log.info("triggered by " + event.type);
            $form.submit();
        };

        // submit if a (specific) form element changed
        $el.on("change", submit);

        // debounced keyup submit, if enabled
        if ($el.hasClass('auto-submit-keyup')) {
            ($el.is('input') ? $el : $el.find('input'))
                .on("keyup", _.debounce(submit, 400));
        }

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

define([
    'require',
    '../lib/jquery.form/jquery.form',
    '../logging',
    '../utils'
], function(require) {
    var log = require('../logging').getLogger('autosubmit'),
        utils = require('../utils');

    // can be called on a form or an element in a form
    var init = function($el) {
        // get parameters from markup
        var $form = $el.is('form') ? $el : $el.parents('form').first();

        var submit = function(ev) {
            var $target = $(ev.target);

            // ignore auto-suggest fields, the change event will be
            // triggered on the hidden input
            if ($target.is('.auto-suggest')) {
                log.debug('ignored event from autosuggest field');
                return;
            }

            if ($target.is('input[type=search]')) {
                // clicking X on type=search deletes data attrs,
                // therefore we store the old value on the form.
                var name = $target.attr('name'),
                    key = name + '-autosubmit-oldvalue',
                    oldvalue = $form.data(key) || "",
                    curvalue = $target[0].value || "";

                if (!name) {
                    log.warn('type=search without name, will be a problem'
                             + ' if there are multiple', $target);
                }
                if (oldvalue === curvalue) return;

                $form.data(key, curvalue);
            }

            log.info("triggered by " + ev.type);

            $form.submit();
        };

        // submit if a (specific) form element changed
        $el.on("change", submit);

        // debounced keyup submit, if enabled
        if ($el.hasClass('auto-submit-keyup')) {
            ($el.is('input') ? $el : $el.find('input'))
                .on("keyup", utils.debounce(submit, 400));
        }

        // XXX: test whether on webkit and enable only if supported
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

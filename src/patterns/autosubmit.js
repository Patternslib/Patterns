/*jslint regexp: true,
         browser: true,
         sloppy: true,
         white: true,
         plusplus: true,
         indent: 4,
         maxlen: 200 */
/*global define, $, console */

define([
    'require',
    '../lib/dist/underscore',
    '../lib/jquery',
    '../lib/jquery.form/jquery.form',
    '../logging'
], function(require) {
    var log = require('../logging').getLogger('autosubmit'),
        init,
        pattern;

    // can be called on a form or an element in a form
    init = function($el) {
        // get parameters from markup
        var $form = $el.is('form') ? $el : $el.parents('form').first(),
            submit;

        submit = function(event) {
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

    pattern = {
        markup_trigger: ".auto-submit, .auto-submit-keyup",
        initialised_class: "auto-submit",
        init: init
    };

    return pattern;
});

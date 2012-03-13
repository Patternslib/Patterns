define([
    'require',
    '../lib/jquery',
    '../lib/dist/underscore'
], function(require) {

    var init = function($el) {
        var submit = _.debounce(function(event) {
            $el.submit();
        }, 400);
        $el.on("change", submit);
        if ($el.hasClass('on-keyup')) {
            $el.find('input').on("keyup", submit);
        }

        // XXX: test whether on webkit and enable only if supported
        // XXX: add code to check whether the click actually changed
        // something
        $el.find('input[type=search]').on("click", submit);

        // allow for chaining
        return $el;
    };

    var pattern = {
        markup_trigger: ".auto-submit",
        initialised_class: "auto-submit",
        init: init
    };

    return pattern;
});

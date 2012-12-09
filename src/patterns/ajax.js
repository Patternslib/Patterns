// XXX: this could/should be merged with form-state and ajax be an
// option of form-state
define([
    "jquery",
    "../registry",
    "../lib/ajax"
], function($, registry, ajax) {
    var _ = {
        name: "ajax",
        trigger: "form.pat-ajax",
        init: function($el, opts) {
            // process matches single-file
            if ($el.length > 1)
                return $el.each(function() { _.init($(this), opts); });

            // remember initial state of the form and after
            // successfull submission
            _.saveState.call($el);
            $el.on('pat-ajax-success', _.saveState);

            // setup listeners for form to be handled via ajax
            $el.on('submit.pat-ajax', _.submit);

            // enable chaining
            return $el;
        },
        saveState: function() {
            var $el = $(this);
            $el.data('pat-ajax.previous-state', $el.data('pat-ajax.state'));
            $el.data('pat-ajax.state', $el.serializeArray());
        },
        submit: function(event) {
            if (event)
                event.preventDefault();
            ajax($(this));
        }
    };

    registry.register(_);
    return _;
});

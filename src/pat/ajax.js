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
        init: function($form, opts) {
            // process matches single-file
            if ($form.length > 1)
                return $form.each(function() { _.init($(this), opts); });

            // remember initial state of the form and after
            // successfull submission
            _.saveState.call($form);
            $form.on("pat-ajax-success", _.saveState);

            // setup listeners for form to be handled via ajax
            $form.on("submit.pat-ajax", _.submit);

            // enable chaining
            return $form;
        },
        saveState: function() {
            var $form = $(this);
            $form.data("pat-ajax.previous-state", $form.data("pat-ajax.state"));
            $form.data("pat-ajax.state", $form.serializeArray());
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

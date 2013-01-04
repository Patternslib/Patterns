define([
    "jquery",
    "../core/logger",
    "../registry",
    "../utils",
    "./modal"
], function($, logger, registry, utils, modal) {
    var log = logger.getLogger("form-state");

    var _ = {
        name: "form-state",
        trigger: "form.pat-form-state",
        init: function($form) {
            if ($form.length > 1)
                return $form.each(function() { _.init($(this)); });

            // XXX: hide reset buttons until we have proper handling for them
            $form.find("[type=reset]").hide();

            _.setReset.call($form);

            return $form;
        },
        setModified: function() {
            var $form = $(this);

            $form.find("[type=reset]").prop("disabled", false);
            $form.find("[type=submit]").prop("disabled", false);

            $form.addClass("modified")
                .off(".pat-form-state")
                .one("reset.pat-form-state", _.setReset)
                .one("pat-ajax-error.pat-form-state", _.setError)
                .one("pat-ajax-success.pat-form-state", _.setSaved);
            log.debug("modified");
        },
        setReset: function() {
            var $form = $(this);

            $form.find("[type=reset]").prop("disabled", true);
            $form.find("[type=submit]").prop("disabled", true);

            $form
                .removeClass("modified")
                .off(".pat-form-state")
                .one("change.pat-form-state textchange.pat-form-state",
                     _.setModified);
            log.debug("reset");
        },
        setError: function(event) {
            var msg = [event.jqxhr.status, event.jqxhr.statusText].join(" ");
            modal.init($(
                "<div class='pat-modal small'>" +
                    "<h3>Error</h3>" +
                    "<div class='wizard-box'>" +
                    "<div class='panel-body'>" +
                    "<p>A server error has occured.</p>" +
                    "<p>The error message is: <strong>" + msg + "</strong>.</p>" +
                    "</div>" +
                    "<div class='buttons panel-footer'>" +
                    "<button class='close-panel'>Ok</button>" +
                    "</div>" +
                    "</div>" +
                    "</div>"
            ).appendTo($("body")));
        },
        setSaved: function(event) {
            if (event.target !== this)
                return;

            var $form = $(this);
            _.setReset.call($form);

            var time = new Date(),
                timestr = time.getHours() + ":" +
                    time.getMinutes() + ":" +
                    time.getSeconds();
            $form.find("time.last-saved").remove();
            $form.prepend(
                "<time class='last-saved' datetime='" + timestr + "'>" +
                    timestr + "</time>"
            );

            $form.addClass("saved");
        }
    };
    registry.register(_);
});

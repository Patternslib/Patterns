define([
    "jquery",
    "../registry",
    '../utils'
], function($, registry, utils) {
    var _ = {
        name: "form-state",
        trigger: "form.pat-form-state",
        init: function($form) {
            if ($form.length > 1)
                return $form.each(function() { _.init($(this)); });

            var $reset = $form.find('[type=reset]'),
                $submit = $form.find('[type=submit]');

            // initially disable submit and reset button, wait for
            // something to be modified to enable them again
            $reset.prop('disabled', true);
            $submit.prop('disabled', true);

            var modified = function() {
                $reset.prop('disabled', false);
                $submit.prop('disabled', false);
                $form.removeClass("saved").addClass("modified")
                    .off('.pat-form-state')
                    .on('reset.pat-form-state', reset)
                    .on('pat-ajax-success.pat-form-state', saved);
            };
            var debouncedModified = utils.debounce(modified, 400);

            var reset = function() {
                $reset.prop('disabled', true);
                $submit.prop('disabled', true);
                $form
                    .removeClass("modified")
                    .off('.pat-form-state')
                    .on('keyup.pat-form-state', debouncedModified)
                    .on('change.pat-form-state', modified);
            };

            var saved = function() {
                reset();
                var time = new Date(),
                    timestr = time.getHours() + ':'
                        + time.getMinutes() + ':'
                        + time.getSeconds();
                $form.find('time.last-saved').remove();
                $form.prepend(
                    '<time class="last-saved" datetime="' + timestr + '">' +
                        timestr + '</time>'
                );
                $form.addClass("saved");
            };

            $form.off('.pat-form-state')
                .on('keyup.pat-form-state', debouncedModified)
                .on('change.pat-form-state', modified);

            return $form;
        }
    };
    registry.register(_);
});

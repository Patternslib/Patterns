define([
    "jquery",
    "../core/logging",
    "../registry",
    '../utils'
], function($, logging, registry, utils) {
    var log = logging.getLogger('form-state');

    var _ = {
        name: "form-state",
        trigger: "form.pat-form-state",
        init: function($form) {
            if ($form.length > 1)
                return $form.each(function() { _.init($(this)); });

            _.setReset.call($form);

            return $form;
        },
        setModified: function() {
            var $form = $(this);

            $form.find('[type=reset]').prop('disabled', false);
            $form.find('[type=submit]').prop('disabled', false);

            $form.addClass("modified")
                .off('.pat-form-state')
                .one('reset.pat-form-state', _.setReset)
                .one('pat-ajax-error.pat-form-state', _.setError)
                .one('pat-ajax-success.pat-form-state', _.setSaved);
            log.debug('modified');
        },
        setReset: function() {
            var $form = $(this);

            $form.find('[type=reset]').prop('disabled', true);
            $form.find('[type=submit]').prop('disabled', true);

            $form
                .removeClass("modified")
                .off('.pat-form-state')
                .one('change.pat-form-state textchange.pat-form-state',
                     _.setModified);
            log.debug('reset');
        },
        setError: function(ev) {
            var $form = $(this),
                msg = [ev.jqxhr.status, ev.jqxhr.statusText].join(' ');
            $form.prepend('<p class="message error">' + msg + '</p>');
        },
        setSaved: function() {
            var $form = $(this);
            _.setReset.call($form);

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
        }
    };
    registry.register(_);
});

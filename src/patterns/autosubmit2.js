define([
    "jquery",
    '../registry',
    '../logging',
    '../utils'
], function($, registry, logging, utils) {
    var log = logging.getLogger('autosubmit');

    var _ = {
        name: "autosubmit2",
        trigger: ".pat-autosubmit2, .pat-autosubmit2-keyup",
        init: function($el) {
            return $el.each(function() {
                var $el = $(this);

                // submit if a (specific) form element changed
                $el.on("change.pat-autosubmit2", _.submit);

                // debounced keyup submit, if enabled
                if ($el.hasClass('pat-autosubmit2-keyup')) {
                    ($el.is('input') ? $el : $el.find('input'))
                        .on("keyup.pat-autosubmit2", utils.debounce(_.submit, 400));
                }

                // XXX: test whether on webkit and enable only if supported
                ($el.is('input[type=search]') ? $el : $el.find('input[type=search]'))
                    .on("click.pat-autosubmit2", _.submit);
            });
        },
        submit: function(ev) {
            var $el = $(this),
                $form = $el.is('form') ? $el : $el.parents('form').first();

            // ignore auto-suggest fields, the change event will be
            // triggered on the hidden input
            if ($el.is('.pat-autosuggest')) {
                log.debug('ignored event from autosuggest field');
                return;
            }

            if ($el.is('input[type=search]')) {
                // clicking X on type=search deletes data attrs,
                // therefore we store the old value on the form.
                var name = $el.attr('name'),
                    key = name + '-autosubmit-oldvalue',
                    oldvalue = $form.data(key) || "",
                    curvalue = $el[0].value || "";

                if (!name) {
                    log.warn('type=search without name, will be a problem' +
                             ' if there are multiple', $el);
                }
                if (oldvalue === curvalue) return;

                $form.data(key, curvalue);
            }

            log.debug("triggered by " + ev.type);

            $form.submit();
        }
    };

    registry.register(_);
    return _;
});


// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

define([
    "jquery",
    "../registry",
    '../logging',
    "jquery_validate"
], function($, patterns, logging) {
    var log = logging.getLogger('validate');

    var pattern_spec = {
        name: "validate",
        trigger: "form.validate",

        init: function($el) {
            var rules = $el.find('[data-required-if]').toArray().reduce(function(acc, el) {
                var $el = $(el),
                    id = $el.attr('id');
                if (!id) {
                    log.error('Element needs id, skipping:', $el);
                    return acc;
                }
                acc[id] = {required: $el.data('required-if')};
                return acc;
            }, {});
            log.debug('rules:', rules);

            // ATTENTION: adding the debug option to validate, disables
            // form submission
            $el.validate({rules: rules});
            return $el;
        }
    };

    patterns.register(pattern_spec);
    return pattern_spec;
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

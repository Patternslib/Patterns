define([
    'require',
    '../../lib/jquery.validate',
    '../logging'
], function(require) {
    var log = require('../logging').getLogger('validate');

    var init = function($el, opts) {
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
    };

    var pattern = {
        markup_trigger: 'form.validate',
        register_jquery_plugin: false,
        init: init
    };
    return pattern;
});
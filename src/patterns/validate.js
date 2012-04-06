/*jslint regexp: true,
         browser: true,
         sloppy: true,
         white: true,
         plusplus: true,
         indent: 4,
         maxlen: 200 */
/*global define, $ */

define([
    'require',
    '../lib/dist/underscore',
    '../../lib/jquery.validate',
    '../logging'
], function(require) {
    var log = require('../logging').getLogger('validate'),
        init,
        pattern;

    init = function($el, opts) {
        var rules = _.reduce(
            $el.find('[data-required-if]').toArray(),
            function(acc, el) {
                var $el = $(el),
                    id = $el.attr('id');
                if (!id) {
                    log.error('Element needs id, skipping:', $el);
                    return acc;
                }
                acc[id] = {required: $el.data('required-if')};
                return acc;
            },
            {}
        );
        log.debug('rules:', rules);
        $el.validate({rules: rules, debug: true});
        return $el;
    };

    pattern = {
        markup_trigger: 'form.validate',
        register_jquery_plugin: false,
        init: init
    };
    return pattern;
});

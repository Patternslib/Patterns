/*jslint regexp: true,
         browser: true,
         sloppy: true,
         white: true,
         plusplus: true,
         indent: 4,
         maxlen: 200 */
/*global define, $, tinyMCE */

define([
    'require',
    '../../lib/tiny_mce/tiny_mce',
    '../logging'
], function(require) {
    var log = require('../logging').getLogger('edit-tinymce'),
        init,
        pattern;

    init = function($el, opts) {
        // make sure the textarea has an id
        var id = $el.attr('id'),
            cfg,
            cfg_str,
            $form = $el.parents('form'),
            formid = $form.attr('id'),
            name = $el.attr('name');

        if (!id) {
            if (!formid) {
                log.error('Textarea or parent form needs an id', $el, $form);
                return false;
            }
            if (!name) {
                log.error('Textarea needs a name', $el);
                return false;
            }
            id = formid + '_' + name;
            if ($('#'+id).length > 0) {
                log.error('Textarea needs an id', $el);
                return false;
            }
            $el.attr({id: id});
        }

        // read configuration
        cfg = {};
        cfg_str = $el.data('tinymce-json');
        if (!cfg_str) {
            log.info('data-tinymce-json empty, using default config', $el);
            cfg_str = '{}';
        }
        /*cfg = JSON.parse(cfg_str);*/
        cfg = cfg_str;  /* data seems already to parse this */
        cfg.elements = id;
        cfg.mode = 'exact';
        tinyMCE.init(cfg);
        return $el;
    };

    pattern = {
        markup_trigger: 'form textarea.edit-tinymce',
        initialised_class: 'edit-tinymce',
        init: init
    };
    return pattern;
});

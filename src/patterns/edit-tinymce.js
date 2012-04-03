define([
    'require',
    '../../lib/tiny_mce/tiny_mce',
    '../logging'
], function(require) {
    var log = require('../logging').getLogger('edit-tinymce');

    var init = function($el, opts) {
        // make sure the textarea has an id
        var id = $el.attr('id');
        if (!id) {
            var $form = $el.parents('form'),
                formid = $el.parents('form').attr('id'),
                name = $el.attr('name');
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
        var cfg = {},
            cfg_str = $el.data('tinymce-json');
        if (!cfg_str) {
            log.info('data-tinymce-json empty, using default config', $el);
            cfg_str = '{}';
        }
        /*cfg = JSON.parse(cfg_str);*/
        cfg = cfg_str;  /* data seems already to parse this */
        cfg.elements = id;
        cfg.mode = 'exact';
        var TinyMCE_minimal = {
            getInfo : function() {
                return {
                        longname : 'minimal',
                        author : 'minimal',
                        authorurl : 'http://www.yoursite.com',
                        infourl : 'http://www.yoursite.com/docs/template.html',
                        version : "1.0"
                };
            },
        };
        tinyMCE.addTheme("minimal", TinyMCE_minimal);
        tinyMCE.init(cfg);
        return $el;
    };

    var pattern = {
        markup_trigger: 'form textarea.edit-tinymce',
        initialised_class: 'edit-tinymce',
        init: init
    };
    return pattern;
});

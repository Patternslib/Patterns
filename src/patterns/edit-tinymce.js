define([
    'require',
    '../../lib/tiny_mce/tiny_mce_src',
    '../lib/ajax',
    '../logging'
], function(require) {
    var log = require('../logging').getLogger('edit-tinymce'),
        ajax = require('../lib/ajax');

    var init = function($el, opts) {
        var $form = $el.parents('form'),
            $resetbtn = $form.find('[type=reset]'),
            id = $el.attr('id');

        // make sure the textarea has an id
        if (!id) {
            var formid = $form.attr('id'),
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
        var cfg = $el.data('tinymce-json');
        if (!cfg) {
            log.info('data-tinymce-json empty, using default config', $el);
            cfg = '{}';
        }
        cfg.elements = id;
        cfg.mode = 'exact';
        cfg.readonly = Boolean($el.attr('readonly'));

        // initialize editor
        var tinymce = tinyMCE.init(cfg);

        // ajaxify form
        var ajaxopts = {
            beforeSerialize: (function(id) {
                return function() {
                    tinyMCE.editors[id].save();
                };
            })(id)
        };

        $form.on('submit', function(ev) {
            ev.preventDefault();
            ajax($form, ajaxopts);
        });

        // XXX: we hijack the reset button, but currently only reset
        // the tiny textarea.
        $resetbtn.on('click', (function(id) {
            return function(ev) {
                ev.preventDefault();
                tinyMCE.editors[id].load();
            };
        })(id));

        return $el;
    };

    var pattern = {
        markup_trigger: 'form textarea.edit-tinymce',
        initialised_class: 'edit-tinymce',
        init: init
    };
    return pattern;
});

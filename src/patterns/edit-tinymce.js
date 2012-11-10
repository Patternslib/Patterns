define([
    'jquery',
    '../lib/ajax',
    "../core/parser",
    '../core/logging',
    '../registry',
    'tinymce'
], function($, ajax, Parser, logging, registry) {
    var log = logging.getLogger('editTinyMCE'),
        parser = new Parser("edit-tinymce");

    parser.add_argument('theme-baseurl');

    var _ = {
        name: "editTinyMCE",
        trigger: 'form textarea.pat-edit-tinymce',
        init: function($el, opts) {
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
                cfg = {};
            }
            cfg.elements = id;
            cfg.mode = 'exact';
            cfg.readonly = Boolean($el.attr('readonly'));
            
            // get arguments
            args = parser.parse($el, opts);

            if (args.themeBaseurl && cfg.theme &&
                !tinyMCE.ThemeManager.urls[cfg.theme]) {
                log.info('loading tinymce theme ' + cfg.theme);
                tinyMCE.ThemeManager.load(cfg.theme, args.themeBaseurl + '/' +
                    cfg.theme + '/editor_template' + tinyMCE.suffix + '.js');
            }

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
            $resetbtn.on('click.pat-edit-tinymce', (function(id) {
                return function(ev) {
                    ev.preventDefault();
                    tinyMCE.editors[id].load();
                };
            })(id));

            return $el;
        },
        destroy: function($el) {
            // XXX
        }
    };

    registry.register(_);
    return _;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

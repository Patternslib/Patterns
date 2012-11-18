define([
    'jquery',
    '../lib/ajax',
    "../core/parser",
    '../core/logging',
    '../registry',
    "../utils",
    'URIjs/URI',
    'tinymce'
], function($, ajax, Parser, logging, registry, utils, URI) {
    var log = logging.getLogger('editTinyMCE'),
        parser = new Parser("edit-tinymce");

    parser.add_argument('tinymce-baseurl');

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
            var args = parser.parse($el, opts);

            if (!args.tinymceBaseurl) {
                log.error('tinymce-baseurl has to point to TinyMCE resources');
                return false;
            }

            var u = new URI();
            u._parts.query = null;

            // handle rebasing of own urls if we were injected
            var parents = $el.parents().filter(function() {
                return $(this).data('pat-injected');
            });
            if (parents.length)
                u = URI(parents.first().data('pat-injected').origin).absoluteTo(u);
            if (cfg.content_css)
                cfg.content_css = URI(cfg.content_css).absoluteTo(u).toString();
            tinyMCE.baseURL = URI(args.tinymceBaseurl).absoluteTo(u).toString();
            tinyMCE.baseURI = new tinyMCE.util.URI(tinyMCE.baseURL);

            var $tinymce,
                modified = utils.debounce(function() {
                    $tinymce.off('.pat-tinymce');
                    $form.removeClass("saved").addClass("modified");
                    $form.data({modified: true});
                    log.debug('modified');
                }, 400);
            $form.on('pat-ajax-success.pat-tinymce', function() {
                $tinymce.on('keyup.pat-tinymce', modified);
                $form.removeClass("modified").addClass("saved");
                $form.data({
                    lastSaved: new Date(),
                    modified: false
                });
                log.debug('saved');
            });
            cfg.oninit = function() {
                $tinymce = $('#' + id + '_ifr').contents().find('#tinymce');
                $tinymce.on('keyup.pat-tinymce', modified);
            };

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

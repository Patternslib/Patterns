// auto-suggest docs:
// http://code.drewwilson.com/entry/autosuggest-jquery-plugin
// Changes to previous
// - prefill and ashtmlid in data-auto-suggest-config
define([
    'jquery',
    '../logging',
    '../core/parser',
    '../registry',
    '../utils',
    '../3rdparty/jquery.autoSuggest'
], function($, logging, Parser, registry, utils) {
    var log = logging.getLogger('autosuggest');

    var parser = new Parser();
    parser.add_argument('words');
    parser.add_argument('prefill');
    parser.add_argument('asHtmlId', false);

    var _ = {
        name: 'autoSuggest',
        trigger: "input.auto-suggest",
        init: function($el, opts) {
            if ($el.length > 1) {
                return $el.map(function() {
                    return _.init($(this), opts);
                });
            }

            var cfg = $.extend({}, _.extractConfig($el), opts);
            $el.data("patterns.autoSuggest", cfg);

            $el.on('keydown.patternAutoSuggest', _.onKeyDown);

            // are we autosubmit?
            var autosubmit = $el.is('.auto-submit') ||
                    ($el.parents('.auto-submit').length > 0);
            log.debug('auto-submit', autosubmit, $el);

            var $form;
            if (autosubmit) {
                $form = $el.parents('form');
                var submit_debounced = utils.debounce(function() {
                    $form.submit();
                }, 400);
                cfg.selectionAdded = function($item) {
                    log.debug('submit because selection was added', $item);
                    // trigger the form
                    submit_debounced();
                };
                cfg.selectionRemoved = function($item) {
                    // ignore removal request if readonly
                    if ($el.attr('readonly')) return;
                    log.debug('submit because selection was removed', $item);
                    // trigger the form
                    $item.remove();
                    submit_debounced();
                };
            }

            var data = cfg.words.map(function(word) {
                return {value: word, name: word};
            });

            $el.autoSuggest(data, cfg);

            return $el;
        },
        destroy: function($el) {
            $el.off('.patternAutoSuggest');
            $el.data('patterns.autoSuggest', null);
            // XXX: destroy the jqueryPlugin
        },

        parser: parser,
        extractConfig: function($el) {
            var cfg = {
                selectedValueProp: "name",
                searchObjProp: "name",
                startText: $el.attr('readonly') ? "" : "Click to add labels"
            };

            // fetch config from first parent found
            var $cfg = $el.parents('[data-auto-suggest-config]:first');
            cfg = $.extend(
                {}, cfg, _.parser.parse($cfg.attr('data-auto-suggest-config')));

            if (cfg.prefill && (cfg.prefill.slice(0,1) === ',')) {
                cfg.prefill = cfg.prefill.slice(1);
            }

            return cfg;
        },

        onKeyDown: function(ev) {
            var $this = $(this);
            if (ev.which === 13) {
                var $results = $this.parents('.as-selections').next();
                ev.preventDefault();
                // skip ENTER->comma translation, if selection is active
                if (($results.is(':visible')) &&
                    ($results.find('.active').length > 0)) return;
                var newev = $.Event("keydown");
                newev.ctrlKey = false;
                newev.which = 188;
                newev.keyCode = 188;
                $this.trigger(newev);
            }
        }
    };
    return registry.register(_);
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

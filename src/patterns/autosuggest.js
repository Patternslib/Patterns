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
    'jquery_autosuggest'
], function($, logging, Parser, registry, utils) {
    var log = logging.getLogger('autosuggest');

    var parser = new Parser("autosuggest");
    parser.add_argument('words');
    parser.add_argument('pre-fill');
    parser.add_argument('as-html-id', false);
    parser.add_argument('selected-value-prop', "name");
    parser.add_argument('search-obj-prop', "name");
    parser.add_argument('start-text', "Enter text");

    var _ = {
        name: 'autosuggest',
        trigger: "input.pat-autosuggest",
        init: function($el, opts) {
            if ($el.length > 1) {
                return $el.map(function() {
                    return _.init($(this), opts);
                });
            }

            // fetch config from first parent found
            var cfg = _.parser.parse($el, opts);
            if ($el.attr('readonly')) {
                cfg.startText = "";
            }

            if (cfg.preFill && (cfg.preFill.slice(0,1) === ',')) {
                cfg.preFill = cfg.preFill.slice(1);
            }

            $el.data("patterns.autosuggest", cfg);

            $el.on('keydown.pat-autosuggest', _.onKeyDown);

            // are we autosubmit?
            var autosubmit = $el.is('.pat-autosubmit') ||
                    ($el.parents('.pat-autosubmit').length > 0) ||
                    $el.is('.pat-autosubmit2') ||
                    ($el.parents('.pat-autosubmit2').length > 0);
            log.debug('autosubmit', autosubmit, $el);

            // XXX: this feels hacky and is either needed for fast
            // typers in which case it should be in autosubmit or to
            // work around triggers in autoSuggest.
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

            var data = cfg.words.split(/\s*,\s*/).map(function(word) {
                return {value: word, name: word};
            });

            $el.autoSuggest(data, cfg);

            return $el;
        },
        destroy: function($el) {
            $el.off('.pat-autosuggest');
            $el.data('patterns.autosuggest', null);

            // XXX: destroy the jqueryPlugin, unfortunately it doesn't
            // support this as of now
        },

        parser: parser,

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
    registry.register(_);
    return _;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

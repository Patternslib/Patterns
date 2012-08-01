// auto-suggest docs:
// http://code.drewwilson.com/entry/autosuggest-jquery-plugin
define([
    'require',
    '../logging',
    '../utils',
    '../../lib/jquery.autoSuggest'
], function(require) {
    var log = require('../logging').getLogger('autosuggest'),
        utils = require('../utils');

    var init = function($el, opts) {
        // fetch words for auto-suggestion
        var $cfg = $el.parents('[data-auto-suggest-config]:first');

        // XXX: do this properly
        var words = (($cfg.data('auto-suggest-config') || '')
                     .split(':')[1] || '').split(/\s*,\s*/);
        var data = words.map(function(word) {
            return {value: word, name: word};
        });
        var $prefillcfg = $el.parents('[data-auto-suggest-prefill]:first');
        var prefill = $prefillcfg.data('auto-suggest-prefill');
        if (prefill === undefined) prefill = '';
        if (prefill.slice(0,1) === ',') prefill = prefill.slice(1);

        var $asHtmlIDcfg = $el.parents('[data-auto-suggest-ashtmlid]:first');
        var asHtmlID = $asHtmlIDcfg.data('auto-suggest-ashtmlid') || false;

        // are we autosubmit?
        var autosubmit = $el.is('.auto-submit') ||
                ($el.parents('.auto-submit').length > 0);
        log.debug('auto-submit', autosubmit, $el);

        $el.on('keydown', function(ev) {
            if (ev.which === 13) {
                var $results = $el.parents('.as-selections').next();
                ev.preventDefault();
                // skip ENTER->comma translation, if selection is active
                if (($results.is(':visible')) &&
                    ($results.find('.active').length > 0)) return;
                var newev = $.Event("keydown");
                newev.ctrlKey = false;
                newev.which = 188;
                newev.keyCode = 188;
                $el.trigger(newev);
            }
        });

        var cfg = {
            asHtmlID: asHtmlID,
            preFill: prefill,
            selectedValueProp: "name",
            searchObjProp: "name",
            startText: $el.attr('readonly') ? "" : "Click to add labels"
        };
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

        $el.autoSuggest(data, cfg);
    };

    var pattern = {
        markup_trigger: "input.auto-suggest",
        initialised_class: "auto-suggest",
        register_jquery_plugin: false,
        init: init
    };

    return pattern;
});

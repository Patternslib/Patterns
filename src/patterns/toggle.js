/**
 * @license
 * Patterns @VERSION@ toggle - toggle class on click
 *
 * Copyright 2012 Simplon B.V.
 * Copyright 2011 Humberto Sermeño
 * Copyright 2011 SYSLAB.COM GmbH
 */
define([
    'jquery',
    "../registry",
    '../core/logging',
    "../core/parser",
    "../core/store"
], function($, patterns, logging, Parser, store) {
    var log = logging.getLogger('pat.toggle'),
        parser = new Parser("toggle");

    parser.add_argument("selector");
    parser.add_argument("attr", "class");
    parser.add_argument("value");
    parser.add_argument("store", "none", ["none", "session", "local"]);

    var toggle = {
        name: "toggle",
        trigger: ".pat-toggle",

        init: function($el) {
            return $el.each(function() {
                var $trigger = $(this),
                    options = toggle._validateOptions(this, parser.parse($trigger, true)),
                    state = {toggled: false, options: options},
                    i, option;

                if (!options.length)
                    return;

                if (options[0].store!=="none") {
                    storage=(options[0].store==="local" ? store.local : store.session)(toggle.name);
                    if (storage.get(this.id))
                        state.toggled=true;
                }

                if (state.toggled)
                    for (i=0; i<options.length; i++)
                        toggle._update(options[i].selector, options[i].attr, options[i].value);

                $trigger
                    .off(".toggle")
                    .data("patternToggle", state)
                    .on("click.toggle", toggle.onClick);
            });
        },

        _validateOptions: function(trigger, options) {
            var correct=[],
                i, option, store_error;

            if (!options.length)
                return correct;

            if (options[0].store!=="none") {
                if (!trigger.id) {
                    log.warn("state persistance requested, but element has no id");
                    options[0].store="none";
                } else if (!store.supported) {
                    store_error="browser does not support webstorage";
                    log.warn("state persistance requested, but browser does not support webstorage");
                    options[0].store="none";
                }
            }


            for (i=0; i<options.length; i++) {
                option=options[i];
                if (i && option.store!=="none") {
                    log.warn("store option can only be set on first argument");
                    option.store="none";
                }

                if (!option.selector || !option.attr || !option.value)
                    log.error("Toggle pattern requires selector, attr and value.");
                else
                    correct.push(option);
            }
            return correct;
        },

        onClick: function(event) {
            var $trigger = $(this),
                state = $trigger.data("patternToggle"),
                option, i;

            state.toggled=!state.toggled;
            $trigger.data("patternToggle", state);

            if (state.options[0].store!=="none") {
                var storage=(state.options[0].store==="local" ? store.local : store.session)(toggle.name);
                if (state.toggled)
                    storage.set(this.id, true);
                else
                    storage.remove(this.id);
            }

            for (i=0; i<state.options.length; i++) {
                option=state.options[i];
                toggle._update(option.selector, option.attr, option.value);
            }
            event.preventDefault();
        },

        _update: function(selector, attr, value) {
            var $targets = $(selector),
                $target;

            if (!$targets.length)
                return;

            if (attr==="class") {
                $targets.toggleClass(value);
            } else {
                for (var i=0; i<$targets.length; i++) {
                    $target=$targets.eq(i);
                    if ($target.attr(attr)===attr) {
                        $target.removeAttr(attr);
                    } else {
                        $target.attr(attr, value);
                    }
                }
            }
        }
    };

    patterns.register(toggle);
    return toggle; // XXX for tests only
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

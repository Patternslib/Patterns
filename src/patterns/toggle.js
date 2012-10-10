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
    '../logging',
    "../core/parser"
], function($, logging, Parser) {
    var log = logging.getLogger('switch'),
        parser = new Parser();

    parser.add_argument("selector");
    parser.add_argument("attr", "class");
    parser.add_argument("value");

    var toggle = {
        initContent: function(root) {
            $("[data-toggle]", root).on("click", toggle.onClick);
        },

        onClick: function(event) {
            var $trigger = $(this),
                options, option, $targets, $target, i;

            options=parser.parse($trigger.data("toggle"));
            if (!Array.isArray(options)) 
                options = [options];
            for (i=0; i<options.length; i++) {
                option=options[i];
                if (option.selector && option.attr && option.value)
                    toggle._update(option.selector, option.attr, option.value);
                else
                    log.error('Toggle pattern requires selector, attr and value.');
            }
            event.preventDefault();
        },

        _update: function(selector, attr, value) {
            var $targets = $(selector);

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

    return toggle;
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

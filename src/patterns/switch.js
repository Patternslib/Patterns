define([
        "jquery",
        "../registry",
        "../jqplugins/switch"
], function($, patterns) {
    var switcher = {
        name: "switch",
        trigger: "[data-switch]",

        init: function($el) {
            return $el.patternSwitch();
        }
    };

    patterns.register(switcher);
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 sts=4 expandtab

define([
        "jquery",
        "../registry",
        "../jqplugins/autosubmit"
], function($, patterns) {
    var autosubmit = {
        name: "autosubmit",
        trigger: "[data-autosubmit]",

        init: function($root) {
            $root
                .find("input[type-search]").andSelf()
                .patternAutosubmit();
        }
    };

    patterns.register(autosubmit);
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

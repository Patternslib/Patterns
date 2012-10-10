define([
        "jquery",
        "../registry",
        "../jqplugins/checklist"
], function($, patterns) {
    var checklist = {
        name: "checklist",
        trigger: "[data-checklist]",

        init: function($root) {
            $root.patternChecklist();
        }
    };

    patterns.register(checklist);
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

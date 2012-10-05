define([
    '../jqplugins/checklist'
], function() {
    var checklist = {
        initContent: function(root) {
            $("[data-checklist]").patternChecklist();
        }
    };

    return checklist;
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

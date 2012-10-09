define([
    '../jqplugins/switch'

], function() {
    var switcher = {
        initContent: function(root) {
            $("[data-switch]", root).patternSwitch();
        }
    };
    return switcher;
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 sts=4 expandtab

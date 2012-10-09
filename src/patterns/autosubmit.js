define([
    '../jqplugins/autosubmit'
], function() {
    var autosubmit = {
        initContent: function(root) {
            $("[data-autosubmit]", root)
                .find("input[type-search]").andSelf()
                .patternAutosubmit();
        }
    };

    return autosubmit;
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

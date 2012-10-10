// XXX This pattern has an undeclared dependency on jQuery UI
define([
    'jquery',
    "../registry"
], function($, patterns) {
    var sorting = {
        name: "sorting",
        trigger: "ul.sorting",

        init: function($el) {
            return $el.sortable({
                'axis': 'y',
                'items': 'li',
                'update': function(event, ui){
                    var $this = $(this);
                    var order = $this.sortable("serialize");

                    $.post($this.attr("data-injection"), order);
                }
            });
        }
    };

    patterns.register(sorting);
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

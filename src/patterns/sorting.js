// XXX This pattern has an undeclared dependency on jQuery UI
define([
    'jquery'
], function($) {
    var sorting = {
        initContent: function(root) {
            var $root = $(root),
                $sorting = $root.find('ul.sorting');

            if ($sorting.length > 0) {
                $sorting.sortable({
                    'axis': 'y',
                    'items': 'li',
                    'update': function(event, ui){
                        var $this = $(this);
                        var order = $this.sortable("serialize");

                        $.post($this.attr("data-injection"), order);
                    }
                });
            }
            return $root;
        }
    };

    return sorting;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

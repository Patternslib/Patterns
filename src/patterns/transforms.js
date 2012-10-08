define([
    'jquery'
], function($) {
    var transforms = {
        initContent: function(root) {
            var $root = $(root);
            if ($root.is(".record-history"))
                $root.addClass('cant-touch-this');

            $(".jsOnly", root).show();

            $("legend:not(.cant-touch-this)", root).each(function() {
                $(this).replaceWith('<p class="legend">'+$(this).html()+'</p>');
            });
        }
    };

    return transforms;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

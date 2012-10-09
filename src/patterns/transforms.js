define([
    'jquery'
], function($) {
    var transforms = {
        convertToIframes: function($root) {
            $root.find("object[type=text/html]").each(function() {
                var $object = $(this),
                    $iframe = $("<iframe allowtransparency='true'/>");

                $iframe
                    .attr("id", $object.attr("id"))
                    .attr("class", $object.attr("class"))
                    .attr("src", $object.attr("data"))
                    .attr("frameborder", "0")
                    .attr("style", "background-color:transparent");
                $object.replaceWith($iframe);
            });
        },


        initContent: function(root) {
            var $root = $(root);
            if ($root.is(".record-history"))
                $root.addClass('cant-touch-this');

            $("legend:not(.cant-touch-this)", root).each(function() {
                $(this).replaceWith('<p class="legend">'+$(this).html()+'</p>');
            });

            // Replace objects with iframes for IE 8 and older.
            if ($.browser.msie ) {
                var version = Number( $.browser.version.split(".", 2).join(""));
                if (version<=80)
                    transforms.convertToIframes($root);
            }
        }
    };

    return transforms;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

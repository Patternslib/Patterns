define([
    "jquery"
], function($) {
    var transforms = {
        name: "transforms",

        _convertToIframes: function($root) {
            $root.find("object[type='text/html']").each(function() {
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

        transform: function($root) {
            // XXX: cant-touch-this is no more, so every legend should be
            // transformed?
            $root.find("legend:not(.cant-touch-this)").each(function() {
                $(this).replaceWith("<p class='legend'>"+$(this).html()+"</p>");
            });

            // Replace objects with iframes for IE 8 and older.
            if ($.browser.msie ) {
                var version = Number( $.browser.version.split(".", 2).join(""));
                if (version<=80)
                    transforms._convertToIframes($root);
            }
        }
    };

    return transforms;

});

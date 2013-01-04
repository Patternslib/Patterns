define([
    "jquery"
], function($) {
    var transforms = {
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

        transformContent: function($root) {
            $root
                .filter(".record-history")
                .add(".record-history", $root)
                .addClass("cant-touch-this");

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

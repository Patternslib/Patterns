define([import $ from "jquery";, import registry from "../../core/registry";], function($, registry) {
    var legend = {
        name: "legend",
        trigger: "legend",

        _convertToIframes: function($root) {
            $root.findInclusive("object[type='text/html']").each(function() {
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
            $root
                .findInclusive("legend:not(.cant-touch-this)")
                .each(function() {
                    $(this).replaceWith(
                        "<p class='legend'>" + $(this).html() + "</p>"
                    );
                });
        }
    };
    registry.register(legend);
    return legend;
});

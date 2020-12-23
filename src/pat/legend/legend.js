import $ from "jquery";
import registry from "../../core/registry";
import utils from "../../core/utils";
import dom from "../../core/dom";

var legend = {
    name: "legend",
    trigger: "legend",

    _convertToIframes: function ($root) {
        $root.findInclusive("object[type='text/html']").each(function () {
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

    transform: function ($root) {
        const root = utils.jqToNode($root);
        const all = dom.querySelectorAllAndMe(
            root,
            "legend:not(.cant-touch-this)"
        );
        for (const el of all) {
            $(el).replaceWith("<p class='legend'>" + $(el).html() + "</p>");
        }
    },
};
registry.register(legend);
export default legend;

define([
    "jquery",
    "../registry"
], function($, registry) {
    var _ = {
        name: "expandable",
        trigger: "ul.pat-expandable",
        init: function($el) {

            // XXX: data-pat-expandable with load-content: instead of injection

            // make sure inject folders have a ul
            $el.find(".folder[data-pat-inject]:not(:has(ul))").append("<ul />");

            // find all folders that contain a ul
            var $folders = $el.find("li.folder:has(ul)");

            // inject span.toggle as first child of each folder
            $folders.prepend("<span class='toggle'></span>");

            // all folders are implicitly closed
            $folders.filter(":not(.open,.closed)").addClass("closed");

            // trigger open event for open folders
            $folders.filter(".open").trigger("patterns-folder-open");

            // wire spans as control elements
            var $ctrls = $el.find("span.toggle");
            $ctrls.each(function() {
                var $ctrl = $(this),
                    $folder = $ctrl.parent();
                $ctrl.on("click.pat-expandable", function() {
                    $folder.toggleClass("open closed");
                    $folder.filter(".open").trigger("patterns-folder-open");
                });
            });
            return $el;
        }
    };
    registry.register(_);
    return _;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

define([
    "jquery",
    "pat-registry",
    "pat-logger",
    "pat-parser"
], function($, patterns, logger, Parser) {
    var parser = new Parser("sortable");

    parser.add_argument("selector", "li");

    var _ = {
        name: "sortable",
        trigger: ".pat-sortable",

        init: function($el) {
            if ($el.length > 1)
                return $el.each(function() { _.init($(this)); });

            var cfgs = parser.parse($el, true);
            $el.data("patterns.sortable", cfgs);

            // use only direct descendants to support nested lists
            var $sortables = $el.children().filter(cfgs[0].selector);

            // add handles and make them draggable for HTML5 and IE8/9
            // it has to be an "a" tag (or img) to make it draggable in IE8/9
            var $handles = $("<a href=\"#\" class=\"handle\"></a>").appendTo($sortables);
            if("draggable" in document.createElement("span"))
                $handles.attr("draggable", true);
            else
                $handles.bind("selectstart", function(event) {
                    event.preventDefault();
                });

            // invisible scroll activation areas
            var scrollup = $("<div id=\"pat-scroll-up\">&nbsp;</div>"),
                scrolldn = $("<div id=\"pat-scroll-dn\">&nbsp;</div>"),
                scroll = $().add(scrollup).add(scrolldn);

            scrollup.css({ top: 0 });
            scrolldn.css({ bottom: 0 });
            scroll.css({
                position: "fixed", zIndex: 999999,
                height: 32, left: 0, right: 0
            });

            scroll.bind("dragover", function(event) {
                event.preventDefault();
                if ($("html,body").is(":animated")) return;

                var newpos = $(window).scrollTop() +
                    ($(this).attr("id")==="pat-scroll-up" ? -32 : 32);

                $("html,body").animate({scrollTop: newpos}, 50, "linear");
            });

            $handles.bind("dragstart", function(event) {
                // Firefox seems to need this set to any value
                event.originalEvent.dataTransfer.setData("Text", "");
                event.originalEvent.dataTransfer.effectAllowed = ["move"];
                if ("setDragImage" in event.originalEvent.dataTransfer)
                    event.originalEvent.dataTransfer.setDragImage(
                        $(this).parent()[0], 0, 0);
                $(this).parent().addClass("dragged");

                // Scroll the list if near the borders
                $el.bind("dragover.pat-sortable", function(event) {
                    event.preventDefault();
                    if ($el.is(":animated")) return;

                    var pos = event.originalEvent.clientY + $("body").scrollTop();

                    if (pos - $el.offset().top < 32)
                        $el.animate({scrollTop: $el.scrollTop()-32}, 50, "linear");
                    else if ($el.offset().top+$el.height() - pos < 32)
                        $el.animate({scrollTop: $el.scrollTop()+32}, 50, "linear");
                });

                // list elements are only drop targets when one element of the
                // list is being dragged. avoids dragging between lists.
                $sortables.bind("dragover.pat-sortable", function(event) {
                    var $this = $(this),
                        midlineY = $this.offset().top - $(document).scrollTop() +
                            $this.height()/2;

                    // bail if dropping on self
                    if ($(this).hasClass("dragged"))
                        return;

                    $this.removeClass("drop-target-above drop-target-below");
                    if (event.originalEvent.clientY > midlineY)
                        $this.addClass("drop-target-below");
                    else
                        $this.addClass("drop-target-above");
                    event.preventDefault();
                });

                $sortables.bind("dragleave.pat-sortable", function() {
                    $sortables.removeClass("drop-target-above drop-target-below");
                });

                $sortables.bind("drop.pat-sortable", function(event) {
                    if ($(this).hasClass("dragged"))
                        return;

                    if ($(this).hasClass("drop-target-below"))
                        $(this).after($(".dragged"));
                    else
                        $(this).before($(".dragged"));
                    $(this).removeClass("drop-target-above drop-target-below");
                    event.preventDefault();
                });

                //XXX: Deactivate document scroll areas, as DnD affects only
                //     scrolling of parent element
                //scroll.appendTo("body");
            });

            $handles.bind("dragend", function() {
                $(".dragged").removeClass("dragged");
                $sortables.unbind(".pat-sortable");
                $el.unbind(".pat-sortable");
                $("#pat-scroll-up, #pat-scroll-dn").detach();
            });

            return $el;
        }
    };

    patterns.register(_);
    return _;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

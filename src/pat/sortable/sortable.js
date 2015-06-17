define([
    "jquery",
    "pat-base",
    "pat-parser"
], function($, Base, Parser) {
    var parser = new Parser("sortable");
    parser.addArgument("selector", "li");

    return Base.extend({
        name: "sortable",
        trigger: ".pat-sortable",

        init: function ($el) {
            this.options = parser.parse(this.$el, true);
            $el.data("patterns.sortable", this.options); // XXX: Necessary?
            // use only direct descendants to support nested lists
            this.$sortables = $el.children().filter(this.options[0].selector);
            this.addHandles().initScrolling();
        },

        addHandles: function () {
            /* Add handles and make them draggable for HTML5 and IE8/9
             * it has to be an "a" tag (or img) to make it draggable in IE8/9
             */
            var $handles = $("<a href=\"#\" class=\"handle\"></a>").appendTo(this.$sortables);
            if("draggable" in document.createElement("span")) {
                $handles.attr("draggable", true);
            } else {
                $handles.bind("selectstart", function(event) {
                    event.preventDefault();
                });
            }
            $handles.bind("dragstart", this.onDragStart.bind(this));
            $handles.bind("dragend", this.onDragEnd.bind(this));
            return this;
        },

        initScrolling: function () {
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
                if ($("html,body").is(":animated")) { return; }
                var newpos = $(window).scrollTop() + ($(this).attr("id")==="pat-scroll-up" ? -32 : 32);
                $("html,body").animate({scrollTop: newpos}, 50, "linear");
            });
            return this;
        },

        onDragEnd: function (event) {
            $(".dragged").removeClass("dragged");
            this.$sortables.unbind(".pat-sortable");
            this.$el.unbind(".pat-sortable");
            $("#pat-scroll-up, #pat-scroll-dn").detach();
        },

        onDragStart: function (event) {
            var $handle = $(event.target),
                $draggable = $handle.parent();

            // Firefox seems to need this set to any value
            event.originalEvent.dataTransfer.setData("Text", "");
            event.originalEvent.dataTransfer.effectAllowed = ["move"];
            if ("setDragImage" in event.originalEvent.dataTransfer) {
                event.originalEvent.dataTransfer.setDragImage($draggable[0], 0, 0);
            }
            $draggable.addClass("dragged");

            // Scroll the list if near the borders
            this.$el.bind("dragover.pat-sortable", function(event) {
                event.preventDefault();
                if (this.$el.is(":animated")) return;

                var pos = event.originalEvent.clientY + $("body").scrollTop();

                if (pos - this.$el.offset().top < 32)
                    this.$el.animate({scrollTop: this.$el.scrollTop()-32}, 50, "linear");
                else if (this.$el.offset().top+this.$el.height() - pos < 32)
                    this.$el.animate({scrollTop: this.$el.scrollTop()+32}, 50, "linear");
            }.bind(this));

            // list elements are only drop targets when one element of the
            // list is being dragged. avoids dragging between lists.
            this.$sortables.bind("dragover.pat-sortable", function(event) {
                var $this = $(this),
                    midlineY = $this.offset().top - $(document).scrollTop() + $this.height()/2;

                if ($(this).hasClass("dragged")) {
                    // bail if dropping on self
                    return;
                }
                $this.removeClass("drop-target-above drop-target-below");
                if (event.originalEvent.clientY > midlineY)
                    $this.addClass("drop-target-below");
                else
                    $this.addClass("drop-target-above");
                event.preventDefault();
            });

            this.$sortables.bind("dragleave.pat-sortable", function() {
                this.$sortables.removeClass("drop-target-above drop-target-below");
            }.bind(this));

            this.$sortables.bind("drop.pat-sortable", function(event) {
                var $sortable = $(this);
                if ($sortable.hasClass("dragged"))
                    return;

                if ($sortable.hasClass("drop-target-below"))
                    $sortable.after($(".dragged"));
                else
                    $sortable.before($(".dragged"));
                $sortable.removeClass("drop-target-above drop-target-below");
                event.preventDefault();
            });
        }
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

import $ from "jquery";
import Base from "../../core/base";
import Parser from "../../core/parser";


var parser = new Parser("sortable");
parser.addArgument("selector", "li");
parser.addArgument("drag-class", "dragged"); // Class to apply to item that is being dragged.
parser.addArgument("drop"); // Callback function for when item is dropped (null)

// BBB for the mockup sortable pattern.
parser.addAlias("dragClass", "drag-class");

export default Base.extend({
    name: "sortable",
    trigger: ".pat-sortable",

    init: function($el) {
        this.$form = this.$el.closest("form");
        this.options = parser.parse(this.$el, false);
        this.recordPositions()
            .addHandles()
            .initScrolling();
        this.$el.on("pat-update", this.onPatternUpdate.bind(this));
    },

    onPatternUpdate: function(ev, data) {
        /* Handler which gets called when pat-update is triggered within
         * the .pat-sortable element.
         */
        if (data.pattern == "clone") {
            this.recordPositions();
            data.$el.on("dragstart", this.onDragStart.bind(this));
            data.$el.on("dragend", this.onDragEnd.bind(this));
        }
        return true;
    },

    recordPositions: function() {
        // use only direct descendants to support nested lists
        this.$sortables = this.$el.children().filter(this.options.selector);
        this.$sortables.each(function(idx, $el) {
            $(this).data("patterns.sortable", { position: idx });
        });
        return this;
    },

    addHandles: function() {
        /* Add handles and make them draggable for HTML5 and IE8/9
         * it has to be an "a" tag (or img) to make it draggable in IE8/9
         */
        var $sortables_without_handles = this.$sortables.filter(function() {
            return $(this).find(".sortable-handle").length === 0;
        });
        var $handles = $(
            '<a href="#" class="sortable-handle">⇕</a>'
        ).appendTo($sortables_without_handles);
        if ("draggable" in document.createElement("span")) {
            $handles.attr("draggable", true);
        } else {
            $handles.on("selectstart", function(ev) {
                ev.preventDefault();
            });
        }
        $handles.on("dragstart", this.onDragStart.bind(this));
        $handles.on("dragend", this.onDragEnd.bind(this));
        return this;
    },

    initScrolling: function() {
        // invisible scroll activation areas
        var scrollup = $('<div id="pat-scroll-up">&nbsp;</div>'),
            scrolldn = $('<div id="pat-scroll-dn">&nbsp;</div>'),
            scroll = $()
                .add(scrollup)
                .add(scrolldn);
        scrollup.css({ top: 0 });
        scrolldn.css({ bottom: 0 });
        scroll.css({
            position: "fixed",
            zIndex: 999999,
            height: 32,
            left: 0,
            right: 0
        });
        scroll.on("dragover", function(ev) {
            ev.preventDefault();
            if ($("html,body").is(":animated")) {
                return;
            }
            var newpos =
                $(window).scrollTop() +
                ($(this).attr("id") === "pat-scroll-up" ? -32 : 32);
            $("html,body").animate({ scrollTop: newpos }, 50, "linear");
        });
        return this;
    },

    onDragEnd: function(ev) {
        var $dragged = $(ev.target).parent();
        $dragged.removeClass(this.options.dragClass);
        this.$sortables.off(".pat-sortable");
        this.$el.off(".pat-sortable");
        $("#pat-scroll-up, #pat-scroll-dn").detach();
        var change = this.submitChangedAmount(
            $(ev.target).closest(".sortable")
        );
        // Call the optionally passed-in callback function
        if (this.options.drop) {
            this.options.drop($dragged, change);
        }
    },

    submitChangedAmount: function($dragged) {
        /* If we are in a form, then submit the form with the right amount
         * that the sortable element was moved up or down.
         */
        var $amount_input = this.$form.find(".sortable-amount");
        if ($amount_input.length === 0) {
            return;
        }
        var old_position = $dragged.data("patterns.sortable").position;
        this.recordPositions();
        var new_position = $dragged.data("patterns.sortable").position;
        var change = Math.abs(new_position - old_position);
        var direction = (new_position > old_position && "down") || "up";
        if (this.$form.length > 0) {
            $amount_input.val(change);
            if (direction == "up") {
                $dragged.find(".sortable-button-up").click();
            } else {
                $dragged.find(".sortable-button-down").click();
            }
        }
        return change;
    },

    onDragStart: function(ev) {
        var $handle = $(ev.target),
            $dragged = $handle.parent(),
            that = this;
        if (typeof ev.originalEvent !== "undefined") {
            // Firefox seems to need this set to any value
            ev.originalEvent.dataTransfer.setData("Text", "");
            ev.originalEvent.dataTransfer.effectAllowed = ["move"];
            if ("setDragImage" in ev.originalEvent.dataTransfer) {
                ev.originalEvent.dataTransfer.setDragImage(
                    $dragged[0],
                    0,
                    0
                );
            }
        }
        $dragged.addClass(this.options.dragClass);

        // Scroll the list if near the borders
        this.$el.on(
            "dragover.pat-sortable",
            function(ev) {
                ev.preventDefault();
                if (this.$el.is(":animated")) return;

                var pos = ev.originalEvent.clientY + $("body").scrollTop();
                if (pos - this.$el.safeOffset().top < 32)
                    this.$el.animate(
                        { scrollTop: this.$el.scrollTop() - 32 },
                        50,
                        "linear"
                    );
                else if (
                    this.$el.safeOffset().top + this.$el.height() - pos <
                    32
                )
                    this.$el.animate(
                        { scrollTop: this.$el.scrollTop() + 32 },
                        50,
                        "linear"
                    );
            }.bind(this)
        );

        this.$sortables.on(
            "dragover.pat-sortable",
            function(ev) {
                // list elements are only drop targets when one element of the
                // list is being dragged. avoids dragging between lists.
                var $dropTarget = $(ev.target).closest(
                        that.options.selector
                    ),
                    midlineY =
                        $dropTarget.safeOffset().top -
                        $(document).scrollTop() +
                        $dropTarget.height() / 2;

                if ($dropTarget.is($dragged)) {
                    return;
                }
                $dropTarget.removeClass(
                    "drop-target-above drop-target-below"
                );
                if (ev.originalEvent.clientY > midlineY)
                    $dropTarget.addClass("drop-target-below");
                else $dropTarget.addClass("drop-target-above");
                ev.preventDefault();
            }.bind(this)
        );

        this.$sortables.on(
            "dragleave.pat-sortable",
            function() {
                this.$sortables.removeClass(
                    "drop-target-above drop-target-below"
                );
            }.bind(this)
        );

        this.$sortables.on("drop.pat-sortable", function(ev) {
            var $dropTarget = $(ev.target).closest(that.options.selector);
            if ($dropTarget.is($dragged)) {
                return;
            }
            if ($dropTarget.hasClass("drop-target-below")) {
                $dropTarget.after($dragged);
            } else {
                $dropTarget.before($dragged);
            }
            $dropTarget.removeClass("drop-target-above drop-target-below");
            ev.preventDefault();
        });
    }
});

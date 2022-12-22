import $ from "jquery";
import Base from "../../core/base";
import dom from "../../core/dom";
import events from "../../core/events";
import Parser from "../../core/parser";

export const parser = new Parser("sortable");
parser.addArgument("selector", "li");
parser.addArgument("drag-class", "dragged"); // Class to apply to item that is being dragged.
parser.addArgument("drop"); // Callback function for when item is dropped (null)

// BBB for the mockup sortable pattern.
parser.addAlias("dragClass", "drag-class");

export default Base.extend({
    name: "sortable",
    trigger: ".pat-sortable",

    init: function () {
        if (window.__patternslib_import_styles) {
            import("./_sortable.scss");
        }
        this.$form = this.$el.closest("form");
        this.options = parser.parse(this.$el, false);
        this.recordPositions().initScrolling();
        this.$el.on("pat-update", this.onPatternUpdate.bind(this));
        this.$el.on("patterns-injected", this.recordPositions.bind(this));
    },

    onPatternUpdate: function (ev, data) {
        /* Handler which gets called when pat-update is triggered within
         * the .pat-sortable element.
         */
        if (data?.pattern !== "clone" || data?.action !== "added") {
            // Nothing to do.
            return;
        }
        this.recordPositions();
    },

    recordPositions: function () {
        // use only direct descendants to support nested lists
        this.$sortables = this.$el.children().filter(this.options.selector);
        this.$sortables.each(function (idx) {
            $(this).data("patterns.sortable", { position: idx });
            // Add `.sortable-item` class to each sortable.
            this.classList.add("sortable-item");
        });
        this.addHandles();
        return this;
    },

    addHandles: function () {
        for (const sortable of this.$sortables) {
            const handles = dom.querySelectorAllAndMe(sortable, ".sortable-handle");
            if (handles.length === 0) {
                // TODO: we should change to a <button>.
                const handle = document.createElement("a");
                handle.textContent = "⇕";
                handle.classList.add("sortable-handle");
                handle.setAttribute("draggable", "true");
                handle.setAttribute("href", "#");
                //handle.setAttribute("title", "Drag to reorder"); // TODO: specify if that should be kept.
                handle.setAttribute("aria-label", "Drag to reorder");
                sortable.appendChild(handle);
                handles.push(handle);
            }

            for (const handle of handles) {
                // TODO: remove when element is a button.
                events.add_event_listener(
                    handle,
                    "click",
                    "pat-sortable--click",
                    (e) => {
                        e.preventDefault();
                    }
                );
                events.add_event_listener(
                    handle,
                    "dragstart",
                    "pat-sortable--dragstart",
                    this.onDragStart.bind(this)
                );
                events.add_event_listener(
                    handle,
                    "dragend",
                    "pat-sortable--dragend",
                    this.onDragEnd.bind(this)
                );
            }
        }
    },

    initScrolling: function () {
        // invisible scroll activation areas
        var scrollup = $('<div id="pat-scroll-up">&nbsp;</div>'),
            scrolldn = $('<div id="pat-scroll-dn">&nbsp;</div>'),
            scroll = $().add(scrollup).add(scrolldn);
        scrollup.css({ top: 0 });
        scrolldn.css({ bottom: 0 });
        scroll.css({
            position: "fixed",
            zIndex: 999999,
            height: 32,
            left: 0,
            right: 0,
        });
        scroll.on("dragover", function (ev) {
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

    onDragEnd: function (ev) {
        const $dragged = $(ev.target.closest(this.options.selector));
        $dragged.removeClass(this.options.dragClass);
        this.$sortables.off(".pat-sortable");
        this.$el.off(".pat-sortable");
        $("#pat-scroll-up, #pat-scroll-dn").detach();
        var change = this.submitChangedAmount(
            $(ev.target).closest(this.options.selector)
        );
        // Call the optionally passed-in callback function
        if (this.options.drop) {
            this.options.drop($dragged, change);
        }
        // Inform other patterns about sorting changes
        $dragged.trigger("pat-update", {
            pattern: "sortable",
            action: "changed",
            dom: $dragged[0],
        });
    },

    submitChangedAmount: function ($dragged) {
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

    onDragStart: function (ev) {
        const $dragged = $(ev.target.closest(this.options.selector));
        var that = this;
        if (ev.dataTransfer) {
            // Firefox seems to need this set to any value
            ev.dataTransfer.setData("Text", "");
            ev.dataTransfer.effectAllowed = ["move"];
            if ("setDragImage" in ev.dataTransfer) {
                ev.dataTransfer.setDragImage($dragged[0], 0, 0);
            }
        }
        $dragged.addClass(this.options.dragClass);

        // Scroll the list if near the borders
        this.$el.on(
            "dragover.pat-sortable",
            function (ev) {
                ev.preventDefault();
                if (this.$el.is(":animated")) return;

                var pos = ev.originalEvent.clientY + $("body").scrollTop();
                if (pos - this.$el.safeOffset().top < 32)
                    this.$el.animate(
                        { scrollTop: this.$el.scrollTop() - 32 },
                        50,
                        "linear"
                    );
                else if (this.$el.safeOffset().top + this.$el.height() - pos < 32)
                    this.$el.animate(
                        { scrollTop: this.$el.scrollTop() + 32 },
                        50,
                        "linear"
                    );
            }.bind(this)
        );

        this.$sortables.on(
            "dragover.pat-sortable",
            function (ev) {
                // list elements are only drop targets when one element of the
                // list is being dragged. avoids dragging between lists.
                var $dropTarget = $(ev.target).closest(that.options.selector),
                    midlineY =
                        $dropTarget.safeOffset().top -
                        $(document).scrollTop() +
                        $dropTarget.height() / 2;

                if ($dropTarget.is($dragged)) {
                    return;
                }
                $dropTarget.removeClass("drop-target-above drop-target-below");
                if (ev.originalEvent.clientY > midlineY)
                    $dropTarget.addClass("drop-target-below");
                else $dropTarget.addClass("drop-target-above");
                ev.preventDefault();
            }.bind(this)
        );

        this.$sortables.on(
            "dragleave.pat-sortable",
            function () {
                this.$sortables.removeClass("drop-target-above drop-target-below");
            }.bind(this)
        );

        this.$sortables.on("drop.pat-sortable", function (ev) {
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
    },
});

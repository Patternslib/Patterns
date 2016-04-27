/**
 * Patterns bumper - `bumper' handling for elements
 *
 * Copyright 2012 Humberto Sermeno
 * Copyright 2013 Florian Friesdorf
 * Copyright 2013-2014 Simplon B.V. - Wichert Akkerman
 */
define([
    "jquery",
    "underscore",
    "pat-logger",
    "pat-parser",
    "pat-base",
    "pat-registry",
    "modernizr",
    "modernizr-csspositionsticky"
], function($, _, logger, Parser, Base, registry) {
    var parser = new Parser("bumper"),
        log = logger.getLogger("bumper");

    parser.addArgument("margin", 0);
    parser.addArgument("selector");
    parser.addArgument("bump-add", "bumped");
    parser.addArgument("bump-remove");
    parser.addArgument("unbump-add");
    parser.addArgument("unbump-remove", "bumped");
    parser.addArgument("side", "top", ['all', 'top', 'right', 'bottom', 'left']);

    // XXX Handle resize
    return Base.extend({
        name: "bumper",
        trigger: ".pat-bumper",

        init: function initBumper($el, opts) {
            this.options = parser.parse(this.$el, opts);
            this.$container = this._findScrollContainer();
            var container = this.$container[0];

            if (Modernizr.csspositionsticky) {
                this.$el.addClass("sticky-supported");
            }

            this.$el[0].style.position = "relative";
            if (!this.$container.length) {
                $(window).on("scroll.bumper", this._updateStatus.bind(this));
            } else {
                this.$container.on("scroll.bumper", this._updateStatus.bind(this));
            }
            var bumpall = (this.options.side.indexOf("all") > -1);
            this.options.bumptop =    bumpall || (this.options.side.indexOf("top") > -1);
            this.options.bumpright =  bumpall || (this.options.side.indexOf("right") > -1);
            this.options.bumpbottom = bumpall || (this.options.side.indexOf("bottom") > -1);
            this.options.bumpleft =   bumpall || (this.options.side.indexOf("left") > -1);
            this._updateStatus();
            return this.$el;
        },

        _findScrollContainer: function findScrollContainer() {
            var $parent = this.$el.parent(),
                overflow;
            while (!$parent.is($(document.body)) && $parent.length) {
                if (_.contains(['all', 'top', 'bottom'], this.options.side)) {
                    overflow = $parent.css("overflow-y");
                    if ((overflow === "auto" || overflow === "scroll")) {
                        return $parent;
                    }
                } 
                if (_.contains(['all', 'left', 'right'], this.options.side)) {
                    overflow = $parent.css("overflow-x");
                    if ((overflow === "auto" || overflow === "scroll")) {
                        return $parent;
                    }
                }
                $parent = $parent.parent();
            }
            return $();
        },

        _markBumped: function markBumper(is_bumped) {
            var $target = this.options.selector ? $(this.options.selector) : this.$el,
                todo = is_bumped ? this.options.bump : this.options.unbump;    
            if (todo.add) {
                $target.addClass(todo.add);
            } 
            if (todo.remove) {
                $target.removeClass(todo.remove);
            }
        },

        _updateStatus: function() {
            var sticker = this.$el[0],
                margin = this.options ? this.options.margin : 0,
                frame,
                box = this._getBoundingBox(this.$el, margin),
                delta = {};

            if (this.$container.length) {
                frame = this._getBoundingBox(this.$container, 0); // Scrolling on a container
            } else {
                frame = this._getViewport(); // Scrolling on the window
            }

            delta.top = sticker.style.top ? parseFloat(this.$el.css("top")) : 0;
            delta.left = sticker.style.left ? parseFloat(this.$el.css("left")) : 0;

            box.top -= delta.top;
            box.bottom -= delta.top;
            box.left -= delta.left;
            box.right -= delta.left;

            if ((frame.top > box.top) && this.options.bumptop) {
                sticker.style.top = (frame.top - box.top) + "px";
            } else if ((frame.bottom < box.bottom) && this.options.bumpbottom) {
                sticker.style.top = (frame.bottom - box.bottom) + "px";
            } else {
                sticker.style.top = "";
            }

            if ((frame.left > box.left) && this.options.bumpleft) {
                sticker.style.left = (frame.left - box.left) + "px";
            } else if ((frame.right < box.right) && this.options.bumpright) {
                sticker.style.left = (frame.right - box.right) + "px";
            } else {
                sticker.style.left = "";
            }
            this._markBumped(!!(sticker.style.top || sticker.style.left));
        },

        _getViewport: function getViewport() {
            /* Calculates the bounding box for the current viewport
             */
            var $win = $(window),
                view = {
                    top: $win.scrollTop(),
                    left: $win.scrollLeft()
                };
            view.right = view.left + $win.width();
            view.bottom = view.top + $win.height();
            return view;
        },

        _getBoundingBox: function getBoundingBox($sticker, margin) {
            /* Calculates the bounding box for a given element, taking margins
             * into consideration
             */
            var box = $sticker.offset();
            margin = margin ? margin : 0;
            box.top -= (parseFloat($sticker.css("margin-top")) || 0) + margin;
            box.left -= (parseFloat($sticker.css("margin-left")) || 0) + margin;
            box.right = box.left + $sticker.outerWidth(true) + (2 * margin);
            box.bottom = box.top + $sticker.outerHeight(true) + (2 * margin);
            return box;
        }
    });
});
// vim: sw=4 expandtab

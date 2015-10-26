/**
 * Patterns autoscale - scale elements to fit available space
 *
 * Copyright 2012 Humberto Sermeno
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 */
define([
    "jquery",
    "jquery.browser",
    "pat-base",
    "pat-registry",
    "pat-parser"
], function($, dummy, Base, registry, Parser) {
    var parser = new Parser("auto-scale");
    parser.addArgument("method", "scale", ["scale", "zoom"]);
    parser.addArgument("min-width", 0);
    parser.addArgument("max-width", 1000000);

    return Base.extend({
        name: "autoscale",
        trigger: ".pat-auto-scale",
        force_method: null,

        init: function($el, opts) {
            this.options = parser.parse(this.$el, opts);
            if (this.force_method !== null) {
                this.options.method = this.force_method;
            }
            this._setup().scale();
            return this.$el;
        },

        _setup: function() {
            if ($.browser.mozilla) {
                // See https://bugzilla.mozilla.org/show_bug.cgi?id=390936
                this.force_method = "scale";
            } else if ($.browser.msie && parseInt($.browser.version, 10) < 9) {
                this.force_method = "zoom";
            }
            $(window).on("resize.autoscale",
                _.debounce(this.scale.bind(this), 250, true)
            );
            $(document).on("pat-update.autoscale", _.debounce(this.scale.bind(this), 250));
            return this;
        },

        scale: function() {
            var available_space, scale;

            if (this.$el[0].tagName.toLowerCase() === "body") {
                available_space = $(window).width();
            } else {
                available_space = this.$el.parent().outerWidth();
            }
            available_space = Math.min(available_space, this.options.maxWidth);
            available_space = Math.max(available_space, this.options.minWidth);
            scale = available_space/this.$el.outerWidth();

            switch (this.options.method) {
                case "scale":
                    this.$el.css("transform", "scale(" + scale + ")");
                    break;
                case "zoom":
                    this.$el.css("zoom", scale);
                    break;
            }
            this.$el.addClass("scaled");
            return this;
        }
    });
});

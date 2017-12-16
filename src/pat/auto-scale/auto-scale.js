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
    "pat-parser",
    "underscore"
], function($, dummy, Base, registry, Parser, _) {
    var parser = new Parser("auto-scale");
    parser.addArgument("method", "scale", ["scale", "zoom"]);
    parser.addArgument("size", "width", ["width", "height", "contain", "cover"]);
    parser.addArgument("min-width", 0);
    parser.addArgument("max-width", 1000000);
    parser.addArgument("min-height", 0);
    parser.addArgument("max-height", 1000000);

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
            }
            $(window).on("resize.autoscale",
                _.debounce(this.scale.bind(this), 250, true)
            );
            $(document).on("pat-update.autoscale", _.debounce(this.scale.bind(this), 250));
            return this;
        },

        scale: function() {
            var available_space, scale_x, scale_y, scaled_height, scaled_width;

            if (this.$el[0].tagName.toLowerCase() === "body") {
                available_space = {
		    width: $(window).width(),
		    height: $(window).height()
		}
            } else {
		var $parent;
                if (this.$el.closest('.auto-scale-wrapper').length != 0) {
		    $parent = this.$el.closest('.auto-scale-wrapper').parent()
                } else {
                    $parent = this.$el.parent();
                }
		available_space = {
		    width: $parent.outerWidth(),
		    height: $parent.outerHeight(),
		};
            }
            available_space.width = Math.min(available_space.width, this.options.max.width);
            available_space.width = Math.max(available_space.width, this.options.min.width);
            available_space.height = Math.min(available_space.height, this.options.max.height);
            available_space.height = Math.max(available_space.height, this.options.min.height);
	    switch (this.options.size) {
		case "width":
		    scale = available_space.width / this.$el.outerWidth();
		    break;
		case "height":
		    scale = available_space.height / this.$el.outerHeight();
		    break;
		case "contain":
		    // Fit entire content on area, allowing for extra space
		    scale = Math.min(available_space.width / this.$el.outerWidth(), available_space.height / this.$el.outerHeight());
		    break;
		case "cover":
		    // Covert entire area, possible clipping
		    scale = Math.max(available_space.width / this.$el.outerWidth(), available_space.height / this.$el.outerHeight());
		    break;
		default:
		    return;
	    }

            scaled_height = this.$el.outerHeight() * scale;
            scaled_width = this.$el.outerWidth() * scale;

            switch (this.options.method) {
                case "scale":
                    this.$el.css("transform", "scale(" + scale + ")");
                    if (this.$el.parent().attr('class') === undefined || this.$el.parent().attr('class') != undefined && $.inArray('auto-scale-wrapper', this.$el.parent().attr('class').split(/\s+/)) === -1) {
                        this.$el.wrap("<div class='auto-scale-wrapper'></div>");                        
                    }
                    this.$el.parent().height(scaled_height).width(scaled_width);
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

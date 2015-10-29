/**
 * Copyright 2012-2013 Syslab.com GmbH - JC Brand
 */
define([
    "jquery",
    "pat-registry",
    "pat-base",
    "pat-utils",
    "pat-logger",
    "pat-parser",
    "underscore"
], function($, patterns, Base, utils, logging, Parser, _) {
    var log = logging.getLogger("scroll"),
        parser = new Parser("scroll");
    parser.addArgument("trigger", "click", ["click", "auto"]);
    parser.addArgument("direction", "top", ["top", "left"]);
    parser.addArgument("selector");
    parser.addArgument("offset");

    return Base.extend({
        name: "scroll",
        trigger: ".pat-scroll",
        jquery_plugin: true,

        init: function($el, opts) {
            this.options = parser.parse(this.$el, opts);
            if (this.options.trigger == "auto") {
               this.smoothScroll();
            } else if (this.options.trigger == "click") {
                this.$el.click(this.onClick.bind(this));
                this.$el.on("pat-update", this.onPatternsUpdate.bind(this));
            }
            this.markBasedOnFragment();
            $(window).scroll(_.debounce(this.markIfVisible.bind(this), 150));
        },

        onClick: function(ev) {
            ev.preventDefault();
            this.smoothScroll();
            this.clearBasedOnPreviousFragment();          
            history.pushState({}, null, this.$el.attr('href'));
            this.markBasedOnFragment();
        },

        clearBasedOnPreviousFragment: function(ev) {
            // Get the fragment from the URL, find what anchor is pointing to this url
            // and clear the current class from it
            // XXX This is not done
            var id = '#' + window.location.hash.substr(1),
                $target = $(id),
                $anchor = $('a[href="' + id + '"]');
            if ($target.length > 0) {
                $anchor.removeClass("current");
            }
        },        

        markBasedOnFragment: function(ev) {
            // Get the fragment from the URL and set the corresponding this.$el as current
            // this.$el is the element the user clicked on.
            var $target = $('#' + window.location.hash.substr(1));
            if ($target.length > 0) {
                this.$el.addClass("current");         
            }
        },

        markIfVisible: function(ev) {
            // Check if the element is an anchor tag, and if so, find the
            // target it points to.
            // Adds current class based on whether target is visible in
            // viewport.            
            if (this.$el[0].nodeName === "A") {
                var $target = $(this.$el[0].href.split('/').pop())[0];
                if (utils.isElementInViewport($target, true, this.options.offset)) {                   
                    this.$el.addClass("current");
                } else {                                                
                    this.$el.removeClass("current");
                }
            }
        },

        onPatternsUpdate: function(ev, data) {
            if (data.originalEvent && data.originalEvent.type === "click") {
                this.smoothScroll();
            }
        },

        smoothScroll: function() {
            var scroll = this.options.direction == "top" ? 'scrollTop' : 'scrollLeft',
                $el, options = {};
            if (typeof this.options.offset != "undefined") {
                $el = this.options.selector ? $(this.options.selector) : this.$el;
                options[scroll] = this.options.offset;
            } else {
                $el = $('body, html');
                options[scroll] = $(this.$el.attr('href')).offset().top;
            }
            $el.animate(options, 500);            
        }
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

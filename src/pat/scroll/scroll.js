/**
 * Copyright 2012-2013 Syslab.com GmbH - JC Brand
 */
define([
    "jquery",
    //"jquery.visible",
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
                this.$el.click(function (ev) {
                    ev.preventDefault();
                    this.smoothScroll();
                    history.pushState({}, '', $el.attr('href'));                    
                }.bind(this));
                this.$el.on("pat-update", this.onPatternsUpdate.bind(this));
            }
            
            // upon page load, check if any anchor elements in the page point to targets
            // that are visible to the user. if so, make them 'current'.
            if ($el[0].nodeName === "A") {
                var target = $($el[0].href.split('/').pop())[0];
                if (utils.isElementInViewport(target, true)) {
                    $el.addClass("current");      
                } else {
                    $el.removeClass("current");
                }
            }

            // when the scroll action completes
            $(window).scroll(_.debounce(function() {
                if ($el[0].nodeName === "A") {
                    var target = $($el[0].href.split('/').pop())[0];              
                    if (utils.isElementInViewport(target, true)) {                        
                        $el.addClass("current");
                    } else {                                                
                        $el.removeClass("current");
                    }
                }
            }, 150));
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

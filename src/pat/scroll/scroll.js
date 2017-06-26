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
    "underscore",
    "imagesloaded"
], function($, patterns, Base, utils, logging, Parser, _, imagesLoaded) {
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
                // Only calculate the offset when all images are loaded
                var that = this;
                imagesLoaded($('body'), function() {
                   that.smoothScroll();
                });
            } else if (this.options.trigger == "click") {
                this.$el.click(this.onClick.bind(this));
            }
            this.$el.on("pat-update", this.onPatternsUpdate.bind(this));
            this.markBasedOnFragment();
            this.on('hashchange', this.clearIfHidden.bind(this));
            $(window).scroll(_.debounce(this.markIfVisible.bind(this), 50));
        },

        onClick: function(ev) {
            ev.preventDefault();
            history.pushState({}, null, this.$el.attr('href'));
            this.smoothScroll();
            this.markBasedOnFragment();
            // manually trigger the hashchange event on all instances of pat-scroll
            $('a.pat-scroll').trigger("hashchange");
        },

        markBasedOnFragment: function(ev) {
            // Get the fragment from the URL and set the corresponding this.$el as current
            var $target = $('#' + window.location.hash.substr(1));
            if ($target.length > 0) {
                this.$el.addClass("current"); // the element that was clicked on
                $target.addClass("current");
            }
        },

        clearIfHidden: function(ev) {
            var active_target = '#' + window.location.hash.substr(1),
                $active_target = $(active_target),
                target = '#' + this.$el[0].href.split('#').pop();
            if ($active_target.length > 0) {
                if (active_target != target) {
                    // if the element does not match the one listed in the url #,
                    // clear the current class from it.
                    var $target = $('#' + this.$el[0].href.split('#').pop());
                    $target.removeClass("current");
                    this.$el.removeClass("current");
                }
            }
        },

        markIfVisible: function(ev) {
            var fragment, $target, href;
            if (this.$el.hasClass('pat-scroll-animated')) {
                // this section is triggered when the scrolling is a result of the animate function
                // ie. automatic scrolling as opposed to the user manually scrolling
                this.$el.removeClass('pat-scroll-animated');
            } else if (this.$el[0].nodeName === "A") {
                href = this.$el[0].href;
                fragment = href.indexOf('#') !== -1 && href.split('#').pop() || undefined;
                if (fragment) {
                    $target = $('#'+fragment);
                    if ($target.length) {
                        if (utils.isElementInViewport($target[0], true, this.options.offset)) {
                            // check that the anchor's target is visible
                            // if so, mark both the anchor and the target element
                            $target.addClass("current");
                            this.$el.addClass("current");
                        }
                        $(this.$el).trigger("pat-update", {pattern: "scroll"});
                    }
                }
            }
        },

        onPatternsUpdate: function(ev, data) {
            var fragment, $target, href;
            if (data.pattern === 'stacks') {
                if (data.originalEvent && data.originalEvent.type === "click") {
                    this.smoothScroll();
                }
            } else if (data.pattern === 'scroll') {
                href = this.$el[0].href;
                fragment = href.indexOf('#') !== -1 && href.split('#').pop() || undefined;
                if (fragment) {
                    $target = $('#'+fragment);
                    if ($target.length) {
                        if (utils.isElementInViewport($target[0], true, this.options.offset) === false) {
                            // if the anchor's target is invisible, remove current class from anchor and target.
                            $target.removeClass("current");
                            $(this.$el).removeClass("current");
                        }
                    }
                }
            }
        },

        smoothScroll: function() {
            var scroll = this.options.direction == "top" ? 'scrollTop' : 'scrollLeft',
                scrollable, options = {};
            if (typeof this.options.offset != "undefined") {
                // apply scroll options directly
                scrollable = this.options.selector ? $(this.options.selector) : this.$el;
                options[scroll] = this.options.offset;
            } else {
                // Get the first element with overflow (the scroll container)
                // starting from the *target*
                // The intent is to move target into view within scrollable
                // if the scrollable has no scrollbar, do not scroll body

                href = this.$el.attr('href');
                fragment = href.indexOf('#') !== -1 && href.split('#').pop() || undefined;
                var target = $('#'+fragment);
                if (target.length === 0) {
                    return;
                }

                scrollable = $(target.parents().filter(function() {
                    return ( $(this).css('overflow') === 'auto' ||
                             $(this).css('overflow') === 'scroll' );
                }).first())

                if ( typeof scrollable[0] === 'undefined' ) {
                    scrollable = $('html, body');
                    // positioning context is document
                    if ( scroll === "scrollTop" ) {
                        options[scroll] = Math.floor(target.offset().top);
                    } else {
                        options[scroll] = Math.floor(target.offset().left);
                    }
                } else if ( scroll === "scrollTop" ) {
                    // difference between target top and scrollable top becomes 0
                    options[scroll] = Math.floor(scrollable.scrollTop()
                                                 + target.offset().top
                                                 - scrollable.offset().top);
                } else {
                    options[scroll] = Math.floor(scrollable.scrollLeft()
                                                 + target.offset().left
                                                 - scrollable.offset().left);
                }
            }

            // execute the scroll
            scrollable.animate(options, {
                duration: 500,
                start: function() {
                    $('.pat-scroll').addClass('pat-scroll-animated');
                }
            });
        }


    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

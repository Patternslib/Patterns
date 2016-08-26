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
                target = this.$el[0].href.split('/').pop();
            if ($active_target.length > 0) {
                if (active_target != target) {
                    // if the element does not match the one listed in the url #,
                    // clear the current class from it.
                    var $target = $(this.$el[0].href.split('/').pop());
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
                scrollable = this.options.selector ? $(this.options.selector) : this.$el;
                options[scroll] = this.options.offset;
            } else {
                // Get the first element with overflow auto (the scroll container)
                // starting from the *target*
                var target = $(this.$el.attr('href'));
                
                scrollable = $(target.parents()
                    .filter(function() { 
                        return $(this).css('overflow') === 'auto'; })
                    .first())
                if (typeof scrollable[0] === 'undefined') {
                    scrollable = $('html, body');
                }

                // The actual calculation is difficult and requires special markup.
                // Immediately *within* the scrollable, around all the scrollable content,
                // we need a special wrapper div that provides a positioning context
                // by being position:relative. Let's call this .inner-scrollable.
                $(scrollable).wrapInner(function() {
                    return "<div class='inner-scrollable' style='position:relative'></div>";
                })
                var inner_scrollable = $(scrollable).children('.inner-scrollable')[0]
                // This enables us to measure the scrolling distance between the #target
                // and the top of the scrollable, represented by .inner-scrollable.
                // We cannot measure directly against the scrollable itself, because if
                // the scrollable is scrolled down, there's invisible (overflowed) content
                // 'sticking out' *above* the top of the scrollable.
                // Using the .inner-scrollable top enables us to measure this top overflow.
                // It doesn't matter whether the scrollable itself provides a positioning
                // context, since we cannot use that in our calculations anyway.
                
                var current = $(target);
                var parents = new Array();
                // Because we use .position() which measures the offset versus the positioning
                // context, we need to walk up the dom across all nested positioning contexts
                // until we reach the (logical) top of the scrollable: .inner-scrollable.
                // We MUST ignore the offset of .inner-scrollable versus the scrollable itself!!!
                while (! current.is($(inner_scrollable))) {
                    parents.push(current);
                    current = current.offsetParent();
                    // detect missing inner-scrollable positioning context
                    if ( current.is($(scrollable))) {
                        // this will now fail to take into account any overflowed content
                        // *above* the first position:relative element within the scrollable
                        console.log('WARNING: Missing inner scrollable with positioning context');
                        break;
                    }
                    // avoid infinite loop
                    if (parents.length > 6) {
                        break;
                    }
                }
                var scroll_to = 0;
                if ( this.options.direction == "top") {
                    // this assumes the grandparent aligns with the top of the scrollable
                    parents.forEach(function (item, index, array) {
                        scroll_to += item.position().top;
                    });
                } else {
                    // this assumes the grandparent aligns with the left of the scrollable
                    parents.forEach(function (item, index, array) {
                        scroll_to += item.position().left;
                    });
                }
                options[scroll] = Math.floor(scroll_to);
            }
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

import "../../core/jquery-ext";
import $ from "jquery";
import Base from "../../core/base";
import dom from "../../core/dom";
import logging from "../../core/logging";
import Parser from "../../core/parser";
import utils from "../../core/utils";

const log = logging.getLogger("pat.scroll");

export const parser = new Parser("scroll");
parser.addArgument("trigger", "click", ["click", "auto", "manual"]);
parser.addArgument("direction", "top", ["top", "left"]);
parser.addArgument("selector");
parser.addArgument("offset", 0);
parser.addArgument("delay");

export default Base.extend({
    name: "scroll",
    trigger: ".pat-scroll",
    jquery_plugin: true,

    async init($el, opts) {
        this.options = parser.parse(this.$el, opts);
        if (this.options.delay) {
            this.options.delay = utils.parseTime(this.options.delay);
        }
        if (this.options.trigger === "auto") {
            const ImagesLoaded = (await import("imagesloaded")).default;
            // Only calculate the offset when all images are loaded
            ImagesLoaded(document.body, () => this.smoothScroll());
        }
        if (this.options.trigger === "auto" || this.options.trigger === "click") {
            this.el.addEventListener("click", this.onClick.bind(this));
        }
        this.$el.on("pat-update", this.onPatternsUpdate.bind(this));
        this.markBasedOnFragment();
        this.on("hashchange", this.clearIfHidden.bind(this));
        $(window).scroll(utils.debounce(this.markIfVisible.bind(this), 50));
    },

    onClick() {
        //ev.preventDefault();
        history.pushState({}, null, this.$el.attr("href"));
        this.smoothScroll();
        this.markBasedOnFragment();
        // manually trigger the hashchange event on all instances of pat-scroll
        $("a.pat-scroll").trigger("hashchange");
    },

    markBasedOnFragment() {
        // Get the fragment from the URL and set the corresponding this.$el as current
        const fragment = window.location.hash.substr(1);
        if (fragment) {
            const $target = $("#" + fragment);
            this.$el.addClass("current"); // the element that was clicked on
            $target.addClass("current");
        }
    },

    clearIfHidden() {
        const active_target = "#" + window.location.hash.substr(1);
        const $active_target = $(active_target);
        const target = "#" + this.$el[0].href.split("#").pop();
        if ($active_target.length > 0) {
            if (active_target != target) {
                // if the element does not match the one listed in the url #,
                // clear the current class from it.
                const $target = $("#" + this.$el[0].href.split("#").pop());
                $target.removeClass("current");
                this.$el.removeClass("current");
            }
        }
    },

    markIfVisible() {
        if (this.$el.hasClass("pat-scroll-animated")) {
            // this section is triggered when the scrolling is a result of the animate function
            // ie. automatic scrolling as opposed to the user manually scrolling
            this.$el.removeClass("pat-scroll-animated");
        } else if (this.el.href) {
            const fragment = this.el.href.split("#")?.[1];
            if (fragment) {
                const $target = $(`#${fragment}`);
                if ($target.length) {
                    if (
                        utils.isElementInViewport($target[0], true, this.options.offset)
                    ) {
                        // check that the anchor's target is visible
                        // if so, mark both the anchor and the target element
                        $target.addClass("current");
                        this.$el.addClass("current");
                    }
                    $(this.$el).trigger("pat-update", { pattern: "scroll" });
                }
            }
        }
    },

    onPatternsUpdate(ev, data) {
        if (data?.pattern === "stacks") {
            if (data.originalEvent && data.originalEvent.type === "click") {
                this.smoothScroll();
            }
        } else if (data?.pattern === "scroll") {
            const href = this.$el[0].href;
            const fragment =
                (href.indexOf("#") !== -1 && href.split("#").pop()) || undefined;
            if (fragment) {
                const $target = $("#" + fragment);
                if ($target.length) {
                    if (
                        !utils.isElementInViewport($target[0], true, this.options.offset)
                    ) {
                        // if the anchor's target is invisible, remove current class from anchor and target.
                        $target.removeClass("current");
                        $(this.$el).removeClass("current");
                    }
                }
            }
        }
    },

    _get_selector_target() {
        const selector = this.options.selector;
        if (!selector && this.el.href?.includes("#")) {
            return document.querySelector(`#${this.el.href.split("#").pop()}`);
        } else if (!selector || selector === "self") {
            return this.el;
        }
        return document.querySelector(selector);
    },

    async smoothScroll() {
        if (this.options.delay) {
            await utils.timeout(this.options.delay);
        }
        const scroll = this.options.direction == "top" ? "scrollTop" : "scrollLeft";
        const options = {};
        let scrollable;
        if (this.options.selector === "top") {
            // Just scroll up or left, period.
            scrollable = $(
                dom.find_scroll_container(
                    this.el.parentElement,
                    this.options.direction === "top" ? "y" : "x"
                )
            );
            options[scroll] = 0;
        } else if (this.options.selector === "bottom") {
            // Just scroll down or right, period.
            scrollable = $(
                dom.find_scroll_container(
                    this.el.parentElement,
                    this.options.direction === "top" ? "y" : "x"
                )
            );
            if (scroll === "scrollTop") {
                options.scrollTop = scrollable[0].scrollHeight;
            } else {
                options.scrollLeft = scrollable[0].scrollWidth;
            }
        } else {
            // Get the first element with overflow (the scroll container)
            // starting from the *target*
            // The intent is to move target into view within scrollable
            // if the scrollable has no scrollbar, do not scroll body

            const target = $(this._get_selector_target());

            if (!target.length) {
                return;
            }

            scrollable = $(
                dom.find_scroll_container(
                    target[0].parentElement,
                    this.options.direction === "top" ? "y" : "x"
                )
            );

            if (scrollable[0] === document.body) {
                // positioning context is document
                if (scroll === "scrollTop") {
                    options[scroll] = Math.floor(target.safeOffset().top);
                } else {
                    options[scroll] = Math.floor(target.safeOffset().left);
                }
            } else if (scroll === "scrollTop") {
                // difference between target top and scrollable top becomes 0
                options[scroll] = Math.floor(
                    scrollable.scrollTop() +
                        target.safeOffset().top -
                        scrollable.safeOffset().top
                );
            } else {
                options[scroll] = Math.floor(
                    scrollable.scrollLeft() +
                        target.safeOffset().left -
                        scrollable.safeOffset().left
                );
            }
        }

        options[scroll] -= this.options.offset;

        // Fix scrolling on body - need to scroll on HTML, howsoever.
        if (scrollable[0] === document.body) {
            scrollable = $("html");
        }

        // execute the scroll
        await scrollable
            .animate(options, {
                duration: 500,
                start: () => {
                    $(".pat-scroll").addClass("pat-scroll-animated");
                    log.debug("scrolling.");
                },
            })
            .promise();
    },
});

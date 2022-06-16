/**
 * Patterns slides - Automatic and customised slideshows.
 *
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 */
import $ from "jquery";
import registry from "../../core/registry";
import utils from "../../core/utils";
import "../../core/remove";

var slides = {
    name: "slides",
    trigger: ".pat-slides",

    setup: function () {
        $(document).on("patterns-injected", utils.debounce(slides._reset, 100));
    },

    async init($el) {
        if (!$el[0].querySelector(".slide")) {
            // no slides, nothing to do.
            return;
        }
        await import("slides/src/slides"); // loads ``Presentation`` globally.

        const slides_filter = new URL(window.location).searchParams.get("slides");
        if (slides_filter) {
            const requested_ids = slides._collapse_ids(slides_filter);
            if (requested_ids) {
                slides._remove_slides($el, requested_ids);
            }
        }
        $el.each(function () {
            var presentation = new window.Presentation(this),
                $container = $(this);
            $container
                .data("pat-slide", presentation)
                .on("SlideDisplay", slides._onSlideDisplay)
                .on("SlideHide", slides._onSlideHide);
        });
        return slides._hook($el);
    },

    _onSlideDisplay: function (event) {
        var slide = event.originalEvent.detail.slide.element,
            $videos = $("video", slide);

        $videos.each(function () {
            if (this.paused) {
                this.currentTime = 0;
                this.play();
            }
        });
    },

    _onSlideHide: function (event) {
        var slide = event.originalEvent.detail.slide.element,
            $videos = $("video", slide);

        $videos.each(function () {
            if (!this.paused) this.pause();
        });
    },

    _collapse_ids: function (id_string) {
        return (id_string || "").split(",").filter((it) => !!it);
    },

    _remove_slides: function ($shows, ids) {
        var has_bad_id = function (idx, el) {
            return ids.indexOf(el.id) === -1;
        };

        for (var i = 0; i < $shows.length; i++) {
            var $show = $shows.eq(i),
                $bad_slides = $show.find(".slide[id]").filter(has_bad_id);
            $bad_slides.remove();
        }
    },

    _hook: function ($el) {
        return $el
            .off("destroy.pat-slide")
            .on("destroy.pat-slide", utils.debounce(slides._reset, 100));
    },

    _reset: function () {
        var $container = $(this).closest(".pat-slides"),
            presentation = $container.data("pat-slide");
        if (presentation) presentation.scan();
        slides._hook($(this.trigger));
    },
};

slides.setup();
registry.register(slides);
export default slides;

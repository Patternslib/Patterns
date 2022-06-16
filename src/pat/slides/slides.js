/**
 * Patterns slides - Automatic and customised slideshows.
 */
import $ from "jquery";
import Base from "../../core/base";
import utils from "../../core/utils";
import "../../core/remove";

export default Base.extend({
    name: "slides",
    trigger: ".pat-slides",

    async init() {
        await import("slides/src/slides"); // loads ``Presentation`` globally.

        const slides_filter = new URL(window.location).searchParams.get("slides");
        if (slides_filter) {
            const requested_ids = this._collapse_ids(slides_filter);
            if (requested_ids) {
                this._remove_slides(requested_ids);
            }
        }
        this.presentation = new window.Presentation(this.el);
        this.$el
            .on("SlideDisplay", this._on_slide_display.bind(this))
            .on("SlideHide", this._on_slide_hide.bind(this));

        $(document).on("patterns-injected", utils.debounce(this._reset.bind(this), 100));

        this._hook();
    },

    _on_slide_display(event) {
        const slide = event.originalEvent.detail.slide.element;
        const $videos = $("video", slide);

        $videos.each(function () {
            if (this.paused) {
                this.currentTime = 0;
                this.play();
            }
        });
    },

    _on_slide_hide(event) {
        const slide = event.originalEvent.detail.slide.element;
        const $videos = $("video", slide);

        $videos.each(function () {
            if (!this.paused) {
                this.pause();
            }
        });
    },

    _collapse_ids(id_string) {
        return (id_string || "").split(",").filter((it) => !!it);
    },

    _remove_slides(keep_ids) {
        for (const slide of this.el.querySelectorAll(".slide[id]")) {
            if (keep_ids.indexOf(slide.id) !== -1) {
                // Not an id to remove
                continue;
            }
            console.log("remove slide", slide);
            slide.remove();
        }
    },

    _hook() {
        this.$el
            .off("destroy.pat-slide")
            .on("destroy.pat-slide", utils.debounce(this._reset.bind(this), 100));
    },

    _reset() {
        this.presentation.scan();
        this._hook();
    },
});

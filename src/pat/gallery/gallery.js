// pat-gallery - A gallery pattern.
import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "../../core/base";
import Parser from "../../core/parser";
import dom from "../../core/dom";
import logging from "../../core/logging";
import utils from "../../core/utils";

const log = logging.getLogger("pat.gallery");

export const parser = new Parser("gallery");
parser.addArgument("item-selector", "a"); // selector for anchor element, which is added to the gallery.
parser.addArgument("loop", true);
parser.addArgument("scale-method", "fit", ["fit", "fitNoUpscale", "zoom"]);
parser.addArgument("delay", 30000);
parser.addArgument("effect-duration", 250);

let PhotoSwipe;
let PhotoSwipeUI;

export default Base.extend({
    name: "gallery",
    trigger: ".pat-gallery",
    orig_body_overflow: "auto",

    images: [],

    async init() {
        if (window.__patternslib_import_styles) {
            import("photoswipe/dist/photoswipe.css");
            import("photoswipe/dist/default-skin/default-skin.css");
        }
        PhotoSwipe = (await import("photoswipe")).default;
        PhotoSwipeUI = (await import("photoswipe/dist/photoswipe-ui-default")).default; // prettier-ignore

        this.options = parser.parse(this.el, this.options);

        this.template = await this.get_template();

        const gallery_observer = new MutationObserver(
            this.initialize_trigger.bind(this)
        );
        gallery_observer.observe(this.el, {
            subtree: true,
            childList: true,
        });

        this.initialize_trigger();
    },

    async get_template() {
        // Check for already defined templates.
        let template = document.querySelector(
            ".pat-gallery__template-wrapper, #photoswipe-template"
        );
        // Otherwise, use default template.
        if (!template) {
            const raw_template = (await import("./template.html")).default;
            template = document.createElement("div");
            template.setAttribute("class", "pat-gallery__template-wrapper");
            template.setAttribute("hidden", "");
            template.innerHTML = raw_template;
            document.body.appendChild(template);
        }
        return template;
    },

    initialize_trigger() {
        const image_wrapper_els = dom.querySelectorAllAndMe(
            this.el,
            this.options.itemSelector
        );
        this.images = [...image_wrapper_els].map((it) => {
            dom.add_event_listener(
                it,
                "click",
                "pat-gallery--image_handler",
                this.initialize_gallery.bind(this)
            );

            const src =
                it.getAttribute("href") ||
                it.getAttribute("src") ||
                it.querySelector("img")?.getAttribute("src");
            const title =
                it.getAttribute("title") ||
                it.querySelector("img")?.getAttribute("title");

            return {
                w: 0,
                h: 0,
                src: src,
                title: title,
            };
        });
    },

    initialize_gallery(e) {
        const trigger_el = e.currentTarget;

        this.template.removeAttribute("hidden");

        const pswp_el = dom.querySelectorAllAndMe(this.template, ".pswp")?.[0];
        if (!pswp_el) {
            log.warn("No photoswipe template found.");
        }

        // Now - when all is set - prevent default action.
        e.preventDefault();

        const index =
            this.images
                .map((it) => it.src)
                .indexOf(
                    trigger_el.getAttribute("href") || trigger_el.getAttribute("src")
                ) || 0;

        const options = {
            // Get the index of the clicked gallery item in the list of images.
            index: index,
            scaleMode: this.options.scaleMethod,
            loop: this.options.loop,
            slideshowDelay: this.options.delay,
            hideAnimationDuration: this.options.effectDuration,
            showAnimationDuration: this.options.effectDuration,
            pinchToClose: false,
            closeOnScroll: false,
            // Fix reload on gallery close which was induced by a history back call.
            history: false,
        };

        const gallery = new PhotoSwipe(pswp_el, PhotoSwipeUI, this.images, options);
        gallery.listen("gettingData", function (index, item) {
            // Workaround for the fact that we don't know the image sizes.
            // https://github.com/dimsemenov/PhotoSwipe/issues/796
            if (item.w < 1 || item.h < 1) {
                // unknown size
                const img = new Image();
                img.onload = (_e) => {
                    const img_el = _e.target;
                    // will get size after load
                    item.w = img_el.width; // set image width
                    item.h = img_el.height; // set image height
                    gallery.invalidateCurrItems(); // reinit Items
                    gallery.updateSize(true); // reinit Items
                };
                img.src = item.src; // let's download image
            }
        });

        gallery.listen("initialZoomInEnd", () => {
            // don't show body scrollbars when overlay is open
            this.orig_body_overflow = utils.getCSSValue(document.body, "overflow");
            document.body.style.overflow = "hidden";
        });

        gallery.listen("destroy", () => {
            // show original overlay value on body after closing
            document.body.style.overflow = this.orig_body_overflow;
            this.template.setAttribute("hidden", "");
        });

        gallery.init();
    },
});

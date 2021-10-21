import Base from "../../core/base";

export const TIMEOUT_FIRST_CALLBACK = 40; // Timeout for first run of the callback
export const TIMEOUT_CALLBACK = 200; // Timeout for subsequent runs of the callback
export const TIMEOUT_PAUSE = 600; // Timeout to detect scrolling pause and reset for TIMEOUT_FIRST_CALLBACK

export default Base.extend({
    name: "scroll-box",
    trigger: ".pat-scroll-box",

    scroll_listener: null,
    last_known_scroll_position: 0,
    timeout_id: null,
    timeout_id__scroll_stop: null,

    init() {
        const el = this.el;
        this.scroll_listener = el === document.body ? window : el;

        // If scolling is not possible, exit.
        if (
            !this.scroll_listener === window &&
            (["auto", "scroll"].indexOf(getComputedStyle(el).overflow) === -1 ||
                ["auto", "scroll"].indexOf(getComputedStyle(el).overflowY) === -1)
        ) {
            return;
        }

        this.scroll_listener.addEventListener("scroll", () => {
            if (this.timeout_id === null) {
                // Run first callback early and don't clear it's scheduled run.
                // This sets up classes early for a better user experience in
                // contrast of setting classes at the end of scrolling.
                window.setTimeout(() => {
                    const scroll_y = this.get_scroll_y();
                    this.set_scroll_classes(scroll_y);
                    this.last_known_scroll_position = scroll_y;
                }, TIMEOUT_FIRST_CALLBACK);
                // Set a dummy timeout_id and return.
                // Next scroll event should not reach this block but start with
                // default callback scheduling.
                this.timeout_id = 0;
                return;
            }

            window.clearTimeout(this.timeout_id);
            this.timeout_id = window.setTimeout(() => {
                const scroll_y = this.get_scroll_y();
                this.set_scroll_classes(scroll_y);
                this.last_known_scroll_position = scroll_y;
            }, TIMEOUT_CALLBACK);

            // Reset the timeout_id after when he user stops scrolling.
            // When scrolling again the scroll classes are set again after TIMEOUT_FIRST_CALLBACK
            window.clearTimeout(this.timeout_id__scroll_stop);
            this.timeout_id__scroll_stop = window.setTimeout(() => {
                this.timeout_id = null;
            }, TIMEOUT_PAUSE);
        });

        // Set initial state
        this.set_scroll_classes(this.get_scroll_y());
    },

    set_scroll_classes(scroll_pos) {
        const el = this.el;
        el.classList.remove("scroll-up");
        el.classList.remove("scroll-down");
        el.classList.remove("scroll-position-top");
        el.classList.remove("scroll-position-bottom");

        if (scroll_pos < this.last_known_scroll_position) {
            el.classList.add("scroll-up");
        } else if (this.last_known_scroll_position < scroll_pos) {
            el.classList.add("scroll-down");
        }

        if (scroll_pos === 0) {
            el.classList.add("scroll-position-top");
        } else if (
            this.scroll_listener === window &&
            window.innerHeight + scroll_pos >= el.scrollHeight
        ) {
            el.classList.add("scroll-position-bottom");
        } else if (
            this.scroll_listener !== window &&
            el.clientHeight + scroll_pos >= el.scrollHeight
        ) {
            el.classList.add("scroll-position-bottom");
        }
    },

    get_scroll_y() {
        if (this.scroll_listener === window) {
            // scrolling the window
            return window.scrollY !== undefined ? window.scrollY : window.pageYOffset; // pageYOffset for IE
        }
        // scrolling a DOM element
        return this.scroll_listener.scrollTop;
    },
});

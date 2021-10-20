import Base from "../../core/base";

export default Base.extend({
    name: "scroll-box",
    trigger: ".pat-scroll-box",

    // A timeout of 200 works good for smooth scrolling on trackpads.
    // With low values like 10 or 50 sometimes no change in scroll position is detected.
    timeout: 200,
    timeout_in_use: null,

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
                // Run first callback quite soon to immediately set correct classes.
                this.timeout_in_use = 10;
            }

            window.clearTimeout(this.timeout_id);
            this.timeout_id = window.setTimeout(() => {
                const scroll_y = this.get_scroll_y();
                this.set_scroll_classes(scroll_y);
                this.last_known_scroll_position = scroll_y;
                this.timeout_in_use = this.timeout; // Set to normal timeout after first run
            }, this.timeout_in_use || this.timeout); // If not set for any reason, fallback to this.timeout

            // Reset the timeout_id after a multiple of timeout when scrolling
            // has stopped for sure.
            // Then, when scrolling again the scroll classes are set
            // immediately and at the end of a series of scroll events.
            window.clearTimeout(this.timeout_id__scroll_stop);
            this.timeout_id__scroll_stop = window.setTimeout(() => {
                this.timeout_id = null;
            }, Math.max(500, this.timeout * 3)); // Note: should be more than the timespan in which scroll events are thrown.
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

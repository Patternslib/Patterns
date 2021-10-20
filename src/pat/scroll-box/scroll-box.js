import $ from "jquery";
import Base from "../../core/base";

export default Base.extend({
    name: "scroll-box",
    trigger: ".pat-scroll-box",

    // A timeout of 200 works good for smooth scrolling on trackpads.
    // With low values like 10 or 50 sometimes no change in scroll position is detected.
    timeout: 200,
    timeout_in_use: null,

    init: function ($el) {
        const el = $el[0];
        let scroll_listener = el;
        if (scroll_listener === document.body) {
            scroll_listener = window;
        }

        // If scolling is not possible, exit.
        if (
            !scroll_listener == window &&
            (["auto", "scroll"].indexOf(getComputedStyle(el).overflow) === -1 ||
                ["auto", "scroll"].indexOf(getComputedStyle(el).overflowY) === -1)
        ) {
            return;
        }

        let last_known_scroll_position = 0;
        let scroll_y = 0;
        let timeout_id = null;
        let timeout_id__scroll_stop = null;

        let set_scroll_classes = (scroll_pos) => {
            el.classList.remove("scroll-up");
            el.classList.remove("scroll-down");
            el.classList.remove("scroll-position-top");
            el.classList.remove("scroll-position-bottom");

            if (scroll_pos < last_known_scroll_position) {
                el.classList.add("scroll-up");
            } else if (last_known_scroll_position < scroll_pos) {
                el.classList.add("scroll-down");
            }

            if (scroll_pos === 0) {
                el.classList.add("scroll-position-top");
            } else if (
                scroll_listener === window &&
                window.innerHeight + scroll_pos >= el.scrollHeight
            ) {
                el.classList.add("scroll-position-bottom");
            } else if (
                scroll_listener !== window &&
                el.clientHeight + scroll_pos >= el.scrollHeight
            ) {
                el.classList.add("scroll-position-bottom");
            }
        };

        scroll_listener.addEventListener("scroll", () => {
            if (timeout_id === null) {
                // Run first callback quite soon to immediately set correct classes.
                this.timeout_in_use = 10;
            }

            window.clearTimeout(timeout_id);
            timeout_id = window.setTimeout(() => {
                scroll_y = this.get_scroll_y(scroll_listener);
                set_scroll_classes(scroll_y);
                last_known_scroll_position = scroll_y;
                this.timeout_in_use = this.timeout; // Set to normal timeout after first run
            }, this.timeout_in_use || this.timeout); // If not set for any reason, fallback to this.timeout

            // Reset the timeout_id after a multiple of timeout when scrolling
            // has stopped for sure.
            // Then, when scrolling again the scroll classes are set
            // immediately and at the end of a series of scroll events.
            window.clearTimeout(timeout_id__scroll_stop);
            timeout_id__scroll_stop = window.setTimeout(() => {
                timeout_id = null;
            }, Math.max(500, this.timeout * 3)); // Note: should be more than the timespan in which scroll events are thrown.
        });

        // Set initial state
        $().ready(() => set_scroll_classes(this.get_scroll_y(scroll_listener)));
    },

    get_scroll_y: (el) => {
        if (el === window) {
            // scrolling the window
            return window.scrollY !== undefined ? window.scrollY : window.pageYOffset; // pageYOffset for IE
        }
        // scrolling a DOM element
        return el.scrollTop;
    },
});

import Base from "../../core/base";
import events from "../../core/events";

export default Base.extend({
    name: "scroll-box",
    trigger: ".pat-scroll-box",

    scroll_listener: null,
    last_known_scroll_position: 0,
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

        let ticking = false;
        events.add_event_listener(
            this.scroll_listener,
            "scroll",
            "pat-scroll-box--scroll_listener",
            () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        this.set_scroll_classes();
                        ticking = false;
                    });
                    ticking = true;
                }
            }
        );

        // Set initial state
        this.set_scroll_classes();
    },

    set_scroll_classes() {
        const scroll_pos = this.get_scroll_y();
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
        this.last_known_scroll_position = scroll_pos;
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

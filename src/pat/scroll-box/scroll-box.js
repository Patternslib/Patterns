import Base from "../../core/base";
import Parser from "../../core/parser";
import events from "../../core/events";

export const parser = new Parser("scroll-box");
parser.addArgument("timeout-stop", 600); // Timeout to detect when stopping scrolling.

export default Base.extend({
    name: "scroll-box",
    trigger: ".pat-scroll-box",

    scroll_listener: null,
    last_known_scroll_position: 0,
    timeout_id__scroll_stop: null,

    init() {
        const el = this.el;
        this.options = parser.parse(el);
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

                        // Detect case when user stops scrolling.
                        window.clearTimeout(this.timeout_id__scroll_stop);
                        this.timeout_id__scroll_stop = window.setTimeout(() => {
                            // When user stopped scrolling, set/clear scroll classes.
                            this.clear_scrolling_classes();
                        }, this.options.timeoutStop);

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

        const to_add = [];

        if (scroll_pos < this.last_known_scroll_position) {
            to_add.push("scroll-up");
            to_add.push("scrolling-up");
        } else if (this.last_known_scroll_position < scroll_pos) {
            to_add.push("scroll-down");
            to_add.push("scrolling-down");
        }

        if (scroll_pos === 0) {
            to_add.push("scroll-position-top");
        } else if (
            this.scroll_listener === window &&
            window.innerHeight + scroll_pos >= el.scrollHeight
        ) {
            to_add.push("scroll-position-bottom");
        } else if (
            this.scroll_listener !== window &&
            el.clientHeight + scroll_pos >= el.scrollHeight
        ) {
            to_add.push("scroll-position-bottom");
        }

        // Keep DOM manipulation calls together to let the browser optimize reflow/repaint.
        // See: https://areknawo.com/dom-performance-case-study/

        el.classList.remove(
            "scroll-up",
            "scroll-down",
            "scrolling-up",
            "scrolling-down",
            "scroll-position-top",
            "scroll-position-bottom"
        );
        el.classList.add(...to_add);

        this.last_known_scroll_position = scroll_pos;
    },

    clear_scrolling_classes() {
        // Remove ``scrolling-up`` and ``scrolling-down``
        // but keep ``scroll-up`` and ``scroll-down``.
        this.el.classList.remove("scrolling-up", "scrolling-down");
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

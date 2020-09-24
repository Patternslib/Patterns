/**
 * Patterns scroll detection - convenience classes requested in #701
 *
 * Copyright 2020- Alexander Pilz, Syslab.com GmbH
 */

define(["jquery"], function ($) {
    var scroll_detection = {
        init: function () {
            let last_known_scroll_position = 0;
            let scroll_y = 0;
            let ticking = false;

            let set_scroll_classes = (scroll_pos) => {
                document.body.classList.remove("scroll-up");
                document.body.classList.remove("scroll-down");
                document.body.classList.remove("scroll-position-top");
                document.body.classList.remove("scroll-position-bottom");

                if (scroll_pos < last_known_scroll_position) {
                    document.body.classList.add("scroll-up");
                } else if (last_known_scroll_position < scroll_pos) {
                    document.body.classList.add("scroll-down");
                }

                if (scroll_pos === 0) {
                    document.body.classList.add("scroll-position-top");
                } else if (
                    window.innerHeight + scroll_pos >=
                    document.body.offsetHeight
                ) {
                    document.body.classList.add("scroll-position-bottom");
                }
            };

            window.addEventListener("scroll", (e) => {
                // In case that's needed sometime:
                // ``e.target.scrollTop`` would be the scrolling position of the DOM element.
                // We're interested in the window scrolling position though.
                if (!ticking) {
                    // Don't redo while we're already modifying the DOM.
                    window.requestAnimationFrame(() => {
                        scroll_y = this.get_scroll_y();
                        set_scroll_classes(scroll_y);
                        last_known_scroll_position = scroll_y;
                        ticking = false;
                    });
                    ticking = true;
                }
            });

            // Set initial state
            $().ready(() => set_scroll_classes(this.get_scroll_y()));
        },

        get_scroll_y: () => {
            return window.scrollY !== undefined
                ? window.scrollY
                : window.pageYOffset; // pageYOffset for IE
        },
    };

    scroll_detection.init();
    return scroll_detection;
});
